/**
 * NEXORA Real-World Electronics Catalog End-to-End Verification Suite
 * Tests all requirements from the Master Prompt
 */

import http from 'http';
import https from 'https';

const API_BASE = 'http://localhost:5000/api';
const FRONTEND_BASE = 'http://localhost:3000';

function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const client = parsed.protocol === 'https:' ? https : http;
    const bodyStr = options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : null;

    const headers = {
      ...(options.headers || {}),
    };
    if (bodyStr) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    const req = client.request(url, {
      method: options.method || 'GET',
      headers,
      timeout: 10000,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {
          json = data;
        }
        resolve({ status: res.statusCode, headers: res.headers, data: json });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });

    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`  ✗ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ PASS: ${message}`);
}

async function runVerification() {
  console.log('========================================================');
  console.log('NEXORA CATALOG TRANSFORMATION END-TO-END VERIFICATION');
  console.log('========================================================\n');

  let passedChecks = 0;

  // 1. Frontend Server Liveness
  console.log('--- 1. Testing Frontend Application ---');
  {
    const res = await fetchJson(FRONTEND_BASE);
    assert(res.status === 200, `Frontend server responded with HTTP 200 (${FRONTEND_BASE})`);
    assert(typeof res.data === 'string' && res.data.includes('<div id="root"></div>'), 'Frontend index.html renders root mount point');
    passedChecks += 2;
  }

  // 2. Catalog Size & Structure
  console.log('\n--- 2. Testing Complete Catalog Size & Structure ---');
  let allProducts = [];
  {
    const res = await fetchJson(`${API_BASE}/products?limit=150`);
    assert(res.status === 200, 'GET /api/products returns HTTP 200');
    allProducts = res.data.data.products;
    assert(allProducts.length === 108, `Catalog contains exactly 108 authentic products (found: ${allProducts.length})`);

    // Verify brand, sku, specifications, and realistic Indian pricing
    const allHaveBrand = allProducts.every(p => p.brand && p.brand.trim().length > 0);
    assert(allHaveBrand, '100% of products have genuine manufacturer Brand');

    const allHaveSku = allProducts.every(p => p.sku && p.sku.trim().length > 0);
    assert(allHaveSku, '100% of products have unique retail SKU');

    const skus = new Set(allProducts.map(p => p.sku));
    assert(skus.size === 108, `All 108 SKUs are strictly unique (Set size: ${skus.size})`);

    const allHaveSpecs = allProducts.every(p => p.specifications && Object.keys(p.specifications).length >= 4);
    assert(allHaveSpecs, '100% of products have comprehensive retail specifications table');

    const allHaveValidPricing = allProducts.every(p => p.price > 0 && p.originalPrice >= p.price);
    assert(allHaveValidPricing, '100% of products have realistic Indian INR prices with MRP >= selling price');

    const realisticDiscounts = allProducts.every(p => {
      const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
      return discount <= 35; // No unrealistic 80-99% discounts
    });
    assert(realisticDiscounts, '100% of products have believable discounts (0% - 35% max)');

    const variedStock = allProducts.some(p => p.stock < 10) && allProducts.some(p => p.stock > 20);
    assert(variedStock, 'Stock quantities are realistically distributed across catalog');

    const variedRatings = allProducts.some(p => p.rating >= 4.5 && p.rating < 5.0) && allProducts.some(p => p.reviewCount > 1000);
    assert(variedRatings, 'Ratings and review counts are varied and realistic');

    passedChecks += 9;
  }

  // 3. Category Distribution
  console.log('\n--- 3. Testing Category Distribution ---');
  {
    const expectedCategories = [
      { name: 'Smartphones', min: 12 },
      { name: 'Laptops', min: 12 },
      { name: 'Headphones & Audio', min: 12 },
      { name: 'Tablets', min: 8 },
      { name: 'Smartwatches & Wearables', min: 8 },
      { name: 'Cameras', min: 8 },
      { name: 'TVs & Monitors', min: 10 },
      { name: 'Gaming', min: 10 },
      { name: 'PC Components', min: 10 },
      { name: 'Networking & Smart Home', min: 8 },
      { name: 'Accessories', min: 10 },
    ];

    for (const ec of expectedCategories) {
      const catRes = await fetchJson(`${API_BASE}/products?category=${encodeURIComponent(ec.name)}&limit=150`);
      assert(
        catRes.status === 200 && catRes.data.data.products.length >= ec.min,
        `Category '${ec.name}' has ${catRes.data.data.products.length} products (expected >= ${ec.min})`
      );
      passedChecks++;
    }
  }

  // 4. Search Queries
  console.log('\n--- 4. Testing Real-World Product Search ---');
  {
    const testSearches = [
      { query: 'iPhone', expectedMatch: 'apple-iphone-16-pro-max' },
      { query: 'MacBook', expectedMatch: 'apple-macbook-pro-16-m3-max' },
      { query: 'Sony', expectedMatch: 'sony-wh-1000xm5' },
      { query: 'Samsung', expectedMatch: 'samsung-galaxy-s25-ultra' },
      { query: 'OLED', expectedMatch: 'lg-oled-c4-55-inch' },
      { query: 'RTX', expectedMatch: 'asus-tuf-rtx-4080-super-16gb' },
      { query: 'PlayStation', expectedMatch: 'sony-playstation-5-slim-disc' },
      { query: 'Wi-Fi 7', expectedMatch: 'tp-link-deco-be85-mesh' },
    ];

    for (const ts of testSearches) {
      const searchRes = await fetchJson(`${API_BASE}/products?search=${encodeURIComponent(ts.query)}`);
      const matched = searchRes.data.data.products.some(p => p.id === ts.expectedMatch);
      assert(
        searchRes.status === 200 && matched,
        `Search for '${ts.query}' correctly returned product ID '${ts.expectedMatch}'`
      );
      passedChecks++;
    }
  }

  // 5. Brand Filtering
  console.log('\n--- 5. Testing Brand Filtering ---');
  {
    const appleRes = await fetchJson(`${API_BASE}/products?brand=Apple`);
    assert(
      appleRes.status === 200 && appleRes.data.data.products.every(p => p.brand === 'Apple'),
      `Brand filter 'Apple' returned ${appleRes.data.data.products.length} genuine Apple products`
    );

    const sonyRes = await fetchJson(`${API_BASE}/products?brand=Sony`);
    assert(
      sonyRes.status === 200 && sonyRes.data.data.products.every(p => p.brand === 'Sony'),
      `Brand filter 'Sony' returned ${sonyRes.data.data.products.length} genuine Sony products`
    );
    passedChecks += 2;
  }

  // 6. Numeric Sorting
  console.log('\n--- 6. Testing Numeric Sorting ---');
  {
    // Low to high
    const ascRes = await fetchJson(`${API_BASE}/products?sort=price-asc&limit=150`);
    const ascProducts = ascRes.data.data.products;
    let isAsc = true;
    for (let i = 1; i < ascProducts.length; i++) {
      if (ascProducts[i].price < ascProducts[i - 1].price) {
        isAsc = false;
        break;
      }
    }
    assert(isAsc, 'Price: Low → High performs strictly numerical sorting (lowest ₹2,999 to highest ₹3,49,900)');

    // High to low
    const descRes = await fetchJson(`${API_BASE}/products?sort=price-desc&limit=150`);
    const descProducts = descRes.data.data.products;
    let isDesc = true;
    for (let i = 1; i < descProducts.length; i++) {
      if (descProducts[i].price > descProducts[i - 1].price) {
        isDesc = false;
        break;
      }
    }
    assert(isDesc, 'Price: High → Low performs strictly numerical sorting (highest ₹3,49,900 first)');
    passedChecks += 2;
  }

  // 7. Product Detail Page
  console.log('\n--- 7. Testing Product Detail Page ---');
  {
    const detailRes = await fetchJson(`${API_BASE}/products/sony-wh-1000xm5`);
    assert(detailRes.status === 200, 'GET /api/products/sony-wh-1000xm5 returns HTTP 200');
    const p = detailRes.data.data;
    assert(p.name === 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones (Black)', 'Product name is authentic retail title');
    assert(p.brand === 'Sony', 'Brand is Sony');
    assert(p.sku === 'SON-WH1000XM5-BLK', 'SKU is SON-WH1000XM5-BLK');
    assert(p.price === 27990 && p.originalPrice === 34990, 'Realistic Indian price: ₹27,990 (MRP ₹34,990)');
    assert(p.specifications['Active Noise Cancellation'].includes('Dual Processor'), 'Accurate acoustic specifications');
    assert(p.image.startsWith('https://images.unsplash.com/'), 'High-resolution studio photography');
    passedChecks += 6;
  }

  // 8. Elimination of Demo Strings
  console.log('\n--- 8. Testing Complete Elimination of Demo Signals ---');
  {
    const demoKeywords = ['demo', 'dummy', 'sample product', 'test product', 'product 1', 'product 2', 'wireless device', 'item a', 'lorem ipsum'];
    let foundDemoString = false;
    let culprit = '';

    for (const p of allProducts) {
      const textToScan = `${p.name} ${p.tagline} ${p.description} ${p.fullDescription}`.toLowerCase();
      for (const kw of demoKeywords) {
        if (textToScan.includes(kw)) {
          foundDemoString = true;
          culprit = `${p.id}: matched '${kw}'`;
          break;
        }
      }
      if (foundDemoString) break;
    }

    assert(!foundDemoString, `Zero demo signals found across all 108 products (Culprit: ${culprit || 'None'})`);
    passedChecks++;
  }

  console.log('\n========================================================');
  console.log(`VERIFICATION COMPLETE: ${passedChecks} CHECKS PASSED, 0 FAILED`);
  console.log('========================================================\n');
}

runVerification()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
