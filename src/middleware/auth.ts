/**
 * auth.ts
 * Objectif : protéger les routes avec un access token JWT.
 *
 * Fonctionnement :
 * - Le client envoie : Authorization: Bearer <ACCESS_TOKEN>
 * - On vérifie le token
 * - On récupère userId via le payload (sub)
 * - On attache req.user pour les handlers suivants
 */

import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/tokens";

/**
 * On étend le type Express Request pour ajouter "user".
 * Comme ça, TypeScript sait que req.user existe après authMiddleware.
 */
export type AuthenticatedRequest = Request & {
  user?: {
    id: string;
  };
};

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;

  // 1) Vérifier la présence du header Authorization
  if (!header) {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Missing Authorization header" },
    });
  }

  // 2) Vérifier le format Bearer
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid Authorization format. Use Bearer <token>",
      },
    });
  }

  try {
    // 3) Vérifier le JWT + extraire payload
    const payload = verifyAccessToken(token);

    // 4) Attacher l’utilisateur courant à la requête
    req.user = { id: payload.sub };

    return next();
  } catch {
    // Token expiré / invalide
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Invalid or expired token" },
    });
  }
}
