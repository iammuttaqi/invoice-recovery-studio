import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'
import path from 'node:path'

let prismaInstance: PrismaClient | null = null
let isSchemaInitialized = false

/**
 * Ensures tables exist in SQLite if starting from a fresh /tmp database.
 */
async function ensureDatabaseSchema(prisma: PrismaClient): Promise<void> {
  if (isSchemaInitialized) return

  try {
    const tables: Array<{ name: string }> = await prisma.$queryRawUnsafe(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='Customer'`
    )

    if (!tables || tables.length === 0) {
      console.info('[Prisma Cold-Start] Initializing database schema in SQLite...')

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Customer" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "email" TEXT NOT NULL,
          "organizationName" TEXT NOT NULL DEFAULT 'Independent Studio',
          "stripeCustomerId" TEXT,
          "subscriptionId" TEXT,
          "tier" TEXT NOT NULL DEFAULT 'FREE',
          "usageCount" INTEGER NOT NULL DEFAULT 0,
          "quotaLimit" INTEGER NOT NULL DEFAULT 3,
          "quotaResetDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `)

      await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "Customer_email_key" ON "Customer"("email");
      `)
      await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "Customer_stripeCustomerId_key" ON "Customer"("stripeCustomerId");
      `)

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Invoice" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "customerId" TEXT NOT NULL,
          "invoiceNumber" TEXT NOT NULL,
          "clientName" TEXT NOT NULL,
          "clientEmail" TEXT,
          "clientAddress" TEXT,
          "clientCompanyNumber" TEXT,
          "issueDate" DATETIME NOT NULL,
          "dueDate" DATETIME NOT NULL,
          "principalAmount" REAL NOT NULL,
          "currency" TEXT NOT NULL DEFAULT 'USD',
          "jurisdiction" TEXT NOT NULL DEFAULT 'US',
          "status" TEXT NOT NULL DEFAULT 'OVERDUE',
          "notes" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `)

      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "Invoice_customerId_idx" ON "Invoice"("customerId");
      `)
      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "Invoice_status_idx" ON "Invoice"("status");
      `)
      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "Invoice_dueDate_idx" ON "Invoice"("dueDate");
      `)

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "RecoveryEscalation" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "invoiceId" TEXT NOT NULL,
          "stageNumber" INTEGER NOT NULL,
          "stageName" TEXT NOT NULL,
          "daysOverdue" INTEGER NOT NULL,
          "interestAccrued" REAL NOT NULL,
          "statutoryFee" REAL NOT NULL,
          "totalClaimAmount" REAL NOT NULL,
          "letterMarkdown" TEXT NOT NULL,
          "settlementDiscountAmount" REAL,
          "settlementDeadline" DATETIME,
          "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "RecoveryEscalation_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `)

      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "RecoveryEscalation_invoiceId_idx" ON "RecoveryEscalation"("invoiceId");
      `)
      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "RecoveryEscalation_stageNumber_idx" ON "RecoveryEscalation"("stageNumber");
      `)
    }

    // Ensure default demo customer exists
    const customerCount = await prisma.customer.count()
    if (customerCount === 0) {
      console.info('[Prisma Cold-Start] Creating initial default customer...')
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

      // Seed initial sample invoices
      const now = new Date()
      const d45 = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000)
      const d18 = new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000)
      const d72 = new Date(now.getTime() - 72 * 24 * 60 * 60 * 1000)

      await prisma.invoice.createMany({
        data: [
          {
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
          },
          {
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
          },
          {
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
        ]
      })
    }

    isSchemaInitialized = true
  } catch (error) {
    console.error('[Prisma Cold-Start] Schema initialization error:', error)
  }
}

/**
 * Returns the singleton PrismaClient instance, managing the serverless
 * /tmp/invoicerecovery.db cold-start copy and schema self-healing.
 */
export function getPrisma(): PrismaClient {
  if (prismaInstance) {
    return prismaInstance
  }

  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.NETLIFY ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NODE_ENV === 'production'
  )

  const dbPath = isServerless
    ? '/tmp/invoicerecovery.db'
    : path.resolve(process.cwd(), 'prisma/dev.db')

  const dbUrl = `file:${dbPath}`

  if (isServerless && !fs.existsSync(dbPath)) {
    const starterPath = path.resolve(process.cwd(), 'prisma/starter.db')
    const publicStarterPath = path.resolve(process.cwd(), 'public/starter.db')

    let copied = false
    for (const candidate of [starterPath, publicStarterPath]) {
      if (fs.existsSync(candidate)) {
        try {
          fs.copyFileSync(candidate, dbPath)
          fs.chmodSync(dbPath, 0o666)
          console.info(`[Prisma Cold-Start] Copied starter database from ${candidate} to ${dbPath}`)
          copied = true
          break
        } catch (err) {
          console.warn(`[Prisma Cold-Start] Failed to copy starter database from ${candidate}:`, err)
        }
      }
    }

    if (!copied) {
      console.info(`[Prisma Cold-Start] No starter database found, initialized at ${dbPath}`)
    }
  }

  prismaInstance = new PrismaClient({
    datasources: {
      db: {
        url: dbUrl
      }
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
  })

  // Ensure tables and default records asynchronously
  ensureDatabaseSchema(prismaInstance).catch((err) => {
    console.error('[Prisma Cold-Start] Failed initial schema check:', err)
  })

  return prismaInstance
}

export { ensureDatabaseSchema }
