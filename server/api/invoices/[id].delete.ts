import { defineEventHandler, getRouterParam, createError } from 'h3'
import { getPrisma } from '../../utils/prisma'

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

  await prisma.invoice.delete({
    where: { id }
  })

  return { success: true, deletedId: id }
})
