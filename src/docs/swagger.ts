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

    /**
     * ------------------------------------------------------------
     * Projects
     * ------------------------------------------------------------
     */
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
                additionalProperties: false,
                properties: {
                  name: {
                    type: "string",
                    minLength: 2,
                    maxLength: 80,
                    example: "Project Postman 2",
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
                  id: "ce73e824-5d16-4b4d-91eb-ee1cfd38e0a7",
                  name: "Project Postman 2",
                  ownerId: "04936224-25c1-420d-b9d3-52a031cbc69f",
                  createdAt: "2026-02-10T06:26:06.592Z",
                  updatedAt: "2026-02-10T06:26:06.592Z",
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
            required: false,
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            name: "pageSize",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, maximum: 50, default: 10 },
          },
          {
            name: "search",
            in: "query",
            required: false,
            schema: { type: "string", minLength: 1, maxLength: 80 },
          },
          {
            name: "sortBy",
            in: "query",
            required: false,
            schema: {
              type: "string",
              enum: ["createdAt", "updatedAt", "name"],
              default: "createdAt",
            },
          },
          {
            name: "sortOrder",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
          },
        ],
        responses: {
          "200": {
            description: "Projects list",
            content: {
              "application/json": {
                example: {
                  items: [
                    {
                      id: "ce73e824-5d16-4b4d-91eb-ee1cfd38e0a7",
                      name: "Project Postman 2",
                      ownerId: "04936224-25c1-420d-b9d3-52a031cbc69f",
                      createdAt: "2026-02-10T06:26:06.592Z",
                      updatedAt: "2026-02-10T06:26:06.592Z",
                    },
                    {
                      id: "c917b5aa-2b51-4474-bd5e-8a89c4a5757d",
                      name: "Project Postman 1",
                      ownerId: "04936224-25c1-420d-b9d3-52a031cbc69f",
                      createdAt: "2026-02-07T08:03:52.158Z",
                      updatedAt: "2026-02-07T08:03:52.158Z",
                    },
                  ],
                  page: 1,
                  pageSize: 10,
                  total: 4,
                  totalPages: 1,
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
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Project found",
            content: {
              "application/json": {
                example: {
                  id: "ce73e824-5d16-4b4d-91eb-ee1cfd38e0a7",
                  name: "Project Postman 2",
                  ownerId: "04936224-25c1-420d-b9d3-52a031cbc69f",
                  createdAt: "2026-02-10T06:26:06.592Z",
                  updatedAt: "2026-02-10T06:26:06.592Z",
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
          "404": { description: "Project not found" },
        },
      },

      patch: {
        tags: ["Projects"],
        summary: "Update project",
        description:
          "Met à jour un projet existant (au moins un champ requis).",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                  name: {
                    type: "string",
                    minLength: 2,
                    maxLength: 80,
                    example: "Project Updated",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Project updated" },
          "400": { description: "Validation error" },
          "401": { description: "Unauthorized" },
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
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": { description: "Project deleted" },
          "401": { description: "Unauthorized" },
          "404": { description: "Project not found" },
        },
      },
    },

    /**
     * ------------------------------------------------------------
     * Tasks
     * ------------------------------------------------------------
     */
    "/api/tasks": {
      post: {
        tags: ["Tasks"],
        summary: "Create a task",
        description: "Crée une nouvelle tâche liée à un projet.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["projectId", "title"],
                additionalProperties: false,
                properties: {
                  projectId: {
                    type: "string",
                    format: "uuid",
                    example: "c917b5aa-2b51-4474-bd5e-8a89c4a5757d",
                  },
                  title: {
                    type: "string",
                    minLength: 1,
                    maxLength: 120,
                    example: "Task Postman 1",
                  },
                  status: {
                    type: "string",
                    enum: ["TODO", "DOING", "DONE"],
                    example: "TODO",
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
                  id: "17a9be9f-e186-4546-8a09-96282077beb4",
                  title: "Task Postman 1",
                  status: "TODO",
                  projectId: "c917b5aa-2b51-4474-bd5e-8a89c4a5757d",
                  userId: "04936224-25c1-420d-b9d3-52a031cbc69f",
                  createdAt: "2026-02-07T08:26:59.204Z",
                  updatedAt: "2026-02-11T06:42:04.637Z",
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
        description: "Retourne la liste des tâches (filtres optionnels).",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "projectId",
            in: "query",
            required: false,
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "status",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["TODO", "DOING", "DONE"] },
          },
        ],
        responses: {
          "200": {
            description: "Tasks list",
            content: {
              "application/json": {
                example: [
                  {
                    id: "17a9be9f-e186-4546-8a09-96282077beb4",
                    title: "Task Postman 1",
                    status: "TODO",
                    projectId: "c917b5aa-2b51-4474-bd5e-8a89c4a5757d",
                    userId: "04936224-25c1-420d-b9d3-52a031cbc69f",
                    createdAt: "2026-02-07T08:26:59.204Z",
                    updatedAt: "2026-02-11T06:42:04.637Z",
                  },
                ],
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
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": { description: "Task found" },
          "401": { description: "Unauthorized" },
          "404": { description: "Task not found" },
        },
      },

      patch: {
        tags: ["Tasks"],
        summary: "Update task",
        description: "Met à jour une tâche (au moins un champ requis).",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                  title: {
                    type: "string",
                    minLength: 1,
                    maxLength: 120,
                    example: "Updated task title",
                  },
                  status: {
                    type: "string",
                    enum: ["TODO", "DOING", "DONE"],
                    example: "DOING",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Task updated" },
          "400": { description: "Validation error" },
          "401": { description: "Unauthorized" },
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
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": { description: "Task deleted" },
          "401": { description: "Unauthorized" },
          "404": { description: "Task not found" },
        },
      },
    },
  },
};
