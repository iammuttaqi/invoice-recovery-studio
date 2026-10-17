# Product Requirements Document (PRD)
## InvoiceRecovery Studio: Automated Overdue Receivables Recovery & Statutory Debt Legal Engine

- **Product Name**: InvoiceRecovery Studio (`invoice-recovery-studio`)
- **Document Version**: 1.0.0
- **Status**: Approved for Engineering Implementation (Standards 4.0)
- **Author**: Lead Product Manager, Autonomous Software Studio
- **Target Release**: Production MVP
- **Technology Stack**: Nuxt 3 (v3.14+), Vue 3 Composition API (`<script setup lang="ts">`), Tailwind CSS, Radix Vue primitives, Lucide Icons, Prisma ORM with serverless `/tmp/dev.db` SQLite adapter, Stripe Checkout SDK & Sandbox Simulator. Package Manager: `pnpm` exclusively.

---

## 1. Executive Summary & Value Proposition

### 1.1 Commercial Problem Statement
In the modern B2B knowledge economy, independent service providers, boutique creative and engineering agencies, and specialized consultants operate primarily on delayed credit terms (Net-30, Net-60, or project-based milestone disbursements). Over **54% of SMBs and independent contractors experience chronic payment delinquency**, with the median overdue invoice lingering **28.4 days past its maturity date**.

This delinquency introduces existential cash-flow volatility, but the primary failure mode is behavioral and institutional:
1. **The Politeness Trap**: Solo founders and agency principals avoid assertive follow-ups for fear of poisoning client goodwill or compromising downstream referral pipelines.
2. **Statutory Rights Blindspot**: Creditors routinely forgo their statutory legal rights to charge commercial late payment interest (e.g., UK Late Payment of Commercial Debts Act 8% + base rate, EU Directive 2011/7/EU, US Prompt Payment rates) and fixed debt-recovery compensation fees (£40–£100 or €40 per invoice).
3. **The Legal Cost Asymmetry**: Retaining commercial litigation counsel or third-party collection agencies is financially irrational for receivables between $1,500 and $25,000, given standard $350–$550/hour billable attorney rates or 25%–40% contingency fees.
4. **Emotional Escalation Failure**: Unstructured ad-hoc follow-ups alternate between timid "just checking in" emails and unstructured emotional threats, giving delinquent corporate accounts payable departments an excuse to deprioritize payment.

### 1.2 Value Proposition & Target ROI
**InvoiceRecovery Studio** transforms awkward accounts receivable follow-up into an institutionalized, automated, legally grounded recovery workflow. By combining a multi-jurisdiction statutory interest calculator, an aging delinquency matrix, a 4-stage progressive escalation letter generator, and a 48-hour conditional fast-settlement discount builder, creditors recover owed capital without adversarial litigation.

#### Unit Economics & ROI Calculation
- **Subscription Cost**: Pro Tier at **$29/month** or **$79 one-time** (Lifetime Deal).
- **Average Claim Size**: $6,500.00 (agency milestone or contractor retainer).
- **Average Statutory Recovery**: $245.00 in accrued late interest + $90.00 (£70) fixed statutory compensation fee = **+$335.00 additional revenue recovered** per invoice.
- **Immediate Commercial Return**: Recovering even a single $3,000 overdue invoice yields a **103x ROI on the $29/mo plan** or a **38x ROI on the $79 lifetime license**.

### 1.3 Strategic Product Goals
- Deliver an authoritative, calm, executive interface that instills immediate confidence in creditors and institutional respect from debtors.
- Automate statutory interest and compensation calculations with 100% legal precision across US, UK, and EU commercial statutes.
- Provide a clear progressive escalation pathway from gentle courtesy check-ins to formal pre-action legal demand letters ("Letter Before Action").
- Drive friction-free monetization via strict 3-letter free quota enforcement, high-converting paywall modals, and seamless Stripe Checkout / developer sandbox simulation.

---

## 2. Target Paying Personas

```
+----------------------------------------------------------------------------------------------------+
|                                    TARGET PAYING PERSONAS                                         |
+----------------------------------------------------------------------------------------------------+
| 1. Boutique Agency Owners      | 2. Fractional CTOs / Senior Dev Contractors                      |
|    - Size: 3-15 staff          |    - Size: Solo Independent Contractor                           |
|    - Overdue: $25k-$150k       |    - Overdue: $10k-$40k (1-3 large invoices)                     |
|    - Pain: Client retention vs |    - Pain: Bureaucratic corporate AP delays                      |
|      payroll cash crunch       |    - Need: Rigid statutory leverage without emotional conflict   |
+--------------------------------+------------------------------------------------------------------+
| 3. Independent Consultants     | 4. Trade & B2B Service Contractors                               |
|    - Size: Solopreneur         |    - Size: 1-10 staff                                            |
|    - Overdue: $5k-$20k         |    - Overdue: $8k-$50k                                           |
|    - Pain: Lacks legal counsel |    - Pain: Invoices ignored by general contractors/enterprises   |
|    - Need: Institutional voice |    - Need: Formal pre-action notice to force wire payment         |
+--------------------------------+------------------------------------------------------------------+
```

### 2.1 Persona 1: Boutique Creative & Web Agency Principal (Marcus, 38)
- **Profile**: Founder of an 8-person web design and branding studio in London / New York.
- **Workflow & Pain Points**: Carries 4–8 unpaid milestone invoices totaling $45,000. Balances team payroll on the 1st of every month. Hesitant to sound aggressive with enterprise clients who might renew annual retainers.
- **Jobs To Be Done (JTBD)**: "Help me systematically escalate overdue client payments using objective commercial norms so my clients treat my invoices as priority payables without blaming me personally."
- **Willingness to Pay**: High ($79 lifetime deal or $29/mo is an effortless operational expense).
- **Conversion Trigger**: Hitting the 4th letter paywall when managing a batch of 5 delinquent retainers; desiring the downloadable formal PDF letterhead with Bank of England statutory citations.

### 2.2 Persona 2: Independent Software Contractor / Fractional CTO (Elena, 34)
- **Profile**: Senior freelance full-stack engineer and fractional technical leader billing $12,000/month.
- **Workflow & Pain Points**: Completed a 3-month contract for a venture-backed startup; final $18,000 sprint invoice is 42 days overdue. Client finance team ignores emails or claims "board approval needed."
- **Jobs To Be Done (JTBD)**: "Provide me an ironclad legal notice that itemizes statutory interest and states clear pre-action legal intent under commercial debt statutes so their finance director cuts the wire today."
- **Willingness to Pay**: Very High ($29/mo or $79 lifetime is <0.5% of one invoice).
- **Conversion Trigger**: Needing Stage 4 "Letter Before Action" and PDF Letterhead export.

### 2.3 Persona 3: Specialized Management & Strategy Consultant (Julian, 46)
- **Profile**: Solo executive advisor and operational consultant working with mid-market manufacturing firms.
- **Workflow & Pain Points**: Billed $7,500 on Net-30 terms; invoice is now 64 days overdue. Client CEO remains friendly on LinkedIn but AP ignores reminders.
- **Jobs To Be Done (JTBD)**: "Give me an objective, third-party tone of voice that separates the strategic advisory relationship from the formal accounts receivable recovery process."
- **Willingness to Pay**: High.
- **Conversion Trigger**: The Fast-Settlement 48-Hour Discount generator (offering a 7% prompt-settlement waiver) to immediately unlock liquidity without surrendering leverage.

### 2.4 Persona 4: Trade & B2B Commercial Contractor (David, 51)
- **Profile**: Commercial IT infrastructure and cabling contractor servicing regional office parks.
- **Workflow & Pain Points**: Outstanding invoices ranging from $2,200 to $11,000 overdue by 30 to 90 days. Tired of chasing accounting clerks who say "the check is in the mail."
- **Jobs To Be Done (JTBD)**: "Generate an unmistakable formal notice citing statutory debt compensation fees that proves we are prepared to file in small claims court if not settled within 7 days."
- **Willingness to Pay**: Immediate purchase when an invoice crosses 60 days overdue.

---

## 3. Monetization & Pricing Architecture (Standards 4.0)

```
+-------------------------------------------------------------------------------------------------------+
|                                    MONETIZATION TIERS MATRIX                                          |
+-------------------------------------------------------------------------------------------------------+
| Capability / Entitlement           | Free Starter ($0)             | Pro Tier ($29/mo or $79 LTD)     |
+------------------------------------+-------------------------------+----------------------------------+
| Monthly Letter Generations         | 3 letters / month             | Unlimited                        |
| Aging Matrix & Ledger Tracking     | Up to 3 active invoices       | Unlimited invoices               |
| Statutory Interest Calculator      | Basic standard rate only      | UK 1998 Act, EU 2011/7, US PPA   |
| Progressive Escalation Sequences   | Stage 1 & Stage 2 only        | Full 4 Stages (incl. Legal LBA)  |
| Stage 4 Letter Before Action (LBA) | Locked (Paywall Trigger)      | Fully unlocked & editable        |
| 48-Hour Fast Settlement Generator  | Locked (Paywall Trigger)      | Full conditional discount waiver |
| Export Formats                     | 1-Click Plaintext / Email     | PDF Letterhead + Rich-Text Email |
| Multi-Jurisdiction Legal Citations | Generic calculation summary   | Statutory code citations in full |
| Stripe Checkout & Sandbox Preview  | Upgrade banner active         | Active Pro entitlement           |
+-------------------------------------------------------------------------------------------------------+
```

### 3.1 Pricing Tiers & Entitlements
1. **Free Starter Tier ($0 / month)**:
   - Target: Casual freelancers with an occasional late invoice.
   - Entitlements:
     - 3 recovery letter generations per rolling 30-day window.
     - Up to 3 active invoices in the ledger.
     - Stage 1 (Courtesy Check-in) and Stage 2 (Firm Administrative Notice) letter generation.
     - Standard late interest estimation.
     - 1-Click Clipboard Email export (plaintext/rich-text).
2. **Pro Monthly ($29 / month)**:
   - Target: Active freelancers, growing boutique agencies, recurring contractors.
   - Entitlements:
     - Unlimited active invoice ledger tracking.
     - Unlimited recovery letter generations.
     - Full 4-Stage Progressive Escalation Sequence (including Stage 3 Statutory Warning and Stage 4 Formal Legal Demand / Letter Before Action).
     - Multi-jurisdiction statutory engine (UK Late Payment Act with fixed compensation tiers £40/£70/£100, EU Directive 2011/7/EU with €40 fee, US Prompt Payment Act).
     - 48-Hour Fast-Settlement Discount Generator (conditional prompt payment waiver clause).
     - Formal printable PDF letterhead export with institutional debt tables and signature blocks.
     - Priority email recovery templates.
3. **Founder Lifetime Deal ($79 one-time payment)**:
   - Target: Agency owners, established consultants, long-term operators.
   - Entitlements:
     - All Pro Tier capabilities in perpetuity with zero recurring subscription charges.
     - Commercial agency license: recover on behalf of multiple corporate entities, subsidiaries, or subcontractors.
     - Custom institutional letterhead header / branding configuration.
     - Future roadmap access (e.g. direct Zapier/Make webhook hooks).

### 3.2 Paywall Triggers & Conversion Touchpoints
The application enforces strict, polite, high-converting paywall boundaries:
1. **The Quota Gate (4th Generation Attempt)**:
   - When a Free user clicks "Generate Letter" for the 4th time in a billing month, the server returns an `HTTP 402 Payment Required` payload:
     ```json
     {
       "statusCode": 402,
       "error": "QuotaExceeded",
       "message": "You have utilized your 3 free recovery letters for this month. Upgrade to Pro for unlimited generation.",
       "currentUsage": 3,
       "limit": 3
     }
     ```
   - The UI intercepts this status code and presents the high-craft `UpgradeModal` with tailored ROI copy ("Recover $14,200 for just $29").
2. **The Stage 4 Legal LBA Paywall Trigger**:
   - Selecting **Stage 4: Formal Legal Demand for Payment (Letter Before Action)** on the escalation selector displays an institutional lock badge for Free tier users. Clicking to generate or preview Stage 4 opens the `UpgradeModal` emphasizing small-claims legal readiness and statutory interest recovery.
3. **The 48-Hour Fast-Settlement Lock**:
   - Toggling the "48-Hour Fast-Settlement Discount" switch on locked tiers triggers the `UpgradeModal` detailing how conditional discounts recover cash 3.8x faster.
4. **The PDF Letterhead Export Lock**:
   - While Free users can copy plain email text, clicking "Download Formal PDF Letterhead" triggers the Pro paywall modal.

### 3.3 Commercial Payment Infrastructure
- **Stripe Integration Flow**:
  - `POST /api/checkout`: Initiates a Stripe Checkout Session with `price_id` for Pro Monthly ($29) or Founder LTD ($79). Returns `{ checkoutUrl: string }`.
  - `POST /api/webhooks/stripe`: Robust, idempotent webhook listener processing:
    - `checkout.session.completed` -> Flips tenant entitlement in database to `PRO` or `LIFETIME`.
    - `customer.subscription.updated` -> Updates subscription status.
    - `customer.subscription.deleted` -> Reverts tenant entitlement to `FREE`.
  - `POST /api/portal`: Redirects subscribed Pro users to the Stripe Customer Billing Portal for payment method updates and tax receipt downloads.
- **Zero-Friction Developer Sandbox Mode**:
  - When Stripe API keys (`STRIPE_SECRET_KEY`) are unconfigured or when the user is operating in testing mode, an in-app **"Simulate Pro Upgrade (Sandbox)"** action is available directly in the `UpgradeModal` and top header.
  - Clicking this toggle executes `POST /api/sandbox/toggle-pro`, instantaneously toggling the active session's entitlement between `FREE` and `PRO` without external network dependencies.
  - This guarantees 100% testability, deterministic QA reviews, and offline product demonstrations.

---

## 4. User Stories & Gherkin Acceptance Criteria

```
+----------------------------------------------------------------------------------------------------+
|                                      CORE USER WORKFLOWS                                           |
+----------------------------------------------------------------------------------------------------+
| [1. Ledger & Matrix] ---> [2. Statutory Calculator] ---> [3. 4-Stage Escalation]                  |
|    - 4 Aging Buckets          - UK BoE + 8% + £40-£100       - Stage 1: Courtesy Nudge            |
|    - Realistic Presets        - EU ECB + 8% + €40            - Stage 2: Admin Statement           |
|    - Real-time Ledger Totals  - US Prompt Payment Rate       - Stage 3: Statutory Accrual Warning |
|                                                              - Stage 4: Formal Legal Demand (LBA) |
+----------------------------------------------------------------------------------------------------+
|                                                 |                                                  |
|                        +------------------------+------------------------+                         |
|                        |                                                 |                         |
|                        v                                                 v                         |
|           [4. Fast-Settlement Discount]                      [5. Dual-Format Export]               |
|              - 48-72h Wire Offer                                - Formal Letterhead PDF            |
|              - Strict Contingent Waiver                         - 1-Click Clipboard Email          |
|                        |                                                 |                         |
|                        +------------------------+------------------------+                         |
|                                                 |                                                  |
|                                                 v                                                  |
|                           [6. Quota Gating & Stripe Monetization]                                  |
|                              - 3 Free Letters / Mo Tracking                                        |
|                              - HTTP 402 Paywall Modal                                              |
|                              - Stripe Checkout & Sandbox Sim                                       |
+----------------------------------------------------------------------------------------------------+
```

### 4.1 Feature 1: Aging Invoice Ledger & Delinquency Matrix

#### User Story
> **As an** agency owner or independent contractor,  
> **I want** to track my unpaid invoices categorized into standardized aging buckets with instant sample data,  
> **So that** I have immediate visibility over overdue principal, accrued statutory interest, and recovery priorities.

#### Acceptance Criteria (Gherkin)

```gherkin
Feature: Aging Invoice Ledger & Delinquency Matrix

  Scenario: Initial view loads with realistic commercial sample invoices
    Given the user navigates to the InvoiceRecovery Studio dashboard
    When the application initializes for the first time
    Then the system displays the Delinquency Matrix with 4 distinct aging buckets:
      | Bucket Name             | Age Range       | Severity Marker   |
      | Grace & Courtesy Window | 1-14 Days       | Neutral Slate     |
      | Administrative Delay    | 15-30 Days      | Informational Blue|
      | Critical Delinquency    | 31-60 Days      | Amber Warning     |
      | Default & Pre-Action    | 60+ Days        | Crimson Overdue   |
    And the user sees 3 realistic pre-loaded commercial sample invoices:
      | Debtor Name          | Amount    | Days Overdue | Jurisdiction |
      | Apex Digital Branding| $8,500.00 | 45 Days      | US           |
      | OmniCloud Solutions  | £14,200.00| 18 Days      | UK           |
      | Vanguard Consulting  | €4,800.00 | 72 Days      | EU           |
    And the Ledger Summary Card displays the calculated sums for Total Principal, Accrued Interest, and Total Recoverable Debt.

  Scenario: User filters invoices by delinquency bucket
    Given the ledger contains invoices across multiple delinquency buckets
    When the user clicks the "31-60 Days (Critical)" filter tab
    Then the invoice list dynamically updates within 150ms to show only invoices between 31 and 60 days overdue
    And the filter tab displays the count and sum of invoices in that category.

  Scenario: User adds a custom invoice to the ledger
    Given the user is on the ledger screen
    When the user clicks "Add Invoice"
    And fills in:
      | Field Name       | Value                |
      | Debtor Name      | Meridian Logistics   |
      | Invoice Reference| INV-2026-089         |
      | Principal Amount | 6200.00              |
      | Currency         | GBP                  |
      | Issue Date       | 2026-08-15           |
      | Due Date         | 2026-09-14           |
      | Jurisdiction     | UK                   |
    And submits the form
    Then the new invoice appears in the ledger with dynamically calculated days overdue
    And the statutory interest and compensation fee are automatically computed
    And the ledger totals immediately reflect the added balance.

  Scenario: User deletes or marks an invoice as recovered
    Given an unpaid invoice exists in the ledger
    When the user clicks "Mark as Recovered"
    Then the invoice status updates to "Recovered" with an Emerald badge
    And the Recovered Amount metric increments
    And a confirmation toast appears confirming the recovery.
```

---

### 4.2 Feature 2: Multi-Jurisdiction Statutory Late Interest & Penalty Calculator

#### User Story
> **As a** creditor operating in the UK, EU, or US,  
> **I want** to calculate statutory interest and mandatory debt recovery compensation fees compliant with regional laws,  
> **So that** I claim my full legal entitlement and provide undisputed financial calculations to the debtor.

#### Acceptance Criteria (Gherkin)

```gherkin
Feature: Multi-Jurisdiction Statutory Interest & Penalty Calculation

  Scenario Outline: UK Late Payment of Commercial Debts Act 1998 calculation
    Given an invoice governed by UK commercial law with principal <Principal> and days overdue <DaysOverdue>
    When the statutory calculation engine evaluates the claim using Bank of England base rate 5.25% plus 8.00% statutory margin (total 13.25% per annum)
    Then the daily interest rate is calculated as (Principal * 0.1325) / 365
    And the total accrued interest equals daily interest * <DaysOverdue> rounded to 2 decimal places
    And the fixed statutory compensation fee matches <ExpectedFee>:
      | Debt Band           | Fee   |
      | Under £1,000        | £40   |
      | £1,000 to £9,999.99 | £70   |
      | £10,000 or greater  | £100  |

    Examples:
      | Principal | DaysOverdue | ExpectedFee |
      | 750.00    | 30          | 40.00       |
      | 4500.00   | 45          | 70.00       |
      | 14200.00  | 65          | 100.00      |

  Scenario: European Union Directive 2011/7/EU calculation
    Given an invoice governed by EU law with principal €5,000.00 and 40 days overdue
    When the statutory calculation engine evaluates the claim using ECB rate 3.75% plus 8.00% minimum margin (total 11.75% per annum)
    Then the accrued interest is calculated pro-rata as (€5,000 * 0.1175 / 365) * 40 = €64.38
    And a mandatory statutory recovery compensation fee of €40.00 is added automatically
    And the total recoverable claim is displayed as €5,104.38.

  Scenario: United States Prompt Payment Act & Commercial Statutory calculation
    Given an invoice governed by US commercial rules with principal $8,500.00 and 50 days overdue
    When the calculation engine applies the default commercial rate of 1.0% per month (12.0% per annum)
    Then the daily interest is ($8,500 * 0.12) / 365 = $2.7945 per day
    And the accrued interest for 50 days is $139.73
    And the statutory fee is set to $0.00 (unless contractually stipulated)
    And the total legal balance displays as $8,639.73.
```

---

### 4.3 Feature 3: 4-Stage Progressive Escalation Sequence Generator

#### User Story
> **As a** service provider seeking payment,  
> **I want** to generate calibrated, professional recovery notices corresponding to the severity of the debt delay,  
> **So that** I preserve positive client relations early on while possessing an escalating legal hammer if delinquency persists.

#### Acceptance Criteria (Gherkin)

```gherkin
Feature: 4-Stage Progressive Escalation Sequence Generator

  Scenario: Selecting an escalation stage dynamically adjusts tone and content
    Given an invoice is selected from the ledger
    When the user clicks through each escalation stage tab:
      | Stage | Title                     | Days Window | Tone                |
      | 1     | Courtesy Check-in         | 1-14 Days   | Friendly, polite    |
      | 2     | Firm Administrative Notice| 15-30 Days  | Structured, neutral |
      | 3     | Statutory Interest Warning| 31-60 Days  | Stern, financial    |
      | 4     | Formal Legal Demand (LBA) | 60+ Days    | Strict, pre-action  |
    Then the live document preview updates in real time (< 50ms)
    And dynamically interpolates debtor name, invoice reference, principal, accrued interest, statutory compensation fee, and remittance instructions
    And contains ZERO emojis, generic placeholder fluff, or conversational AI cliches.

  Scenario: Free user accesses Stage 1 and Stage 2
    Given a user on the Free Starter tier
    When the user selects Stage 1 or Stage 2
    Then the full text is visible, editable, and copyable to clipboard.

  Scenario: Free user attempts to generate Stage 4 Formal Legal Demand (Letter Before Action)
    Given a user on the Free Starter tier
    When the user clicks on the "Stage 4: Formal Legal Demand (LBA)" tab
    Then the preview displays an institutional blurred lock overlay
    And an upgrade banner states: "Stage 4 Letter Before Action with small-claims statutory citations is a Pro feature"
    And clicking "Unlock Stage 4 Demand" opens the UpgradeModal with checkout options.

  Scenario: Pro user generates Stage 4 Formal Legal Demand
    Given an authenticated user with Pro or Lifetime entitlement
    When the user selects Stage 4 for an invoice 65 days overdue
    Then the preview renders a formal pre-action legal notice citing:
      - The formal 7-calendar-day deadline for settlement.
      - The statutory legislation (e.g. UK Late Payment of Commercial Debts Act 1998 / Senior Courts Act 1981 Section 35A).
      - Itemized breakdown of Principal, Accrued Daily Interest, and Fixed Recovery Fee.
      - Clear notification that failure to settle will result in Small Claims Court filing and credit reporting without further notice.
```

---

### 4.4 Feature 4: Fast-Settlement 48-Hour Conditional Discount Generator

#### User Story
> **As a** business operator needing urgent cash flow,  
> **I want** to offer a time-limited 5%–10% discount on the principal balance conditioned on immediate wire transfer within 48 hours,  
> **So that** I incentivize the debtor to settle instantly while legally preserving my right to the full amount if they fail to pay.

#### Acceptance Criteria (Gherkin)

```gherkin
Feature: Fast-Settlement 48-Hour Conditional Discount Generator

  Scenario: Enabling the fast-settlement discount builder
    Given a Pro user is reviewing an escalation letter for a $10,000.00 invoice
    When the user toggles "48-Hour Fast-Settlement Discount" to ON
    And adjusts the discount slider to 8%
    Then the computed settlement amount updates to $9,200.00 (Savings: $800.00)
    And the expiration deadline is automatically calculated as exactly 48 hours from current timestamp
    And the settlement section is inserted into the letter text with strict legal conditional phrasing:
      """
      CONDITIONAL PROMPT SETTLEMENT OFFER:
      As a commercial courtesy to facilitate immediate accounts closure, Creditor offers a conditional
      concession of 8.0% ($800.00). Remittance of exactly $9,200.00 received in cleared funds prior to
      [Timestamp + 48h] shall constitute full and final satisfaction of this invoice.

      STRICT CONDITIONAL WAIVER NOTICE:
      Failure to remit the discounted amount in cleared funds prior to the stated deadline shall immediately
      render this offer null and void. The full principal balance of $10,000.00 plus accrued statutory interest
      and recovery fees shall remain due and payable in full without further notice.
      """

  Scenario: Free user attempts to enable fast-settlement discount
    Given a user on the Free Starter tier
    When the user clicks the "48-Hour Fast-Settlement Discount" toggle
    Then the toggle remains in the OFF position
    And the UpgradeModal appears highlighting the fast-settlement liquidity feature.
```

---

### 4.5 Feature 5: Dual-Format Export: Printable PDF Letterhead & 1-Click Clipboard Email

#### User Story
> **As a** professional creditor,  
> **I want** to export recovery letters either as formal printable PDF documents with header blocks or as formatted email text,  
> **So that** I can send an immediate email or serve a formal paper/PDF notice attached to a registered legal communication.

#### Acceptance Criteria (Gherkin)

```gherkin
Feature: Dual-Format Export

  Scenario: Copying formatted email text to clipboard
    Given a user on any tier is viewing a generated recovery letter
    When the user clicks "Copy Email to Clipboard"
    Then the subject line and body text are copied to the system clipboard
    And a subtle confirmation notification appears ("Email copied to clipboard with subject line")
    And the clipboard text preserves clean email spacing, debtor salutations, itemized ledger figures, and wire payment coordinates.

  Scenario: Exporting formal PDF letterhead on Pro tier
    Given an authenticated user with Pro or Lifetime entitlement
    When the user clicks "Download Formal PDF Letterhead"
    Then the browser initiates a clean, print-styled PDF rendering
    And the output document includes:
      - Formal creditor header block (Company Name, Registration, Address, Contact).
      - Debtor billing address and registered company identifier.
      - Formal date stamp and notice title ("FORMAL NOTICE OF OVERDUE ACCOUNT / LETTER BEFORE ACTION").
      - Tabular financial summary (Principal, Days Overdue, Statutory Interest, Legal Fees, Total Due).
      - Remittance wire coordinates (IBAN / BIC / ABA Routing / Account Number).
      - Creditor signature and declaration block.
    And the print stylesheet strips all web UI navigation, buttons, and app frames.

  Scenario: Free user attempts PDF export
    Given a user on the Free Starter tier
    When the user clicks "Download Formal PDF Letterhead"
    Then no PDF is generated
    And the UpgradeModal is displayed with Pro PDF export highlighted.
```

---

### 4.6 Feature 6: Built-in Monetization, Quota Gating & Stripe Sandbox Simulation

#### User Story
> **As a** platform administrator and user,  
> **I want** automatic quota tracking with seamless Stripe Checkout upgrades and an instant sandbox simulation fallback,  
> **So that** free users can convert effortlessly to paid tiers and engineers/evaluators can test the complete Pro workflow without live payment friction.

#### Acceptance Criteria (Gherkin)

```gherkin
Feature: Built-in Monetization, Quota Gating & Stripe Checkout

  Scenario: Free user consumes monthly quota and encounters HTTP 402
    Given a user on the Free Starter tier has already generated 3 letters this month
    When the user clicks "Generate Recovery Letter" for a 4th time
    Then the client sends a POST request to "/api/letters/generate"
    And the server responds with HTTP 402 Payment Required:
      """
      {
        "statusCode": 402,
        "error": "QuotaExceeded",
        "currentUsage": 3,
        "limit": 3
      }
      """
    And the UI displays the UpgradeModal
    And the modal presents two clear purchasing options:
      | Plan Name            | Pricing          | Badge               | Primary Action Button      |
      | Pro Monthly          | $29 / month      | Most Flexible       | "Upgrade to Pro Monthly"   |
      | Founder Lifetime Deal| $79 one-time     | Best Value (Save 75%)| "Get Lifetime Access ($79)"|

  Scenario: User initiates Stripe Checkout
    Given a user clicks "Upgrade to Pro Monthly" or "Get Lifetime Access" in the UpgradeModal
    When the application calls "POST /api/checkout" with the chosen plan
    Then if valid Stripe keys are detected:
      - The server returns `{ checkoutUrl: "https://checkout.stripe.com/c/pay/cs_test_..." }`
      - The user's browser redirects to the secure hosted Stripe Checkout page.

  Scenario: Sandbox simulation fallback for testing and demo evaluation
    Given Stripe keys are unconfigured or the user prefers to test the demo environment
    When the user clicks "Simulate Pro Upgrade (Sandbox)" in the UpgradeModal or header
    Then the client sends "POST /api/sandbox/toggle-pro"
    And the server updates the current session entitlement to "PRO"
    And the client reactive state updates instantaneously without a page reload
    And all Pro badges, Stage 4 LBA generators, PDF letterhead exports, and settlement discount controls unlock immediately
    And a notification confirms: "Sandbox Mode: Pro entitlements activated successfully".
```

---

## 5. Standards 4.0 Design & Quality System

### 5.1 Visual Direction & Palette Tokens
InvoiceRecovery Studio embodies an **authoritative, institutional financial tone**. The interface resembles Bloomberg Law, Stripe Invoicing, or Carta—crisp, reliable, and entirely devoid of cartoonish or casual design elements.

```
+----------------------------------------------------------------------------------------------------+
|                                      DESIGN TOKEN SPECIFICATIONS                                   |
+----------------------------------------------------------------------------------------------------+
| Token Name             | Hex Code   | Semantic UI Application                                      |
+------------------------+------------+--------------------------------------------------------------+
| Canvas Background      | #f8fafc    | Page canvas, subtle warm stone/slate base (`bg-slate-50`)     |
| Surface Container      | #ffffff    | Card surfaces, modals, data tables (`bg-white`)              |
| Border / Separators    | #e2e8f0    | Clean hairline container borders (`border-slate-200`)        |
| Typography Primary     | #0f172a    | High-contrast titles, headers, table figures (`text-slate-900)|
| Typography Secondary   | #64748b    | Subtitles, field labels, metadata (`text-slate-500`)         |
| Primary Action Surface | #0f172a    | Executive primary buttons (`bg-slate-900 hover:bg-slate-800`)|
| Emerald Recovered      | #059669    | Recovered badges, successful settlement indicators           |
| Amber Warning          | #d97706    | 31-60d delinquency markers, statutory interest warnings      |
| Crimson Overdue        | #dc2626    | 60+d critical delinquency, pre-action legal notice badges    |
| Selection Focus Ring   | #2563eb    | Accessible keyboard focus indicators                         |
+----------------------------------------------------------------------------------------------------+
```

### 5.2 Strict Zero-AI-Slop & Zero-Emoji Guidelines
1. **Strictly 0 Emojis**: Emojis are categorically forbidden across all buttons, badges, navigation items, page headers, tables, toasts, and empty states.
   - *Forbidden*: 🚀 💰 ⚠️ 📄 ❌ 🔒 ⚡️ 🎉
   - *Required*: 100% semantic Lucide SVG stroke icons (`Scale`, `FileText`, `AlertTriangle`, `Clock`, `ShieldAlert`, `DollarSign`, `CheckCircle2`, `Download`, `Copy`, `Lock`, `Sparkles`, `Building2`, `ArrowRight`).
2. **Tabular Numerics**: All currency values, principal numbers, interest rates, and overdue days must use monospace tabular alignment (`font-mono tracking-tight`) to ensure clean vertical alignment across columns.
3. **Natural Human & Legal Copy**: UI text must be authoritative, concise, and professional. Ban generic AI buzzwords such as "Revolutionize your receivables", "Supercharge your cash flow", or "AI-powered magic". Use crisp commercial terminology: *"Statutory Debt Recovery"*, *"Delinquency Aging Matrix"*, *"Accrued Statutory Interest"*, *"Letter Before Action"*.

### 5.3 Micro-Interactions, Motion & Headless Primitives
- **Headless UI**: Built on **Radix Vue** headless primitives (`Dialog`, `DropdownMenu`, `Tabs`, `Tooltip`, `Select`, `Switch`) for bulletproof WAI-ARIA accessibility and keyboard navigation.
- **Micro-Transitions**: All state transitions (tab changes, accordion expands, button hovers) use sub-200ms ease-out transitions (`transition-all duration-150 ease-out`).
- **Reduced Motion**: Full compliance with `@media (prefers-reduced-motion: reduce)`. When enabled, animations collapse to instantaneous cuts.

---

## 6. Technical Architecture & Data Model

### 6.1 Lightweight Technology Stack
- **Framework**: Nuxt 3 (v3.14+) using Vue 3 Composition API with strict TypeScript (`<script setup lang="ts">`).
- **CSS Framework**: Tailwind CSS with custom theme variables matching Section 5 design tokens.
- **ORM & Database**: Prisma ORM paired with a lightweight, serverless SQLite database located at `/tmp/dev.db`. Zero setup, instantly initialized on local machines and serverless edge hosts.
- **Package Manager**: `pnpm` exclusively.
- **State Management**: Vue 3 `ref` and `computed` reactive state composables (`useInvoices()`, `useEntitlements()`, `useCalculator()`).
- **PDF Generation**: Browser-native print stylesheet / headless HTML-to-print canvas formatted for standard A4 and US Letter margins.

### 6.2 Prisma Database Schema
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:/tmp/dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model UserTenant {
  id               String           @id @default(uuid())
  email            String           @unique
  organizationName String           @default("Independent Studio")
  tier             String           @default("FREE") // "FREE", "PRO", "LIFETIME"
  lettersUsedMonth Int              @default(0)
  quotaResetDate   DateTime         @default(now())
  stripeCustomerId String?
  subscriptionId   String?
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt
  invoices         Invoice[]
  letters          RecoveryLetter[]
}

model Invoice {
  id                   String           @id @default(uuid())
  tenantId             String
  debtorName           String
  debtorEmail          String?
  debtorAddress        String?
  debtorCompanyNumber  String?
  invoiceReference     String
  principalAmount      Float
  currency             String           @default("USD") // "USD", "GBP", "EUR"
  issueDate            DateTime
  dueDate              DateTime
  status               String           @default("DELINQUENT") // "DELINQUENT", "RECOVERED", "WRITTEN_OFF"
  jurisdiction         String           @default("US") // "US", "UK", "EU"
  notes                String?
  createdAt            DateTime         @default(now())
  updatedAt            DateTime         @updatedAt
  tenant               UserTenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  recoveryLetters      RecoveryLetter[]
}

model RecoveryLetter {
  id                   String           @id @default(uuid())
  tenantId             String
  invoiceId            String
  stage                Int              // 1, 2, 3, 4
  title                String
  recipientEmail       String?
  principalSnapshot    Float
  interestSnapshot     Float
  statutoryFeeSnapshot Float
  totalClaimSnapshot   Float
  fastSettlementActive Boolean          @default(false)
  settlementDiscountPct Float?
  settlementAmount     Float?
  settlementDeadline   DateTime?
  letterContent        String
  exportedPdf          Boolean          @default(false)
  copiedEmail          Boolean          @default(false)
  createdAt            DateTime         @default(now())
  tenant               UserTenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  invoice              Invoice          @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
}
```

### 6.3 Server API Route Specifications
| Route | Method | Purpose & Payload |
| :--- | :--- | :--- |
| `/api/invoices` | `GET` | Fetches all invoices for current tenant with calculated aging statistics. |
| `/api/invoices` | `POST` | Creates a new invoice record in `/tmp/dev.db`. |
| `/api/invoices/:id` | `PUT` | Updates invoice details or marks status as `RECOVERED`. |
| `/api/invoices/:id` | `DELETE` | Removes invoice from ledger. |
| `/api/invoices/seed` | `POST` | Seeds realistic preset sample invoices (Apex Digital, OmniCloud, Vanguard). |
| `/api/calculate-interest` | `POST` | Deterministic computation endpoint for principal, days, and statutory jurisdiction. |
| `/api/letters/generate` | `POST` | Evaluates monthly quota; generates calibrated letter text; returns HTTP 402 if quota exceeded. |
| `/api/checkout` | `POST` | Generates Stripe Checkout hosted URL for Pro Monthly ($29) or Founder LTD ($79). |
| `/api/sandbox/toggle-pro` | `POST` | Instantaneously toggles current session between `FREE` and `PRO` for testing/evaluation. |
| `/api/webhooks/stripe` | `POST` | Handles Stripe lifecycle events (`checkout.session.completed`, etc.). |

---

## 7. Explicit MVP Boundaries (In-Scope vs. Out-of-Scope)

```
+----------------------------------------------------------------------------------------------------+
|                                    MVP BOUNDARIES MATRIX                                           |
+----------------------------------------------------------------------------------------------------+
| IN-SCOPE (Production MVP Deliverable)          | OUT-OF-SCOPE (Future v2+ Roadmap)                 |
+------------------------------------------------+---------------------------------------------------+
| - Interactive Aging Delinquency Matrix (4 bins)| - Automated SMTP / SendGrid email sending daemon  |
| - Pre-loaded realistic sample invoices         | - Live OAuth2 integrations with Xero or QuickBooks|
| - Statutory Interest Engine (UK, EU, US)       | - Automated credit bureau debt reporting API      |
| - 4-Stage Progressive Escalation Generator     | - Small claims court automated digital e-filing   |
| - Fast-Settlement 48-Hour Conditional Discount | - ACH direct debtor bank account debit pulls      |
| - Dual Export: PDF Letterhead & Rich Email Text| - Multi-currency real-time FX conversions         |
| - 3-Letter Free Quota with HTTP 402 Modal      | - Multi-user role permissions (RBAC / sub-teams)  |
| - Stripe Checkout & Sandbox Sim Entitlement    | - Native mobile iOS / Android applications        |
| - Radix Vue primitives & 100% Lucide Icons     | - Automated recurring WhatsApp / SMS dunning      |
+----------------------------------------------------------------------------------------------------+
```

### 7.1 In-Scope (MVP Deliverables)
1. **Interactive Delinquency Matrix**: Visual 4-bucket grouping (1-14d, 15-30d, 31-60d, 60+d) with live summary cards for Total Outstanding Principal, Accrued Statutory Interest, Statutory Compensation, and Total Claim.
2. **Preset Sample Seed Loader**: 1-click button to load realistic commercial scenarios with realistic currencies and overdue ages.
3. **Deterministic Statutory Calculator**: Accurate implementations of the UK 1998 Late Payment Act (£40/£70/£100 fee tiers), EU Directive 2011/7/EU (€40 fee), and US Prompt Payment rates.
4. **4-Stage Progressive Escalation Generator**: Reactive drafting tool producing courteous nudges, administrative statements, statutory warnings, and formal legal demands.
5. **Conditional 48-Hour Discount Builder**: Configurable discount slider with strict conditional legal phrasing.
6. **Dual Export Pipeline**: High-craft formal letterhead view optimized for print/PDF export and 1-click rich-text email copy.
7. **Complete Monetization & Sandbox Engine**:
   - Quota tracking logic (Free tier: 3 letters/mo).
   - HTTP 402 status code responses triggering `UpgradeModal`.
   - Stripe Checkout initiation endpoint.
   - Immediate in-app Sandbox Simulation toggle enabling instant Pro capability evaluation without API keys.

### 7.2 Out-of-Scope (Deferred to Post-MVP)
- Direct SMTP/SendGrid background email dispatching (users copy and send via their verified email client).
- Two-way accounting software sync (Xero, QuickBooks, FreshBooks API webhooks).
- Automated court claim filing (HMCTS Money Claim Online or US Small Claims e-file APIs).
- Direct debt collection agency forwarding or debtor credit score reporting.

---

## 8. Success Metrics & Key Performance Indicators (KPIs)

```
+----------------------------------------------------------------------------------------------------+
|                                    KEY PERFORMANCE INDICATORS                                      |
+----------------------------------------------------------------------------------------------------+
| Metric Name                    | Target Benchmark   | Measurement Methodology                      |
+--------------------------------+--------------------+----------------------------------------------+
| Time to First Value (TTFV)     | < 60 seconds       | Time from page load to first letter preview  |
| Free-to-Paid Conversion Rate   | > 4.5%             | Upgrades triggered per active Free users     |
| Paywall Modal Click-Through    | > 22.0%            | Clicks on checkout / sandbox sim in modal    |
| Letter Utilization Rate        | > 85.0%            | Ratio of letters exported (PDF or copied)    |
| Average Recovered Amount       | > $4,200 / user    | Total debt value transitioned to "Recovered" |
+----------------------------------------------------------------------------------------------------+
```

1. **Time to First Value (TTFV)**: Target **< 60 seconds**. A first-time user can review pre-seeded invoices, test the statutory interest calculator, and preview a stage-specific recovery letter within one minute of landing on the application.
2. **Free-to-Paid Conversion Rate**: Target **> 4.5%** of monthly active creditors converting to Pro Monthly ($29/mo) or Founder Lifetime Deal ($79).
3. **Paywall Engagement Rate**: **> 22%** click-through rate from the `UpgradeModal` to Stripe Checkout or Sandbox Simulation.
4. **User Trust & Brand Authority**: Zero visual regressions, 0 unhandled exceptions, zero emojis, and 100% adherence to Standards 4.0 design tokens.

---

## 9. Implementation Roadmap & Verification Checklist

- [ ] **Phase 1: Project Scaffolding & Dependencies**
  - Initialize Nuxt 3 with TypeScript, Tailwind CSS, Radix Vue primitives, and Lucide Vue Next.
  - Setup Prisma schema with SQLite `/tmp/dev.db` database and seed scripts.
- [ ] **Phase 2: Statutory Calculation Core**
  - Build pure TypeScript interest calculator supporting UK, EU, and US statutory formulas and compensation tiers with unit tests.
- [ ] **Phase 3: Delinquency Matrix & Ledger UI**
  - Implement aging bucket summary cards, filtering tabs, invoice data table, and 1-click sample scenario seed loader.
- [ ] **Phase 4: 4-Stage Progressive Escalation Engine**
  - Develop reactive letter preview with stage selector tabs, dynamic token interpolation, and 48-hour discount builder.
- [ ] **Phase 5: Dual Export & Print Formatting**
  - Implement clipboard email copy utility with confirmation feedback and clean CSS print stylesheet for letterhead PDF download.
- [ ] **Phase 6: Monetization, Quota Tracking & Stripe / Sandbox Flow**
  - Enforce 3-letter Free quota limit with HTTP 402 interceptor.
  - Implement `UpgradeModal` with plan comparison.
  - Connect `/api/checkout` and provide in-app `/api/sandbox/toggle-pro` entitlement simulator.
- [ ] **Phase 7: QA & Standards 4.0 Polish**
  - Verify zero emojis, high-contrast light theme, responsive layout, and seamless end-to-end user experience.
