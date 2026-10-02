# NEXORA — Backend Integration Notes (Antigravity Phase)

This document provides complete technical specifications for migrating NEXORA from its current frontend prototype to a full-stack architecture powered by **Node.js**, **Express.js**, **PostgreSQL**, **JWT**, and **bcrypt**.

---

## 1. Existing Frontend Service Interfaces

All frontend components communicate solely through the service layer located in `src/services/`. When connecting to the REST API, the method signatures remain identical:

### `productService` (`src/services/productService.ts`)
- `getAllProducts(): Promise<Product[]>`
- `getProductById(id: string): Promise<Product | null>`
- `getFeaturedProducts(): Promise<Product[]>`
- `getNewArrivals(): Promise<Product[]>`
- `getCategories(): Promise<ProductCategory[]>`
- `queryProducts(filters: ProductFilterState, sort: SortOption): Promise<Product[]>`

### `orderService` (`src/services/orderService.ts`)
- `createOrder(payload: CreateOrderPayload): Promise<Order>`
- `getOrders(userId?: string): Promise<Order[]>`
- `getOrderById(orderId: string): Promise<Order | null>`
- `validateShippingAddress(address: ShippingAddress): { valid: boolean; errors: Record<string, string> }`

### `authService` (`src/services/authService.ts`)
- `login(credentials: { email: string; password: string }): Promise<User>`
- `register(data: { name: string; email: string; password: string }): Promise<User>`
- `logout(): Promise<void>`
- `getCurrentUser(): Promise<User | null>`
- `updateProfile(updates: Partial<User>): Promise<User>`
- `getSavedAddresses(): Promise<ShippingAddress[]>`
- `addSavedAddress(address: ShippingAddress): Promise<ShippingAddress[]>`

---

## 2. Target REST API Contract

### Authentication & Users

#### 1. Register User
- **Endpoint**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "name": "Alex Morgan",
    "email": "alex@nexora.design",
    "password": "password123"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "usr_99214",
      "name": "Alex Morgan",
      "email": "alex@nexora.design",
      "joinedDate": "October 2026",
      "savedAddresses": []
    }
  }
  ```

#### 2. Sign In User
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "alex@nexora.design",
    "password": "password123"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "usr_99214",
      "name": "Alex Morgan",
      "email": "alex@nexora.design",
      "joinedDate": "October 2026",
      "savedAddresses": [
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
      ]
    }
  }
  ```

#### 3. User Profile
- **Endpoint**: `GET /api/auth/profile`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response** (`200 OK`): User object.

---

### Products Catalog

#### 1. List Products
- **Endpoint**: `GET /api/products`
- **Query Parameters**:
  - `category`: `Electronics | Accessories | Gaming | Lifestyle`
  - `search`: string
  - `minPrice`: number
  - `maxPrice`: number
  - `inStockOnly`: boolean
  - `sort`: `featured | newest | price-asc | price-desc | rating`
- **Response** (`200 OK`):
  ```json
  {
    "total": 18,
    "products": [
      {
        "id": "nexora-arc-headphones",
        "name": "Nexora Arc Wireless Headphones",
        "tagline": "Acoustic mastery in titanium and dark emerald.",
        "description": "Precision-tuned 40mm planar magnetic drivers...",
        "price": 14999,
        "originalPrice": 17999,
        "category": "Electronics",
        "image": "/assets/products/arc-main.svg",
        "stock": 14,
        "rating": 4.9,
        "reviewCount": 184,
        "featured": true,
        "newArrival": false,
        "tag": "Bestseller"
      }
    ]
  }
  ```

#### 2. Get Product Detail
- **Endpoint**: `GET /api/products/:id`
- **Response** (`200 OK`): Full product record including `gallery`, `specifications` (JSONB), and `features` (JSONB array).

---

### Orders & Checkout

#### 1. Place Order
- **Endpoint**: `POST /api/orders`
- **Headers**: `Authorization: Bearer <jwt_token>` (optional for guest checkout)
- **Request Body**:
  ```json
  {
    "items": [
      {
        "productId": "nexora-arc-headphones",
        "quantity": 1,
        "price": 14999
      }
    ],
    "shippingAddress": {
      "fullName": "Vikram Malhotra",
      "email": "vikram@studio.in",
      "phone": "+91 98201 54321",
      "addressLine": "Flat 904, Tower B, Horizon Heights",
      "city": "Gurugram",
      "state": "Haryana",
      "postalCode": "122002",
      "country": "India"
    },
    "deliveryMethod": "standard",
    "paymentMethod": "cod",
    "discountCode": "NEXORA10"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "id": "NX-2026-09182",
    "status": "Confirmed",
    "subtotal": 14999,
    "shipping": 0,
    "tax": 2287,
    "discount": 1500,
    "total": 13499,
    "trackingNumber": "NX-EXP-882194",
    "estimatedDelivery": "Thu, 8 Oct",
    "createdAt": "2026-10-02T11:20:00.000Z"
  }
  ```

#### 2. List User Orders
- **Endpoint**: `GET /api/orders`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response** (`200 OK`): Array of Order objects.

---

## 3. PostgreSQL Database Schema (DDL)

```sql
-- 1. Users Table
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    saved_addresses JSONB DEFAULT '[]'::jsonb
);

-- 2. Products Table
CREATE TABLE products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    full_description TEXT,
    price INTEGER NOT NULL, -- Stored in whole INR rupees
    original_price INTEGER,
    category VARCHAR(64) NOT NULL,
    image_url TEXT NOT NULL,
    gallery JSONB DEFAULT '[]'::jsonb,
    stock INTEGER NOT NULL DEFAULT 0,
    rating NUMERIC(3, 1) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    new_arrival BOOLEAN DEFAULT FALSE,
    tag VARCHAR(64),
    specifications JSONB DEFAULT '{}'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    dimensions VARCHAR(128),
    weight VARCHAR(64),
    warranty VARCHAR(128),
    shipping_info TEXT
);

-- 3. Orders Table
CREATE TABLE orders (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'NX-2026-10291'
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    subtotal INTEGER NOT NULL,
    shipping INTEGER NOT NULL,
    tax INTEGER NOT NULL,
    discount INTEGER DEFAULT 0,
    total INTEGER NOT NULL,
    delivery_method VARCHAR(32) NOT NULL,
    payment_method VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'Confirmed',
    shipping_address JSONB NOT NULL,
    tracking_number VARCHAR(64),
    estimated_delivery VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Order Items Table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id),
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    category VARCHAR(64)
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_orders_user ON orders(user_id);
```

---

## 4. Current Mock Limitations vs. Production Backend

| Feature | Frontend Prototype Behavior | Target Antigravity Backend Behavior |
| :--- | :--- | :--- |
| **Passwords** | Plain text compared in service layer | `bcrypt.hash(password, 12)` & salted verification |
| **Tokens** | Local JSON session in storage | Signed JWT (`HS256` or `RS256`) with expiration & refresh |
| **Concurrency / Stock** | Decremented in browser local state | Row-level locking (`SELECT FOR UPDATE`) within DB transaction |
| **Image Hosting** | Embedded zero-latency SVGs | Cloud CDN object storage (S3 / Cloud Storage / Cloudflare R2) |
| **Payment Gateway** | Deterministic mock confirmation | Webhook listener for Razorpay / Stripe / UPI intent signatures |
