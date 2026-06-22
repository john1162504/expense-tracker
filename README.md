# Expense Tracker

A full-stack expense tracking application built as a TypeScript monorepo. Users can register, log in, and view their spending on a dashboard backed by a REST API with JWT authentication, PostgreSQL, and shared validation schemas between client and server.

---

## Features

- **Authentication** — Register, login, logout, and automatic token refresh via HTTP-only refresh cookies
- **Expense management** — Create, list, and update expenses scoped to the authenticated user
- **Categories** — Default expense categories (Food, Transport, Utilities, and more) with per-user support
- **Dashboard** — Home page showing total spend and recent expenses
- **Shared validation** — Zod schemas in `@expense-tracker/shared` used by both API and client
- **Tested API** — Unit and integration tests with Vitest and Supertest

---

## Tech Stack

| Layer    | Technologies |
| -------- | ------------ |
| Frontend | React 19, Vite, React Router, Tailwind CSS, Axios |
| Backend  | Express 5, Prisma, PostgreSQL, Pino |
| Shared   | TypeScript, Zod |
| Tooling  | npm workspaces, Vitest, concurrently |

---

## Project Structure

```
expense-tracker/
├── apps/
│   ├── client/          # React SPA
│   └── server/          # Express API, Prisma schema, and tests
├── packages/
│   └── shared/          # Shared Zod schemas and types
└── package.json         # Root workspace scripts
```

---

## Prerequisites

- Node.js 18+
- PostgreSQL
- npm (workspaces are configured at the repo root)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `apps/server/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/expense_tracker"
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
CLIENT_URL="http://localhost:5173"
PORT=3000
```

Create `apps/client/.env`:

```env
VITE_API_URL="http://localhost:3000"
```

For tests, create `apps/server/.env.test` with a separate database URL and the same JWT secrets.

### 3. Set up the database

```bash
npm run db:generate
npm run db:migrate
```

Optionally seed default categories and sample data:

```bash
cd apps/server && npx dotenv -e .env -- prisma db seed
```

The seed creates default categories, a test user (`test@test.com` / `password`), and sample expenses.

### 4. Run in development

Start both the API and the client:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev:server   # http://localhost:3000
npm run dev:client   # http://localhost:5173
```

---

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Run client and server in watch mode |
| `npm run build` | Build all workspaces |
| `npm run start` | Start production builds of client and server |
| `npm run test:server` | Run server unit and integration tests |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Apply database migrations |

---

## API Overview

All protected routes require a `Bearer` access token. Refresh tokens are stored in an HTTP-only cookie at `/api/auth`.

### Auth — `/api/auth`

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| `POST` | `/register` | — | Create a new account |
| `POST` | `/login` | — | Log in and receive an access token |
| `POST` | `/logout` | Access token | Log out and revoke refresh token |
| `GET` | `/refresh` | Refresh cookie | Issue a new access token |

### Expenses — `/api/expense`

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| `GET` | `/expenses` | Access token | List the current user's expenses |
| `POST` | `/create` | Access token | Create an expense |
| `PUT` | `/update/:id` | Access token | Update an expense |

### Categories — `/api/category`

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| `GET` | `/categories` | Access token | List available categories |

### Health

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET` | `/health` | Server health check |

---

## Architecture

The server follows a layered structure:

- **Routes** — HTTP routing and middleware composition
- **Controllers** — Request/response mapping
- **Services** — Business logic
- **Repositories** — Prisma data access
- **Middleware** — Authentication, validation, and centralized error handling

The client uses React Router for navigation, an `AuthProvider` for session state, and an Axios instance that automatically refreshes expired access tokens before retrying failed requests.

Authentication uses short-lived JWT access tokens in memory and longer-lived refresh tokens stored as hashed values in PostgreSQL. Passwords are hashed with bcrypt before persistence.

---

## Testing

Server tests live under `apps/server/src` and are split into two Vitest projects:

- **Unit tests** (`*.unit.test.ts`) — Services, utilities, and middleware in isolation
- **Integration tests** (`*.int.test.ts`) — End-to-end API behaviour with Supertest

```bash
npm run test:server
```

Integration tests reset and migrate a dedicated test database before running.

---

## Production Build

```bash
npm run build
npm run start
```

Ensure production environment variables are set (`NODE_ENV=production`, secure JWT secrets, and a production `DATABASE_URL`). The API enables secure, cross-site cookies when `NODE_ENV` is `production`.
