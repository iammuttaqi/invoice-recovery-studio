import { defineEventHandler, readBody, createError } from 'h3'
import { calculateStatutoryDebt } from '../../utils/statutoryRates'
import { StatutoryCalculateSchema } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = StatutoryCalculateSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: parsed.error.issues.map((i) => i.message).join(', ')
    })
  }

  const calculation = calculateStatutoryDebt({
    principalAmount: parsed.data.principalAmount,
    currency: parsed.data.currency,
    jurisdiction: parsed.data.jurisdiction,
    dueDate: parsed.data.dueDate,
    targetDate: parsed.data.targetDate
  })

  return calculation
})
