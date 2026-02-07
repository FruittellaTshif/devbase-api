/**
 * env.ts
 * Objectif : centraliser et sécuriser l’accès aux variables d’environnement.
 *
 * Règle importante :
 * - Toute variable critique DOIT être validée au démarrage
 * - Si elle n’existe pas → on crash immédiatement
 */

import "dotenv/config";

/**
 * Force l’existence d’une variable d’environnement.
 * TypeScript comprendra qu’on retourne TOUJOURS un string.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 4000),

  // 🔐 JWT (OBLIGATOIRES)
  JWT_ACCESS_SECRET: requireEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: requireEnv("JWT_REFRESH_SECRET"),
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",

  DATABASE_URL: requireEnv("DATABASE_URL"),

  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "*",
};
