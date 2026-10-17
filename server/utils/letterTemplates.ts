import type { CreditorInfo, StatutoryCalculation, EscalationStageMeta } from '../../types/recovery'
import { getCurrencySymbol } from './settlementCalculator'

export const ESCALATION_STAGES: EscalationStageMeta[] = [
  {
    stageNumber: 1,
    stageName: 'Courtesy Check-in',
    tone: 'Friendly & Administrative',
    recommendedBucket: '1-14',
    minDays: 1,
    maxDays: 14,
    isLockedForFree: false,
    description: 'Friendly confirmation of invoice receipt, assuming inadvertent oversight or banking processing delay.'
  },
  {
    stageNumber: 2,
    stageName: 'Firm Administrative Statement',
    tone: 'Formal & Objective',
    recommendedBucket: '15-30',
    minDays: 15,
    maxDays: 30,
    isLockedForFree: false,
    description: 'Direct statement of account requesting explicit confirmation of payment disbursement date and AP log ID.'
  },
  {
    stageNumber: 3,
    stageName: 'Statutory Accrual Warning',
    tone: 'Stern & Legal',
    recommendedBucket: '31-60',
    minDays: 31,
    maxDays: 60,
    isLockedForFree: false,
    description: 'Formally invokes territorial statutory late interest rights and fixed recovery compensation fee accrual.'
  },
  {
    stageNumber: 4,
    stageName: 'Formal Legal Demand (Letter Before Action)',
    tone: 'Pre-Action Legal Mandate',
    recommendedBucket: '60+',
    minDays: 61,
    isLockedForFree: true,
    description: 'Final 7-day pre-action statutory demand prior to small-claims court filing and commercial debt recovery proceedings.'
  }
]

export interface GenerateLetterParams {
  stageNumber: number
  invoice: {
    invoiceNumber: string
    clientName: string
    clientEmail?: string | null
    clientAddress?: string | null
    clientCompanyNumber?: string | null
    issueDate: Date | string
    dueDate: Date | string
    principalAmount: number
    currency: string
    jurisdiction: string
    notes?: string | null
  }
  calculation: StatutoryCalculation
  creditor?: Partial<CreditorInfo>
  settlementClauseMarkdown?: string | null
}

export interface GeneratedLetterResult {
  stageNumber: number
  stageName: string
  subjectLine: string
  letterMarkdown: string
  plainText: string
}

function formatDate(dateInput: Date | string): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatMoney(amount: number, currency: string): string {
  const symbol = getCurrencySymbol(currency)
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function generateLetterNotice(params: GenerateLetterParams): GeneratedLetterResult {
  const { stageNumber, invoice, calculation, creditor, settlementClauseMarkdown } = params

  const stageMeta = ESCALATION_STAGES.find((s) => s.stageNumber === stageNumber) || ESCALATION_STAGES[0]
  const creditorName = creditor?.companyName || 'Independent Studio LLC'
  const signatory = creditor?.signatory || 'Managing Principal'
  const remittance = creditor?.remittanceDetails || 'Wire Transfer / Electronic Funds Transfer upon request'
  const creditorAddress = creditor?.creditorAddress || 'Accounts Receivable Department'
  const debtorAddress = invoice.clientAddress || 'Accounts Payable Department'

  const formattedIssueDate = formatDate(invoice.issueDate)
  const formattedDueDate = formatDate(invoice.dueDate)
  const formattedToday = formatDate(new Date())

  const formattedPrincipal = formatMoney(calculation.principalAmount, calculation.currency)
  const formattedInterest = formatMoney(calculation.accruedInterest, calculation.currency)
  const formattedFee = formatMoney(calculation.statutoryCompensationFee, calculation.currency)
  const formattedDailyAccrual = formatMoney(calculation.dailyAccrualAmount, calculation.currency)
  const formattedTotalClaim = formatMoney(calculation.totalClaimAmount, calculation.currency)

  let subjectLine = ''
  let letterMarkdown = ''

  if (stageNumber === 1) {
    subjectLine = `COURTESY INQUIRY: Invoice ${invoice.invoiceNumber} — ${invoice.clientName}`
    letterMarkdown = `# COURTESY INVOICE STATUS INQUIRY

**Date**: ${formattedToday}  
**To**: ${invoice.clientName}  
**Attn**: ${debtorAddress}  
**From**: ${creditorName} (${creditorAddress})  

**RE**: Status of Outstanding Invoice ${invoice.invoiceNumber}  
**Principal Face Value**: ${formattedPrincipal}  
**Original Issue Date**: ${formattedIssueDate}  
**Maturity / Due Date**: ${formattedDueDate} (${calculation.daysOverdue} days past maturity)  

---

Dear Accounts Payable Team,

We hope this correspondence finds you well.

Our internal accounting ledger indicates that Invoice **${invoice.invoiceNumber}** in the amount of **${formattedPrincipal}**, which matured on **${formattedDueDate}**, remains outstanding in our accounts receivable system.

Recognizing that inadvertent processing delays or administrative routing oversights occasionally occur between accounts payable cycles, we are providing this courtesy statement to verify whether this invoice has been queued for immediate disbursement.

### Summary of Account
| Item | Particulars | Amount |
| :--- | :--- | :--- |
| **Invoice Reference** | ${invoice.invoiceNumber} | — |
| **Debtor Entity** | ${invoice.clientName} | — |
| **Original Due Date** | ${formattedDueDate} | — |
| **Elapsed Days Past Due** | ${calculation.daysOverdue} Days | — |
| **Outstanding Balance** | Principal Due in Full | **${formattedPrincipal}** |

${settlementClauseMarkdown ? `\n${settlementClauseMarkdown}\n` : ''}

### Remittance Instructions
Please remit the outstanding sum of **${formattedPrincipal}** to our designated banking coordinates:
> **Remittance Details**: ${remittance}

Should you require a duplicate copy of the original signed contract or itemized invoice deliverables, please reply directly to this notice. If payment has already been remitted within the last 48 hours, please disregard this communication with our sincere thanks.

Respectfully submitted,

**${creditorName}**  
*${signatory}*  
Accounts Receivable Operations
`
  } else if (stageNumber === 2) {
    subjectLine = `STATEMENT OF ACCOUNT: Overdue Invoice ${invoice.invoiceNumber} (${calculation.daysOverdue} Days Past Maturity)`
    letterMarkdown = `# FORMAL ADMINISTRATIVE STATEMENT OF OVERDUE ACCOUNT

**Date**: ${formattedToday}  
**To**: ${invoice.clientName}  
**Attn**: ${debtorAddress}  
**From**: ${creditorName} (${creditorAddress})  

**RE**: Overdue Statement of Account for Invoice ${invoice.invoiceNumber}  
**Outstanding Principal**: ${formattedPrincipal}  
**Elapsed Delinquency**: ${calculation.daysOverdue} Days Past Due  

---

Dear Finance Director / Accounts Payable Controller,

We are writing to address the delinquent status of Invoice **${invoice.invoiceNumber}** (${formattedPrincipal}), issued on **${formattedIssueDate}** and matured for settlement on **${formattedDueDate}**.

As of **${formattedToday}**, this balance is **${calculation.daysOverdue} days overdue**. Despite our previous courtesy communication, we have not yet received confirmation of payment disbursement or an administrative tracking reference.

As an active supplier operating under strict credit governance, maintaining timely settlement is essential to our ongoing commercial relationship. 

### Current Statement of Account
| Description | Ledger Reference | Amount Due |
| :--- | :--- | :--- |
| **Original Principal Face Value** | Invoice ${invoice.invoiceNumber} | ${formattedPrincipal} |
| **Contractual Terms** | Net 30 Commercial Credit | Matured ${formattedDueDate} |
| **Current Delinquency** | ${calculation.daysOverdue} Days Past Maturity | — |
| **Total Amount Immediately Due** | Cleared Electronic Funds | **${formattedPrincipal}** |

${settlementClauseMarkdown ? `\n${settlementClauseMarkdown}\n` : ''}

### Action Required
Please furnish explicit confirmation of the payment release date and remittance transaction identifier within **three (3) business days** of receipt of this notice.

Remittance must be directed to our banking coordinates:
> **Bank Remittance**: ${remittance}

Please confirm remittance schedule by reply email without delay.

Sincerely,

**${creditorName}**  
*${signatory}*  
Finance & Credit Control Division
`
  } else if (stageNumber === 3) {
    subjectLine = `STATUTORY NOTICE: Accrual of Statutory Late Interest & Fees — Invoice ${invoice.invoiceNumber}`
    letterMarkdown = `# STATUTORY NOTICE OF COMMERCIAL DEBT ACCRUAL & LATE FEES

**Date**: ${formattedToday}  
**To**: ${invoice.clientName}  
**Attn**: Legal & Accounts Payable Management  
${debtorAddress}  
**From**: ${creditorName} (${creditorAddress})  

**RE**: Statutory Debt Accrual Notice — Invoice ${invoice.invoiceNumber}  
**Governing Legal Framework**: ${calculation.statuteName}  
**Total Current Statutory Claim**: **${formattedTotalClaim}** (${calculation.daysOverdue} Days Overdue)  

---

**FORMAL STATUTORY NOTICE UNDER COMMERCIAL LAW**

Please be advised that Invoice **${invoice.invoiceNumber}**, in the principal sum of **${formattedPrincipal}**, remains unpaid and is now **${calculation.daysOverdue} days past its contractually mandated maturity date** of ${formattedDueDate}.

Pursuant to the provisions of **${calculation.statuteName}**, Creditor hereby exercises its statutory entitlement to levy daily late commercial interest and fixed statutory debt-recovery compensation costs against ${invoice.clientName}.

### Itemized Schedule of Statutory Debt Claim
| Statutory Element | Legal Basis / Computation | Amount |
| :--- | :--- | :--- |
| **Principal Outstanding** | Face Value of Invoice ${invoice.invoiceNumber} | ${formattedPrincipal} |
| **Statutory Interest Accrued** | ${calculation.annualRatePercent}% p.a. pro-rata (${calculation.daysOverdue} days @ ${formattedDailyAccrual}/day) | ${formattedInterest} |
| **Statutory Compensation Fee** | Fixed Territorial Debt Recovery Compensation | ${formattedFee} |
| **Total Statutory Claim Balance** | **Sum Immediately Payable in Cleared Funds** | **${formattedTotalClaim}** |

> **Statutory Authority**: *${calculation.statutoryCitation}*

Interest continues to accumulate on a daily pro-rata basis at **${formattedDailyAccrual} per calendar day** until full and final settlement in cleared funds is received.

${settlementClauseMarkdown ? `\n${settlementClauseMarkdown}\n` : ''}

### Demand for Remittance
To arrest further interest accrual and avoid escalating this matter to our formal legal enforcement department, the total sum of **${formattedTotalClaim}** must be transferred immediately to:
> **Remittance Details**: ${remittance}

Failure to settle within **five (5) business days** will result in the immediate transmission of a formal Letter Before Action.

For and on behalf of,

**${creditorName}**  
*${signatory}*  
Statutory Debt Recovery Operations
`
  } else {
    // Stage 4: Formal Legal Demand / Letter Before Action
    subjectLine = `FORMAL DEMAND FOR PAYMENT (LETTER BEFORE ACTION): Invoice ${invoice.invoiceNumber} — ${invoice.clientName}`
    letterMarkdown = `# FORMAL DEMAND FOR IMMEDIATE PAYMENT
## LETTER BEFORE ACTION / PRE-ACTION PROTOCOL NOTICE

**Date of Notice**: ${formattedToday}  
**Sent Via**: Tracked Commercial Communication & Electronic Mail  

**DEBTOR PARTICULARS**:  
**Company Name**: ${invoice.clientName}  
${invoice.clientCompanyNumber ? `**Company Registration / Tax ID**: ${invoice.clientCompanyNumber}  \n` : ''}**Address**: ${debtorAddress}  

**CREDITOR PARTICULARS**:  
**Creditor**: ${creditorName}  
**Address**: ${creditorAddress}  
**Signatory**: ${signatory}  

---

### RE: FINAL DEMAND PRIOR TO LEGAL PROCEEDINGS — INVOICE ${invoice.invoiceNumber}

This letter serves as a formal **Letter Before Action** pursuant to governing commercial debt recovery protocols and commercial contract litigation rules.

We have previously issued multiple statements and statutory notifications regarding overdue Invoice **${invoice.invoiceNumber}**, originally due on **${formattedDueDate}**. To date, the debt remains delinquent by **${calculation.daysOverdue} days**.

### ITEMIZATION OF TOTAL LEGAL CLAIM
As of **${formattedToday}**, the total liquidated amount demanded is **${formattedTotalClaim}**, calculated as follows:

| Legal Claim Component | Statutory & Contractual Particulars | Amount Due |
| :--- | :--- | :--- |
| **1. Principal Debt** | Contracted Services / Deliverables under ${invoice.invoiceNumber} | ${formattedPrincipal} |
| **2. Accrued Statutory Interest** | Accrued under ${calculation.statuteName} (${calculation.annualRatePercent}% p.a. for ${calculation.daysOverdue} days) | ${formattedInterest} |
| **3. Fixed Statutory Recovery Fee** | Mandatory Debt Collection Compensation Fee | ${formattedFee} |
| **TOTAL LEGAL CLAIM AMOUNT** | **SUM DUE IN CLEARED FUNDS** | **${formattedTotalClaim}** |

> **Continuing Accrual Notice**: Interest continues to accrue at the daily statutory rate of **${formattedDailyAccrual} per day** until full settlement or court judgment.

${settlementClauseMarkdown ? `\n${settlementClauseMarkdown}\n` : ''}

### MANDATORY DEADLINE FOR PAYMENT: SEVEN (7) DAYS
Take notice that unless cleared payment of **${formattedTotalClaim}** is received in our designated account within **seven (7) calendar days** of the date of this letter (on or before **${formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))}**), we will immediately initiate civil legal proceedings against ${invoice.clientName} in the competent court of jurisdiction without further warning.

### NOTICE OF LEGAL COSTS AND DAMAGE RECOVERY
Should legal action be commenced, our claim will formally be expanded to include:
1. The total outstanding debt of **${formattedTotalClaim}**;
2. Continuing statutory interest accruing on a per-diem basis through to the date of judicial judgment;
3. All court filing, hearing, and bailiff / sheriff enforcement fees;
4. Reasonable commercial litigation costs and legal fees as permitted by statute and contract.

Furthermore, entry of a judicial judgment against ${invoice.clientName} may adversely affect your commercial credit rating, trade credit facilities, and public corporate register standing.

### BANKING REMITTANCE COORDINATES
Payment must be transmitted immediately via wire / electronic transfer:
> **Beneficiary / Entity**: ${creditorName}  
> **Remittance Details**: ${remittance}  
> **Payment Reference**: ${invoice.invoiceNumber} / LBA-LEGAL  

This letter is sent in compliance with pre-action protocol requirements.

Yours faithfully,

____________________________________________  
**${signatory}**  
Managing Director / Authorized Signatory  
**${creditorName}**  
Direct Inquiries: ${creditor?.creditorEmail || 'legal@studio.example.com'}
`
  }

  // Create clean plain text version for email client pasting
  const plainText = letterMarkdown
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\|/g, ' ')
    .replace(/---+/g, '----------------------------------------')
    .replace(/>\s+/gm, '  ')

  return {
    stageNumber,
    stageName: stageMeta.stageName,
    subjectLine,
    letterMarkdown,
    plainText
  }
}
