# 📘 DevBase API

DevBase API est une **API REST backend** conçue pour gérer des **projets** et des **tâches** avec une **authentification sécurisée** basée sur JWT.

Ce projet a été réalisé comme **projet portfolio backend**, avec un fort accent sur :

- la sécurité
- la structure du code
- la documentation
- la testabilité

---

## 🚀 Stack technique

- **Node.js** + **TypeScript**
- **Express**
- **PostgreSQL**
- **Prisma ORM**
- **JWT (access + refresh tokens)**
- **Swagger / OpenAPI** (documentation officielle)
- **Zod** (validation)
- **Render** (déploiement)

---

## ✨ Fonctionnalités

- 🔐 Authentification sécurisée
  - Register / Login
  - JWT Bearer (access token)
  - Refresh token en cookie HTTP-only

- 📁 Gestion des **Projects**
  - CRUD complet
  - Accès isolé par utilisateur (ownership)
  - Pagination, recherche, tri

- ✅ Gestion des **Tasks**
  - CRUD complet
  - Liées à un project
  - Filtres (par projet, statut, pagination)

- 🛡️ Sécurité
  - Routes protégées
  - Rate limiting
  - Headers de sécurité (Helmet)

---

## 🌍 API en production

- **Base URL (prod)**

  ```
  https://devbase-api-egxh.onrender.com
  ```

- **Swagger (documentation officielle)**
  👉 [https://devbase-api-egxh.onrender.com/docs](https://devbase-api-egxh.onrender.com/docs)

---

## 📖 Documentation API (Swagger)

Swagger est la **source de vérité** de l’API :

- toutes les routes sont documentées
- chaque endpoint est testable
- exemples de payloads inclus
- authentification JWT intégrée

👉 **Aucun Postman requis pour tester l’API**

---

## 🧪 How to test this API (via Swagger)

### 1️⃣ Ouvrir Swagger

👉 [https://devbase-api-egxh.onrender.com/docs](https://devbase-api-egxh.onrender.com/docs)

---

### 2️⃣ Créer un compte (Register)

- Aller dans **Auth → POST /api/auth/register**
- Cliquer sur **Try it out**
- Exemple de body :

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!",
  "name": "John Doe"
}
```

- Cliquer sur **Execute**
- Copier le `accessToken` retourné

---

### 3️⃣ S’authentifier dans Swagger

- Cliquer sur **Authorize** (en haut à droite)
- Coller le token sous la forme :

```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- Cliquer sur **Authorize**

✅ Toutes les routes protégées sont maintenant accessibles

---

### 4️⃣ Tester les routes protégées

Tu peux maintenant tester :

#### 📁 Projects

- `POST /api/projects` → créer un projet
- `GET /api/projects` → lister les projets
- `PATCH /api/projects/{id}` → modifier
- `DELETE /api/projects/{id}` → supprimer

#### ✅ Tasks

- `POST /api/tasks` → créer une tâche
- `GET /api/tasks` → lister les tâches
- `PATCH /api/tasks/{id}` → mettre à jour
- `DELETE /api/tasks/{id}` → supprimer

---

## 🔐 Authentification & Sécurité

- **Access token** : JWT (Bearer) → envoyé via header `Authorization`
- **Refresh token** :
  - stocké en cookie HTTP-only
  - non accessible en JavaScript

- Isolation stricte :
  - un utilisateur ne peut accéder **qu’à ses propres données**

---

## 🧠 Architecture (simplifiée)

```
src/
 ├─ modules/
 │   ├─ auth/
 │   ├─ projects/
 │   └─ tasks/
 ├─ middleware/
 ├─ docs/        # Swagger / OpenAPI
 ├─ config/
 └─ app.ts
```

- Controllers → couche HTTP
- Services → logique métier
- Prisma → accès base de données
- Zod → validation des entrées

---

## 🎯 Objectif du projet

Ce projet a été conçu pour démontrer :

- la capacité à concevoir une API REST propre
- la mise en place d’une authentification sécurisée
- une documentation claire et exploitable
- des bonnes pratiques backend professionnelles

---

## 📌 Notes

- Swagger est volontairement **complet et autonome**
- Postman est utilisé uniquement pour les tests internes
- Le projet est prêt pour être :
  - étendu
  - connecté à un frontend
  - présenté en entretien technique

---
