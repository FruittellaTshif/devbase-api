import type { Request, Response } from "express";

/**
 * notFound
 * ------------------------------------------------------------------
 * Middleware 404 appelé quand aucune route ne correspond.
 * Retourne une réponse standardisée (format error uniforme).
 */
export function notFound(req: Request, res: Response) {
  return res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
}
