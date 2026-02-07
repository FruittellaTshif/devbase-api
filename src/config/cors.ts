import type { CorsOptions } from "cors";
import { env } from "./env";

export const corsOptions: CorsOptions = {
  origin: (origin, cb) => {
    // Autorise tools (Postman) sans origin
    if (!origin) return cb(null, true);

    // CORS_ORIGIN="*" => autorise tout
    if (env.CORS_ORIGIN === "*") return cb(null, true);

    const allowed = env.CORS_ORIGIN.split(",").map((s) => s.trim());
    if (allowed.includes(origin)) return cb(null, true);

    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
};
