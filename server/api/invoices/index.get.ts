import { defineEventHandler } from 'h3'
import { getPrisma, ensureDatabaseReady } from '../../utils/prisma'
import { calculateStatutoryDebt } from '../../utils/statutoryRates'
import type { InvoiceViewModel, AgingBucket } from '../../../types/recovery'

export default defineEventHandler(async (event) => {
  const prisma = getPrisma()
  await ensureDatabaseReady(prisma)
  const customer = event.context.customer || (await prisma.customer.findFirst())

  if (!customer) {
    return []
  }

  const invoices = await prisma.invoice.findMany({
    where: { customerId: customer.id },
    orderBy: { dueDate: 'asc' },
    include: {
      escalations: {
        orderBy: { generatedAt: 'desc' },
        take: 5
      }
    }
  })

  const now = new Date()

  const enriched: InvoiceViewModel[] = invoices.map((inv) => {
    const calc = calculateStatutoryDebt({
      principalAmount: inv.principalAmount,
      currency: inv.currency,
      jurisdiction: inv.jurisdiction,
      dueDate: inv.dueDate,
      targetDate: now
    })

    let bucket: AgingBucket = '1-14'
    if (calc.daysOverdue >= 61) {
      bucket = '60+'
    } else if (calc.daysOverdue >= 31) {
      bucket = '31-60'
    } else if (calc.daysOverdue >= 15) {
      bucket = '15-30'
    } else {
      bucket = '1-14'
    }

    return {
      id: inv.id,
      customerId: inv.customerId,
      invoiceNumber: inv.invoiceNumber,
      clientName: inv.clientName,
      clientEmail: inv.clientEmail,
      clientAddress: inv.clientAddress,
      clientCompanyNumber: inv.clientCompanyNumber,
      issueDate: inv.issueDate.toISOString(),
      dueDate: inv.dueDate.toISOString(),
      principalAmount: inv.principalAmount,
      currency: inv.currency,
      jurisdiction: inv.jurisdiction as any,
      status: inv.status as any,
      notes: inv.notes,
      createdAt: inv.createdAt.toISOString(),
      updatedAt: inv.updatedAt.toISOString(),
      daysOverdue: calc.daysOverdue,
      agingBucket: bucket,
      accruedInterest: calc.accruedInterest,
      statutoryFee: calc.statutoryCompensationFee,
      totalClaim: calc.totalClaimAmount,
      calculation: calc
    }
  })

  return enriched
})
