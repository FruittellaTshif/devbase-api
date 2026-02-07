import express from "express";
import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { env } from "./config/env";
import { corsOptions } from "./config/cors";
import { apiLimiter } from "./config/rateLimit";

import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/error";

import { authRoutes } from "./modules/auth/auth.routes";
import { projectsRoutes } from "./modules/projects/projects.routes";
import tasksRoutes from "./modules/tasks/tasks.routes";

// Swagger UI
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

/**
 * createApp
 * ------------------------------------------------------------------
 * Construit et configure l'application Express (sans démarrer le serveur).
 *
 * Ordre recommandé :
 * 1) settings (trust proxy)
 * 2) security + logs
 * 3) parsers (json, urlencoded, cookies)  ✅ DOIT être avant les routes
 * 4) cors
 * 5) rate limiting
 * 6) routes
 * 7) docs
 * 8) notFound
 * 9) errorHandler (TOUJOURS en dernier)
 */
export function createApp() {
  const app = express();

  /**
   * Trust proxy
   * ----------------------------------------------------------------
   * Utile si l'app est derrière un reverse proxy (Render, Nginx, etc.)
   * Permet à Express d'interpréter correctement IP/HTTPS via X-Forwarded-*
   */
  app.set("trust proxy", 1);

  /**
   * Security + logs
   * ----------------------------------------------------------------
   * helmet: headers de sécurité
   * morgan: logs HTTP (dev/combined)
   */
  app.use(helmet());
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  /**
   * Parsers
   * ----------------------------------------------------------------
   * IMPORTANT: express.json() doit être monté avant toutes les routes
   * sinon req.body sera undefined.
   */
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  /**
   * CORS
   * ----------------------------------------------------------------
   * Origins autorisées + credentials si besoin (cookies refresh token)
   */
  app.use(cors(corsOptions));

  /**
   * Rate limit global
   * ----------------------------------------------------------------
   * Appliqué à toutes les routes /api/*
   */
  app.use("/api", apiLimiter);

  /**
   * Healthcheck
   * ----------------------------------------------------------------
   * Endpoint simple pour vérifier que l’API tourne (monitoring/deploy)
   */
  app.get("/health", (_req, res) => {
    res.json({ ok: true, name: "devbase-api", env: env.NODE_ENV });
  });

  /**
   * Routes API
   * ----------------------------------------------------------------
   * On monte chaque module sous /api/...
   */
  app.use("/api/auth", authRoutes);
  app.use("/api/projects", projectsRoutes);
  app.use("/api/tasks", tasksRoutes);

  /**
   * Documentation Swagger
   * ----------------------------------------------------------------
   * Disponible sur /docs
   */
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  /**
   * Fin de chaîne
   * ----------------------------------------------------------------
   * 1) notFound: aucune route match -> 404
   * 2) errorHandler: formate toutes les erreurs (Zod, AppError, 500...)
   */
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
