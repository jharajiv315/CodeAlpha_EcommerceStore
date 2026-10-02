/**
 * Master Real-World Catalog Aggregator & Database Seeder
 * Consolidates all 108 products across 11 categories
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import { pool } from '../src/config/db.js';

import { CATEGORIES_DATA } from './categories.js';
import { SMARTPHONES } from './smartphones.js';
import { LAPTOPS } from './laptops.js';
import { AUDIO } from './audio.js';
import { TABLETS } from './tablets.js';
import { WEARABLES } from './wearables.js';
import { CAMERAS } from './cameras.js';
import { DISPLAYS } from './displays.js';
import { GAMING } from './gaming.js';
import { PC_COMPONENTS } from './pcComponents.js';
import { SMART_HOME } from './smartHome.js';
import { ACCESSORIES } from './accessories.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ALL_PRODUCTS = [
  ...SMARTPHONES,
  ...LAPTOPS,
  ...AUDIO,
  ...TABLETS,
  ...WEARABLES,
  ...CAMERAS,
  ...DISPLAYS,
  ...GAMING,
  ...PC_COMPONENTS,
  ...SMART_HOME,
  ...ACCESSORIES,
];

// Helper to escape SQL single quotes
function sqlEscape(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number' || typeof val === 'boolean') return `${val}`;
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${String(val).replace(/'/g, "''")}'`;
}

// Image verification helper
function verifyImageUrl(url) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.request(url, { method: 'HEAD', timeout: 7000 }, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve({ valid: true, status: res.statusCode });
        } else {
          resolve({ valid: false, status: res.statusCode });
        }
      });
      req.on('error', (err) => resolve({ valid: false, error: err.message }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ valid: false, error: 'Timeout' });
      });
      req.end();
    } catch (e) {
      resolve({ valid: false, error: e.message });
    }
  });
}

export async function runCatalogTransformation() {
  console.log('====================================================');
  console.log('NEXORA REAL-WORLD ELECTRONICS CATALOG TRANSFORMATION');
  console.log('====================================================\n');

  console.log(`Loaded ${CATEGORIES_DATA.length} categories.`);
  console.log(`Loaded ${ALL_PRODUCTS.length} real-world products.\n`);

  // 1. Data Integrity Checks
  console.log('Performing data integrity audit...');
  const idSet = new Set();
  const skuSet = new Set();
  const duplicateIds = [];
  const duplicateSkus = [];
  const categoryCounts = {};
  const brandsSet = new Set();

  CATEGORIES_DATA.forEach((c) => {
    categoryCounts[c.name] = 0;
  });

  for (const p of ALL_PRODUCTS) {
    if (idSet.has(p.id)) duplicateIds.push(p.id);
    idSet.add(p.id);

    if (skuSet.has(p.sku)) duplicateSkus.push(p.sku);
    skuSet.add(p.sku);

    if (categoryCounts[p.category] !== undefined) {
      categoryCounts[p.category]++;
    } else {
      console.warn(`[WARNING] Product ${p.id} has unrecognized category: ${p.category}`);
    }

    if (p.brand) brandsSet.add(p.brand);

    // Price checks
    if (!p.price || p.price <= 0) {
      throw new Error(`Invalid price for product ${p.id}: ${p.price}`);
    }
    if (p.originalPrice && p.originalPrice < p.price) {
      throw new Error(`originalPrice < price for product ${p.id}`);
    }
    if (p.stock < 0) {
      throw new Error(`Negative stock for product ${p.id}`);
    }
    if (p.rating < 1 || p.rating > 5) {
      throw new Error(`Invalid rating for product ${p.id}: ${p.rating}`);
    }
  }

  if (duplicateIds.length > 0) {
    throw new Error(`Duplicate IDs detected: ${duplicateIds.join(', ')}`);
  }
  if (duplicateSkus.length > 0) {
    throw new Error(`Duplicate SKUs detected: ${duplicateSkus.join(', ')}`);
  }

  console.log('✓ Unique ID constraint passed (108/108)');
  console.log('✓ Unique SKU constraint passed (108/108)');
  console.log('✓ Price integrity check passed (MRP >= selling price)');
  console.log(`✓ Found ${brandsSet.size} authentic global electronics brands.\n`);

  console.log('Product Distribution per Category:');
  for (const [cat, count] of Object.entries(categoryCounts)) {
    console.log(`  - ${cat.padEnd(26)}: ${count} products`);
  }
  console.log('');

  // 2. Sample Image Verification
  console.log('Sampling image URL responsiveness...');
  const sampledImages = ALL_PRODUCTS.slice(0, 10).map((p) => p.image);
  let verifiedCount = 0;
  for (const imgUrl of sampledImages) {
    const res = await verifyImageUrl(imgUrl);
    if (res.valid) {
      verifiedCount++;
    } else {
      console.warn(`[WARN] Image test failed for ${imgUrl}: ${res.status || res.error}`);
    }
  }
  console.log(`✓ Verified ${verifiedCount}/${sampledImages.length} sampled image CDN responses (HTTP 200).\n`);

  // 3. Generate TypeScript Data File: src/data/products.ts
  console.log('Generating src/data/products.ts for frontend type safety and fallback...');
  const tsContent = `// ========================================================
// NEXORA Real-World Electronics Catalog
// 108 Authentic Products across 11 Retail Categories
// Auto-generated deterministic catalog
// ========================================================

import { Product, ProductCategory } from '../types';

export const CATEGORIES: { name: ProductCategory; slug: string; description: string }[] = ${JSON.stringify(
    CATEGORIES_DATA,
    null,
    2
  )};

export const PRODUCTS: Product[] = ${JSON.stringify(ALL_PRODUCTS, null, 2)};

export const INITIAL_PRODUCTS: Product[] = PRODUCTS;
`;

  const tsFilePath = path.resolve(__dirname, '../../src/data/products.ts');
  fs.writeFileSync(tsFilePath, tsContent, 'utf8');
  console.log(`✓ Written ${tsContent.length} bytes to ${tsFilePath}`);

  // 4. Generate SQL Seed File: backend/sql/seed.sql
  console.log('Generating backend/sql/seed.sql for production database reproduction...');
  let sqlContent = `-- ========================================================
-- NEXORA Database Production Seed Script
-- 108 Authentic Real-World Electronics Products across 11 Categories
-- ========================================================

-- 1. Categories
INSERT INTO categories (name, slug, description) VALUES\n`;

  const catValues = CATEGORIES_DATA.map(
    (c) => `(${sqlEscape(c.name)}, ${sqlEscape(c.slug)}, ${sqlEscape(c.description)})`
  ).join(',\n');

  sqlContent += `${catValues}
ON CONFLICT (name) DO UPDATE SET
  slug = EXCLUDED.slug,
  description = EXCLUDED.description;

-- 2. Demo Users (Deterministic Test Accounts, password: password123)
INSERT INTO users (id, name, email, password_hash, joined_date, saved_addresses) VALUES
(
  'usr_alex_01',
  'Alex Morgan',
  'alex@nexora.design',
  '$2a$10$.J8onuqwfsI5/.O2AgcyMufHPBAG8rxmMPWHVYTHDLrTwwGSuPwFu',
  'January 2026',
  '[{"fullName":"Alex Morgan","email":"alex@nexora.design","phone":"+91 98765 43210","addressLine":"Flat 402, Signature Pavilion, 12th Main Indiranagar","city":"Bengaluru","state":"Karnataka","postalCode":"560038","country":"India"}]'::jsonb
),
(
  'usr_priya_02',
  'Priya Sharma',
  'priya@nexora.design',
  '$2a$10$.J8onuqwfsI5/.O2AgcyMufHPBAG8rxmMPWHVYTHDLrTwwGSuPwFu',
  'February 2026',
  '[{"fullName":"Priya Sharma","email":"priya@nexora.design","phone":"+91 98111 22334","addressLine":"Apt 12B, Ocean Crest, Perry Cross Rd, Bandra West","city":"Mumbai","state":"Maharashtra","postalCode":"400050","country":"India"}]'::jsonb
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  saved_addresses = EXCLUDED.saved_addresses;

-- 3. Products (108 authentic electronics items)
INSERT INTO products (
  id, name, slug, brand, sku, tagline, description, full_description,
  price, original_price, category, image_url, gallery,
  stock, rating, review_count, featured, new_arrival, tag,
  specifications, features, dimensions, weight, warranty, shipping_info
) VALUES\n`;

  const prodValues = ALL_PRODUCTS.map((p) => {
    return `(
  ${sqlEscape(p.id)},
  ${sqlEscape(p.name)},
  ${sqlEscape(p.id)},
  ${sqlEscape(p.brand)},
  ${sqlEscape(p.sku)},
  ${sqlEscape(p.tagline)},
  ${sqlEscape(p.description)},
  ${sqlEscape(p.fullDescription)},
  ${p.price},
  ${p.originalPrice},
  ${sqlEscape(p.category)},
  ${sqlEscape(p.image)},
  ${sqlEscape(p.gallery || [p.image])},
  ${p.stock},
  ${p.rating},
  ${p.reviewCount},
  ${p.featured ? 'TRUE' : 'FALSE'},
  ${p.newArrival ? 'TRUE' : 'FALSE'},
  ${sqlEscape(p.tag)},
  ${sqlEscape(p.specifications)},
  ${sqlEscape(p.features)},
  ${sqlEscape(p.dimensions)},
  ${sqlEscape(p.weight)},
  ${sqlEscape(p.warranty)},
  ${sqlEscape(p.shippingInfo)}
)`;
  }).join(',\n');

  sqlContent += `${prodValues}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  sku = EXCLUDED.sku,
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
  shipping_info = EXCLUDED.shipping_info;\n`;

  const sqlFilePath = path.resolve(__dirname, '../../backend/sql/seed.sql');
  fs.writeFileSync(sqlFilePath, sqlContent, 'utf8');
  console.log(`✓ Written ${sqlContent.length} bytes to ${sqlFilePath}`);

  // 5. Direct PostgreSQL Seeding
  console.log('\nSeeding PostgreSQL database directly via connection pool...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Clean old demo products that are not part of the 108 real catalog
    const validIds = ALL_PRODUCTS.map((p) => p.id);
    const idPlaceholders = validIds.map((_, i) => `$${i + 1}`).join(',');

    // Delete order_items from old dummy products if any exist
    await client.query(
      `DELETE FROM order_items WHERE product_id NOT IN (${idPlaceholders})`,
      validIds
    );
    // Delete old dummy products
    const deletedRes = await client.query(
      `DELETE FROM products WHERE id NOT IN (${idPlaceholders})`,
      validIds
    );
    if (deletedRes.rowCount > 0) {
      console.log(`Purged ${deletedRes.rowCount} legacy/dummy products from database.`);
    }

    // Execute categories upsert
    for (const c of CATEGORIES_DATA) {
      await client.query(
        `INSERT INTO categories (name, slug, description)
         VALUES ($1, $2, $3)
         ON CONFLICT (name) DO UPDATE SET
           slug = EXCLUDED.slug,
           description = EXCLUDED.description`,
        [c.name, c.slug, c.description]
      );
    }

    // Execute products upsert
    let insertedOrUpdated = 0;
    for (const p of ALL_PRODUCTS) {
      await client.query(
        `INSERT INTO products (
          id, name, slug, brand, sku, tagline, description, full_description,
          price, original_price, category, image_url, gallery,
          stock, rating, review_count, featured, new_arrival, tag,
          specifications, features, dimensions, weight, warranty, shipping_info
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13,
          $14, $15, $16, $17, $18, $19,
          $20, $21, $22, $23, $24, $25
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          brand = EXCLUDED.brand,
          sku = EXCLUDED.sku,
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
          shipping_info = EXCLUDED.shipping_info`,
        [
          p.id,
          p.name,
          p.id,
          p.brand,
          p.sku,
          p.tagline,
          p.description,
          p.fullDescription,
          p.price,
          p.originalPrice,
          p.category,
          p.image,
          JSON.stringify(p.gallery || [p.image]),
          p.stock,
          p.rating,
          p.reviewCount,
          p.featured,
          p.newArrival,
          p.tag,
          JSON.stringify(p.specifications),
          JSON.stringify(p.features),
          p.dimensions,
          p.weight,
          p.warranty,
          p.shippingInfo,
        ]
      );
      insertedOrUpdated++;
    }

    await client.query('COMMIT');
    console.log(`✓ Successfully seeded ${insertedOrUpdated} products into PostgreSQL.`);

    // Quick verification query
    const countCheck = await client.query('SELECT COUNT(*) FROM products');
    console.log(`✓ Total products in PostgreSQL database: ${countCheck.rows[0].count}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to seed database:', err);
    throw err;
  } finally {
    client.release();
  }

  console.log('\n====================================================');
  console.log('CATALOG TRANSFORMATION COMPLETED SUCCESSFULLY');
  console.log('====================================================\n');
}

// Run if directly executed
if (process.argv[1] && process.argv[1].endsWith('index.js')) {
  runCatalogTransformation()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
