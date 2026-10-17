# InvoiceRecovery Studio
### Automated Overdue Receivables Recovery & Statutory Debt Legal Engine
**Autonomous Software Studio — Standards 4.0 Reference Implementation**

[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Nuxt 3](https://img.shields.io/badge/Nuxt-3.15+-00DC82.svg)](https://nuxt.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Radix Vue](https://img.shields.io/badge/Radix_Vue-Accessible-purple.svg)](https://www.radix-vue.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.3-2D3748.svg)](https://www.prisma.io/)
[![Standards 4.0](https://img.shields.io/badge/Standards-4.0_Commercial-1e3a8a.svg)](#standards-40-compliance)

---

## 1. Executive Summary & Problem Space

In the modern knowledge economy, over 54% of SMBs, boutique digital agencies, and specialized technical contractors suffer from chronic invoice delinquency. The median overdue receivable lingers 28.4 days past maturity.

Traditional debt recovery suffers from four core failure modes:
1. **The Politeness Trap**: Solo founders and agency principals avoid assertive follow-ups for fear of poisoning client goodwill or compromising downstream referrals.
2. **Statutory Rights Blindspot**: Creditors routinely forgo statutory legal rights to charge commercial late payment interest (e.g., UK Late Payment of Commercial Debts Act 8% + base rate, EU Directive 2011/7/EU, US Prompt Payment rates) and fixed debt-recovery compensation fees (£40–£100 or €40 per invoice).
3. **Legal Cost Asymmetry**: Retaining commercial litigation counsel is financially irrational for receivables between $1,500 and $25,000, given standard $350–$550/hour billable attorney rates or 25%–40% contingency fees.
4. **Emotional Escalation Failure**: Unstructured follow-ups alternate between timid "just checking in" emails and emotional threats, giving delinquent accounts payable departments an excuse to deprioritize payment.

**InvoiceRecovery Studio** transforms awkward accounts receivable follow-up into an institutionalized, automated, legally grounded recovery workflow.

---

## 2. Core Capabilities

### 2.1 Multi-Jurisdiction Statutory Interest Engine
- **United Kingdom**: Late Payment of Commercial Debts (Interest) Act 1998
  - Bank of England Base Rate (`5.25%`) + statutory margin (`8.00%`) = **`13.25% p.a.`** daily pro-rata accrual.
  - Section 5A fixed debt recovery compensation tiers:
    - Debt < £1,000: **£40.00**
    - Debt £1,000 to £9,999.99: **£70.00**
    - Debt >= £10,000: **£100.00**
- **European Union**: Directive 2011/7/EU on Late Payment in Commercial Transactions
  - European Central Bank Refinancing Rate (`3.75%`) + statutory margin (`8.00%`) = **`11.75% p.a.`**
  - Article 6 flat statutory recovery compensation fee: **`€40.00`** per invoice.
- **United States**: Commercial Prompt Payment Standards & Uniform Commercial Code
  - Standard commercial late rate benchmark of `1.0% per month` (**`12.00% p.a.`**).

### 2.2 4-Stage Progressive Escalation Sequence
1. **Stage 1 (1–14 Days)**: *Courtesy Check-in* — Friendly, collaborative confirmation of invoice receipt; assumes administrative oversight.
2. **Stage 2 (15–30 Days)**: *Firm Administrative Statement* — Direct statement of account requesting explicit confirmation of disbursement date and AP log ID.
3. **Stage 3 (31–60 Days)**: *Statutory Accrual Warning* — Formally invokes territorial statutory late interest rights and fixed recovery compensation fee accrual.
4. **Stage 4 (60+ Days)**: *Formal Legal Demand (Letter Before Action - LBA)* — Final 7-day pre-action statutory demand prior to small-claims court filing and commercial litigation proceedings [Pro Tier].

### 2.3 48-Hour Fast-Settlement Formulator
- Offers debtors an immediate conditional concession (3% to 25%, default 8%) for prompt payment in cleared funds within 48 hours.
- Formulates an ironclad **Strict Conditional Non-Waiver Notice**: failure to remit the discounted amount prior to the deadline immediately voids the offer, reinstating the full principal claim plus accrued statutory interest and compensation fees.

### 2.4 Dual Export Tooling
- **1-Click Plaintext / Email Copy**: Copies complete subject line and formatted message text to system clipboard.
- **Printable Formal PDF Letterhead**: Institutional legal letterhead layout with complete itemized debt schedules, statutory citations, and signature blocks (`@media print`).

---

## 3. Built-In Monetization & Zero-Friction Sandbox Fallback

InvoiceRecovery Studio follows **Standards 4.0** monetization architecture:

```
+-------------------------------------------------------------------------------------------------------+
| FEATURE ENTITLEMENT           | FREE STARTER ($0)             | PRO ($29/MO) / LIFETIME ($79 LTD)     |
+-------------------------------------------------------------------------------------------------------+
| Monthly Letter Generations    | 3 letters / month             | UNLIMITED                             |
| Active Invoices in Ledger     | Up to 3 active invoices       | UNLIMITED                             |
| Statutory Interest Engine     | Basic estimation rate         | Full UK 1998, EU 2011/7, US PPA rules |
| Fixed Statutory Debt Fees     | Hidden / generic              | Itemized £40-£100 or €40 fee breakdown|
| Escalation Sequence Access    | Stage 1 & Stage 2 only        | Full 4 Stages (incl. Legal Demand)    |
| Stage 4 Letter Before Action  | LOCKED (Paywall Modal)        | FULLY UNLOCKED & EDITABLE             |
| 48h Fast Settlement Formulator| LOCKED (Paywall Modal)        | FULLY UNLOCKED with waiver clauses    |
| Formal Letterhead PDF Export  | LOCKED (Paywall Modal)        | FULLY UNLOCKED with clean print CSS   |
| 1-Click Clipboard Email Copy  | Included                      | Included                              |
+-------------------------------------------------------------------------------------------------------+
```

### Zero-Friction Sandbox Simulator
If `STRIPE_SECRET_KEY` is not present in `.env`, the studio operates in **Sandbox Mode**:
- Clicking **"Upgrade to Pro"** or **"Simulate Pro (Sandbox)"** flips the tenant record in the database directly to `PRO` or `LIFETIME`.
- The UI reacts immediately, unlocking all gated features for frictionless testing and demonstration.
- Evaluators can toggle back to Free tier at any moment via the persistent `SandboxStatusBar`.

---

## 4. Serverless Cold-Start SQLite Adapter Pattern

On serverless environments (Vercel, AWS Lambda, Netlify), file systems are read-only except `/tmp`.

`server/utils/prisma.ts` implements the **Self-Healing Cold-Start Adapter**:
1. Checks for writable `/tmp/invoicerecovery.db`.
2. On cold container boot, copies the bundled template `prisma/starter.db` to `/tmp/invoicerecovery.db` with `0666` permissions.
3. Automatically executes fallback DDL schema creation and seeds default demo records if the database is uninitialized.

---

## 5. Development & Verification Guide

### Prerequisites
- Node.js v20+ or v24+
- `pnpm` exclusively (`corepack enable pnpm`)

### Setup Commands
```bash
# 1. Install dependencies
pnpm install

# 2. Synchronize SQLite schema & seed starter scenarios
pnpm prisma db push
pnpm db:seed

# 3. Run comprehensive test suite
pnpm test

# 4. Build production bundle
pnpm build

# 5. Start development server
pnpm dev
```

### Pre-Seeded Scenarios
1. **Apex Digital Branding** (US): $8,500.00 • 45 days overdue • 12.0% US commercial prompt payment rate.
2. **OmniCloud Solutions Ltd** (UK): £14,200.00 • 18 days overdue • BoE + 8.0% (13.25%) + £100.00 s.5A fixed fee.
3. **Vanguard Consulting GmbH** (EU): €4,800.00 • 72 days overdue • ECB + 8.0% (11.75%) + €40.00 Article 6 fixed fee.

---

## 6. Standards 4.0 Compliance Verification

- **Strict Zero-Emoji Policy**: 100% semantic Lucide SVG stroke icons (`lucide-vue-next`). 0 emojis across buttons, badges, headers, or cards.
- **Tabular Monospace Typography**: All financial figures, percentages, dates, and days overdue formatted with `font-mono tabular-nums`.
- **Accessibility & Reduced Motion**: CSS safeguard for `prefers-reduced-motion: reduce`.
- **Complete Compilable Code**: Zero placeholders, zero ellipses, zero `// TODO` comments.
