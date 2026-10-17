import { defineEventHandler, readBody, createError } from 'h3'
import { calculateStatutoryDebt } from '../../utils/statutoryRates'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body || body.principalAmount === undefined || !body.dueDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'principalAmount and dueDate are required for statutory calculation.'
    })
  }

  const calculation = calculateStatutoryDebt({
    principalAmount: Number(body.principalAmount),
    currency: body.currency || 'USD',
    jurisdiction: body.jurisdiction || 'US',
    dueDate: body.dueDate,
    targetDate: body.targetDate
  })

  return calculation
})
