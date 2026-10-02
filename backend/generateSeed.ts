import { INITIAL_PRODUCTS } from '../src/data/products';
import fs from 'fs';
import path from 'path';

function sqlEscape(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'object') {
    return "'" + JSON.stringify(val).replace(/'/g, "''") + "'::jsonb";
  }
  return "'" + String(val).replace(/'/g, "''") + "'";
}

// Valid bcrypt hash for 'password123' (cost 10):
// $2a$10$wNq.756nBgbnB363q21JNu3H51iA.5Q5W9z7n8oJqM8C9D3S7vFLe
// Generated with bcrypt.hashSync('password123', 10)
const BCRYPT_HASH_PASSWORD123 = '$2a$10$.J8onuqwfsI5/.O2AgcyMufHPBAG8rxmMPWHVYTHDLrTwwGSuPwFu';

let sql = `-- ========================================================
-- NEXORA Database Seed Script
-- Deterministic initial seed data: categories, demo users, products
-- ========================================================

-- 1. Categories
INSERT INTO categories (name, slug, description) VALUES
('Electronics', 'electronics', 'Planar magnetic acoustic drivers, mechanical instruments, and studio monitors'),
('Accessories', 'accessories', 'CNC-machined aluminum stands, cable management, and tactile desk tools'),
('Gaming', 'gaming', 'Zero-latency wireless peripherals and glass mousepads with tactile precision'),
('Lifestyle', 'lifestyle', 'Ceramic travel flasks, wool microfiber desk surfaces, and weatherproof daypacks')
ON CONFLICT (name) DO NOTHING;

-- 2. Demo Users (password: password123)
INSERT INTO users (id, name, email, password_hash, joined_date, saved_addresses) VALUES
(
  'usr_alex_01',
  'Alex Morgan',
  'alex@nexora.design',
  '${BCRYPT_HASH_PASSWORD123}',
  'January 2026',
  '[{"fullName":"Alex Morgan","email":"alex@nexora.design","phone":"+91 98765 43210","addressLine":"Flat 402, Signature Pavilion, 12th Main Indiranagar","city":"Bengaluru","state":"Karnataka","postalCode":"560038","country":"India"}]'::jsonb
),
(
  'usr_priya_02',
  'Priya Sharma',
  'priya@nexora.design',
  '${BCRYPT_HASH_PASSWORD123}',
  'February 2026',
  '[{"fullName":"Priya Sharma","email":"priya@nexora.design","phone":"+91 98111 22334","addressLine":"Apt 12B, Ocean Crest, Perry Cross Rd, Bandra West","city":"Mumbai","state":"Maharashtra","postalCode":"400050","country":"India"}]'::jsonb
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  saved_addresses = EXCLUDED.saved_addresses;

-- 3. Products (${INITIAL_PRODUCTS.length} curated deterministic instruments)
INSERT INTO products (
  id, name, slug, tagline, description, full_description,
  price, original_price, category, image_url, gallery,
  stock, rating, review_count, featured, new_arrival, tag,
  specifications, features, dimensions, weight, warranty, shipping_info
) VALUES
`;

const rows = INITIAL_PRODUCTS.map(p => {
  return '(' + [
    sqlEscape(p.id),
    sqlEscape(p.name),
    sqlEscape(p.id), // slug
    sqlEscape(p.tagline),
    sqlEscape(p.description),
    sqlEscape(p.fullDescription),
    sqlEscape(p.price),
    sqlEscape(p.originalPrice || null),
    sqlEscape(p.category),
    sqlEscape(p.image),
    sqlEscape(p.gallery || []),
    sqlEscape(p.stock),
    sqlEscape(p.rating),
    sqlEscape(p.reviewCount),
    sqlEscape(p.featured),
    sqlEscape(p.newArrival),
    sqlEscape(p.tag || null),
    sqlEscape(p.specifications || {}),
    sqlEscape(p.features || []),
    sqlEscape(p.dimensions || null),
    sqlEscape(p.weight || null),
    sqlEscape(p.warranty || null),
    sqlEscape(p.shippingInfo || null),
  ].join(', ') + ')';
});

sql += rows.join(',\n');
sql += `
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  full_description = EXCLUDED.full_description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  gallery = EXCLUDED.gallery,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  featured = EXCLUDED.featured,
  new_arrival = EXCLUDED.new_arrival,
  tag = EXCLUDED.tag,
  specifications = EXCLUDED.specifications,
  features = EXCLUDED.features,
  dimensions = EXCLUDED.dimensions,
  weight = EXCLUDED.weight,
  warranty = EXCLUDED.warranty,
  shipping_info = EXCLUDED.shipping_info,
  updated_at = CURRENT_TIMESTAMP;
`;

const outPath = path.resolve(process.cwd(), 'backend', 'sql', 'seed.sql');
fs.writeFileSync(outPath, sql, 'utf-8');
console.log('Seed SQL file successfully created at:', outPath);
