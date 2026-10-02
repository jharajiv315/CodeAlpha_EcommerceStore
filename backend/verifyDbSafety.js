import dotenv from 'dotenv';
import fs from 'fs';

const envPaths = ['.env', 'backend/.env', '../.env', '../backend/.env'];
for (const p of envPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
  }
}

import { query } from './src/config/db.js';
import { supabasePublic as supabase } from './src/config/supabase.js';

async function verifyDatabaseIntegrity() {
  const BASE_URL = 'http://localhost:5000/api';

  console.log('\n======================================================');
  console.log('--- STRICT POSTGRESQL DATABASE INTEGRITY VERIFICATION ---');
  console.log('======================================================\n');

  // 1. Initial State Snapshot
  const initialOrders = parseInt((await query('SELECT count(*) FROM orders')).rows[0].count);
  const initialItems = parseInt((await query('SELECT count(*) FROM order_items')).rows[0].count);
  const initialStockRes = await query("SELECT stock FROM products WHERE id = 'sony-wh-1000xm5'");
  const initialStock = parseInt(initialStockRes.rows[0].stock);

  console.log('[Snapshot 1 - Initial DB State]:');
  console.log(`  Orders Count:      ${initialOrders}`);
  console.log(`  Order Items Count: ${initialItems}`);
  console.log(`  Headphones Stock:  ${initialStock}\n`);

  // 2. Guest Attempt (Unauthenticated POST /api/orders)
  console.log('[Test 1 - Guest Order Attempt without Authorization header]:');
  const guestRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ productId: 'sony-wh-1000xm5', quantity: 1 }],
      shippingAddress: {
        fullName: 'Anonymous Guest',
        email: 'guest@attacker.com',
        phone: '9999999999',
        addressLine: '100 Unknown Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001'
      },
      deliveryMethod: 'standard',
      paymentMethod: 'cod'
    })
  });
  const guestData = await guestRes.json();
  console.log(`  HTTP Response Status: ${guestRes.status} (Expected: 401)`);
  console.log(`  Error Code:           ${guestData?.error?.code} (Expected: AUTH_REQUIRED)`);

  // 3. Post-Guest DB State Verification
  const postGuestOrders = parseInt((await query('SELECT count(*) FROM orders')).rows[0].count);
  const postGuestItems = parseInt((await query('SELECT count(*) FROM order_items')).rows[0].count);
  const postGuestStockRes = await query("SELECT stock FROM products WHERE id = 'sony-wh-1000xm5'");
  const postGuestStock = parseInt(postGuestStockRes.rows[0].stock);

  console.log('\n[Snapshot 2 - Post-Guest Attempt DB State]:');
  console.log(`  Orders Count:      ${postGuestOrders} (Delta: ${postGuestOrders - initialOrders})`);
  console.log(`  Order Items Count: ${postGuestItems} (Delta: ${postGuestItems - initialItems})`);
  console.log(`  Headphones Stock:  ${postGuestStock} (Delta: ${postGuestStock - initialStock})`);

  if (postGuestOrders !== initialOrders || postGuestItems !== initialItems || postGuestStock !== initialStock) {
    throw new Error('SECURITY VIOLATION: Guest attempt modified PostgreSQL database!');
  }
  console.log('  -> PASS: Guest order attempt was 100% blocked before database execution.\n');

  // 4. Authenticated Order Placement Verification
  console.log('[Test 2 - Authenticated User Order Placement]:');
  const { data: authA, error: authError } = await supabase.auth.signInWithPassword({
    email: 'alex@nexora.design',
    password: 'password123',
  });
  if (authError) throw authError;

  const authRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authA.session.access_token}`
    },
    body: JSON.stringify({
      items: [{ productId: 'sony-wh-1000xm5', quantity: 1 }],
      shippingAddress: {
        fullName: 'Alex Morgan',
        email: 'alex@nexora.design',
        phone: '9876543210',
        addressLine: '12 Design Boulevard',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001'
      },
      deliveryMethod: 'standard',
      paymentMethod: 'card'
    })
  });

  const authData = await authRes.json();
  console.log(`  HTTP Response Status: ${authRes.status} (Expected: 201)`);
  console.log(`  Created Order Number: ${authData?.data?.id}`);
  console.log(`  Assigned User ID:     ${authData?.data?.userId}`);

  // 5. Post-Authenticated DB State Verification
  const postAuthOrders = parseInt((await query('SELECT count(*) FROM orders')).rows[0].count);
  const postAuthItems = parseInt((await query('SELECT count(*) FROM order_items')).rows[0].count);
  const postAuthStockRes = await query("SELECT stock FROM products WHERE id = 'sony-wh-1000xm5'");
  const postAuthStock = parseInt(postAuthStockRes.rows[0].stock);

  console.log('\n[Snapshot 3 - Post-Authenticated Order DB State]:');
  console.log(`  Orders Count:      ${postAuthOrders} (Delta: +${postAuthOrders - postGuestOrders})`);
  console.log(`  Order Items Count: ${postAuthItems} (Delta: +${postAuthItems - postGuestItems})`);
  console.log(`  Headphones Stock:  ${postAuthStock} (Delta: ${postAuthStock - postGuestStock})`);

  if (postAuthOrders !== postGuestOrders + 1 || postAuthItems !== postGuestItems + 1 || postAuthStock !== postGuestStock - 1) {
    throw new Error('FAILURE: Authenticated order failed transaction or inventory decrement in DB!');
  }
  console.log('  -> PASS: Authenticated order committed transaction, created rows, decremented inventory.\n');

  console.log('======================================================');
  console.log('ALL DATABASE INTEGRITY CHECKS PASSED SUCCESSFULLY');
  console.log('======================================================\n');
  process.exit(0);
}

verifyDatabaseIntegrity().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
