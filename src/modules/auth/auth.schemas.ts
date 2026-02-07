import { z } from "zod";

/**
 * Champs réutilisables
 * ------------------------------------------------------------------
 * On factorise email/password pour éviter la duplication
 * entre register/login (et futurs endpoints).
 */
const email = z.string().trim().email("Email invalide").toLowerCase();

const password = z
  .string()
  .min(8, "Mot de passe : minimum 8 caractères")
  .max(72, "Mot de passe : maximum 72 caractères");

/**
 * OPTION (à activer si tu veux une policy plus stricte)
 * ------------------------------------------------------------------
 * Très bon pour la sécurité, mais parfois trop strict côté UX.
 * Tu peux l'activer plus tard sans toucher aux controllers/services.
 *
 * .regex(/[A-Z]/, "Mot de passe : au moins une majuscule")
 * .regex(/[a-z]/, "Mot de passe : au moins une minuscule")
 * .regex(/[0-9]/, "Mot de passe : au moins un chiffre")
 * .regex(/[^A-Za-z0-9]/, "Mot de passe : au moins un caractère spécial")
 */

/**
 * registerSchema
 * ------------------------------------------------------------------
 * Body attendu :
 * - email (obligatoire)
 * - password (obligatoire)
 * - name (optionnel)
 *
 * .strict() :
 * - refuse les champs supplémentaires (sécurité + API plus propre)
 */
export const registerSchema = z
  .object({
    email,
    password,
    name: z
      .string()
      .trim()
      .min(2, "Nom : minimum 2 caractères")
      .max(50, "Nom : maximum 50 caractères")
      .optional(),
  })
  .strict();

/**
 * loginSchema
 * ------------------------------------------------------------------
 * Body attendu :
 * - email (obligatoire)
 * - password (obligatoire)
 */
export const loginSchema = z
  .object({
    email,
    password,
  })
  .strict();
