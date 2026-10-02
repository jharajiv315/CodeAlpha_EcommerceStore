# Supabase Auth Setup & Configuration Guide

This guide documents the setup, environment variables, dashboard configuration, and architecture for running NEXORA with **Supabase Auth** and the existing **PostgreSQL business database**.

---

## 1. Architectural Model

```
                SUPABASE AUTH
            (Authentication Provider)
                     │
          ┌──────────┴──────────┐
          │                     │
       Sign Up                Login / Google
          │                     │
          └──────────┬──────────┘
                     ↓
                 AUTH USER (UUID)
                     │
                Access Token
                     │
                     ↓
                NEXORA API (Express)
                     │
          Supabase Token Verification
                     │
             Verified User UUID
                     │
                     ↓
             PostgreSQL 18 Database
             ┌───────┴────────┐
             │                │
          profiles          orders
                                │
                          order_items
                                │
                             products
```

- **Authentication Identity**: Managed entirely by Supabase Auth (`auth.users`).
- **Application Profile**: Stored in PostgreSQL `profiles` table (`id` matches Supabase `auth.users.id`).
- **Passswords & Hashes**: 0% handled by NEXORA. Managed by Supabase Auth.
- **Business Logic**: Products, orders, order items, stock management, and transactional price calculations remain in PostgreSQL.

---

## 2. Supabase Dashboard Configuration

### Step 1: Email Provider Setup
1. Open your Supabase Dashboard: `https://supabase.com/dashboard/project/<project-ref>`
2. Go to **Authentication** (lock/users icon in left sidebar) $\rightarrow$ **Providers** $\rightarrow$ **Email**.
3. Toggle **"Enable Email provider"** to **ON**.
4. For local development / instant signups, toggle **"Confirm email"** to **OFF** so users can sign in immediately without waiting for an email. (In production, turn ON with custom SMTP).
5. Click **Save**.

### Step 2: Google OAuth Provider Setup (Optional / Enabled)
1. Go to **Authentication** $\rightarrow$ **Providers** $\rightarrow$ **Google**.
2. Toggle **"Enable Google provider"** to **ON**.
3. Enter your Google OAuth `Client ID` and `Client Secret` (from Google Cloud Console).
4. Copy the **Authorized Redirect URI** provided by Supabase (e.g. `https://<project-ref>.supabase.co/auth/v1/callback`) and paste it into Google Cloud Console $\rightarrow$ OAuth Credentials.
5. Click **Save**.

### Step 3: URL Configuration
1. Go to **Authentication** $\rightarrow$ **URL Configuration**.
2. **Site URL**: `http://localhost:3000` (or your production domain).
3. **Redirect URLs**: Add `http://localhost:3000/**` and `http://localhost:3000/`.
4. Click **Save**.

---

## 3. Environment Variables

### Backend Configuration (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgre@127.0.0.1:5432/nexora_db
CLIENT_URL=http://localhost:3000

# Supabase Auth Server Configuration
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=eyJhbGciOi... # Service-role secret key (kept server-side only!)
```

### Frontend Configuration (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

> [!WARNING]
> NEVER expose the `SUPABASE_SECRET_KEY` (service-role key) to the frontend or git. Only place it in `backend/.env`.

---

## 4. Database Setup & Migration

The migration creates the `profiles` table linked to Supabase User UUIDs and removes obsolete `password_hash` columns:

```bash
# Execute migration script in PostgreSQL
psql -U postgres -d nexora_db -f backend/sql/migrate_to_supabase.sql
```

Table schema:
```sql
CREATE TABLE profiles (
    id VARCHAR(64) PRIMARY KEY, -- Stores Supabase auth.users UUID
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    joined_date VARCHAR(64) NOT NULL,
    saved_addresses JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. Development Demo Accounts

The following demo accounts are seeded directly in Supabase Auth:
- **Alex Morgan**: `alex@nexora.design` / `password123` (UUID: `35aed916-16f4-4bc4-b198-e689e6d5e59e`)
- **Priya Sharma**: `priya@nexora.design` / `password123` (UUID: `53f2f66e-7f2a-455c-acae-27f83a496f87`)

---

## 6. How to Run & Verify

1. **Start Express Backend**:
   ```bash
   npm run server
   ```
2. **Start Frontend**:
   ```bash
   npm run dev
   ```
3. **Run Supabase Auth & Order Test Suite**:
   ```bash
   npm run test:backend
   ```
