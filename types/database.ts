import type { Customer, Invoice, RecoveryEscalation } from '@prisma/client'

export type { Customer, Invoice, RecoveryEscalation }

export interface CustomerWithInvoices extends Customer {
  invoices: Invoice[]
}

export interface InvoiceWithEscalations extends Invoice {
  escalations: RecoveryEscalation[]
}
