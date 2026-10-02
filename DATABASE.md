# NEXORA Database Architecture & Schema Specification (Supabase Auth Edition)

This document provides a comprehensive technical overview of the PostgreSQL database powering NEXORA with **Supabase Auth** for identity management.

- **DBMS**: PostgreSQL 18
- **Driver**: `pg` with connection pooling (`Pool`)
- **Authentication**: Supabase Auth (`auth.users`)
- **Isolation Level**: Read Committed with explicit Row-Level Locking (`SELECT ... FOR UPDATE`)
- **Currency Data Type**: `NUMERIC(12, 2)` (Zero floating-point inaccuracies)

---

## 1. Entity Relationship (ER) Model

```
       +------------------------------------+
       |        Supabase auth.users         |
       +------------------------------------+
       | id (UUID, PK)                      |
       | email                              |
       | encrypted_password                 |
       +------------------------------------+
                         |
                         | 1 : 1 (Canonical Identity)
                         v
       +------------------------------------+
       |              profiles              |
       +------------------------------------+
       | id (VARCHAR 64, PK -> auth.users)  |
       | name                               |
       | email                              |
       | joined_date                        |
       | saved_addresses (JSONB)            |
       +------------------------------------+
                         |
                         | 1 : N
                         v
       +------------------------------------+              +-----------------------+
       |               orders               |              |       products        |
       +------------------------------------+              +-----------------------+
       | id (VARCHAR 64, PK)                |              | id (PK)               |
       | order_number (UNIQUE)              |              | slug (UNIQUE)         |
       | user_id (FK -> profiles.id)        |              | category              |
       | total_amount                       |              | price                 |
       +------------------------------------+              | stock                 |
                         |                                 +-----------------------+
                         | 1 : N                                       |
                         v                                             | 1 : N
       +---------------------------------------------------------------+
       |                          order_items                          |
       +---------------------------------------------------------------+
       | id (SERIAL, PK)                                               |
       | order_id (FK -> orders, ON DELETE CASCADE)                    |
       | product_id (FK -> products, ON DELETE SET NULL)               |
       | product_name                                                  |
       | unit_price (Historical price preservation)                    |
       | quantity                                                      |
       | subtotal                                                      |
       +---------------------------------------------------------------+
```

---

## 2. Table Definitions

### 1. `profiles`
Stores customer profile details, account creation month, and saved shipping addresses.
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
CREATE INDEX idx_profiles_email ON profiles(email);
```

### 2. `categories`
Disciplines organizing the catalog.
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) UNIQUE NOT NULL,
    slug VARCHAR(64) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3. `products`
Authoritative store of products, inventory stock, ratings, and specifications.
```sql
CREATE TABLE products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tagline VARCHAR(255),
    description TEXT NOT NULL,
    full_description TEXT,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(12, 2),
    category VARCHAR(64) NOT NULL,
    image_url TEXT NOT NULL,
    gallery JSONB DEFAULT '[]'::jsonb,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    rating NUMERIC(3, 1) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
    featured BOOLEAN DEFAULT FALSE,
    new_arrival BOOLEAN DEFAULT FALSE,
    tag VARCHAR(64),
    specifications JSONB DEFAULT '{}'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    dimensions VARCHAR(128),
    weight VARCHAR(64),
    warranty VARCHAR(128),
    shipping_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 4. `orders`
Master record of customer purchases and delivery destinations.
```sql
CREATE TABLE orders (
    id VARCHAR(64) PRIMARY KEY,
    order_number VARCHAR(64) UNIQUE NOT NULL,
    user_id VARCHAR(64) REFERENCES profiles(id) ON DELETE SET NULL,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    shipping_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (shipping_amount >= 0),
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    discount_amount NUMERIC(12, 2) DEFAULT 0 CHECK (discount_amount >= 0),
    discount_code VARCHAR(64),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    delivery_method VARCHAR(32) NOT NULL DEFAULT 'standard',
    payment_method VARCHAR(32) NOT NULL DEFAULT 'cod',
    status VARCHAR(32) NOT NULL DEFAULT 'Confirmed' CHECK (status IN ('Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled')),
    shipping_name VARCHAR(255) NOT NULL,
    shipping_email VARCHAR(255) NOT NULL,
    shipping_phone VARCHAR(64) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(128) NOT NULL,
    shipping_state VARCHAR(128) NOT NULL,
    shipping_postal_code VARCHAR(32) NOT NULL,
    shipping_country VARCHAR(64) NOT NULL DEFAULT 'India',
    tracking_number VARCHAR(64),
    estimated_delivery VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 5. `order_items`
Itemized line-items for each purchase. Preserves the exact unit price and title paid at the moment of order placement.
```sql
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image TEXT,
    category VARCHAR(64),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Transaction & Concurrency Control

When an order is created (`POST /api/orders`), the backend initiates an atomic PostgreSQL transaction:

```sql
BEGIN;

-- 1. Lock the selected product rows to prevent concurrent overselling
SELECT id, name, price, stock, category, image_url
FROM products
WHERE id = ANY($1)
FOR UPDATE;

-- 2. Verify requested quantity does not exceed locked stock (reject with 409 if insufficient)

-- 3. Insert order record with verified user_id (Supabase UUID) and server-calculated amounts
INSERT INTO orders (...) VALUES (...) RETURNING *;

-- 4. Insert each order item capturing historical price
INSERT INTO order_items (...) VALUES (...);

-- 5. Atomically decrement stock
UPDATE products
SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2;

COMMIT;
```
