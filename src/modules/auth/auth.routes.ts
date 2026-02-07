/**
 * auth.routes.ts
 * ------------------------------------------------------------------
 * Rôle :
 * Définir les routes d’authentification de l’API.
 *
 * Responsabilités :
 * - Déclarer les endpoints (/register, /login, etc.)
 * - Appliquer les middlewares (validation Zod, rate-limit)
 * - Déléguer la logique métier au controller
 *
 * ⚠️ Aucune logique métier ici :
 *    - pas de DB
 *    - pas de hash password
 *    - pas de JWT
 */

import { Router } from "express";
import authController from "./auth.controller";
import { loginLimiter } from "../../config/rateLimit";
import { validate } from "../../middleware/validate";
import { loginSchema, registerSchema } from "./auth.schemas";

export const authRoutes = Router();

/**
 * ------------------------------------------------------------------
 * POST /api/auth/register
 * ------------------------------------------------------------------
 * Création d’un compte utilisateur
 *
 * Body attendu :
 * - email    (string, format email)
 * - password (string, min 8 caractères)
 * - name     (optionnel)
 *
 * Sécurité :
 * - validate(registerSchema) => valide req.body AVANT le controller
 *
 * Retour :
 * - access token
 * - refresh token (cookie HTTP-only)
 */
authRoutes.post(
  "/register",
  validate(registerSchema), // ✅ Validation Zod (req.body)
  authController.register,
);

/**
 * ------------------------------------------------------------------
 * POST /api/auth/login
 * ------------------------------------------------------------------
 * Connexion utilisateur
 *
 * Body attendu :
 * - email
 * - password
 *
 * Sécurité :
 * - Rate limit (anti brute-force)
 * - validate(loginSchema) => valide req.body AVANT le controller
 *
 * Retour :
 * - access token
 * - refresh token (cookie HTTP-only)
 */
authRoutes.post(
  "/login",
  loginLimiter, // ✅ Protection brute-force
  validate(loginSchema), // ✅ Validation Zod (req.body)
  authController.login,
);

/**
 * ------------------------------------------------------------------
 * POST /api/auth/refresh
 * ------------------------------------------------------------------
 * Génère un nouvel access token à partir du refresh token (cookie HTTP-only).
 *
 * Note :
 * - Pas de body attendu => pas de validation Zod
 */
authRoutes.post("/refresh", authController.refresh);

/**
 * ------------------------------------------------------------------
 * POST /api/auth/logout
 * ------------------------------------------------------------------
 * Déconnexion utilisateur
 *
 * Action :
 * - Supprime le refresh token côté client (cookie)
 *
 * Note :
 * - Pas de body attendu => pas de validation Zod
 */
authRoutes.post("/logout", authController.logout);
