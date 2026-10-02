# NEXORA Production Deployment Checklist

This document details the step-by-step requirements for taking NEXORA from local development to a live production environment.

---

## 1. Domain & DNS Configuration
- [ ] Configure authoritative DNS records (A / AAAA / CNAME) pointing to frontend and API hosts.
- [ ] Configure `www` to non-`www` (or vice-versa) 301 canonical redirects at the edge.
- [ ] Verify DNS propagation with `nslookup` or `dig`.

## 2. TLS / HTTPS Certificate
- [ ] Enable automated HTTPS (Let's Encrypt, Cloudflare, or AWS Certificate Manager).
- [ ] Ensure modern TLS versions only (`TLSv1.2` and `TLSv1.3`).
- [ ] Verify certificate validity and set up automated renewal alerts (>30 days before expiration).
- [ ] Enforce automatic HTTP to HTTPS (301) redirect.

## 3. Supabase Cloud Configuration
- [ ] **Authentication URL Configuration**:
  - In Supabase Dashboard -> Authentication -> URL Configuration:
    - Set **Site URL** to production domain (e.g., `https://nexora.design`).
    - Add production redirect URLs (e.g., `https://nexora.design/#/auth`, `https://nexora.design/**`).
- [ ] **Google OAuth Credentials**:
  - In Google Cloud Console, add production domain to Authorized JavaScript Origins and Authorized Redirect URIs (`https://<project-ref>.supabase.co/auth/v1/callback`).
  - Enable Google provider in Supabase Dashboard.
- [ ] **Email Templates & Rate Limits**:
  - Configure branded email templates for confirmation/magic-link.
  - Review Supabase Auth rate limits for production traffic.

## 4. Environment Variables Checklist
### Frontend (e.g. Vercel, Netlify, Cloudflare Pages)
- [ ] `VITE_API_URL`: Production backend URL (e.g., `https://api.nexora.design/api`)
- [ ] `VITE_SUPABASE_URL`: `https://<project-ref>.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY`: Supabase anon/publishable public key

### Backend (e.g. Render, Railway, Fly.io, DigitalOcean)
- [ ] `PORT`: Environment assigned or `5000`
- [ ] `NODE_ENV`: Set to `production`
- [ ] `CLIENT_URL`: Production frontend URL (e.g., `https://nexora.design`)
- [ ] `DATABASE_URL`: Production PostgreSQL connection string (using connection pooler such as PgBouncer or Supabase transaction pooler port 6543)
- [ ] `SUPABASE_URL`: `https://<project-ref>.supabase.co`
- [ ] `SUPABASE_SECRET_KEY`: Supabase `service_role` secret key

## 5. Security & Network Hardening
- [ ] Confirm `x-powered-by` is disabled.
- [ ] Verify `Strict-Transport-Security` (HSTS) header is enabled.
- [ ] Ensure `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY` are emitted.
- [ ] Ensure Content-Security-Policy allows production frontend, API, Supabase, and Google Fonts domains.
- [ ] Verify rate limiting (`express-rate-limit`) is active.
- [ ] Confirm no debug endpoints or stack traces are emitted in HTTP responses.

## 6. Database Readiness
- [ ] Run migration scripts (`backend/sql/schema.sql` and `backend/sql/seed.sql`) against production DB.
- [ ] Ensure indexes are active:
  - `products(category)`, `products(featured)`, `products(slug)`
  - `orders(user_id)`, `orders(order_number)`
  - `order_items(order_id)`
  - `profiles(id)`
- [ ] Configure automated daily database backups and point-in-time recovery.

## 7. SEO & Accessibility Assets
- [ ] Verify `public/robots.txt` is served at `/robots.txt`.
- [ ] Verify `public/sitemap.xml` is served at `/sitemap.xml` with updated production domain.
- [ ] Test mobile responsiveness across viewports (375px to 1440px).
- [ ] Ensure OpenGraph and meta descriptions render properly for social previews.
