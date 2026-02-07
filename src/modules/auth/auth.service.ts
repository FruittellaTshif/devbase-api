/**
 * auth.service.ts
 * ------------------------------------------------------------------
 * Rôle :
 * La couche "métier" (business logic) de l’authentification.
 *
 * Ici on fait :
 * - accès DB (Prisma)
 * - hash / verify password (bcrypt via utils/password)
 * - génération des tokens (utils/tokens)
 *
 * Important :
 * - Le service NE gère PAS res.status / cookies → c’est le controller.
 */

import { AppError } from "../../utils/appError";
import { prisma } from "../../config/prisma";
import { hashPassword, verifyPassword } from "../../utils/password";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/tokens";

type PublicUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
};

function toPublicUser(user: {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}): PublicUser {
  // On ne renvoie JAMAIS "password" au client
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

export const authService = {
  /**
   * Register : créer un utilisateur
   * - Vérifie paramètres minimaux
   * - Vérifie si email déjà utilisé
   * - Hash le password
   * - Insère en DB
   * - Retourne user + tokens
   */
  async register(input: { email?: string; password?: string; name?: string }) {
    const email = input.email?.trim().toLowerCase();
    const password = input.password;

    if (!email || !password) {
      // On renvoie une erreur simple (on raffinera avec Zod ensuite)
      throw new Error("Email and password are required");
    }

    // 1) Vérifier si utilisateur existe déjà
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError(409, "EMAIL_ALREADY_IN_USE", "Email already in use");
    }

    // 2) Hash password
    const hashed = await hashPassword(password);

    // 3) Créer user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: input.name?.trim() || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // 4) Tokens
    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    return {
      user: toPublicUser(user),
      accessToken,
      refreshToken,
    };
  },

  /**
   * Login : connexion utilisateur
   * - Vérifie email/password
   * - Compare password avec bcrypt
   * - Retourne user + tokens
   */
  async login(input: { email?: string; password?: string }) {
    const email = input.email?.trim().toLowerCase();
    const password = input.password;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // 1) Trouver user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Message volontairement vague pour éviter de donner de l’info aux attaquants
      throw new Error("Invalid credentials");
    }

    // 2) Vérifier password
    const ok = await verifyPassword(password, user.password);
    if (!ok) {
      throw new Error("Invalid credentials");
    }

    // 3) Tokens
    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    return {
      user: toPublicUser({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      }),
      accessToken,
      refreshToken,
    };
  },

  /**
   * Refresh Access Token :
   * - Vérifie refresh token (signature + expiration)
   * - Génère un nouvel access token
   */
  async refreshAccessToken(refreshToken: string): Promise<string> {
    const payload = verifyRefreshToken(refreshToken);

    // payload.sub = userId
    const userId = payload.sub;

    // (Optionnel mais pro) : vérifier que l’utilisateur existe encore
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    return signAccessToken(userId);
  },
};
