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
   * Components
   * - securitySchemes: JWT Bearer
   * - schemas: modèles réutilisables (Project, Task, Error...)
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

    schemas: {
      // ----------------------------
      // Domain models
      // ----------------------------
      Project: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", minLength: 2, maxLength: 80 },
          ownerId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["id", "name", "ownerId", "createdAt", "updatedAt"],
      },

      Task: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string", minLength: 1, maxLength: 120 },
          status: { type: "string", enum: ["TODO", "DOING", "DONE"] },
          projectId: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: [
          "id",
          "title",
          "status",
          "projectId",
          "userId",
          "createdAt",
          "updatedAt",
        ],
      },

      // ----------------------------
      // Response wrappers
      // ----------------------------
      ProjectResponse: {
        type: "object",
        additionalProperties: false,
        properties: {
          project: { $ref: "#/components/schemas/Project" },
        },
        required: ["project"],
      },

      PaginatedProjectsResponse: {
        type: "object",
        additionalProperties: false,
        properties: {
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/Project" },
          },
          page: { type: "integer", minimum: 1 },
          pageSize: { type: "integer", minimum: 1, maximum: 50 },
          total: { type: "integer", minimum: 0 },
          totalPages: { type: "integer", minimum: 0 },
        },
        required: ["items", "page", "pageSize", "total", "totalPages"],
      },

      // ----------------------------
      // Errors
      // ----------------------------
      ErrorResponse: {
        type: "object",
        additionalProperties: false,
        properties: {
          error: {
            type: "object",
            additionalProperties: false,
            properties: {
              code: { type: "string" },
              message: { type: "string" },
            },
            required: ["code", "message"],
          },
        },
        required: ["error"],
      },

      ValidationErrorResponse: {
        type: "object",
        additionalProperties: false,
        properties: {
          error: {
            type: "object",
            additionalProperties: false,
            properties: {
              code: { type: "string", enum: ["VALIDATION_ERROR"] },
              message: { type: "string", enum: ["Validation failed"] },
              details: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    path: { type: "string" },
                    message: { type: "string" },
                  },
                  required: ["path", "message"],
                },
              },
            },
            required: ["code", "message", "details"],
          },
        },
        required: ["error"],
      },
    },

    examples: {
      UnauthorizedMissingHeader: {
        summary: "Missing Authorization header",
        value: {
          error: {
            code: "UNAUTHORIZED",
            message: "Missing Authorization header",
          },
        },
      },
      UnauthorizedInvalidFormat: {
        summary: "Invalid Authorization format",
        value: {
          error: {
            code: "UNAUTHORIZED",
            message: "Invalid Authorization format. Use Bearer <token>",
          },
        },
      },
      UnauthorizedInvalidOrExpired: {
        summary: "Invalid or expired token",
        value: {
          error: {
            code: "UNAUTHORIZED",
            message: "Invalid or expired token",
          },
        },
      },
      ValidationErrorExample: {
        summary: "Zod validation error",
        value: {
          error: {
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            details: [{ path: "pageSize", message: "Number must be <= 50" }],
          },
        },
      },
      NotFoundRouteExample: {
        summary: "Route not found (notFound middleware)",
        value: {
          error: {
            code: "NOT_FOUND",
            message: "Route not found: GET /unknown",
          },
        },
      },
      NotFoundProjectExample: {
        summary: "Project not found",
        value: {
          error: { code: "NOT_FOUND", message: "Project not found" },
        },
      },
      NotFoundTaskExample: {
        summary: "Task not found",
        value: {
          error: { code: "NOT_FOUND", message: "Task not found" },
        },
      },
      CorsForbiddenExample: {
        summary: "CORS forbidden",
        value: {
          error: {
            code: "CORS_FORBIDDEN",
            message: "CORS forbidden for this origin",
          },
        },
      },
      InternalServerErrorExample: {
        summary: "Internal server error",
        value: {
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          },
        },
      },
    },
  },

  /**
   * Sécurité appliquée globalement
   */
  security: [{ bearerAuth: [] }],

  paths: {
    "/": {
      get: {
        tags: ["Root"],
        summary: "API landing (root)",
        description:
          "Retourne une réponse JSON indiquant que l’API est en ligne et fournit le lien de documentation.",
        responses: {
          "200": {
            description: "API landing response",
            content: {
              "application/json": {
                example: {
                  name: "DevBase API",
                  status: "running",
                  message: "Welcome to DevBase API",
                  documentation: {
                    swagger: "/docs",
                    fullUrl: "https://devbase-api-egxh.onrender.com/docs",
                  },
                },
              },
            },
          },
        },
      },
    },

    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        description: "Vérifie que l’API est en ligne et fonctionnelle.",
        responses: {
          "200": {
            description: "API health status",
            content: {
              "application/json": {
                example: { ok: true, name: "devbase-api", env: "development" },
              },
            },
          },
        },
      },
    },

    // ----------------------------
    // Auth
    // ----------------------------
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
                  email: { type: "string", example: "user@example.com" },
                  password: { type: "string", example: "StrongPassword123!" },
                  name: { type: "string", example: "John Doe" },
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
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse",
                },
                examples: {
                  validation: {
                    $ref: "#/components/examples/ValidationErrorExample",
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
                  email: { type: "string", example: "user@example.com" },
                  password: { type: "string", example: "StrongPassword123!" },
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
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse",
                },
                examples: {
                  validation: {
                    $ref: "#/components/examples/ValidationErrorExample",
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
          "401": { description: "Missing or invalid refresh token" },
        },
      },
    },

    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout user",
        description:
          "Supprime le refresh token côté client et invalide la session.",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "User logged out successfully" },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  missingHeader: {
                    $ref: "#/components/examples/UnauthorizedMissingHeader",
                  },
                  invalidFormat: {
                    $ref: "#/components/examples/UnauthorizedInvalidFormat",
                  },
                  invalidToken: {
                    $ref: "#/components/examples/UnauthorizedInvalidOrExpired",
                  },
                },
              },
            },
          },
        },
      },
    },

    // ----------------------------
    // Projects
    // ----------------------------
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
                schema: { $ref: "#/components/schemas/ProjectResponse" },
                example: {
                  project: {
                    id: "ce73e824-5d16-4b4d-91eb-ee1cfd38e0a7",
                    name: "Project Postman 2",
                    ownerId: "04936224-25c1-420d-b9d3-52a031cbc69f",
                    createdAt: "2026-02-10T06:26:06.592Z",
                    updatedAt: "2026-02-10T06:26:06.592Z",
                  },
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse",
                },
                examples: {
                  validation: {
                    $ref: "#/components/examples/ValidationErrorExample",
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  missingHeader: {
                    $ref: "#/components/examples/UnauthorizedMissingHeader",
                  },
                  invalidFormat: {
                    $ref: "#/components/examples/UnauthorizedInvalidFormat",
                  },
                  invalidToken: {
                    $ref: "#/components/examples/UnauthorizedInvalidOrExpired",
                  },
                },
              },
            },
          },
        },
      },

      get: {
        tags: ["Projects"],
        summary: "List projects",
        description:
          "Retourne la liste des projets de l’utilisateur (pagination + recherche + tri).",
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
                schema: {
                  $ref: "#/components/schemas/PaginatedProjectsResponse",
                },
                example: {
                  items: [
                    {
                      id: "ce73e824-5d16-4b4d-91eb-ee1cfd38e0a7",
                      name: "Project Postman 2",
                      ownerId: "04936224-25c1-420d-b9d3-52a031cbc69f",
                      createdAt: "2026-02-10T06:26:06.592Z",
                      updatedAt: "2026-02-10T06:26:06.592Z",
                    },
                  ],
                  page: 1,
                  pageSize: 10,
                  total: 1,
                  totalPages: 1,
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse",
                },
                examples: {
                  validation: {
                    $ref: "#/components/examples/ValidationErrorExample",
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  missingHeader: {
                    $ref: "#/components/examples/UnauthorizedMissingHeader",
                  },
                  invalidFormat: {
                    $ref: "#/components/examples/UnauthorizedInvalidFormat",
                  },
                  invalidToken: {
                    $ref: "#/components/examples/UnauthorizedInvalidOrExpired",
                  },
                },
              },
            },
          },
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
                schema: { $ref: "#/components/schemas/ProjectResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse",
                },
                examples: {
                  validation: {
                    $ref: "#/components/examples/ValidationErrorExample",
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  missingHeader: {
                    $ref: "#/components/examples/UnauthorizedMissingHeader",
                  },
                  invalidFormat: {
                    $ref: "#/components/examples/UnauthorizedInvalidFormat",
                  },
                  invalidToken: {
                    $ref: "#/components/examples/UnauthorizedInvalidOrExpired",
                  },
                },
              },
            },
          },
          "404": {
            description: "Project not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  notFound: {
                    $ref: "#/components/examples/NotFoundProjectExample",
                  },
                },
              },
            },
          },
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
          "200": {
            description: "Project updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProjectResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse",
                },
                examples: {
                  validation: {
                    $ref: "#/components/examples/ValidationErrorExample",
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  missingHeader: {
                    $ref: "#/components/examples/UnauthorizedMissingHeader",
                  },
                  invalidFormat: {
                    $ref: "#/components/examples/UnauthorizedInvalidFormat",
                  },
                  invalidToken: {
                    $ref: "#/components/examples/UnauthorizedInvalidOrExpired",
                  },
                },
              },
            },
          },
          "404": {
            description: "Project not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  notFound: {
                    $ref: "#/components/examples/NotFoundProjectExample",
                  },
                },
              },
            },
          },
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
          "200": {
            description: "Project deleted",
            content: {
              "application/json": {
                example: { ok: true },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  missingHeader: {
                    $ref: "#/components/examples/UnauthorizedMissingHeader",
                  },
                  invalidFormat: {
                    $ref: "#/components/examples/UnauthorizedInvalidFormat",
                  },
                  invalidToken: {
                    $ref: "#/components/examples/UnauthorizedInvalidOrExpired",
                  },
                },
              },
            },
          },
          "404": {
            description: "Project not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  notFound: {
                    $ref: "#/components/examples/NotFoundProjectExample",
                  },
                },
              },
            },
          },
        },
      },
    },

    // ----------------------------
    // Tasks (Option B: pas strict -> on NE bloque PAS additionalProperties)
    // ----------------------------
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
                schema: { $ref: "#/components/schemas/Task" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse",
                },
                examples: {
                  validation: {
                    $ref: "#/components/examples/ValidationErrorExample",
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  missingHeader: {
                    $ref: "#/components/examples/UnauthorizedMissingHeader",
                  },
                  invalidFormat: {
                    $ref: "#/components/examples/UnauthorizedInvalidFormat",
                  },
                  invalidToken: {
                    $ref: "#/components/examples/UnauthorizedInvalidOrExpired",
                  },
                },
              },
            },
          },
          "404": {
            description: "Project not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  notFound: {
                    $ref: "#/components/examples/NotFoundProjectExample",
                  },
                },
              },
            },
          },
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
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Task" },
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse",
                },
                examples: {
                  validation: {
                    $ref: "#/components/examples/ValidationErrorExample",
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  missingHeader: {
                    $ref: "#/components/examples/UnauthorizedMissingHeader",
                  },
                  invalidFormat: {
                    $ref: "#/components/examples/UnauthorizedInvalidFormat",
                  },
                  invalidToken: {
                    $ref: "#/components/examples/UnauthorizedInvalidOrExpired",
                  },
                },
              },
            },
          },
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
          "200": {
            description: "Task found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Task" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse",
                },
                examples: {
                  validation: {
                    $ref: "#/components/examples/ValidationErrorExample",
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  missingHeader: {
                    $ref: "#/components/examples/UnauthorizedMissingHeader",
                  },
                  invalidFormat: {
                    $ref: "#/components/examples/UnauthorizedInvalidFormat",
                  },
                  invalidToken: {
                    $ref: "#/components/examples/UnauthorizedInvalidOrExpired",
                  },
                },
              },
            },
          },
          "404": {
            description: "Task not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  notFound: {
                    $ref: "#/components/examples/NotFoundTaskExample",
                  },
                },
              },
            },
          },
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
          "200": {
            description: "Task updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Task" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse",
                },
                examples: {
                  validation: {
                    $ref: "#/components/examples/ValidationErrorExample",
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  missingHeader: {
                    $ref: "#/components/examples/UnauthorizedMissingHeader",
                  },
                  invalidFormat: {
                    $ref: "#/components/examples/UnauthorizedInvalidFormat",
                  },
                  invalidToken: {
                    $ref: "#/components/examples/UnauthorizedInvalidOrExpired",
                  },
                },
              },
            },
          },
          "404": {
            description: "Task not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  notFound: {
                    $ref: "#/components/examples/NotFoundTaskExample",
                  },
                },
              },
            },
          },
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
          "200": {
            description: "Task deleted",
            content: {
              "application/json": {
                example: { deleted: true },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse",
                },
                examples: {
                  validation: {
                    $ref: "#/components/examples/ValidationErrorExample",
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  missingHeader: {
                    $ref: "#/components/examples/UnauthorizedMissingHeader",
                  },
                  invalidFormat: {
                    $ref: "#/components/examples/UnauthorizedInvalidFormat",
                  },
                  invalidToken: {
                    $ref: "#/components/examples/UnauthorizedInvalidOrExpired",
                  },
                },
              },
            },
          },
          "404": {
            description: "Task not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  notFound: {
                    $ref: "#/components/examples/NotFoundTaskExample",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
