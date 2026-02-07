import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

/**
 * Démarrage serveur
 * ------------------------------------------------------------------
 * On conserve une référence au server pour pouvoir :
 * - gérer les erreurs de démarrage (EADDRINUSE, etc.)
 * - fermer proprement (SIGINT/SIGTERM)
 */
const server = app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`✅ DevBase API running on http://localhost:${env.PORT}`);
  // eslint-disable-next-line no-console
  console.log(`📚 Swagger docs on http://localhost:${env.PORT}/docs`);
});

/**
 * Gestion erreurs serveur (ex: port déjà utilisé)
 */
server.on("error", (err: any) => {
  // eslint-disable-next-line no-console
  console.error("❌ Server error:", err);

  if (err?.code === "EADDRINUSE") {
    // eslint-disable-next-line no-console
    console.error(
      `➡️  Le port ${env.PORT} est déjà utilisé. Change env.PORT ou ferme le process en conflit.`,
    );
  }

  process.exit(1);
});

/**
 * Arrêt propre (Ctrl+C / arrêt plateforme)
 * ------------------------------------------------------------------
 * Pratique en production et évite des connexions ouvertes.
 */
function shutdown(signal: string) {
  // eslint-disable-next-line no-console
  console.log(`\n🛑 Received ${signal}. Shutting down...`);

  server.close(() => {
    // eslint-disable-next-line no-console
    console.log("✅ Server closed.");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
