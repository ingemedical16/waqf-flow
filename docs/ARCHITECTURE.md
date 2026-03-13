# WaqfFlow – System Architecture Blueprint

## 1. Overview

WaqfFlow is a multi-tenant SaaS platform designed to enable mosques and non-profit associations to collect donations securely and compliantly using Stripe Connect Express.

This document defines the architectural structure, system boundaries, and development layers of the platform.

The architecture is designed to support:

- 1000+ mosques
- Multi-country operations
- Stripe Connect onboarding
- Hybrid compliance governance
- Multi-language and multi-theme UI
- Long-term scalability

---

# 2. High-Level Architecture

The platform follows a layered architecture:

UI Layer
↓
Service / Business Logic Layer
↓
Database Layer


Strict boundary rules:

- UI never talks directly to the database
- UI never contains Stripe logic
- API routes handle all sensitive operations
- Database is the single source of truth

---

# 3. Root Project Structure
waqf-flow/
├── docs/
├── prisma/
├── public/
├── src/
├── .env
├── .env.example
├── next.config.ts
├── package.json
└── tsconfig.json

---

# 4. Documentation Layer
docs/
├── PROJECT_FOUNDATION.md
├── ARCHITECTURE.md
├── STRIPE_CONNECT_FLOW.md
├── TENANT_LIFECYCLE.md
└── SECURITY_MODEL.md

Purpose:
- Onboarding new contributors
- Explaining compliance logic
- Governance transparency
- Avoiding architectural drift

---

# 5. Database Layer (Prisma + PostgreSQL)
prisma/
├── schema.prisma
└── migrations/

The database defines:

- Tenant lifecycle
- Compliance state
- Stripe account linkage
- Risk classification

Database is the single source of truth.

---

# 6. Application Layer (Next.js App Router)
src/app/
├── (platform)/
│ ├── layout.tsx
│ ├── page.tsx
│ └── pricing/
│
├── (admin)/
│ ├── layout.tsx
│ ├── dashboard/
│ ├── tenants/
│ └── compliance/
│
├── [mosqueSlug]/
│ ├── layout.tsx
│ ├── page.tsx
│ ├── donate/
│ └── about/
│
├── api/
│ ├── stripe/
│ │ ├── connect/
│ │ ├── webhook/
│ │ └── checkout/
│ ├── tenant/
│ └── auth/
│
└── layout.tsx

## Route Groups

(platform) → Marketing + SaaS pages  
(admin) → Internal dashboard  
[mosqueSlug] → Public tenant pages  

This prevents route collision and keeps separation clean.

---

# 7. Component Architecture
src/components/
├── ui/
│ ├── Button/
│ ├── Input/
│ ├── Select/
│ └── Modal/
│
├── layout/
│ ├── Container/
│ ├── Header/
│ └── Footer/
│
├── donation/
│ ├── DonationForm/
│ ├── AmountSelector/
│ └── CheckoutButton/
│
└── compliance/
└── StatusBadge/

Component structure rule:
ComponentName/
├── index.tsx
└── ComponentName.module.scss

Mobile-first SCSS modules only.  
No global styling inside components.

---

# 8. Business Logic Layer
src/lib/
├── db/
│ └── index.ts
│
├── tenant/
│ ├── resolver.ts
│ ├── lifecycle.ts
│ └── validation.ts
│
├── stripe/
│ ├── connect.ts
│ ├── checkout.ts
│ ├── webhook.ts
│ └── helpers.ts
│
├── compliance/
│ ├── countryRisk.ts
│ ├── activation.ts
│ └── policies.ts
│
├── i18n/
│ ├── i18n.ts
│ ├── I18nProvider.tsx
│ ├── languages.ts
│ └── tx.ts
│
├── theme/
│ └── ThemeProvider.tsx
│
└── utils/
└── logger.ts

Separation principle:

- No database calls in UI components
- No Stripe secrets in client-side code
- All compliance checks happen server-side

---

# 9. Styling System
src/styles/
├── abstracts/
│ ├── _variables.scss
│ ├── _breakpoints.scss
│ └── _mixins.scss
│
├── base/
│ ├── _reset.scss
│ └── _typography.scss
│
├── themes/
│ ├── _light.scss
│ └── _dark.scss
│
└── globals.scss

Rules:

- Mobile-first
- REM-based sizing
- CSS variables for theme switching
- No inline styling for core components

---

# 10. Tenant Lifecycle Model

Tenant status is enforced at backend level:

Statuses:

- PENDING
- REVIEW
- ACTIVE
- REJECTED
- SUSPENDED

Donation allowed only if:
tenant.status === ACTIVE

All financial actions validated in API routes.

---

# 11. Stripe Integration Architecture

Stripe Connect Express model:

- Each mosque owns its Stripe account
- Platform takes application fee
- No fund custody by WaqfFlow
- Stripe handles KYC and AML

Webhooks update tenant lifecycle.

Stripe logic never runs in client-side code.

---

# 12. Compliance Strategy

Hybrid activation model:

Low-risk countries (EU):
- Auto activation after Stripe verification

High-risk countries:
- Manual admin review required

Country classification stored in compliance layer.

Default risk = HIGH (conservative approach).

---

# 13. Security Boundaries

Sensitive operations:
- Stripe account creation
- Checkout session creation
- Webhook handling

All handled in:
src/app/api/

Never expose:
- Stripe secret key
- Webhook secret
- Database credentials

---

# 14. Internationalization

- i18next
- Namespaced JSON
- RTL support for Arabic
- Tenant default language
- User language stored in localStorage

Language resolution priority:

1. User preference
2. Tenant default
3. Browser language
4. Global fallback

---

# 15. Development Workflow

Branch strategy:
main → Production
staging → Pre-production
dev → Integration
feature/* → Feature branches


Flow:
feature → dev → staging → main

No direct commits to main.

---

# 16. Scaling Considerations

Architecture supports:

- 1000+ tenants
- Domain-based routing
- Custom domain per mosque
- Stripe Connect multi-country
- Multi-currency
- Admin governance dashboard
- Future analytics layer

No architectural rewrite required for scaling.

---

# 17. Implementation Phases

Phase 1:
- Initialize Next.js
- Setup Prisma + PostgreSQL
- Implement Tenant model

Phase 2:
- Tenant slug routing
- Stripe Connect onboarding

Phase 3:
- Donation flow
- Webhook lifecycle activation

Phase 4:
- Admin dashboard
- Compliance review interface

Phase 5:
- Custom domains
- Advanced fraud detection

---

# 18. Architecture Philosophy

WaqfFlow prioritizes:

Security > Compliance > Scalability > Simplicity

The platform is built to empower legitimate mosques and associations while protecting donors and maintaining regulatory safety.