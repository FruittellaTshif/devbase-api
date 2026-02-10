export const swaggerSpec = {
  openapi: "3.0.0",

  info: {
    title: "DevBase API",
    version: "1.0.0",
    description: `
DevBase API est une API REST backend conçue pour gérer des **projets** et des **tâches** avec authentification sécurisée.

### ✨ Fonctionnalités principales
- Authentification JWT (register / login)
- Gestion des projets (CRUD, ownership)
- Gestion des tâches (liées aux projets)
- Sécurité : accès isolé par utilisateur
- Base de données PostgreSQL (Prisma ORM)

### 🔐 Authentification
Les routes protégées nécessitent un **JWT Bearer token**.
Utilisez \`/api/auth/login\` pour obtenir un token, puis cliquez sur **Authorize**.
    `,
  },

  servers: [
    {
      url: "http://localhost:4000",
      description: "Local development server",
    },
    {
      url: "https://devbase-api-egxh.onrender.com",
      description: "Production server (Render)",
    },
  ],

  /**
   * 🔐 Sécurité globale
   * ------------------------------------------------------------
   * Déclare le schéma JWT Bearer pour Swagger UI
   */
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Entrez votre JWT sous la forme : Bearer <token>",
      },
    },
  },

  /**
   * 🛡️ Sécurité appliquée globalement
   * (sera affinée route par route plus tard)
   */
  security: [
    {
      bearerAuth: [],
    },
  ],

  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        description: "Vérifie que l’API est en ligne et fonctionnelle.",
        responses: {
          "200": {
            description: "API is up and running",
          },
        },
      },
    },

    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        description:
          "Crée un nouvel utilisateur et retourne un access token JWT.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    example: "user@example.com",
                  },
                  password: {
                    type: "string",
                    example: "StrongPassword123!",
                  },
                  name: {
                    type: "string",
                    example: "John Doe",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User created successfully",
            content: {
              "application/json": {
                example: {
                  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                  user: {
                    id: "uuid",
                    email: "user@example.com",
                    name: "John Doe",
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        description:
          "Authentifie un utilisateur existant et retourne un access token JWT.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    example: "user@example.com",
                  },
                  password: {
                    type: "string",
                    example: "StrongPassword123!",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                example: {
                  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                  user: {
                    id: "uuid",
                    email: "user@example.com",
                    name: "John Doe",
                  },
                },
              },
            },
          },
          "401": {
            description: "Invalid credentials",
          },
        },
      },
    },

    "/api/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",
        description:
          "Génère un nouvel access token à partir du refresh token stocké en cookie HTTP-only.",
        responses: {
          "200": {
            description: "New access token generated",
            content: {
              "application/json": {
                example: {
                  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
              },
            },
          },
          "401": {
            description: "Missing or invalid refresh token",
          },
        },
      },
    },

    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout user",
        description:
          "Supprime le refresh token côté client et invalide la session.",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "200": {
            description: "User logged out successfully",
          },
        },
      },
    },

    "/api/projects": {
      post: {
        tags: ["Projects"],
        summary: "Create a project",
        description: "Crée un nouveau projet pour l’utilisateur authentifié.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: {
                    type: "string",
                    example: "Portfolio Backend API",
                  },
                  description: {
                    type: "string",
                    example: "Projet backend Node.js avec auth JWT",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Project created",
            content: {
              "application/json": {
                example: {
                  id: "uuid",
                  name: "Portfolio Backend API",
                  description: "Projet backend Node.js avec auth JWT",
                  createdAt: "2025-01-01T12:00:00.000Z",
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },

      get: {
        tags: ["Projects"],
        summary: "List projects",
        description:
          "Retourne la liste des projets de l’utilisateur (pagination, recherche, tri).",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", example: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", example: 10 },
          },
          {
            name: "search",
            in: "query",
            schema: { type: "string", example: "portfolio" },
          },
          {
            name: "sort",
            in: "query",
            schema: { type: "string", example: "createdAt:desc" },
          },
        ],
        responses: {
          "200": {
            description: "Projects list",
            content: {
              "application/json": {
                example: {
                  data: [
                    {
                      id: "uuid",
                      name: "Portfolio Backend API",
                      description: "Projet backend Node.js",
                    },
                  ],
                  meta: {
                    page: 1,
                    limit: 10,
                    total: 1,
                  },
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
    },

    "/api/projects/{id}": {
      get: {
        tags: ["Projects"],
        summary: "Get project by ID",
        description: "Retourne un projet appartenant à l’utilisateur.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", example: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Project found",
            content: {
              "application/json": {
                example: {
                  id: "uuid",
                  name: "Portfolio Backend API",
                  description: "Projet backend Node.js",
                },
              },
            },
          },
          "404": { description: "Project not found" },
        },
      },

      patch: {
        tags: ["Projects"],
        summary: "Update project",
        description: "Met à jour un projet existant.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", example: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    example: "Updated project name",
                  },
                  description: {
                    type: "string",
                    example: "Nouvelle description",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Project updated" },
          "404": { description: "Project not found" },
        },
      },

      delete: {
        tags: ["Projects"],
        summary: "Delete project",
        description: "Supprime un projet appartenant à l’utilisateur.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", example: "uuid" },
          },
        ],
        responses: {
          "200": { description: "Project deleted" },
          "404": { description: "Project not found" },
        },
      },
    },

    "/api/tasks": {
      post: {
        tags: ["Tasks"],
        summary: "Create a task",
        description:
          "Crée une nouvelle tâche liée à un projet appartenant à l’utilisateur.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "projectId"],
                properties: {
                  title: {
                    type: "string",
                    example: "Implement JWT middleware",
                  },
                  projectId: {
                    type: "string",
                    example: "project-uuid",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Task created",
            content: {
              "application/json": {
                example: {
                  id: "task-uuid",
                  title: "Implement JWT middleware",
                  completed: false,
                  projectId: "project-uuid",
                  createdAt: "2025-01-01T12:00:00.000Z",
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },

      get: {
        tags: ["Tasks"],
        summary: "List tasks",
        description:
          "Retourne la liste des tâches de l’utilisateur (pagination et filtres).",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "projectId",
            in: "query",
            schema: { type: "string", example: "project-uuid" },
          },
          {
            name: "completed",
            in: "query",
            schema: { type: "boolean", example: false },
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", example: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", example: 10 },
          },
        ],
        responses: {
          "200": {
            description: "Tasks list",
            content: {
              "application/json": {
                example: {
                  data: [
                    {
                      id: "task-uuid",
                      title: "Implement JWT middleware",
                      completed: false,
                      projectId: "project-uuid",
                    },
                  ],
                  meta: {
                    page: 1,
                    limit: 10,
                    total: 1,
                  },
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
    },

    "/api/tasks/{id}": {
      get: {
        tags: ["Tasks"],
        summary: "Get task by ID",
        description: "Retourne une tâche appartenant à l’utilisateur.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", example: "task-uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Task found",
            content: {
              "application/json": {
                example: {
                  id: "task-uuid",
                  title: "Implement JWT middleware",
                  completed: false,
                  projectId: "project-uuid",
                },
              },
            },
          },
          "404": { description: "Task not found" },
        },
      },

      patch: {
        tags: ["Tasks"],
        summary: "Update task",
        description: "Met à jour une tâche existante.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", example: "task-uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    example: "Finalize Swagger documentation",
                  },
                  completed: {
                    type: "boolean",
                    example: true,
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Task updated" },
          "404": { description: "Task not found" },
        },
      },

      delete: {
        tags: ["Tasks"],
        summary: "Delete task",
        description: "Supprime une tâche appartenant à l’utilisateur.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", example: "task-uuid" },
          },
        ],
        responses: {
          "200": { description: "Task deleted" },
          "404": { description: "Task not found" },
        },
      },
    },
  },
};
