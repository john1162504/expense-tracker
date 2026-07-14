# Expense Tracker — Vertical Slice Roadmap

> **Last updated:** July 2026  
> **Rule:** A slice is done only when **Backend + Frontend + Tests + User value** are all complete.  
> **Interactive tracker:** Open [expense-tracker-roadmap.canvas.tsx](/Users/chunyuenchan/.cursor/projects/Users-chunyuenchan-expense-tracker/canvases/expense-tracker-roadmap.canvas.tsx) beside chat — checkboxes persist automatically.

---

## Progress at a glance

| Slice | Name | Status |
|-------|------|--------|
| 0 | Project & Quality Baseline | In progress |
| 1 | Auth End-to-End | Close-out remaining |
| **→** | **You are here** | **Slice 2 — Create Expense** |
| 2.5 | Navigation & Shell | Not started |
| 3 | View Monthly Expenses | Prototype only |
| 4 | Edit & Delete Expenses | Backend partial |
| 5 | Categories & Filtering | Foundation only |
| 6 | Production Hardening | Partial |
| 7 | Receipt Upload | Not started |
| 8 | Receipt Scanning (OCR) | Not started |
| 9 | Bank Statement Import | Not started |

**Gates**

- [ ] Slice 0 complete before starting new feature slices
- [ ] Slice 1 close-out complete before Slice 2 ships
- [ ] Slice 2 delivers user value before Slice 3 starts

---

## Slice 0 — Project & Quality Baseline

**Goal:** Make it hard to do the wrong thing later.  
**User value:** None — discipline, not features.

### Deliverables

- [x] Monorepo structure (npm workspaces: `apps/client`, `apps/server`, `packages/shared`)
- [x] Shared types / validation package (`@expense-tracker/shared`)
- [x] Strict TypeScript (`strict: true` at root)
- [x] Server test framework (Vitest + Supertest, unit + integration projects)
- [ ] Docker Compose (PostgreSQL + API)
- [ ] ESLint on server (client only today)
- [ ] Prettier (root config, format on save)
- [ ] Client test framework (Vitest + Testing Library)
- [ ] CI pipeline (GitHub Actions: build + test on push)
- [ ] Coverage gate (≥90% on modules touched per slice; ≥70% repo-wide)

### Slice 0 done when

- [ ] All boxes above checked
- [ ] `npm run dev` works via Docker for a fresh clone

---

## Slice 1 — Auth End-to-End

**Goal:** A real user can log in.  
**User value:** Secure access to the app.

### Backend

- [x] Register, login, logout API
- [x] JWT access tokens (15 min) + refresh tokens (7 days, HTTP-only cookie)
- [x] Refresh token rotation on `GET /api/auth/refresh`
- [x] Auth middleware (`RequireAccessToken`, `RequireRefreshToken`)
- [x] Standardised error contract (`AppError` hierarchy + error handler)
- [x] Multi-device sessions (multiple refresh tokens per user)

### Frontend

- [x] Login screen
- [x] Register screen
- [x] Token handling (`AuthContext` + axios interceptor)
- [x] Protected routes with `isLoading` gate (no login flash on reload)
- [ ] Logout button wired to `POST /api/auth/logout` + clear local state

### Tests

- [x] Auth service unit tests
- [x] Auth middleware unit tests
- [ ] Auth integration tests updated (`GET` refresh, not `POST`)
- [ ] Token expiry / refresh flow integration test
- [ ] UI auth flow tests (login success, protected redirect, session restore)

### Slice 1 done when

- [ ] All boxes above checked
- [ ] User can register, log in, stay logged in across reload, and log out

---

## Slice 2 — Create Expense ← current focus

**Goal:** First meaningful data entry.  
**User value:** Users can record expenses.

### Backend

- [x] Expense entity + Prisma migration
- [x] `POST /api/expense/create` with Zod validation
- [x] Ownership enforcement (user-scoped create)
- [x] Category ownership validation on create
- [ ] Fix `GET /api/category/categories` — include default categories (`userId: null`)
- [ ] Align route naming to `POST /api/expenses` *(optional — or document current paths)*

> **Note:** `PUT /api/expense/update/:id` exists but belongs to Slice 4 — do not count as Slice 2 progress.

### Frontend

- [ ] `CreateExpense.tsx` form (amount, description, category)
- [ ] Category dropdown wired to categories API
- [ ] Route registered in `App.tsx` (e.g. `/expenses/new`)
- [ ] Success feedback (toast + redirect to home)
- [ ] Failure feedback (validation errors via existing toast system)
- [ ] New expense visible on dashboard after create

### Tests

- [ ] Expense creation integration tests (happy path)
- [ ] Validation error tests (missing amount, invalid category)
- [ ] Category list includes defaults test
- [ ] UI form test (submit valid expense)

### Slice 2 done when

- [ ] All boxes above checked
- [ ] A logged-in user can add an expense and see it on the home page

---

## Slice 2.5 — Navigation & Shell

**Goal:** The app feels connected, not like isolated pages.  
**User value:** Users can move around the app confidently.

### Deliverables

- [ ] App nav bar (Home, Add Expense, Logout)
- [ ] Consistent layout links across all authenticated pages
- [ ] Dashboard loading state while fetching expenses
- [ ] Dashboard empty state ("No expenses yet — add your first")
- [ ] User display from `AuthContext` (not `localStorage` alone)
- [ ] Register success redirects to login (replace `alert()`)

### Slice 2.5 done when

- [ ] All boxes above checked

---

## Slice 3 — View Monthly Expenses

**Goal:** The app becomes useful.  
**User value:** Users can see where money goes.

> **Note:** Current `Home.tsx` dashboard (total + recent 5) is a **prototype**, not this slice.

### Backend

- [ ] `GET /api/expenses?month=YYYY-MM` filter
- [ ] Monthly total endpoint (or computed field in list response)
- [ ] Pagination (`limit`, `offset` or cursor)

### Frontend

- [ ] Month picker / navigator
- [ ] Expense list for selected month
- [ ] Monthly total display
- [ ] Empty state for months with no expenses
- [ ] Loading and error states

### Tests

- [ ] Query correctness tests (month boundary, timezone)
- [ ] Pagination tests
- [ ] UI rendering tests (empty, loading, populated)

### Slice 3 done when

- [ ] All boxes above checked
- [ ] User can browse any month's expenses with accurate totals

---

## Slice 4 — Edit & Delete Expenses

**Goal:** Trust and control.  
**User value:** Users can fix mistakes safely.

### Backend

- [x] `PUT /api/expense/update/:id` with ownership checks *(already built — add tests + UI)*
- [ ] `DELETE /api/expenses/:id` with ownership checks
- [ ] Soft deletes (`deletedAt` column) *(optional — decide before implementing)*

### Frontend

- [ ] Edit expense form (pre-filled)
- [ ] Delete with confirmation dialog
- [ ] Undo pattern after delete *(optional)*

### Tests

- [ ] Update ownership tests (cannot edit another user's expense)
- [ ] Delete ownership tests
- [ ] UI state recovery after failed edit/delete

### Slice 4 done when

- [ ] All boxes above checked

---

## Slice 5 — Categories & Filtering

**Goal:** Insight, not just storage.  
**User value:** Users understand spending patterns.

> **Note:** Default categories are seeded for Slice 2. User-defined categories belong here.

### Backend

- [x] Category entity + default seed data
- [x] `GET /api/category/categories` *(fix in Slice 2 first)*
- [ ] User-defined category CRUD (`POST`, `PUT`, `DELETE`)
- [ ] Filter & sort query params on expense list
- [ ] Category summary / aggregation endpoint

### Frontend

- [ ] Category manager (create, rename, delete custom categories)
- [ ] Filters & sorting on expense list
- [ ] Simple spending chart (by category)

### Tests

- [ ] Aggregation correctness tests
- [ ] Filter combination tests
- [ ] UI filter persistence (URL or localStorage)

### Slice 5 done when

- [ ] All boxes above checked

---

## Slice 6 — Production Hardening

**Goal:** Prepare for real customers.  
**User value:** App feels stable and professional.

### Backend

- [x] Request logging (Pino)
- [x] Health endpoint (`GET /health`)
- [ ] Rate limiting
- [ ] Structured request IDs / correlation

### Frontend

- [ ] React error boundaries
- [ ] Graceful API failure UX (offline, 5xx)
- [ ] Retry logic for transient failures (beyond auth refresh)

### Tests

- [ ] Failure injection tests
- [ ] Load sanity tests (basic)

### Slice 6 done when

- [ ] All boxes above checked

---

## Slice 7 — Receipt Upload

**Goal:** Evidence attached to expenses.  
**User value:** Users trust their records.

### Backend

- [ ] Receipt storage (S3 / local / blob)
- [ ] Upload API with file validation (type, size)
- [ ] Link receipt to expense record

### Frontend

- [ ] Upload UI on expense form / detail
- [ ] Receipt preview
- [ ] Upload error handling

### Tests

- [ ] File validation tests
- [ ] Partial failure recovery tests

### Slice 7 done when

- [ ] All boxes above checked

---

## Slice 8 — Receipt Scanning (OCR)

**Goal:** Speed without loss of control.  
**User value:** Faster expense entry.

### Backend

- [ ] OCR service abstraction
- [ ] Data extraction pipeline
- [ ] Confidence scoring

### Frontend

- [ ] Pre-filled expense form from OCR result
- [ ] Manual confirmation flow before save

### Tests

- [ ] OCR failure handling
- [ ] Incorrect extraction edge cases

### Slice 8 done when

- [ ] All boxes above checked

---

## Slice 9 — Bank Statement Import

**Goal:** Scale fast.  
**User value:** Large historical imports possible.

### Backend

- [ ] CSV parsing
- [ ] Duplicate detection
- [ ] Bulk preview API

### Frontend

- [ ] Import wizard
- [ ] Review & confirm UI

### Tests

- [ ] Duplicate detection logic
- [ ] Rollback behaviour on partial import failure

### Slice 9 done when

- [ ] All boxes above checked

---

## Changelog

| Date | Change |
|------|--------|
| Jul 2026 | Initial roadmap created from project audit. Added Slice 2.5, gates, and adjusted scope to match codebase reality. |
