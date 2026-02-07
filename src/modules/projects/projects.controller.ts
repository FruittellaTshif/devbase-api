/**
 * projects.controller.ts
 * ------------------------------------------------------------------
 * Couche HTTP :
 * - lit req (body/query/params)
 * - appelle le service
 * - renvoie res (status/json)
 */

import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth";

import { projectsService } from "./projects.service";

export const projectsController = {
  /**
   * POST /api/projects
   */
  async create(req: AuthenticatedRequest, res: Response) {
    const ownerId = req.user!.id; // garanti par authMiddleware
    const project = await projectsService.create(ownerId, req.body);
    return res.status(201).json({ project });
  },

  /**
   * GET /api/projects
   */
  async list(req: AuthenticatedRequest, res: Response) {
    const ownerId = req.user!.id;

    // validé en amont par validate(listProjectsQuerySchema, "query")
    const { page, pageSize, search, sortBy, sortOrder } = req.query as any;

    const result = await projectsService.list({
      ownerId,
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
    });

    return res.status(200).json(result);
  },

  /**
   * GET /api/projects/:id
   */
  async getById(req: AuthenticatedRequest, res: Response) {
    const ownerId = req.user!.id;
    const { id } = req.params as any;

    const project = await projectsService.getById(ownerId, id);
    if (!project) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Project not found" },
      });
    }

    return res.status(200).json({ project });
  },

  /**
   * PATCH /api/projects/:id
   */
  async update(req: AuthenticatedRequest, res: Response) {
    const ownerId = req.user!.id;
    const { id } = req.params as any;

    const project = await projectsService.update(ownerId, id, req.body);
    if (!project) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Project not found" },
      });
    }

    return res.status(200).json({ project });
  },

  /**
   * DELETE /api/projects/:id
   */
  async remove(req: AuthenticatedRequest, res: Response) {
    const ownerId = req.user!.id;
    const { id } = req.params as any;

    const result = await projectsService.remove(ownerId, id);
    if (!result) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Project not found" },
      });
    }

    return res.status(200).json(result);
  },
};
