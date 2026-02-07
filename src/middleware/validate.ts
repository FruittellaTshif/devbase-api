import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodTypeAny } from "zod";

/**
 * Cible de validation (par défaut: body)
 * ------------------------------------------------------------------
 * - body   : req.body
 * - query  : req.query
 * - params : req.params
 */
type ValidateTarget = "body" | "query" | "params";

/**
 * validate
 * ------------------------------------------------------------------
 * Middleware générique de validation Zod.
 *
 * Usage:
 * - validate(registerSchema)            // valide req.body
 * - validate(listSchema, "query")       // valide req.query
 * - validate(idSchema, "params")        // valide req.params
 *
 * Comportement:
 * - remplace req[target] par la version "parsed" (sanitized / castée)
 * - en cas d'erreur, passe l'erreur au errorHandler global
 */
export function validate(schema: ZodTypeAny, target: ValidateTarget = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      // Laisse le middleware global (error.ts) formater la réponse
      return next(result.error);
    }

    // Remplace par la version validée (ex: trim, toLowerCase, coercions, etc.)
    (req as any)[target] = result.data;

    return next();
  };
}

/**
 * isZodError
 * ------------------------------------------------------------------
 * Helper si tu as besoin d'identifier une ZodError ailleurs.
 * (Optionnel, mais utile si tu as un autre error handler un jour.)
 */
export function isZodError(err: unknown): err is ZodError {
  return err instanceof ZodError;
}
