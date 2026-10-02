# NEXORA — Backend Integration Notes

This document provides complete technical specifications for the production full-stack architecture implemented for **NEXORA**, powered by **Node.js**, **Express.js**, **PostgreSQL**, **JWT**, **bcryptjs**, and **pg**.

---

## 1. Full-Stack Architectural Overview

```
                      NEXORA FRONTEND
               (React 19 + TypeScript + Vite)
                            |
                     HTTPS / REST API
                      (JSON Payloads)
                            v
                   EXPRESS.JS SERVER
                (Helmet, CORS, Rate Limit)
                            |
           +----------------+----------------+
           |                |                |
      AUTH ROUTE     PRODUCTS ROUTE     ORDERS ROUTE
     (/api/auth)    (/api/products)    (/api/orders)
           |                |                |
           +----------------+----------------+
                            |
                 POSTGRESQL CONNECTION POOL
                            v
                     POSTGRESQL 18
      +---------------------+---------------------+
      |                     |                     |
    users                products               orders
                                                  |
                                             order_items
```

---

## 2. Integrated Frontend Service Layer

All frontend UI components interact via the decoupled service layer in `src/services/` backed by a centralized `apiClient.ts`:

### `productService` (`src/services/productService.ts`)
- `getAllProducts(): Promise<Product[]>` → Calls `GET /api/products?limit=100`
- `getProductById(id: string): Promise<Product | null>` → Calls `GET /api/products/:id`
- `getFeaturedProducts(): Promise<Product[]>` → Calls `GET /api/products/featured`
- `getNewArrivals(): Promise<Product[]>` → Calls `GET /api/products/new-arrivals`
- `getCategories(): Promise<ProductCategory[]>` → Calls `GET /api/products/categories`
- `getRelatedProducts(currentId: string, limit?: number): Promise<Product[]>` → Calls `GET /api/products/:id/related?limit=...`
- `queryProducts(filters: ProductFilterState, sort: SortOption): Promise<Product[]>` → Calls `GET /api/products?...` with parameterized SQL filters.

### `orderService` (`src/services/orderService.ts`)
- `createOrder(payload: CreateOrderPayload): Promise<Order>` → Calls `POST /api/orders`
- `getOrders(userId?: string): Promise<Order[]>` → Calls `GET /api/orders` (Auth required)
- `getOrderById(orderId: string): Promise<Order | null>` → Calls `GET /api/orders/:id`
- `validateShippingAddress(address: ShippingAddress)` → Client-side form pre-validation.

### `authService` (`src/services/authService.ts`)
- `login(credentials: { email: string; password: string }): Promise<User>` → Calls `POST /api/auth/login`
- `register(data: { name: string; email: string; password: string }): Promise<User>` → Calls `POST /api/auth/register`
- `logout(): Promise<void>` → Calls `POST /api/auth/logout` & clears `nexora_auth_token_v1`
- `getCurrentUser(): Promise<User | null>` → Calls `GET /api/auth/profile`
- `updateProfile(updates: Partial<User>): Promise<User>` → Calls `PUT /api/auth/profile`
- `getSavedAddresses(): Promise<ShippingAddress[]>` → Retrieves user's saved addresses
- `addSavedAddress(address: ShippingAddress): Promise<ShippingAddress[]>` → Calls `POST /api/auth/addresses`

---

## 3. Implemented Security Controls

1. **Password Encryption**: All customer passwords are encrypted using `bcrypt` (12 rounds) with salted hashes. Passwords and hashes are strictly excluded from all API responses.
2. **JWT Authentication**: Authenticated sessions use signed JSON Web Tokens (`HS256`) with a configurable secret and 7-day expiration.
3. **Money Integrity**: The client NEVER submits prices, taxes, or order totals. The backend retrieves unit prices from PostgreSQL, locks product rows, validates inventory limits, calculates tax and shipping server-side, and commits orders transactionally.
4. **Concurrency & Race Conditions**: Stock reduction utilizes explicit row-level locking (`SELECT ... FOR UPDATE`) within an atomic PostgreSQL transaction (`BEGIN ... COMMIT / ROLLBACK`).
5. **Rate Limiting**: Authentication endpoints (`/register`, `/login`) are protected with `express-rate-limit` (30 requests / 15-minute window).
6. **SQL Injection Resistance**: All SQL queries utilize parameterized placeholders (`$1, $2, ...`), preventing SQL injection attacks.
7. **HTTP Security Headers**: Implemented via `helmet`.
8. **CORS**: Configured with origin validation against `CLIENT_URL`.

---

## 4. Evaluator Demo Credentials

Pre-seeded deterministic test accounts in PostgreSQL:
- **Alex Morgan**: `alex@nexora.design` / `password123`
- **Priya Sharma**: `priya@nexora.design` / `password123`
