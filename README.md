# NEXORA — Modern Products. Simple Shopping.

NEXORA is a high-end, luxury-minimalist e-commerce platform built for thoughtful everyday essentials, acoustic instruments, and precision workplace tools. Designed with architectural restraint, typographic discipline, and clean engineering, NEXORA simulates complete real-world commercial behavior while maintaining a service layer structured for seamless migration to Node.js, Express.js, and PostgreSQL.

---

## 1. Architectural Highlights & Features

- **Storefront & Editorial Discovery**: 
  - Dynamic curated hero with spotlight instrument showcase.
  - Category navigation across four distinct disciplines: *Electronics*, *Accessories*, *Gaming*, *Lifestyle*.
  - Handpicked Featured Collection and New Arrivals grids.
  - Architectural brand story ("Better products. Less noise.") emphasizing material durability and tactile precision.
- **Search, Filtering & Sorting Catalog**:
  - Live client-side instant search across product names, descriptions, categories, and tags.
  - Collapsible desktop sidebar filter system with live counts across discipline categories, price ranges, star ratings (4.0+, 4.5+, 4.8+), and stock availability.
  - Interactive dual-thumb price range slider with floating dynamic labels (₹0–₹30,000+), quick presets, and direct numeric input.
  - Desktop toolbar dropdown filters for Category, Price, Customer Rating, In-Stock toggle, and active filter dismiss pills.
  - Tactile luxury product cards featuring subtle vertical lift (`-translate-y-1.5`), soft shadow elevation, and silky ease-out image zoom on hover.
  - Sorting by Featured status, Newest arrivals, Price (asc/desc), and Customer Ratings.
  - "Recently Viewed" chronological section tracking and displaying the last 4 clicked instruments with instant "Clear History" control.
  - Responsive slide-out mobile drawer with touch-friendly accordion controls.
- **Navigation & Accessibility**:
  - Top Bar Contract conforming navigation header with categories, search, bag, and account status.
  - Semantic Schema.org Breadcrumb component on `ShopPage` and `ProductDetailPage` displaying hierarchical parents (`Home` > `Shop` > `Category` > `Product`) with microdata and `aria-current="page"`.
  - Minimalist floating "Back to Top" affordance that appears dynamically when scrolled 400px down.
  - Slide-out mobile navigation drawer with focus trapping and ESC key dismiss.
- **Contiguous Product Detail Page (PDP)**:
  - Multi-angle high-resolution gallery with thumbnail switcher.
  - Real-time stock status indicator with low-stock warnings (e.g. `< 6` units remaining).
  - Tactile quantity stepper respecting inventory thresholds.
  - "Add to Bag" feedback with non-blocking toast notifications and "Buy Now" 1-click express checkout.
  - Technical specification tables, engineering highlights, and domestic delivery/warranty policies.
  - Client Review & Rating System (`ProductReviewsSection`) with overall score, star breakdown progress bars, filter-by-star rating, review submission form with interactive 5-star picker, author initials avatar, and verified buyer badges.
  - Related product recommendations in matching categories.
- **Side-by-Side Product Comparison Tool**:
  - Interactive comparison of up to 3 products across the catalog.
  - Floating bottom comparison dock (`CompareDock`) with quick item removal, slot counter, and instant trigger.
  - Full-screen side-by-side comparison matrix (`ProductComparisonModal`) with sticky headers and criteria navigation.
  - Deep feature analysis: Pricing & savings, Star ratings, Key features, Technical specifications (dynamically aggregated), Form dimensions, Weight, and Domestic warranty.
  - "Highlight Differences" toggle that visually isolates conflicting specifications.
  - In-table direct "Add to Bag" actions and slot dropdown picker to add alternative products on the fly.
- **Commerce Cart & Quick Bag Drawer**:
  - Global slide-over bag drawer accessible anytime from the navigation bar.
  - Dedicated `/cart` page with line-item management, quantity steppers, and item removal.
  - Real-time free shipping threshold meter (Complimentary domestic delivery on orders ₹2,000+).
  - Promotional privilege code validator (e.g., `NEXORA10` for 10% off, `WELCOME15` for 15% off).
  - Itemized financial accounting: Subtotal, Shipping, 18% GST component, and Final Total.
- **Frictionless Checkout Flow**:
  - Inline input validation with user-friendly error alerts (zero browser `alert()` usage).
  - Fast-fill evaluator sample address button for 1-click end-to-end testing.
  - Delivery speed selector: Standard Ground Courier vs Express Air Priority.
  - Payment settlement choices: Cash on Delivery (COD), Instant UPI, and Credit/Debit Card prototype.
  - Deterministic order numbering generation (`NX-2026-XXXXX`).
- **Post-Purchase & Order Lifecycle**:
  - Order confirmation screen with estimated delivery scheduling and courier tracking reference.
  - My Orders history with visual status indicators, pulsing milestone dots, and 4-step fulfillment progress timeline (`Confirmed`, `Processing`, `Shipped`, `Delivered`).
  - Interactive receipt inspection modal showing line items, shipping destinations, and financial breakdown.
- **Client Account & Authentication**:
  - User registration and login with local session persistence.
  - Built-in evaluator demo accounts (`alex@nexora.design` / `password123` and `priya@nexora.design` / `password123`).
  - Account profile dashboard with saved shipping address book and wishlist manager.
- **Design System & Zero-Pill Discipline**:
  - Warm Ivory (`#F7F5F0`), Deep Emerald (`#123C35`), Graphite (`#171A19`), Champagne Gold (`#B89B5E`).
  - Shimmering skeleton screen loaders for both ShopPage and ProductDetailPage preventing layout shift while fetching catalog data.
  - Tabular numerals (`tabular-nums`) for clean financial alignment.
  - Zero-pill metadata discipline: unboxed text separated by typographic middots (`·`).
  - Full WCAG AA contrast compliance, visible focus outlines, and `prefers-reduced-motion` compliance.

---

## 2. Technology Stack

- **Framework**: React 19 + TypeScript (ES2022)
- **Bundler & Dev Server**: Vite 8 with `@vitejs/plugin-react`
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Typography**: Plus Jakarta Sans & Cormorant Garamond
- **Icons**: Lucide React
- **State Architecture**: React Context (`CartContext`, `AuthContext`, `ToastContext`) + decoupled service layer

---

## 3. Directory Structure

```
src/
├── types/
│   └── index.ts                 # Product, Order, User, Cart, Filter types
├── utils/
│   ├── currency.ts              # Indian Rupee (INR) formatter with lakhs/thousands
│   └── id.ts                    # Order ID generator and date formatters
├── data/
│   ├── products.ts              # 18 high-end deterministic products with full specs
│   └── productImages.ts         # High-fidelity SVG vector studio illustrations
├── services/
│   ├── productService.ts        # Catalog queries, filters, categories
│   ├── cartService.ts           # Cart state, stock constraints, promo codes, financials
│   ├── orderService.ts          # Order generation, validation, history
│   └── authService.ts           # Authentication, profile, saved addresses
├── context/
│   ├── CartContext.tsx          # Shopping bag state and slide-over drawer controls
│   ├── AuthContext.tsx          # Active user session and saved wishlist
│   └── ToastContext.tsx         # Accessible non-blocking notifications
├── components/
│   ├── common/
│   │   ├── Navbar.tsx           # 3-Zone contract navigation bar
│   │   ├── MobileDrawer.tsx     # Slide-out mobile menu with focus trapping
│   │   ├── Footer.tsx           # Clean footer with links and promises
│   │   ├── ToastContainer.tsx   # Stacked notifications
│   │   ├── Breadcrumb.tsx       # Unboxed clean breadcrumb trail
│   │   ├── EmptyState.tsx       # Contextual empty states with CTAs
│   │   ├── SkeletonLoader.tsx   # Pulse loading placeholders
│   │   └── CartDrawer.tsx       # Quick slide-over shopping bag
│   └── shop/
│       ├── ProductCard.tsx      # Consistent 4:3 card with hover zoom & quick actions
│       ├── FilterBar.tsx        # Search, categories, price presets, sort dropdown
│       └── ProductGrid.tsx      # Responsive grid with auto-alignment
├── pages/
│   ├── HomePage.tsx             # Hero, category tiles, featured, story, new arrivals
│   ├── ShopPage.tsx             # Full catalog with search, filter, sort
│   ├── ProductDetailPage.tsx    # Gallery, buy module, spec tabs, related products
│   ├── CartPage.tsx             # Dedicated bag page, promo codes, totals
│   ├── CheckoutPage.tsx         # Address form, delivery speed, payment selection
│   ├── OrderConfirmationPage.tsx# Post-order confirmation with tracking ID
│   ├── OrdersPage.tsx           # Order history and receipt viewer modal
│   ├── AuthPage.tsx             # Sign in & registration with 1-click test fill
│   ├── ProfilePage.tsx          # Account info, saved addresses, logout
│   ├── WishlistPage.tsx         # Saved items manager
│   └── NotFoundPage.tsx         # Graceful 404 route
├── App.tsx                      # Root shell and hash router
└── index.css                    # Design system tokens and accessibility rules
```

---

## 4. How to Run Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Verify build & lint**:
   ```bash
   npm run lint
   npm run build
   ```

---

## 5. Mock Data & Prototype Behavior

- **Determinism**: Product data (18 items across 4 categories) contains consistent pricing in Indian Rupees (INR ₹), fixed inventory limits, realistic dimensions, and complete technical specifications.
- **Stock Constraint Enforcement**: Adding items to the bag checks active inventory. If an item has only 4 units left in stock, the stepper will prevent exceeding 4 units and notify the user via a toast message.
- **Cart & Order Persistence**: Stored via `localStorage` abstractions inside `src/services/` so reloading or navigating does not clear the cart or wipe order history.
- **Authentication**: Simulated client-side session with pre-configured accounts:
  - `alex@nexora.design` / `password123` (Alex Morgan)
  - `priya@nexora.design` / `password123` (Priya Sharma)

---

## 6. Future Backend Integration (Antigravity Phase)

NEXORA's UI components do **not** directly execute `localStorage` queries or hardcoded database rules. All operations invoke the Service Layer:
- `productService` → Replaced with `GET /api/products` and `GET /api/products/:id`
- `cartService` → Can remain client-side or sync with `POST /api/cart`
- `orderService` → Replaced with `POST /api/orders` and `GET /api/orders`
- `authService` → Replaced with `POST /api/auth/login`, `POST /api/auth/register`, and JWT Bearer headers.

For technical specifications, PostgreSQL DDL schemas, and REST request/response shapes, review `BACKEND_INTEGRATION_NOTES.md`.
