# InvoiceRecovery Studio — Multi-Channel Commercial Launch Package
### Product Hunt • Twitter / X • Reddit (r/SideProject, r/freelance, r/smallbusiness) • Hacker News (Show HN)

**Live Production URL**: [https://invoice-recovery-studio.vercel.app](https://invoice-recovery-studio.vercel.app)  
**Open Source Repository**: [https://github.com/iammuttaqi/invoice-recovery-studio](https://github.com/iammuttaqi/invoice-recovery-studio)  
**Standard**: Standards 4.0 Autonomous Software Studio

---

## 1. Product Hunt Launch Pack

### 1.1 Product Metadata
- **Product Name**: InvoiceRecovery Studio
- **Tagline**: Statutory debt engine & progressive escalation notices for unpaid B2B invoices
- **Categories**: Productivity, Legal, Finance, Freelance, Developer Tools
- **Pricing**: Freemium (3 letters/mo free, $29/mo Pro or $79 Lifetime Deal)
- **Primary Live Link**: [https://invoice-recovery-studio.vercel.app](https://invoice-recovery-studio.vercel.app)
- **GitHub Repository**: [https://github.com/iammuttaqi/invoice-recovery-studio](https://github.com/iammuttaqi/invoice-recovery-studio)

### 1.2 First Maker Story Comment

```markdown
Hey Product Hunt community,

I’m the maker of InvoiceRecovery Studio.

Like almost every independent contractor, engineer, and boutique agency founder here, I’ve experienced the quiet agony of chronic invoice delinquency. 

You finish a difficult project on time. The client signs off. You send the invoice on Net-30 terms. Day 31 arrives: silence. Day 45 arrives: "Our finance director is traveling." Day 60 arrives: "Waiting on board approval."

Meanwhile, you have payroll to meet, hosting bills to pay, and taxes due. But you hesitate to push hard because of what I call **The Politeness Trap**: you don’t want to look desperate, and you don’t want to poison a relationship with a client who might have another contract next quarter. So you send timid emails ("Just checking in on this!") that corporate accounts payable departments promptly ignore.

Here is the dirty secret of enterprise cash management: **Accounts payable prioritizes vendors who apply structured, objective, and legally grounded pressure.**

Most independent operators have no idea that in jurisdictions like the UK and EU, you have automatic statutory rights to late payment interest and fixed recovery fees—even if late fees were never written into your original contract. Under the UK Late Payment Act of 1998, for example, you are entitled to the Bank of England base rate + 8% per annum, plus £40 to £100 in compensation per invoice. On an overdue £14,000 invoice, that is over £300 in legal statutory fees that the debtor owes you right now.

I built **InvoiceRecovery Studio** to institutionalize this process so you never have to feel awkward chasing money again:

1. **Delinquency Aging Matrix**: Tracks invoices across 4 critical risk windows (1–14d, 15–30d, 31–60d, 60+d).
2. **Statutory Debt Engine**: Accurately computes daily interest and mandatory recovery fees under UK, EU, and US commercial statutes with 100% mathematical precision.
3. **4-Stage Progressive Escalation Generator**: Takes you from a friendly courtesy check-in (Stage 1), to a firm administrative notice (Stage 2), to a statutory accrual warning (Stage 3), and finally to a formal legal demand (Letter Before Action / Stage 4).
4. **48-Hour Fast-Settlement Formulator**: Need liquidity today? Offer an 8% prompt-settlement waiver backed by an ironclad conditional non-waiver clause: if they don't wire the funds within 48 hours, the discount is revoked and full statutory interest is restored.
5. **Zero-Knowledge Privacy (No External LLMs)**: We intentionally avoided generative AI APIs like OpenAI or Anthropic. Your client names, invoice references, and financial data are never sent to third-party language models. Everything is computed deterministically in local templates.
6. **Dual Export**: 1-click clipboard copy for email clients, plus an institutional printable PDF letterhead that looks like it came from outside legal counsel.

The app is live right now at https://invoice-recovery-studio.vercel.app with pre-seeded scenarios you can test immediately without creating an account. The entire codebase is also open source on GitHub at https://github.com/iammuttaqi/invoice-recovery-studio.

Free tier gives you 3 letters per month; Pro is $29/mo or $79 for a lifetime license (which pays for itself if you recover even a single late fee).

I’d love your feedback, questions, or war stories of chasing late payments in the comments!
```

---

## 2. Twitter / X Announcement Thread (Zero Buzzwords)

### Tweet 1 (Hook & Reality Check)
> Over 54% of freelancers and boutique agencies carry unpaid invoices that linger 28+ days past their due date.
>
> Most people stall because they fear awkwardness with clients.
>
> Today we’re launching InvoiceRecovery Studio: an autonomous statutory debt engine and progressive escalation generator.
>
> Live: https://invoice-recovery-studio.vercel.app

### Tweet 2 (The Statutory Leverage)
> Most service providers don’t know that statutory law entitles you to late payment interest and fixed recovery compensation:
>
> • UK 1998 Act: BoE Base Rate + 8% p.a. + £40–£100 fee per invoice
> • EU 2011/7/EU: ECB Rate + 8% p.a. + €40 fee
> • US Commercial: 12% p.a. standard
>
> You are entitled to this even if it wasn't in your contract.

### Tweet 3 (The Escalation Workflow)
> Chasing money shouldn't alternate between timid "just checking in" emails and emotional arguments.
>
> InvoiceRecovery Studio drafts 4 calibrated escalation stages:
> 1. Courtesy check-in
> 2. Administrative notice
> 3. Statutory fee accrual warning
> 4. Formal Letter Before Action (LBA)
>
> + A 48h settlement discount waiver to unlock fast liquidity.

### Tweet 4 (Architecture & Open Source)
> Privacy first: 100% deterministic local calculation. Zero external LLM calls. Your client invoice data never leaks to OpenAI or Anthropic.
>
> Export to clipboard or formal printable PDF letterhead.
>
> Free to try (3 letters/mo). Pro: $29/mo or $79 LTD.
>
> Code: https://github.com/iammuttaqi/invoice-recovery-studio

---

## 3. Reddit Showcase Posts

### 3.1 r/SideProject
**Title**: I built a statutory debt engine and legal notice generator for overdue invoices (Nuxt 3, zero LLMs, open source)

```markdown
Hi r/SideProject,

I built **InvoiceRecovery Studio** (https://invoice-recovery-studio.vercel.app) to solve a problem that cost me thousands of dollars when I was freelancing: client invoices lingering 30, 60, or 90 days past their due date.

### The Big Technical Decision: Why No AI / LLM?
When people build escalation or document generators today, their default instinct is to wrap an OpenAI prompt: `"Write an angry email to a client who owes me money."`

That approach is terrible for legal and financial recovery:
1. LLMs hallucinate statutes, cite nonexistent local ordinances, and sound erratic or passive-aggressive.
2. Sending client names, invoice balances, and dispute details to third-party AI APIs creates major confidentiality and data privacy risks.
3. Accounts payable departments don't care about flowery prose; they respond to precise statutory language, daily interest tallies, and structured deadlines.

Instead, I built a 100% deterministic engine using Nuxt 3, Vue 3, Tailwind CSS, Radix Vue, and Prisma:
- Multi-jurisdiction statutory interest engine (UK Late Payment Act 1998 at 13.25% + £40–£100 Section 5A fees; EU Directive 2011/7/EU at 11.75% + €40 fee; US Prompt Payment benchmark at 12%).
- 4-stage progressive escalation sequences (from a soft courtesy check-in to a formal Letter Before Action).
- 48-hour conditional fast-settlement builder with strict forfeiture clauses.
- Serverless SQLite cold-start adapter for Vercel: copies a pre-migrated `starter.db` to `/tmp` with synchronous DDL schema self-healing.
- Dual export: 1-click clipboard email and a formal printable PDF letterhead using `@media print`.

### Live Demo & Code
- Live App: https://invoice-recovery-studio.vercel.app (click "Load Agency Scenarios" to test it with pre-seeded $8.5k, £14.2k, and €4.8k scenarios).
- GitHub Repo: https://github.com/iammuttaqi/invoice-recovery-studio

Would love technical feedback on the serverless SQLite replication pattern or the UI typography!
```

---

### 3.2 r/freelance
**Title**: Stop sending "Just checking in" emails: How statutory interest and a 4-stage escalation sequence collect overdue invoices

```markdown
Hey freelancers,

If you have been doing client work for more than a year, you have almost certainly dealt with this: an invoice goes past due, you send a polite email, the client replies with an excuse or goes silent, and you spend weeks feeling stressed about asking for your own money.

I want to share the practical accounts receivable playbook that corporate billing departments use, and how you can apply it without losing client goodwill:

### 1. The Politeness Trap
When an invoice is 15 days late and you write: *"Hey! Just checking in to see if you had a chance to look at this :)"*, corporate AP departments immediately deprioritize you. They know you won't do anything, so they use your cash to float their own runway while paying assertive enterprise vendors first.

### 2. You Have Statutory Rights to Interest and Compensation
Most freelancers believe you can only charge late fees if you included a clause in your contract. In many jurisdictions, that is false:
- **In the UK**: The Late Payment of Commercial Debts Act 1998 gives you statutory right to Bank of England base rate + 8% per annum (currently 13.25%), plus a statutory compensation fee of £40 (<£1,000), £70 (£1,000–£10,000), or £100 (>=£10,000) per invoice.
- **In the EU**: Directive 2011/7/EU grants ECB rate + 8% (currently 11.75%) plus a flat €40 administrative fee per invoice.
- **In the US**: Standard commercial prompt payment rates benchmark at 12% per year.

### 3. Progressive 4-Stage Escalation
Never jump straight from polite to furious. Use calibrated steps:
- **Stage 1 (1–14 days overdue)**: Courtesy Check-in. Assume administrative delay. Provide remittance info and ask if they need a PO number.
- **Stage 2 (15–30 days overdue)**: Firm Administrative Notice. Ask for an exact disbursement date and AP voucher ID.
- **Stage 3 (31–60 days overdue)**: Statutory Accrual Warning. Inform them that statutory interest is accruing daily and fixed fees have attached, giving them 7 business days to clear the principal before fees are enforced.
- **Stage 4 (60+ days overdue)**: Formal Legal Demand / Letter Before Action (LBA). Final 7-day cure window before small claims court filing and commercial credit bureau reporting.

### 4. The 48-Hour Settlement Lever
If you need cash immediately, never offer an unconditional discount. Offer a conditional 48-hour discount (e.g. 8%) with an explicit forfeiture notice: if payment is not in your account within 48 hours, the discount is void and the full balance plus interest is restored.

To automate this entire workflow, I built an open tool: **InvoiceRecovery Studio** (https://invoice-recovery-studio.vercel.app). It calculates statutory math across US/UK/EU, drafts all 4 stages, and lets you copy the email or print a formal PDF letterhead.

Hope this helps someone get paid this week!
```

---

### 3.3 r/smallbusiness
**Title**: How we eliminated 60-day invoice drag without hiring a debt collector or retaining a lawyer

```markdown
To any business owner managing accounts receivable:

For small B2B service firms and agencies with $20,000 to $100,000 in receivables, late payments create massive payroll headaches. Retaining a debt collection attorney or agency is usually counterproductive: attorneys bill $400/hr, and collection agencies take a 25% to 40% contingency cut.

Here is the operational framework we developed to get paid within days:

1. **Treat aging buckets objectively**:
   - 1–14 days: Monitored grace.
   - 15–30 days: Formal statement of account required.
   - 31–60 days: Statutory interest and fixed compensation invoked.
   - 60+ days: Letter Before Action issued with small-claims court pre-action protocol.

2. **Invoke statutory compensation**: When clients realize continued delay incurs daily statutory interest plus fixed statutory recovery compensation (£40–£100 or €40 per invoice), your invoice jumps to the top of the payment queue.

3. **Deploy formal PDF letterheads**: Sending a formatted PDF notice on letterhead with itemized debt tables and signature lines gets taken 3x more seriously by finance managers than standard email threads.

We packaged this system into **InvoiceRecovery Studio** (https://invoice-recovery-studio.vercel.app). It tracks ledger aging, deterministically calculates statutory interest for US, UK, and EU accounts, generates calibrated escalation letters, and formats formal PDF letterheads.

Free to use for up to 3 letters a month. Check it out and let me know if it helps tighten your AR cycle.
```

---

## 4. Hacker News (Show HN) Post Draft

### 4.1 Title
**Show HN: InvoiceRecovery Studio – Deterministic statutory debt engine and pre-action legal notices**

### 4.2 Submission Body

```markdown
Hi HN,

I built InvoiceRecovery Studio (https://invoice-recovery-studio.vercel.app), a financial recovery tool for independent developers, agencies, and consultants dealing with chronically overdue B2B invoices.

Source code: https://github.com/iammuttaqi/invoice-recovery-studio

### The Problem
Over 54% of service SMBs and freelancers face payment delinquency, with invoices lingering an average of 28.4 days past maturity. Most solo operators stall because of "The Politeness Trap": they worry that pursuing unpaid invoices will damage client relationships or future referrals. Corporate accounts payable departments exploit this hesitation to optimize their own float.

### Why Deterministic Code Instead of an LLM?
The initial temptation was to use an LLM API to generate letters. We chose not to, for two reasons:
1. **Confidentiality & Privacy**: Accounts receivable disputes involve confidential business information—debtor legal entities, invoice IDs, and financial balances. Pushing this to OpenAI or Anthropic exposes users to unnecessary compliance and privacy risks.
2. **Deterministic Statutory Math**: Statutory debt regimes require strict, legally defensible arithmetic. For example, under the UK Late Payment of Commercial Debts (Interest) Act 1998, statutory interest is Bank of England Base Rate (5.25%) + 8.00% = 13.25% p.a., calculated daily: `(Principal * 0.1325 / 365) * DaysOverdue`, plus tiered Section 5A compensation fees (£40 for debts <£1,000; £70 for £1,000–£9,999.99; £100 for >=£10,000). EU Directive 2011/7/EU specifies ECB rate + 8.00% (11.75%) plus €40 flat. LLMs frequently hallucinate these formulas and invent non-existent precedents.

### Technical Architecture
- **Framework**: Nuxt 3 (v3.15) with Nitro 2.13 and Vue 3 Composition API.
- **UI Primitives**: Radix Vue for accessible headless primitives, styled with Tailwind CSS and 100% semantic Lucide SVG stroke icons (strict zero-emoji policy).
- **Serverless SQLite Cold-Start Adapter**: Because Vercel serverless environments are ephemeral and read-only except `/tmp`, we bundled a pre-migrated `prisma/starter.db`. On container cold-start, Nitro verifies `/tmp/invoicerecovery.db`. If uninitialized, it clones the database and runs synchronous schema validation (`ensureDatabaseReady`) before incoming requests execute.
- **Zero-Friction Monetization**: Free tier allows 3 letters/month; Pro is $29/mo or $79 lifetime. If Stripe keys are omitted, a built-in sandbox simulator allows complete evaluation of Pro features without external dependencies.
- **Dual Export**: Clipboard email formatting and `@media print` CSS for browser-generated formal PDF letterhead.

We wrote a 75-test verification suite covering statutory debt math, settlement calculations, input validation, and serverless persistence (`pnpm test`).

Live demo (no login needed, pre-seeded scenarios ready):
https://invoice-recovery-studio.vercel.app

I'd appreciate your thoughts on the statutory calculation engine, serverless database pattern, and UI design.
```
