/**
 * prisma.ts
 * Objectif : fournir une instance PrismaClient unique dans toute l’app.
 *
 * Pourquoi ?
 * - Evite de recréer PrismaClient dans chaque fichier (mauvaise pratique).
 * - En dev avec ts-node-dev / hot reload, on évite d’ouvrir trop de connexions.
 */

import { PrismaClient } from "@prisma/client";

declare global {
  // Permet de "cacher" l’instance Prisma sur globalThis en dev
  // pour éviter de recréer plusieurs clients à chaque reload.
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// En prod, on instancie normalement.
// En dev, on réutilise l’instance si elle existe déjà.
export const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
