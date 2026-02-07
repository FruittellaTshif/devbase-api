import { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth";
import * as tasksService from "./tasks.service";

/**
 * POST /api/tasks
 * Créer une nouvelle task
 */
export async function createTask(req: AuthenticatedRequest, res: Response) {
  /**
   * Sécurité :
   * - authMiddleware garantit que req.user existe
   * - userId vient du token (payload.sub)
   */
  const userId = req.user!.id;

  const task = await tasksService.createTask(userId, req.body);

  return res.status(201).json(task);
}

/**
 * GET /api/tasks
 * Lister les tasks (avec filtres optionnels)
 */
export async function listTasks(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.id;

  const tasks = await tasksService.listTasks(userId, {
    projectId: req.query.projectId as string | undefined,
    status: req.query.status as any,
  });

  return res.json(tasks);
}

/**
 * GET /api/tasks/:id
 * Récupérer une task
 */
export async function getTask(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.id;

  const task = await tasksService.getTaskById(userId, req.params.id);

  return res.json(task);
}

/**
 * PATCH /api/tasks/:id
 * Mettre à jour une task (ex: status)
 */
export async function updateTask(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.id;

  const task = await tasksService.updateTask(userId, req.params.id, req.body);

  return res.json(task);
}

/**
 * DELETE /api/tasks/:id
 * Supprimer une task
 */
export async function deleteTask(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.id;

  const result = await tasksService.deleteTask(userId, req.params.id);

  return res.json(result);
}
