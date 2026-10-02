-- ========================================================
-- Migration: Custom Auth -> Supabase Auth Profiles
-- Removes password_hash and uses Supabase Auth UUID as Primary Key
-- ========================================================

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id VARCHAR(64) PRIMARY KEY, -- Stores Supabase auth.users UUID
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    joined_date VARCHAR(64) NOT NULL,
    saved_addresses JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- 2. Seed initial profiles for existing Supabase demo users
INSERT INTO profiles (id, name, email, joined_date, saved_addresses)
VALUES
(
  '35aed916-16f4-4bc4-b198-e689e6d5e59e',
  'Alex Morgan',
  'alex@nexora.design',
  'January 2026',
  '[{"fullName":"Alex Morgan","email":"alex@nexora.design","phone":"+91 98765 43210","addressLine":"Flat 402, Signature Pavilion, 12th Main Indiranagar","city":"Bengaluru","state":"Karnataka","postalCode":"560038","country":"India"}]'::jsonb
),
(
  '53f2f66e-7f2a-455c-acae-27f83a496f87',
  'Priya Sharma',
  'priya@nexora.design',
  'February 2026',
  '[{"fullName":"Priya Sharma","email":"priya@nexora.design","phone":"+91 98111 22334","addressLine":"Apt 12B, Ocean Crest, Perry Cross Rd, Bandra West","city":"Mumbai","state":"Maharashtra","postalCode":"400050","country":"India"}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  saved_addresses = EXCLUDED.saved_addresses;

-- 3. Migrate existing orders from old usr_alex_01 to Supabase Alex UUID
UPDATE orders
SET user_id = '35aed916-16f4-4bc4-b198-e689e6d5e59e'
WHERE user_id = 'usr_alex_01';

-- 4. Update foreign key constraints on orders
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE orders
  ADD CONSTRAINT orders_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- 5. Drop obsolete users table with password_hash
DROP TABLE IF EXISTS users CASCADE;
