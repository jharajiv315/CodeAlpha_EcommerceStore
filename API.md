# NEXORA REST API Documentation (Supabase Auth Edition)

This document describes the production REST API implemented for the NEXORA e-commerce platform.

- **Base URL**: `http://localhost:5000/api` (Configured via `PORT` and `VITE_API_URL`)
- **Protocol**: HTTP/1.1 REST over JSON
- **Authentication**: Supabase Auth Access Token via `Authorization: Bearer <SUPABASE_ACCESS_TOKEN>`
- **Database**: PostgreSQL 18 with connection pooling

---

## 1. System Health & Diagnostics

### `GET /api/health`
Checks server readiness and database connectivity.

- **Auth**: None
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "NEXORA API is healthy",
    "timestamp": "2026-10-02T12:51:46.574Z",
    "env": "development"
  }
  ```

---

## 2. Authentication & User Profiles

> [!NOTE]
> User registration, login, session renewal, password reset, and Google OAuth are handled by **Supabase Auth** directly via `@supabase/supabase-js`. The Express backend validates Supabase access tokens and manages application business profile data.

### `GET /api/auth/profile`
Retrieves the authenticated user's profile and saved shipping destinations from PostgreSQL.

- **Auth**: `Authorization: Bearer <SUPABASE_ACCESS_TOKEN>` (Required)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Profile retrieved",
    "data": {
      "id": "35aed916-16f4-4bc4-b198-e689e6d5e59e",
      "name": "Alex Morgan",
      "email": "alex@nexora.design",
      "joinedDate": "January 2026",
      "savedAddresses": [
        {
          "fullName": "Alex Morgan",
          "email": "alex@nexora.design",
          "phone": "+91 98765 43210",
          "addressLine": "Flat 402, Signature Pavilion, 12th Main Indiranagar",
          "city": "Bengaluru",
          "state": "Karnataka",
          "postalCode": "560038",
          "country": "India"
        }
      ]
    }
  }
  ```
- **Errors**:
  - `401 Unauthorized`: Missing or invalid Supabase access token.

---

### `PUT /api/auth/profile`
Updates profile name or address list. The user ID is strictly taken from the verified Supabase token (`req.user.id`).

- **Auth**: `Authorization: Bearer <SUPABASE_ACCESS_TOKEN>` (Required)
- **Request Body**:
  ```json
  {
    "name": "Alex Morgan",
    "savedAddresses": [...]
  }
  ```
- **Response** (`200 OK`): Updated user profile object.

---

### `POST /api/auth/addresses`
Appends a verified shipping address to the user's profile in PostgreSQL.

- **Auth**: `Authorization: Bearer <SUPABASE_ACCESS_TOKEN>` (Required)
- **Request Body**:
  ```json
  {
    "fullName": "Alex Morgan",
    "email": "alex@nexora.design",
    "phone": "+91 98765 43210",
    "addressLine": "Flat 402, Signature Pavilion",
    "city": "Bengaluru",
    "state": "Karnataka",
    "postalCode": "560038",
    "country": "India"
  }
  ```

---

### `POST /api/auth/logout`
Acknowledges session destruction on backend.

- **Auth**: None
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

## 3. Product Catalog

### `GET /api/products`
Lists catalog items with parameterized filtering, search, sorting, and pagination.

- **Auth**: None (Public)
- **Query Parameters**:
  - `category` *(optional)*: `Electronics | Accessories | Gaming | Lifestyle`
  - `search` *(optional)*: Search query string
  - `minPrice` *(optional)*: Lower price boundary (INR)
  - `maxPrice` *(optional)*: Upper price boundary (INR)
  - `inStockOnly` *(optional)*: `true` to filter items where `stock > 0`
  - `minRating` *(optional)*: Minimum star rating (e.g. `4.5`)
  - `sort` *(optional)*: `featured | newest | price-asc | price-desc | rating`
  - `page` *(optional, default 1)*: Page number
  - `limit` *(optional, default 50)*: Items per page
- **Response** (`200 OK`): Array of 18 products with pagination metadata.

---

### `GET /api/products/:id`
Retrieves complete product record by unique ID with full specifications and gallery.

---

### `GET /api/products/categories`
Lists all unique categories from the database.

---

### `GET /api/products/featured`
Returns featured collection items.

---

### `GET /api/products/new-arrivals`
Returns newly arrived products.

---

### `GET /api/products/:id/related?limit=4`
Returns related products in matching discipline.

---

## 4. Orders & Checkout

### `POST /api/orders`
Creates an authoritative, transaction-backed order in PostgreSQL.
**Security & Money Rule**: The frontend sends ONLY product IDs and quantities. The backend locks rows with `SELECT FOR UPDATE`, validates live inventory, calculates unit prices, tax, shipping, and discounts server-side, inserts order and order items, and decrements stock atomically. The user identity is extracted authoritatively from `req.user.id` (verified Supabase UUID).

- **Auth**: Optional/Bearer (automatically linked to authenticated user if signed in)
- **Request Body**:
  ```json
  {
    "items": [
      {
        "productId": "nexora-arc-headphones",
        "quantity": 1
      }
    ],
    "shippingAddress": {
      "fullName": "Alex Morgan",
      "email": "alex@nexora.design",
      "phone": "+91 98765 43210",
      "addressLine": "Flat 402, Signature Pavilion, 12th Main Indiranagar",
      "city": "Bengaluru",
      "state": "Karnataka",
      "postalCode": "560038",
      "country": "India"
    },
    "deliveryMethod": "standard",
    "paymentMethod": "cod",
    "discountCode": "NEXORA10"
  }
  ```
- **Response** (`201 Created`): Complete order object with `id: NX-2026-XXXXX` and `userId: <supabase_user_uuid>`.

---

### `GET /api/orders`
Lists order history for the authenticated user, sorted with newest first.

- **Auth**: `Authorization: Bearer <SUPABASE_ACCESS_TOKEN>` (Required)
- **Security**: Strictly returns `WHERE user_id = req.user.id`.

---

### `GET /api/orders/:id`
Retrieves a specific order by public order number (`NX-2026-XXXXX`) or internal ID.
- **Security**: Ownership check enforced. Users can never view another user's order.
