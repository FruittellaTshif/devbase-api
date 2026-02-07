import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/appError";

/**
 * Type du status aligné sur ton enum Prisma.
 * (On reste simple : string union côté TS)
 */
type TaskStatus = "TODO" | "DOING" | "DONE";

type CreateTaskInput = {
  projectId: string;
  title: string;
  status?: TaskStatus;
};

type ListTasksFilters = {
  projectId?: string;
  status?: TaskStatus;
};

type UpdateTaskInput = {
  title?: string;
  status?: TaskStatus;
};

/**
 * Créer une task:
 * 1) Vérifier que le project appartient bien à l'utilisateur (sécurité)
 * 2) Créer la task en forçant userId depuis le token
 *
 * ⚠️ On ne fait jamais confiance au client pour userId.
 */
export async function createTask(userId: string, input: CreateTaskInput) {
  // 1) Ownership check : est-ce que le projet appartient à ce user ?
  const project = await prisma.project.findFirst({
    where: { id: input.projectId, ownerId: userId },
    select: { id: true },
  });

  if (!project) {
    throw new AppError(404, "NOT_FOUND", "Project not found");
  }

  // 2) Création
  return prisma.task.create({
    data: {
      title: input.title,
      status: input.status ?? "TODO", // optionnel (Prisma default TODO aussi)
      projectId: input.projectId,
      userId, // provient du token
    },
  });
}

/**
 * Lister les tasks:
 * Toujours filtré par userId.
 * + filtres optionnels projectId/status.
 */
export async function listTasks(userId: string, filters: ListTasksFilters) {
  return prisma.task.findMany({
    where: {
      userId,
      ...(filters.projectId ? { projectId: filters.projectId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Récupérer une task par id:
 * Toujours filtré par userId pour éviter accès cross-user.
 */
export async function getTaskById(userId: string, taskId: string) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new AppError(404, "NOT_FOUND", "Task not found");
  }

  return task;
}

/**
 * Mettre à jour une task:
 * 1) Vérifier ownership (task appartient au user)
 * 2) Update
 */
export async function updateTask(
  userId: string,
  taskId: string,
  input: UpdateTaskInput,
) {
  const existing = await prisma.task.findFirst({
    where: { id: taskId, userId },
    select: { id: true },
  });

  if (!existing) {
    throw new AppError(404, "NOT_FOUND", "Task not found");
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
    },
  });
}

/**
 * Supprimer une task:
 * 1) Vérifier ownership
 * 2) Delete
 */
export async function deleteTask(userId: string, taskId: string) {
  const existing = await prisma.task.findFirst({
    where: { id: taskId, userId },
    select: { id: true },
  });

  if (!existing) {
    throw new AppError(404, "NOT_FOUND", "Task not found");
  }

  await prisma.task.delete({ where: { id: taskId } });

  return { deleted: true };
}
