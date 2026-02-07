/**
 * auth.controller.ts
 * ------------------------------------------------------------------
 * Rôle :
 * Le controller gère la couche "HTTP" :
 * - lire req (body, cookies, headers)
 * - appeler le service (logique métier)
 * - renvoyer res (status, JSON)
 * - poser/supprimer le cookie refresh token (HTTP-only)
 *
 * Important :
 * - Le controller NE fait pas de requêtes Prisma directement
 * - Il délègue au service (auth.service.ts)
 */

import type { Request, Response } from "express";
import { z } from "zod";

import { env } from "../../config/env";
import { authService } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.schemas";

/**
 * Types inférés depuis Zod
 * ------------------------------------------------------------------
 * Grâce au middleware validate(registerSchema/loginSchema),
 * req.body est garanti conforme à ces types au moment d'arriver ici.
 */
type RegisterBody = z.infer<typeof registerSchema>;
type LoginBody = z.infer<typeof loginSchema>;

/**
 * Options du cookie refresh token.
 * - httpOnly : inaccessible en JS (protection XSS)
 * - sameSite : limite certains scénarios CSRF
 * - secure   : true en production (https), false en local (http)
 */
function getRefreshCookieOptions(): {
  httpOnly: boolean;
  sameSite: "lax";
  secure: boolean;
  path: string;
  maxAge: number;
} {
  // maxAge en millisecondes
  // On reste cohérent avec un refresh token long (7 jours par défaut)
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  return {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/api/auth", // le cookie est envoyé seulement pour ces routes
    maxAge: sevenDaysMs,
  };
}

const authController = {
  /**
   * POST /api/auth/register
   * Body attendu : { email, password, name? }
   * Retour : { accessToken, user }
   * + set-cookie(refreshToken)
   */
  async register(req: Request, res: Response) {
    /**
     * NOTE :
     * - req.body est validé en amont par validate(registerSchema)
     * - Donc ici, email/password sont forcément présents et valides
     */
    console.log("REGISTER BODY:", req.body);
    const { email, password, name } = req.body as RegisterBody;

    const result = await authService.register({ email, password, name });

    // On stocke le refresh token en cookie HTTP-only
    res.cookie("refreshToken", result.refreshToken, getRefreshCookieOptions());

    // On ne renvoie PAS le refresh token dans le JSON (bonne pratique)
    return res.status(201).json({
      accessToken: result.accessToken,
      user: result.user,
    });
  },

  /**
   * POST /api/auth/login
   * Body attendu : { email, password }
   * Retour : { accessToken, user }
   * + set-cookie(refreshToken)
   */
  async login(req: Request, res: Response) {
    /**
     * NOTE :
     * - req.body est validé en amont par validate(loginSchema)
     * - Donc ici, email/password sont forcément présents et valides
     */
    const { email, password } = req.body as LoginBody;

    const result = await authService.login({ email, password });

    res.cookie("refreshToken", result.refreshToken, getRefreshCookieOptions());

    return res.status(200).json({
      accessToken: result.accessToken,
      user: result.user,
    });
  },

  /**
   * POST /api/auth/refresh
   * Utilise le refresh token depuis les cookies :
   * - vérifie le refresh token
   * - renvoie un nouvel access token
   */
  async refresh(req: Request, res: Response) {
    // cookie-parser ajoute req.cookies (type "any" côté Express)
    const refreshToken = req.cookies?.refreshToken as string | undefined;

    if (!refreshToken) {
      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Missing refresh token cookie",
        },
      });
    }

    const accessToken = await authService.refreshAccessToken(refreshToken);

    return res.status(200).json({ accessToken });
  },

  /**
   * POST /api/auth/logout
   * Supprime le cookie refresh token côté client.
   */
  async logout(_req: Request, res: Response) {
    res.clearCookie("refreshToken", {
      path: "/api/auth",
    });

    return res.status(200).json({ ok: true });
  },
};

export default authController;
