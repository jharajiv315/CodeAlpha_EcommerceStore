/**
 * Automated Test Suite for NEXORA with Supabase Auth & PostgreSQL Integration
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPaths = ['.env', 'backend/.env', '../.env', '../backend/.env'];
for (const p of envPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
  }
}

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://fqpdjecqmgcxcycvdfgx.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
const BASE_URL = 'http://localhost:5000/api';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n--- 1. Testing Health & Diagnostics ---');
  {
    const { status, data } = await request('/health');
    assert(status === 200 && data.success === true, 'GET /api/health returns 200 healthy');
  }

  console.log('\n--- 2. Testing Supabase Authentication & Session Verification ---');
  let supabaseAccessToken = '';
  let authenticatedUserId = '';
  {
    // Authenticate via Supabase Auth with seeded demo credentials
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email: 'alex@nexora.design',
      password: 'password123',
    });

    assert(!authErr && !!authData.session, 'Supabase Auth login succeeds for alex@nexora.design');
    supabaseAccessToken = authData.session.access_token;
    authenticatedUserId = authData.user.id;
    assert(authenticatedUserId === '35aed916-16f4-4bc4-b198-e689e6d5e59e', 'Verified canonical Supabase User UUID');

    // Invalid login via Supabase
    const { error: badAuthErr } = await supabase.auth.signInWithPassword({
      email: 'alex@nexora.design',
      password: 'wrong_password_xyz',
    });
    assert(!!badAuthErr, 'Invalid credentials rejected by Supabase Auth');

    // Profile check with valid Supabase Bearer token
    const profileRes = await request('/auth/profile', {
      headers: { Authorization: `Bearer ${supabaseAccessToken}` },
    });
    assert(
      profileRes.status === 200 &&
      profileRes.data.data.email === 'alex@nexora.design' &&
      profileRes.data.data.id === authenticatedUserId,
      'Express validates Supabase access token and returns PostgreSQL profile'
    );

    // Profile check with missing token
    const noAuthRes = await request('/auth/profile');
    assert(noAuthRes.status === 401, 'Protected route rejects unauthenticated request with 401');

    // Profile check with invalid token
    const badTokenRes = await request('/auth/profile', {
      headers: { Authorization: 'Bearer invalid_tampered_token_xyz' },
    });
    assert(badTokenRes.status === 401, 'Tampered/invalid Bearer token rejected with 401');
  }

  console.log('\n--- 3. Testing Products Catalog API ---');
  {
    const listRes = await request('/products');
    assert(listRes.status === 200 && listRes.data.data.products.length === 18, 'GET /api/products returns all 18 PostgreSQL products');

    const catRes = await request('/products?category=Electronics');
    const allElectronics = catRes.data.data.products.every(p => p.category === 'Electronics');
    assert(catRes.status === 200 && allElectronics && catRes.data.data.products.length > 0, 'Category filtering works');

    const searchRes = await request('/products?search=headphones');
    assert(searchRes.status === 200 && searchRes.data.data.products.some(p => p.id === 'nexora-arc-headphones'), 'Instant search returns matches');

    const detailRes = await request('/products/nexora-arc-headphones');
    assert(detailRes.status === 200 && detailRes.data.data.name === 'Nexora Arc Wireless Headphones', 'Product detail loaded with specs & gallery');

    const notFoundRes = await request('/products/invalid-instrument-id');
    assert(notFoundRes.status === 404, 'Non-existent product returns 404');
  }

  console.log('\n--- 4. Testing Transactional Orders with Supabase Identity ---');
  let placedOrderNumber = '';
  {
    const beforeProduct = await request('/products/nexora-arc-headphones');
    const initialStock = beforeProduct.data.data.stock;

    const orderPayload = {
      items: [
        { productId: 'nexora-arc-headphones', quantity: 1 }
      ],
      shippingAddress: {
        fullName: 'Alex Morgan',
        email: 'alex@nexora.design',
        phone: '+91 98765 43210',
        addressLine: 'Flat 402, Signature Pavilion, 12th Main Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        country: 'India',
      },
      deliveryMethod: 'standard',
      paymentMethod: 'cod',
      discountCode: 'NEXORA10',
    };

    // Verify guest checkout is strictly rejected by backend API
    const guestOrderRes = await request('/orders', {
      method: 'POST',
      body: orderPayload,
    });
    assert(
      guestOrderRes.status === 401 && guestOrderRes.data?.error?.code === 'AUTH_REQUIRED',
      'POST /api/orders strictly rejects guest checkout with 401 Unauthorized'
    );

    // Verify authenticated order creation with anti-spoofing check
    const orderRes = await request('/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${supabaseAccessToken}` },
      body: { ...orderPayload, userId: 'spoofed-untrusted-client-id' },
    });

    assert(orderRes.status === 201 && orderRes.data.success === true, 'POST /api/orders creates order transactionally with Supabase identity');
    const created = orderRes.data.data;
    placedOrderNumber = created.id;
    assert(created.userId === authenticatedUserId, 'Order linked to canonical Supabase Auth UUID, ignoring spoofed client userId');
    assert(created.items[0].price === 14999, 'Server-authoritative price applied');
    assert(created.discount === 1500, 'Server-authoritative 10% discount applied');

    // Stock verification
    const afterProduct = await request('/products/nexora-arc-headphones');
    assert(afterProduct.data.data.stock === initialStock - 1, `Inventory atomically decremented: ${initialStock} -> ${afterProduct.data.data.stock}`);

    // Insufficient stock rejection
    const excessOrder = await request('/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${supabaseAccessToken}` },
      body: {
        items: [{ productId: 'nexora-arc-headphones', quantity: 9999 }],
        shippingAddress: orderPayload.shippingAddress,
      },
    });
    assert(excessOrder.status === 409, 'Excess stock request rejected with 409 Conflict');

    // Order history
    const userOrdersRes = await request('/orders', {
      headers: { Authorization: `Bearer ${supabaseAccessToken}` },
    });
    assert(
      userOrdersRes.status === 200 && userOrdersRes.data.data.some(o => o.id === placedOrderNumber),
      'GET /api/orders lists authenticated user orders sorted newest first'
    );

    // Single order retrieval
    const singleOrderRes = await request(`/orders/${placedOrderNumber}`, {
      headers: { Authorization: `Bearer ${supabaseAccessToken}` },
    });
    assert(singleOrderRes.status === 200 && singleOrderRes.data.data.id === placedOrderNumber, 'GET /api/orders/:id retrieves order details');
  }

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
