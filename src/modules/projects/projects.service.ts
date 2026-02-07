/**
 * projects.service.ts
 * ------------------------------------------------------------------
 * Couche "métier" + DB :
 * - appelle Prisma
 * - applique les règles (ownerId, pagination, etc.)
 *
 * ⚠️ Pas de logique HTTP ici (pas de req/res)
 */

import { prisma } from "../../config/prisma";

type ListOptions = {
  ownerId: string;
  page: number;
  pageSize: number;
  search?: string;
  sortBy: "createdAt" | "updatedAt" | "name";
  sortOrder: "asc" | "desc";
};

export const projectsService = {
  async create(ownerId: string, data: { name: string }) {
    return prisma.project.create({
      data: {
        name: data.name,
        ownerId,
      },
      select: {
        id: true,
        name: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async list(opts: ListOptions) {
    const where: any = { ownerId: opts.ownerId };

    if (opts.search) {
      where.name = { contains: opts.search, mode: "insensitive" };
    }

    const skip = (opts.page - 1) * opts.pageSize;
    const take = opts.pageSize;

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { [opts.sortBy]: opts.sortOrder },
        skip,
        take,
        select: {
          id: true,
          name: true,
          ownerId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.project.count({ where }),
    ]);

    return {
      items,
      page: opts.page,
      pageSize: opts.pageSize,
      total,
      totalPages: Math.ceil(total / opts.pageSize),
    };
  },

  async getById(ownerId: string, id: string) {
    return prisma.project.findFirst({
      where: { id, ownerId },
      select: {
        id: true,
        name: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async update(ownerId: string, id: string, data: { name?: string }) {
    // sécurité: vérifier appartenance
    const exists = await prisma.project.findFirst({
      where: { id, ownerId },
      select: { id: true },
    });
    if (!exists) return null;

    return prisma.project.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
      },
      select: {
        id: true,
        name: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async remove(ownerId: string, id: string) {
    const exists = await prisma.project.findFirst({
      where: { id, ownerId },
      select: { id: true },
    });
    if (!exists) return null;

    await prisma.project.delete({ where: { id } });
    return { ok: true };
  },
};
