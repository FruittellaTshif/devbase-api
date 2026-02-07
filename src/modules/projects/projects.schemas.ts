import { z } from "zod";

/**
 * Champs réutilisables
 */
const name = z
  .string()
  .trim()
  .min(2, "Nom : minimum 2 caractères")
  .max(80, "Nom : maximum 80 caractères");

/**
 * Création d’un project
 * POST /api/projects
 */
export const createProjectSchema = z
  .object({
    name,
  })
  .strict();

/**
 * Mise à jour partielle
 * PATCH /api/projects/:id
 *
 * - tout est optionnel
 * - mais il faut au moins 1 champ
 */
export const updateProjectSchema = z
  .object({
    name: name.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni",
    path: [],
  });

/**
 * Params : /api/projects/:id
 */
export const projectIdParamsSchema = z
  .object({
    id: z.string().uuid("Id invalide (uuid attendu)"),
  })
  .strict();

/**
 * Listing / pagination
 * GET /api/projects?page=&pageSize=&search=&sortBy=&sortOrder=
 */
export const listProjectsQuerySchema = z
  .object({
    // pagination
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(10),

    // recherche simple (sur name)
    search: z.string().trim().min(1).max(80).optional(),

    // tri
    sortBy: z.enum(["createdAt", "updatedAt", "name"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict();
