import { z } from 'zod'

export const StatutoryCalculateSchema = z.object({
  principalAmount: z.coerce.number().positive('Principal amount must be positive'),
  currency: z.enum(['USD', 'GBP', 'EUR']).default('USD'),
  jurisdiction: z.enum(['US', 'UK', 'EU']).default('US'),
  dueDate: z.string().or(z.date()),
  targetDate: z.string().or(z.date()).optional()
})

export const SettlementOfferSchema = z.object({
  principalAmount: z.coerce.number().positive('Principal amount must be positive'),
  currency: z.string().default('USD'),
  discountPct: z.coerce.number().min(1).max(50).default(8.0),
  windowHours: z.coerce.number().min(1).max(168).default(48)
})

export const RecoveryGenerateSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice ID is required'),
  stageNumber: z.coerce.number().int().min(1).max(4),
  includeSettlement: z.boolean().optional(),
  settlementDiscountPct: z.coerce.number().min(1).max(50).optional(),
  creditorInfo: z
    .object({
      companyName: z.string().optional(),
      signatory: z.string().optional(),
      remittanceDetails: z.string().optional(),
      creditorAddress: z.string().optional(),
      creditorEmail: z.string().email().optional().or(z.literal(''))
    })
    .optional()
})

export const CreateInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice reference number is required'),
  clientName: z.string().min(1, 'Debtor entity name is required'),
  clientEmail: z.string().email().optional().or(z.literal('')).nullable(),
  clientAddress: z.string().optional().nullable(),
  clientCompanyNumber: z.string().optional().nullable(),
  issueDate: z.string().or(z.date()).optional(),
  dueDate: z.string().or(z.date()),
  principalAmount: z.coerce.number().positive('Principal amount must be greater than zero'),
  currency: z.enum(['USD', 'GBP', 'EUR']).default('USD'),
  jurisdiction: z.enum(['US', 'UK', 'EU']).default('US'),
  status: z.enum(['PENDING', 'OVERDUE', 'RESOLVED']).default('OVERDUE'),
  notes: z.string().optional().nullable()
})

export const UpdateInvoiceSchema = z.object({
  status: z.enum(['PENDING', 'OVERDUE', 'RESOLVED']).optional(),
  principalAmount: z.coerce.number().positive().optional(),
  notes: z.string().optional().nullable(),
  clientName: z.string().min(1).optional(),
  clientEmail: z.string().email().optional().or(z.literal('')).nullable(),
  clientAddress: z.string().optional().nullable(),
  dueDate: z.string().or(z.date()).optional()
})

export const CheckoutSchema = z.object({
  plan: z.enum(['pro_monthly', 'lifetime']).default('pro_monthly')
})

export const ToggleSandboxSchema = z.object({
  tier: z.enum(['FREE', 'PRO', 'LIFETIME']).optional()
})
