import { z } from "zod";

/**
 * CREATE (valide req.body)
 * POST /api/tasks
 */
export const createTaskSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(1, "Title is required").max(120),
  status: z.enum(["TODO", "DOING", "DONE"]).optional(),
});

/**
 * LIST (valide req.query)
 * GET /api/tasks?projectId=...&status=...
 */
export const listTasksQuerySchema = z.object({
  projectId: z.string().uuid().optional(),
  status: z.enum(["TODO", "DOING", "DONE"]).optional(),
});

/**
 * PARAMS (valide req.params)
 * /api/tasks/:id
 */
export const taskIdParamsSchema = z.object({
  id: z.string().uuid(),
});

/**
 * UPDATE (valide req.body)
 * PATCH /api/tasks/:id
 */
export const updateTaskSchema = z
  .object({
    title: z.string().min(1).max(120).optional(),
    status: z.enum(["TODO", "DOING", "DONE"]).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: "At least one field must be provided",
  });
