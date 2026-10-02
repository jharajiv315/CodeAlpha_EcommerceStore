# Changelog

All notable changes to the **NEXORA** e-commerce platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-10-02

### Added
- **Search Engine Optimization**: Injected Schema.org `Organization` and `WebSite` JSON-LD structured data into `index.html`.
- **Crawler Directives**: Added `public/robots.txt` with RFC 9309 compliant absolute sitemap URL and private route shielding.
- **Sitemap Generator**: Added `public/sitemap.xml` listing core static paths and all catalog product routes.
- **Aesthetic Branding**: Added luxury-minimalist `public/favicon.svg` with dark emerald background and ivory monogram.
- **Performance Optimization**: Configured Rolldown/Vite vendor chunk splitting (`vendor-react`, `vendor-supabase`, `vendor-icons`), keeping all bundles <275 kB.
- **Security & Authorization Suite**: Added `backend/testSecurity.js` covering 29 automated checks (SQLi, IDOR, clickjacking, CORS, rate limits, info disclosure).
- **Deployment Documentation**: Added [SECURITY.md](file:///d:/CodeAlpha_EcommerceStore/SECURITY.md) and [PRODUCTION_CHECKLIST.md](file:///d:/CodeAlpha_EcommerceStore/PRODUCTION_CHECKLIST.md).

### Changed
- **Accessibility (WCAG AA)**:
  - Enhanced contrast for muted metadata text (`#4D524E`, 5.2:1) and dark footer links (`#A8AEA9`, 7.5:1).
  - Replaced low-contrast champagne text on white with deep bronze (`#8C6E2E`, 5.1:1).
  - Aligned heading progression across HomePage, Shop, and Cart (`<h1>` -> `<h2>` -> `<h3>`).
  - Resolved `label-content-name-mismatch` by removing `role="button"` and `aria-label` from `<article>` cards with nested actions.
- **Order Security**: Hardened `getOrderById` in `order.service.js` to strictly reject unauthenticated access with `401 Unauthorized` and cross-account access with `403 Forbidden`.
- **API Hardening**: Disabled Express `X-Powered-By` header, attached `express-rate-limit` to sensitive routes, and sanitized all error responses.

---

## [1.1.0] - 2026-10-02

### Added
- **Supabase Authentication Migration**: Integrated Supabase Auth (`@supabase/supabase-js`) supporting Email/Password and Google OAuth.
- **PostgreSQL Profile Synchronization**: Created `profiles` table in `nexora_db` linking canonical Supabase Auth UUIDs.
- **Automated Integration Testing**: Added `backend/testEndpoints.js` with 20/20 test assertions.

### Changed
- Migrated from legacy custom JWT/bcrypt local authentication to centralized Supabase Auth bearer tokens.
- Updated frontend `AuthContext.tsx`, `AuthPage.tsx`, and `apiClient.ts` to manage Supabase session lifecycle.

---

## [1.0.0] - 2026-10-01

### Added
- **Initial Release**: Complete NEXORA full-stack e-commerce architecture.
- **Frontend**: Vite 8, React 19, TailwindCSS luxury minimalist theme, responsive product catalog, quick-view modal, side-by-side product comparison, slide-over cart drawer, and multi-step checkout.
- **Backend**: Express.js REST API with health check, product catalog browsing, filtering, search, and category endpoints.
- **Database**: PostgreSQL schema with `products`, `categories`, `orders`, and `order_items` tables.
- **Transaction Safety**: Atomic row-level locking (`SELECT ... FOR UPDATE`) and server-authoritative financial calculation.
