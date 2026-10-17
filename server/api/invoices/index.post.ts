import { defineEventHandler, readBody, createError } from 'h3'
import { getPrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = getPrisma()
  const customer = event.context.customer || (await prisma.customer.findFirst())

  if (!customer) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'No tenant customer record found.'
    })
  }

  const body = await readBody(event)

  if (!body.invoiceNumber || !body.clientName || !body.principalAmount || !body.dueDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'invoiceNumber, clientName, principalAmount, and dueDate are required.'
    })
  }

  const isPro = customer.tier === 'PRO' || customer.tier === 'LIFETIME'
  const activeCount = await prisma.invoice.count({
    where: { customerId: customer.id, status: { not: 'RESOLVED' } }
  })

  // Free tier allows up to 3 active invoices
  if (!isPro && activeCount >= 3) {
    throw createError({
      statusCode: 402,
      statusMessage: 'Payment Required',
      data: {
        error: 'ActiveInvoiceLimitReached',
        message: 'Free Starter tier is limited to 3 active overdue invoices. Upgrade to Pro for unlimited tracking.',
        currentCount: activeCount,
        limit: 3
      }
    })
  }

  const issueDate = body.issueDate ? new Date(body.issueDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const dueDate = new Date(body.dueDate)

  const invoice = await prisma.invoice.create({
    data: {
      customerId: customer.id,
      invoiceNumber: body.invoiceNumber.trim(),
      clientName: body.clientName.trim(),
      clientEmail: body.clientEmail ? body.clientEmail.trim() : null,
      clientAddress: body.clientAddress ? body.clientAddress.trim() : null,
      clientCompanyNumber: body.clientCompanyNumber ? body.clientCompanyNumber.trim() : null,
      issueDate,
      dueDate,
      principalAmount: Number(body.principalAmount),
      currency: body.currency || 'USD',
      jurisdiction: body.jurisdiction || 'US',
      status: body.status || 'OVERDUE',
      notes: body.notes ? body.notes.trim() : null
    }
  })

  return invoice
})
