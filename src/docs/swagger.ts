export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "DevBase API",
    version: "1.0.0",
    description: "REST API + Auth + PostgreSQL + Swagger",
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Local",
    },
    {
      url: "https://devbase-api-egxh.onrender.com",
      description: "Production",
    },
  ],
  paths: {
    "/health": {
      get: {
        summary: "Healthcheck",
        responses: {
          "200": { description: "API is up" },
        },
      },
    },
  },
};
