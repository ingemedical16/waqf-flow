# WaqfFlow – Project Foundation

## 1. Vision

WaqfFlow is a multi-tenant SaaS platform enabling mosques and non-profit associations to collect donations securely, transparently, and compliantly across multiple countries.

Target scale:
- 1000+ mosques
- Multi-country (EU first)
- Stripe Connect Express-based infrastructure
- Secure, ethical, and compliant

WaqfFlow does NOT act as a financial intermediary. Each mosque owns its Stripe account.

---

## 2. Core Principles

### 2.1 Security First
- No central fund custody
- Stripe Connect Express
- Stripe handles KYC & AML
- Backend-enforced compliance
- Database as single source of truth

### 2.2 Ethical Governance
- Hybrid approval model
- Automatic activation for low-risk EU countries
- Manual review for high-risk countries
- Admin suspension capability
- Anti-fraud and anti-extremism policy

### 2.3 Scalability
- Multi-tenant architecture
- Slug + custom domain support
- Tenant-based language system
- Tenant-based payment routing
- Country-based compliance classification

### 2.4 Simplicity
- Clean layered architecture
- Backend + DB enforcement
- Small functional iterations
- Avoid overengineering

---

## 3. Platform Architecture Overview

### 3.1 Routing Strategy

Hybrid tenant routing:

1. Custom domain → tenant
2. Subdomain (future) → tenant
3. Slug fallback → tenant

Examples:
waqfflow.com/mosquee-al-ihssane
don.epone-mosquee.fr


Root domain (`waqfflow.com`) is reserved for:
- Marketing
- Admin dashboard
- Authentication
- Onboarding

---

## 4. Tenant Model

```ts
Tenant {
  id: string
  slug: string
  name: string
  country: string
  stripeAccountId: string | null
  defaultLanguage: string
  supportedLanguages: string[]
  riskLevel: "low" | "high"
  status: "pending" | "review" | "active" | "rejected" | "suspended"
  createdAt: Date
}
```
Status Definitions

pending → Stripe onboarding not completed

review → Stripe verified but requires admin approval

active → Donations enabled

rejected → Not approved

suspended → Previously active but disabled

Tenant status is the single source of truth for donation eligibility.

## 5. Payment Architecture
### 5.1 Stripe Connect Express

Each mosque owns its Stripe account

Donations go directly to mosque

Platform takes application fee

Stripe handles KYC & AML

No fund custody by platform

### 5.2 Supported Countries

Only Stripe Connect-supported countries are allowed.

Country validation is enforced at backend during signup.

## 6. Activation Flow

Mosque signs up

Selects legal country

Backend validates Stripe coverage

Stripe Express onboarding

Stripe webhook verifies:

charges_enabled === true

payouts_enabled === true

Risk evaluation:

Low-risk → Auto active

High-risk → Manual review

## 7. Compliance Model
Country Risk Classification

Low-risk:

EU / EEA

UK

Other trusted regions

High-risk:

Non-EU countries

Countries requiring additional oversight

Default risk = high (conservative approach)

Activation Rule
Stripe Verified	Risk Level	Result
Yes	Low	Active
Yes	High	Review
No	Any	Pending
## 8. Donation Security Enforcement

Compliance is enforced at:

### 8.1 Database Layer

Tenant status determines donation eligibility.

### 8.2 Backend API

Before creating Stripe Checkout session:
```tsx
if (tenant.status !== "active") {
  throw new Error("Donations are not available.");
}
```
### 8.3 UI Layer

If tenant not active:

Hide donation button

Show status message

Middleware is NOT used for compliance enforcement.

## 9. Internationalization

i18next-based system

JSON namespaced translations

Tenant default language

RTL support (Arabic)

Language Resolution Priority

User stored preference

Tenant default language

Browser language (if supported)

Global default fallback

## 10. Development Workflow

Branch strategy:
```
main      → Production
staging   → Pre-production
dev       → Integration
feature/* → Feature branches
```
Rules:

Small functional tasks

CI must pass before merge

No direct commit to main

Clean PR descriptions

## 11. Governance & Ethics

WaqfFlow is designed to:

Support legitimate mosques and associations

Prevent misuse

Protect donors

Avoid extremist or fraudulent organizations

Maintain regulatory compliance

Admin retains right to:

Reject tenant

Suspend tenant

Disable donation flow

## 12. Long-Term Roadmap
#### Phase 1

Tenant model

Stripe onboarding

Webhook activation

Basic donation flow

#### Phase 2

Admin dashboard

Manual review system

Custom domains

Basic analytics

#### Phase 3

Multi-currency

Advanced fraud detection

Regional compliance expansion

Subscription plans

## 13. Security Philosophy

Platform does not hold donor funds

Stripe manages identity verification

Strict backend validation

Conservative risk classification

Clear legal Terms of Service

WaqfFlow prioritizes:
Security > Simplicity > Scale

## 14. Mission Statement

WaqfFlow exists to empower mosques and non-profit associations to collect donations transparently, securely, and ethically — helping communities without creating legal or financial risk.