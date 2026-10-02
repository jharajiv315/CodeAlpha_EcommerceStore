# NEXORA Application Security Policy & Architecture

## 1. Security Architecture Overview
NEXORA utilizes a modern, zero-trust decoupled architecture designed for high integrity and resilient e-commerce operations:

```
[Vite React 19 Frontend]
        |
        +---> [Supabase Auth (Cloud)] -> issues JWT Bearer tokens
        |
        +---> [Express.js Backend API] (Port 5000)
                    |
                    +---> Validates Supabase JWT session via @supabase/supabase-js
                    +---> Enforces ownership & RBAC
                    +---> Atomic Transactions (BEGIN / COMMIT / ROLLBACK)
                    |
              [PostgreSQL Database (nexora_db)]
```

## 2. Authentication & Authorization Controls
- **Client Authentication**: Managed entirely through Supabase Auth (Email/Password & Google OAuth).
- **No Secret Key in Frontend**: The frontend only receives and holds the public `VITE_SUPABASE_ANON_KEY`. The privileged `SUPABASE_SECRET_KEY` (service-role) resides strictly on the backend and is never packaged in client bundles.
- **Stateless Bearer Tokens**: Authenticated HTTP requests transmit `Authorization: Bearer <supabase_access_token>`.
- **Identity Derivation**: Identity is never inferred from unvalidated client payload parameters such as `req.body.userId`. The backend extracts `req.user.id` solely from the verified Supabase Auth JWT.
- **Resource Ownership Authorization**:
  - `GET /api/orders/:id`: If an order is linked to a registered user, unauthenticated requests receive `401 Unauthorized`. Users attempting to view orders belonging to another user receive `403 Forbidden`.
  - `GET /api/auth/profile`: Restricted to the authenticated user owning the session.

## 3. Database Security & Integrity
- **100% Parameterized Queries**: All SQL queries utilize PostgreSQL parameterized placeholders (`$1, $2, ...`) via `pg.Pool`. No user input is ever concatenated into SQL query strings.
- **Whitelisted Sorting & Filtering**: Sort queries utilize explicit switch/case whitelisting (`ORDER BY featured DESC`, `price ASC`, etc.), preventing injection through sort or pagination fields.
- **Row-Level Locking for Inventory**: Order creation executes inside an atomic transaction (`BEGIN ... COMMIT`) utilizing `SELECT ... FOR UPDATE` row locks on the `products` table. This completely eliminates race conditions and negative inventory bugs.
- **Server-Authoritative Pricing**: The client cart prices, tax, and subtotals are completely ignored by the backend. The backend retrieves the authoritative price directly from PostgreSQL, applies promo rules, and calculates taxes and totals server-side.

## 4. Network, API & Header Security
- **Express Security Headers (`helmet`)**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY` (anti-clickjacking)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Content-Security-Policy`: Strictly scoped to Supabase endpoints, Google Fonts, and trusted assets.
  - `X-Powered-By`: Explicitly disabled to prevent server fingerprinting.
  - `Strict-Transport-Security` (HSTS): Enforced in production environments.
- **CORS Configuration**: Restricted to explicit `CLIENT_URL` origins (`http://localhost:3000` in development, customized for production domains). Wildcard `*` origins are disabled for authenticated traffic.
- **Rate Limiting (`express-rate-limit`)**:
  - Global API: 500 requests per 15-minute window.
  - Sensitive Endpoints (`/api/orders`, `/api/auth`): 60 requests per 15-minute window.
- **Zero Information Disclosure**: Centralized error middleware ensures stack traces, database schema names, and SQL statements are never sent over HTTP to clients.

## 5. Environment Secrets & Git Hygiene
- Git ignores `.env`, `backend/.env`, and any local secret artifacts.
- Templates are provided in `.env.example` and `backend/.env.example` containing only sanitised placeholder structures.
