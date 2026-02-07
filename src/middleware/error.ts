import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/appError";

/**
 * errorHandler (global)
 * ------------------------------------------------------------------
 * Middleware global de gestion des erreurs (à enregistrer APRÈS les routes).
 *
 * Gère :
 * - ZodError (validation) => 400 + détails par champ
 * - AppError (erreurs métier) => status personnalisé (400/401/404/409…)
 * - erreurs CORS => 403
 * - fallback => 500
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  /**
   * ✅ 1) Erreurs de validation (Zod)
   */
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: err.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
  }

  /**
   * ✅ 2) Erreurs métier (AppError)
   */
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  /**
   * ✅ 3) Erreurs “CORS”
   */
  if (err instanceof Error && err.message.includes("CORS")) {
    return res.status(403).json({
      error: {
        code: "CORS_FORBIDDEN",
        message: "CORS forbidden for this origin",
      },
    });
  }

  /**
   * ✅ 4) Fallback générique
   */
  const message = err instanceof Error ? err.message : "Unknown error";

  // eslint-disable-next-line no-console
  console.error("❌ Error:", err);

  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message,
    },
  });
}
