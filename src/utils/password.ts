/**
 * password.ts
 * Objectif : centraliser la logique de sécurité liée aux mots de passe.
 * - On ne stocke JAMAIS un mot de passe en clair en base.
 * - On utilise bcrypt pour générer un hash (empreinte) irréversible.
 */

import bcrypt from "bcrypt";

const SALT_ROUNDS = 10; // Bon compromis perf/sécurité pour un projet portfolio

/**
 * Hash un mot de passe (avant insertion en DB).
 * @param plainPassword mot de passe en clair (ex: "abc123!!")
 * @returns hash bcrypt à stocker en DB
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compare un mot de passe saisi avec le hash stocké en DB.
 * @param plainPassword mot de passe en clair saisi par l’utilisateur
 * @param hashedPassword hash bcrypt stocké
 * @returns true si match, false sinon
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
