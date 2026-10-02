-- ========================================================
-- NEXORA PostgreSQL Database Schema (Supabase Auth Edition)
-- Architectural luxury-minimalist e-commerce platform
-- ========================================================

-- Drop tables if resetting (in dependency order)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 1. Profiles Table (1:1 relationship with Supabase auth.users UUID)
-- Credentials and passwords are owned exclusively by Supabase Auth.
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

-- 2. Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) UNIQUE NOT NULL,
    slug VARCHAR(64) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products Table
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
    brand VARCHAR(64),
    sku VARCHAR(64) UNIQUE,
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

-- 4. Orders Table
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

-- 5. Order Items Table (Preserves historical product price & title)
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

-- Indexes for optimal querying & performance
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_new_arrival ON products(new_arrival);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
