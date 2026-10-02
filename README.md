# NEXORA — Modern Products. Simple Shopping.

NEXORA is a high-end, luxury-minimalist full-stack e-commerce platform built for thoughtful everyday essentials, acoustic instruments, and precision workplace tools. Designed with architectural restraint, typographic discipline, and clean engineering, NEXORA pairs a responsive React 19 frontend with an Express.js backend, a PostgreSQL 18 relational database, and **Supabase Auth** for identity management.

---

## 1. Architectural Highlights & Features

- **Storefront & Editorial Discovery**: 
  - Dynamic curated hero with spotlight instrument showcase.
  - Category navigation across four distinct disciplines: *Electronics*, *Accessories*, *Gaming*, *Lifestyle*.
  - Handpicked Featured Collection and New Arrivals grids.
  - Brand story ("Better products. Less noise.") emphasizing material durability and tactile precision.
- **Search, Filtering & Sorting Catalog**:
  - Full-text search across product names, descriptions, categories, and tags.
  - Parameterized database filtering by discipline category, price ranges, star ratings (4.0+, 4.5+, 4.8+), and stock availability.
  - Interactive dual-thumb price range slider (₹0–₹30,000+), quick presets, and direct numeric input.
  - Sorting by Featured status, Newest arrivals, Price (asc/desc), and Customer Ratings.
  - "Recently Viewed" chronological section tracking and displaying the last 4 clicked instruments.
- **Authentication & Identity via Supabase Auth**:
  - Full user registration and password authentication managed by **Supabase Auth**.
  - **Google OAuth**: One-click "Continue with Google" sign-in integrated seamlessly with Supabase Auth.
  - **Zero Password Storage**: NEXORA's business database stores zero passwords or bcrypt hashes. Credentials are owned exclusively by Supabase Auth.
  - Canonical user identities use Supabase Auth UUIDs mapped 1:1 to PostgreSQL `profiles`.
  - Built-in evaluator demo accounts (`alex@nexora.design` / `password123` and `priya@nexora.design` / `password123`) seeded directly in Supabase Auth.
- **Contiguous Product Detail Page (PDP)**:
  - Multi-angle high-resolution gallery with thumbnail switcher.
  - Real-time stock status indicator with low-stock warnings (e.g. `< 6` units remaining).
  - Tactile quantity stepper respecting inventory thresholds.
  - "Add to Bag" feedback with non-blocking toast notifications and "Buy Now" 1-click express checkout.
  - Technical specification tables, engineering highlights, and domestic delivery/warranty policies.
  - Client Review & Rating System with interactive star picker.
- **Side-by-Side Product Comparison Tool**:
  - Interactive comparison of up to 3 products across the catalog.
  - Floating bottom comparison dock (`CompareDock`) with quick item removal.
  - Full-screen side-by-side comparison matrix (`ProductComparisonModal`) with sticky headers.
- **Commerce Cart & Quick Bag Drawer**:
  - Global slide-over bag drawer accessible anytime from the navigation bar.
  - Dedicated `/cart` page with line-item management, quantity steppers, and item removal.
  - Real-time free shipping threshold meter (Complimentary domestic delivery on orders ₹2,000+).
  - Promotional privilege code validator (`NEXORA10` for 10% off, `WELCOME15` for 15% off, `STUDIO20` for 20% off).
- **Frictionless Transactional Checkout**:
  - Client sends ONLY product IDs and quantities — the backend recalculates and verifies prices, taxes, and shipping authoritatively.
  - Row-level locking (`SELECT ... FOR UPDATE`) prevents concurrent overselling.
  - Fast-fill evaluator sample address button for 1-click end-to-end testing.
  - Delivery speed selector: Standard Ground Courier vs Express Air Priority.
  - Payment settlement choices: Cash on Delivery (COD), Instant UPI, and Credit/Debit Card prototype.
  - Deterministic customer-facing order numbering (`NX-2026-XXXXX`).
- **Post-Purchase & Order Lifecycle**:
  - Order confirmation screen with estimated delivery scheduling and courier tracking reference.
  - "My Orders" history with visual status indicators, pulsing milestone dots, and 4-step fulfillment progress timeline.

---

## 2. Technology Stack

- **Frontend**: React 19 + TypeScript (ES2022) + Vite 8
- **Styling**: Tailwind CSS v4 with custom design tokens (Warm Ivory `#F7F5F0`, Deep Emerald `#123C35`, Champagne Gold `#B89B5E`)
- **Backend**: Node.js (v20+) + Express.js (v4.21)
- **Database**: PostgreSQL 18
- **Authentication**: **Supabase Auth** (`@supabase/supabase-js`) + Google OAuth
- **Database Driver**: `pg` with connection pooling
- **Security**: `helmet`, `cors`, `express-rate-limit`, parameterized SQL queries

---

## 3. Full-Stack Directory Structure

```
CodeAlpha_EcommerceStore/
├── backend/
│   ├── sql/
│   │   ├── schema.sql            # PostgreSQL DDL tables (profiles, products, orders, order_items)
│   │   ├── seed.sql              # Deterministic catalog (18 products, 4 categories)
│   │   └── migrate_to_supabase.sql # Migration to profiles table with Supabase UUIDs
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js             # PostgreSQL connection pool & query helpers
│   │   │   └── supabase.js       # Supabase Admin & Public clients
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── product.controller.js
│   │   │   └── order.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js # Supabase Bearer token verification & profile sync
│   │   │   ├── error.middleware.js # Centralized error & 404 handler
│   │   │   └── validate.middleware.js # Request payload validation
│   │   ├── routes/
│   │   │   ├── auth.routes.js    # Profile & address routes
│   │   │   ├── product.routes.js # Catalog & detail routes
│   │   │   └── order.routes.js   # Transactional order routes
│   │   ├── services/
│   │   │   ├── auth.service.js   # PostgreSQL profile management
│   │   │   ├── product.service.js# Parameterized SQL queries
│   │   │   └── order.service.js  # Transaction management & stock locking
│   │   ├── utils/
│   │   │   └── apiResponse.js    # Standardized response format
│   │   ├── app.js                # Express app configuration
│   │   └── server.js             # Server startup & graceful shutdown
│   ├── package.json
│   └── testEndpoints.js          # Automated backend integration test suite
│
├── src/                          # NEXORA Frontend
│   ├── lib/
│   │   └── supabase.ts           # Canonical Supabase client instance
│   ├── services/
│   │   ├── apiClient.ts          # Centralized API client with dynamic Supabase token injection
│   │   ├── productService.ts     # Connected to GET /api/products
│   │   ├── authService.ts        # Supabase Auth operations & Google OAuth
│   │   ├── orderService.ts       # Connected to POST /api/orders
│   │   └── cartService.ts        # Client-side cart manager
│   ├── context/
│   │   ├── AuthContext.tsx       # Supabase session lifecycle & state management
│   │   ├── CartContext.tsx       # Bag state & drawer controls
│   │   └── ToastContext.tsx      # Non-blocking notification queue
│   ├── components/               # Nav, ProductCard, Modals, Comparison
│   ├── pages/                    # Home, Shop, PDP, Cart, Checkout, Orders, Profile, Auth
│   └── index.css                 # Design tokens & typography
│
├── API.md                        # Complete REST API reference
├── DATABASE.md                   # PostgreSQL schema, ER model, indexing
├── SUPABASE_AUTH_SETUP.md        # Supabase setup and dashboard configuration guide
└── BACKEND_INTEGRATION_NOTES.md # Architecture & security specifications
```

---

## 4. Setup & Running Locally

### 1. Database Setup
```bash
psql -U postgres -d nexora_db -f backend/sql/schema.sql
psql -U postgres -d nexora_db -f backend/sql/seed.sql
```

### 2. Environment Variables
Configure `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:your_password@127.0.0.1:5432/nexora_db
CLIENT_URL=http://localhost:3000
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=eyJhbGciOi... # Server-only service_role key
```

Configure root `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### 3. Run the Servers
Open two terminal windows:

**Terminal 1 — Backend Express Server**:
```bash
npm run server
```
Server starts on `http://localhost:5000` (Health check at `http://localhost:5000/api/health`).

**Terminal 2 — Frontend Vite Application**:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Run Automated Backend Tests
```bash
npm run test:backend
```
Executes the automated integration test suite (20 assertions covering health, Supabase Auth session verification, profile synchronization, duplicate prevention, product filters, stock deduction, and transactional orders).

---

## 5. Demo Credentials

| Role | Email | Password | Supabase Canonical UUID |
| :--- | :--- | :--- | :--- |
| **Demo Client 1** | `alex@nexora.design` | `password123` | `35aed916-16f4-4bc4-b198-e689e6d5e59e` |
| **Demo Client 2** | `priya@nexora.design` | `password123` | `53f2f66e-7f2a-455c-acae-27f83a496f87` |
