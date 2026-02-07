import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import * as controller from "./tasks.controller";
import {
  createTaskSchema,
  listTasksQuerySchema,
  taskIdParamsSchema,
  updateTaskSchema,
} from "./tasks.schemas";

console.log("✅ tasks.routes loaded");

const router = Router();

router.use(authMiddleware);

// POST /api/tasks (body)
router.post("/", validate(createTaskSchema), controller.createTask);

// GET /api/tasks (query)
router.get("/", validate(listTasksQuerySchema, "query"), controller.listTasks);

// GET /api/tasks/:id (params)
router.get("/:id", validate(taskIdParamsSchema, "params"), controller.getTask);

// PATCH /api/tasks/:id (params + body)
router.patch(
  "/:id",
  validate(taskIdParamsSchema, "params"),
  validate(updateTaskSchema),
  controller.updateTask,
);

// DELETE /api/tasks/:id (params)
router.delete(
  "/:id",
  validate(taskIdParamsSchema, "params"),
  controller.deleteTask,
);

export default router;
