import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'
import path from 'node:path'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding InvoiceRecovery Studio database...')

  // Delete existing data to ensure clean seed
  await prisma.recoveryEscalation.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.customer.deleteMany()

  // 1. Create Default Customer
  const customer = await prisma.customer.create({
    data: {
      id: 'cust_default_recovery',
      email: 'principal@studio.example.com',
      organizationName: 'Independent Studio LLC',
      tier: 'FREE',
      usageCount: 0,
      quotaLimit: 3
    }
  })

  // 2. Overdue Scenarios
  const now = new Date()
  const d45 = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000)
  const d18 = new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000)
  const d72 = new Date(now.getTime() - 72 * 24 * 60 * 60 * 1000)

  // Apex Digital Branding (US - 45 days overdue)
  const apex = await prisma.invoice.create({
    data: {
      id: 'inv_apex_045',
      customerId: customer.id,
      invoiceNumber: 'INV-2026-045',
      clientName: 'Apex Digital Branding',
      clientEmail: 'ap@apexdigital.example.com',
      clientAddress: '100 Broadway, Ste 400, New York, NY 10005',
      clientCompanyNumber: 'US-DEL-49219',
      issueDate: new Date(d45.getTime() - 30 * 24 * 60 * 60 * 1000),
      dueDate: d45,
      principalAmount: 8500.0,
      currency: 'USD',
      jurisdiction: 'US',
      status: 'OVERDUE',
      notes: 'Q2 Brand design & design system sprint milestone.'
    }
  })

  // OmniCloud Solutions Ltd (UK - 18 days overdue)
  const omnicloud = await prisma.invoice.create({
    data: {
      id: 'inv_omnicloud_882',
      customerId: customer.id,
      invoiceNumber: 'INV-UK-882',
      clientName: 'OmniCloud Solutions Ltd',
      clientEmail: 'finance@omnicloud.example.co.uk',
      clientAddress: '12 Chiswell Street, London EC1Y 4UP',
      clientCompanyNumber: 'GB-09823145',
      issueDate: new Date(d18.getTime() - 30 * 24 * 60 * 60 * 1000),
      dueDate: d18,
      principalAmount: 14200.0,
      currency: 'GBP',
      jurisdiction: 'UK',
      status: 'OVERDUE',
      notes: 'Kubernetes migration & multi-region deployment contract.'
    }
  })

  // Vanguard Consulting GmbH (EU - 72 days overdue)
  const vanguard = await prisma.invoice.create({
    data: {
      id: 'inv_vanguard_109',
      customerId: customer.id,
      invoiceNumber: 'INV-EU-109',
      clientName: 'Vanguard Consulting GmbH',
      clientEmail: 'rechnung@vanguard.example.de',
      clientAddress: 'Taunusanlage 8, 60329 Frankfurt am Main',
      clientCompanyNumber: 'DE-HRB-78321',
      issueDate: new Date(d72.getTime() - 30 * 24 * 60 * 60 * 1000),
      dueDate: d72,
      principalAmount: 4800.0,
      currency: 'EUR',
      jurisdiction: 'EU',
      status: 'OVERDUE',
      notes: 'Strategic digital transformation retainer - Net 30.'
    }
  })

  console.log(`Seeded customer: ${customer.email}`)
  console.log(`Seeded 3 invoices: ${apex.invoiceNumber}, ${omnicloud.invoiceNumber}, ${vanguard.invoiceNumber}`)

  // Copy dev.db to starter.db and public/starter.db for bundled serverless deployments
  const devDbPath = path.resolve(process.cwd(), 'prisma/dev.db')
  const starterPath = path.resolve(process.cwd(), 'prisma/starter.db')
  const publicDir = path.resolve(process.cwd(), 'public')
  const publicStarterPath = path.resolve(publicDir, 'starter.db')

  if (fs.existsSync(devDbPath)) {
    fs.copyFileSync(devDbPath, starterPath)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }
    fs.copyFileSync(devDbPath, publicStarterPath)
    console.log('Successfully bundled starter.db to prisma/ and public/ directories.')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
