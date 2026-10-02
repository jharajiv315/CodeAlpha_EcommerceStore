/**
 * Security & Authorization Automated Verification Suite
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

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
  const headers = Object.fromEntries(res.headers.entries());
  return { status: res.status, data, headers };
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

async function runSecurityAudit() {
  console.log('\n--- 1. HTTP Security Headers & Software Disclosure Audit ---');
  const healthRes = await request('/health');
  assert(healthRes.status === 200, 'GET /api/health returned 200 OK');
  assert(!healthRes.headers['x-powered-by'], 'x-powered-by header is absent (software fingerprinting prevented)');
  assert(healthRes.headers['x-content-type-options'] === 'nosniff', 'X-Content-Type-Options: nosniff present');
  assert(healthRes.headers['x-frame-options'] === 'DENY', 'X-Frame-Options: DENY present (anti-clickjacking)');
  assert(healthRes.headers['referrer-policy'] === 'strict-origin-when-cross-origin', 'Referrer-Policy is strict');
  assert(!!healthRes.headers['content-security-policy'], 'Content-Security-Policy header is configured');

  console.log('\n--- 2. SQL Injection & Parameterization Resilience ---');
  const sqliPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE products; --",
    "1' UNION SELECT null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null --",
    '"><script>alert(1)</script>',
  ];

  for (const payload of sqliPayloads) {
    const searchRes = await request(`/products?search=${encodeURIComponent(payload)}`);
    assert(searchRes.status === 200, `Search endpoint handles SQL payload safely without DB error: ${payload}`);
    assert(searchRes.data?.success === true, 'Response remains structured JSON with success flag');
    assert(!JSON.stringify(searchRes.data).includes('syntax error'), 'No SQL syntax error exposed');
  }

  const badIdRes = await request("/products/prod_' OR '1'='1");
  assert(badIdRes.status === 404, 'SQL injection in product ID safely returns 404 Not Found without SQL leak');

  console.log('\n--- 3. Authorization & Cross-Account Isolation ---');
  // Sign in as User A (Alex)
  const { data: authA } = await supabase.auth.signInWithPassword({
    email: 'alex@nexora.design',
    password: 'password123',
  });
  const tokenA = authA.session.access_token;
  const userAId = authA.user.id;

  // Sign in as User B (Priya)
  const { data: authB } = await supabase.auth.signInWithPassword({
    email: 'priya@nexora.design',
    password: 'password123',
  });
  const tokenB = authB.session.access_token;
  const userBId = authB.user.id;

  assert(userAId !== userBId, 'User A and User B are distinct Supabase accounts');

  const orderPayloadSample = {
    items: [{ productId: 'nexora-arc-headphones', quantity: 1 }],
    shippingAddress: {
      fullName: 'Alex Morgan',
      email: 'alex@nexora.design',
      phone: '9876543210',
      addressLine: '12 Design Boulevard',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
    },
    deliveryMethod: 'standard',
    paymentMethod: 'card',
  };

  // Security Test: Guest attempt to create order without token -> 401 Unauthorized
  const guestOrderRes = await request('/orders', {
    method: 'POST',
    body: orderPayloadSample,
  });
  assert(guestOrderRes.status === 401, 'Guest order creation rejected with 401 Unauthorized');
  assert(guestOrderRes.data?.error?.code === 'AUTH_REQUIRED', 'AUTH_REQUIRED error code returned for guest order attempt');

  // Security Test: Malformed/invalid token -> 401 Unauthorized
  const invalidTokenRes = await request('/orders', {
    method: 'POST',
    headers: { Authorization: 'Bearer this-is-an-invalid-fake-token' },
    body: orderPayloadSample,
  });
  assert(invalidTokenRes.status === 401, 'Invalid Bearer token rejected with 401 Unauthorized');

  // Security Test: User A places order with spoofed userId in body -> Server strictly uses req.user.id
  const orderRes = await request('/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}` },
    body: {
      ...orderPayloadSample,
      userId: userBId, // Malicious attempt: User A tries to bill/assign order to User B
    },
  });

  if (orderRes.status !== 201) {
    console.error('Order creation failed:', orderRes.status, orderRes.data);
  }
  assert(orderRes.status === 201, 'User A creates authenticated order successfully');
  assert(orderRes.data?.data?.userId === userAId, 'Order bound to verified req.user.id, defeating body userId spoofing attempt');
  const userAOrderNumber = orderRes.data?.data?.id;

  // 1. User A retrieves own order -> 200 PASS
  const userAView = await request(`/orders/${userAOrderNumber}`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  assert(userAView.status === 200, 'User A can view their own order');

  // 2. User B attempts to retrieve User A's order -> 403 Forbidden
  const userBView = await request(`/orders/${userAOrderNumber}`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  assert(userBView.status === 403, 'User B is forbidden (403) from viewing User A order');
  assert(!userBView.data?.data, 'No sensitive order data leaked to User B');

  // 3. Unauthenticated requester attempts to view User A's order -> 401 Unauthorized
  const anonView = await request(`/orders/${userAOrderNumber}`);
  assert(anonView.status === 401, 'Unauthenticated user rejected with 401 when accessing user order');

  console.log('\n--- 4. Information Disclosure & Error Safety ---');
  const invalidJsonRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"invalid": json',
  });
  const invalidJsonData = await invalidJsonRes.json().catch(() => null);
  assert(invalidJsonRes.status === 400, 'Malformed JSON returns clean 400 error');
  assert(!invalidJsonData?.error?.details?.stack, 'No stack trace leaked on malformed JSON payload');

  const notFoundRoute = await request('/route-that-does-not-exist');
  assert(notFoundRoute.status === 404, 'Invalid API endpoint returns clean structured 404 JSON');
  assert(notFoundRoute.data?.success === false, 'Structured JSON error envelope');

  console.log('\n========================================');
  console.log(`Security Audit Results: ${passed} Passed, ${failed} Failed`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityAudit().catch(err => {
  console.error('Audit crashed:', err);
  process.exit(1);
});
