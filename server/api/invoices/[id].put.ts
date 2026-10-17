import { defineEventHandler, readBody, getRouterParam, createError } from 'h3'
import { getPrisma } from '../../utils/prisma'
import { UpdateInvoiceSchema } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invoice ID is required.'
    })
  }

  const prisma = getPrisma()
  const rawBody = await readBody(event)
  const parsed = UpdateInvoiceSchema.safeParse(rawBody)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: parsed.error.issues.map((i) => i.message).join(', ')
    })
  }

  const body = parsed.data

  const existing = await prisma.invoice.findUnique({
    where: { id }
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: `Invoice ${id} does not exist.`
    })
  }

  const updateData: Record<string, any> = {}

  if (body.status !== undefined) updateData.status = body.status
  if (body.principalAmount !== undefined) updateData.principalAmount = Number(body.principalAmount)
  if (body.notes !== undefined) updateData.notes = body.notes
  if (body.clientName !== undefined) updateData.clientName = body.clientName
  if (body.clientEmail !== undefined) updateData.clientEmail = body.clientEmail
  if (body.clientAddress !== undefined) updateData.clientAddress = body.clientAddress
  if (body.dueDate !== undefined) updateData.dueDate = new Date(body.dueDate)

  const updated = await prisma.invoice.update({
    where: { id },
    data: updateData
  })

  return updated
})
