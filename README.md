# DevBase API English Version (french version line174)

DevBase API is a RESTful backend application designed to manage users, projects, and tasks with strict ownership-based access control.  
The project focuses on clean backend architecture, authentication, authorization, validation, and security best practices.

This API is intended as a **portfolio-grade backend project** demonstrating real-world patterns used in professional environments.

---

## Features

- User registration and authentication
- JWT-based authentication (Access Token + Refresh Token)
- Projects CRUD (Create, Read, Update, Delete)
- Tasks CRUD linked to both users and projects
- Ownership enforcement (users can only access their own resources)
- Request validation using Zod
- Centralized error handling
- Fully tested with Postman
- Interactive API documentation with Swagger (OpenAPI)

---

## Tech Stack

- **Node.js**
- **Express**
- **TypeScript**
- **PostgreSQL**
- **Prisma ORM**
- **JWT (jsonwebtoken)**
- **Zod** (request validation)
- **Swagger / OpenAPI**
- **Postman** (API testing)

---

## Authentication & Security

- All protected routes require a valid **JWT access token**
- Tokens are validated using middleware
- Refresh tokens are used to renew access tokens
- Ownership is enforced at the API level:
  - Users cannot access or modify resources they do not own
  - Unauthorized resource access returns **404** to prevent resource enumeration
- Invalid or missing tokens return **401 Unauthorized**

---

## API Structure

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

### Projects

- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/:id`
- `PATCH /api/projects/:id`
- `DELETE /api/projects/:id`

### Tasks

- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

---

## API Testing (Postman)

A complete Postman collection is provided to validate:

- Authentication flow
- Projects CRUD
- Tasks CRUD
- Ownership enforcement
- Security rules

### Tested scenarios include:

- Access without token (blocked)
- User accessing their own resources (allowed)
- User accessing another user's resources (blocked)
- Task isolation per user
- Security edge cases

Tokens and resource IDs are stored automatically using Postman environment variables.  
No secrets are hard-coded in the collection.

---

## API Documentation (Swagger)

Interactive API documentation is available at:

```

[http://localhost:4000/docs](http://localhost:4000/docs)

```

Swagger provides:

- Endpoint descriptions
- Request/response schemas
- Example payloads
- A visual overview of the API contract

---

## Running the Project Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file and define:

- Database connection
- JWT secrets
- Token expiration values

### 3. Run database migrations

```bash
npx prisma migrate dev
```

### 4. Start the development server

```bash
npm run dev
```

The API will be available at:

```
http://localhost:4000
```

---

## Project Status

The core backend features are **complete and stable**.

This project is suitable for:

- Portfolio presentation
- Junior backend or full-stack developer roles
- Demonstrating authentication, security, and API design fundamentals

Future improvements (optional):

- Automated tests (Jest)
- CI/CD pipeline
- Role-based access control
- Frontend integration

---

## Author

Built as a backend portfolio project to demonstrate real-world API development practices.

# DevBase API Version Francaise

DevBase API est une application backend REST conçue pour gérer des utilisateurs, des projets et des tâches avec un contrôle d’accès strict basé sur la notion de propriétaire (ownership).  
Le projet met l’accent sur une architecture backend propre, l’authentification, l’autorisation, la validation des données et les bonnes pratiques de sécurité.

Cette API a été réalisée comme **projet de portfolio** afin de démontrer des patterns utilisés en environnement professionnel.

---

## Fonctionnalités

- Inscription et authentification des utilisateurs
- Authentification JWT (Access Token + Refresh Token)
- CRUD complet des projets (Create, Read, Update, Delete)
- CRUD complet des tâches liées aux utilisateurs et aux projets
- Contrôle d’accès par ownership (un utilisateur ne peut accéder qu’à ses ressources)
- Validation des requêtes avec Zod
- Gestion centralisée des erreurs
- Tests complets via Postman
- Documentation interactive de l’API avec Swagger (OpenAPI)

---

## 🛠 Stack Technique

- **Node.js**
- **Express**
- **TypeScript**
- **PostgreSQL**
- **Prisma ORM**
- **JWT (jsonwebtoken)**
- **Zod** (validation des requêtes)
- **Swagger / OpenAPI**
- **Postman** (tests de l’API)

---

## Authentification & Sécurité

- Toutes les routes protégées nécessitent un **JWT access token valide**
- Les tokens sont validés via un middleware
- Les refresh tokens permettent de renouveler les access tokens
- Le contrôle d’accès est appliqué au niveau de l’API :
  - Un utilisateur ne peut ni lire ni modifier les ressources d’un autre utilisateur
  - L’accès non autorisé à une ressource retourne **404** afin d’éviter l’énumération des ressources
- Un token manquant ou invalide retourne **401 Unauthorized**

---

## Structure de l’API

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

### Projects

- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/:id`
- `PATCH /api/projects/:id`
- `DELETE /api/projects/:id`

### Tasks

- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

---

## Tests de l’API (Postman)

Une collection Postman complète est fournie afin de valider :

- Le flux d’authentification
- Le CRUD des projets
- Le CRUD des tâches
- Le contrôle d’accès par ownership
- Les règles de sécurité

### Scénarios testés :

- Accès sans token (bloqué)
- Accès aux ressources propres (autorisé)
- Accès aux ressources d’un autre utilisateur (bloqué)
- Isolation des tâches par utilisateur
- Cas limites liés à la sécurité

Les tokens et identifiants sont stockés automatiquement via les variables d’environnement Postman.  
Aucun secret n’est codé en dur dans la collection.

---

## Documentation de l’API (Swagger)

La documentation interactive de l’API est accessible à l’adresse suivante :

```

[http://localhost:4000/docs](http://localhost:4000/docs)

```

Swagger permet de :

- Visualiser les routes disponibles
- Comprendre les schémas de requêtes et de réponses
- Tester les endpoints directement depuis le navigateur
- Disposer d’un contrat clair de l’API

---

## 🚀 Lancer le projet en local

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d’environnement

Créer un fichier `.env` et définir :

- La connexion à la base de données
- Les secrets JWT
- Les durées d’expiration des tokens

### 3. Lancer les migrations

```bash
npx prisma migrate dev
```

### 4. Démarrer le serveur de développement

```bash
npm run dev
```

L’API sera disponible à l’adresse :

```
http://localhost:4000
```

---

## État du projet

Les fonctionnalités principales du backend sont **complètes et stables**.

Ce projet est adapté pour :

- Un portfolio de développeur junior backend / full-stack
- La démonstration de bonnes pratiques API
- Illustrer l’authentification, la sécurité et le contrôle d’accès

Améliorations possibles (optionnelles) :

- Tests automatisés (Jest)
- Mise en place d’un CI/CD
- Gestion des rôles (admin, etc.)
- Intégration d’un frontend

---

## Auteur

Projet backend réalisé dans le cadre d’un portfolio afin de démontrer des pratiques professionnelles de développement d’API.

```


```
