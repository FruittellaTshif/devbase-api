/**
 * tokens.ts
 * Objectif : gérer l’authentification JWT (Access + Refresh).
 *
 * - Access token : durée courte (ex: 15 min) → utilisé pour accéder aux routes protégées
 * - Refresh token : durée longue (ex: 7 jours) → sert à regénérer un nouvel access token
 *
 * Approche V1 (portfolio) :
 * - On signe les tokens avec des secrets (ENV)
 * - On met l'userId dans le payload
 */

import * as jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

type JwtPayload = {
  sub: string; // "subject" → identifiant utilisateur (userId)
};

/**
 * ✅ Fix TypeScript:
 * - jsonwebtoken attend un type "Secret" pour le secret.
 * - expiresIn attend un type spécifique (SignOptions["expiresIn"]).
 * On caste explicitement pour enlever l’ambiguïté des overloads.
 */
const ACCESS_SECRET: Secret = env.JWT_ACCESS_SECRET;
const REFRESH_SECRET: Secret = env.JWT_REFRESH_SECRET;

const accessOpts: SignOptions = {
  expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
};

const refreshOpts: SignOptions = {
  expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
};

export function signAccessToken(userId: string): string {
  const payload: JwtPayload = { sub: userId };
  return jwt.sign(payload, ACCESS_SECRET, accessOpts);
}

export function signRefreshToken(userId: string): string {
  const payload: JwtPayload = { sub: userId };
  return jwt.sign(payload, REFRESH_SECRET, refreshOpts);
}

/**
 * Vérifie un access token et retourne le payload.
 * Lance une erreur si invalide/expiré.
 */
export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

/**
 * Vérifie un refresh token et retourne le payload.
 * Lance une erreur si invalide/expiré.
 */
export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}
