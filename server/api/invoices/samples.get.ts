import { defineEventHandler, getQuery } from 'h3'
import { getPrisma } from '../../utils/prisma'

export const SAMPLE_PRESETS = [
  {
    invoiceNumber: 'INV-2026-045',
    clientName: 'Apex Digital Branding',
    clientEmail: 'ap@apexdigital.example.com',
    clientAddress: '100 Broadway, Ste 400, New York, NY 10005',
    clientCompanyNumber: 'US-DEL-49219',
    principalAmount: 8500.0,
    currency: 'USD',
    jurisdiction: 'US',
    daysOverdue: 45,
    status: 'OVERDUE',
    notes: 'Q2 Brand design & design system sprint milestone.'
  },
  {
    invoiceNumber: 'INV-UK-882',
    clientName: 'OmniCloud Solutions Ltd',
    clientEmail: 'finance@omnicloud.example.co.uk',
    clientAddress: '12 Chiswell Street, London EC1Y 4UP',
    clientCompanyNumber: 'GB-09823145',
    principalAmount: 14200.0,
    currency: 'GBP',
    jurisdiction: 'UK',
    daysOverdue: 18,
    status: 'OVERDUE',
    notes: 'Kubernetes migration & multi-region deployment contract.'
  },
  {
    invoiceNumber: 'INV-EU-109',
    clientName: 'Vanguard Consulting GmbH',
    clientEmail: 'rechnung@vanguard.example.de',
    clientAddress: 'Taunusanlage 8, 60329 Frankfurt am Main',
    clientCompanyNumber: 'DE-HRB-78321',
    principalAmount: 4800.0,
    currency: 'EUR',
    jurisdiction: 'EU',
    daysOverdue: 72,
    status: 'OVERDUE',
    notes: 'Strategic digital transformation retainer - Net 30.'
  }
]

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const shouldSeed = query.seed === 'true'

  if (shouldSeed) {
    const prisma = getPrisma()
    const customer = event.context.customer || (await prisma.customer.findFirst())

    if (customer) {
      const now = new Date()

      for (const sample of SAMPLE_PRESETS) {
        const dueDate = new Date(now.getTime() - sample.daysOverdue * 24 * 60 * 60 * 1000)
        const issueDate = new Date(dueDate.getTime() - 30 * 24 * 60 * 60 * 1000)

        // Check if already exists for customer
        const existing = await prisma.invoice.findFirst({
          where: { customerId: customer.id, invoiceNumber: sample.invoiceNumber }
        })

        if (!existing) {
          await prisma.invoice.create({
            data: {
              customerId: customer.id,
              invoiceNumber: sample.invoiceNumber,
              clientName: sample.clientName,
              clientEmail: sample.clientEmail,
              clientAddress: sample.clientAddress,
              clientCompanyNumber: sample.clientCompanyNumber,
              issueDate,
              dueDate,
              principalAmount: sample.principalAmount,
              currency: sample.currency,
              jurisdiction: sample.jurisdiction,
              status: sample.status,
              notes: sample.notes
            }
          })
        }
      }
    }
  }

  return SAMPLE_PRESETS
})
