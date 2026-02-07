/**
 * projects.routes.ts
 * ------------------------------------------------------------------
 * Routes Projects (protégées)
 *
 * - authMiddleware : protège toutes les routes
 * - validate       : valide body/query/params via Zod
 */

import { Router } from "express";

import { authMiddleware } from "../../middleware/auth";
import { validate } from "../../middleware/validate";

import { projectsController } from "./projects.controller";
import {
  createProjectSchema,
  listProjectsQuerySchema,
  projectIdParamsSchema,
  updateProjectSchema,
} from "./projects.schemas";

export const projectsRoutes = Router();

// ✅ Toutes les routes Projects nécessitent un access token
projectsRoutes.use(authMiddleware);

/**
 * POST /api/projects
 */
projectsRoutes.post(
  "/",
  validate(createProjectSchema),
  projectsController.create,
);

/**
 * GET /api/projects (pagination + recherche + tri)
 */
projectsRoutes.get(
  "/",
  validate(listProjectsQuerySchema, "query"),
  projectsController.list,
);

/**
 * GET /api/projects/:id
 */
projectsRoutes.get(
  "/:id",
  validate(projectIdParamsSchema, "params"),
  projectsController.getById,
);

/**
 * PATCH /api/projects/:id
 */
projectsRoutes.patch(
  "/:id",
  validate(projectIdParamsSchema, "params"),
  validate(updateProjectSchema),
  projectsController.update,
);

/**
 * DELETE /api/projects/:id
 */
projectsRoutes.delete(
  "/:id",
  validate(projectIdParamsSchema, "params"),
  projectsController.remove,
);
