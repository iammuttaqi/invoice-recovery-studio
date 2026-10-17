import { defineEventHandler, readBody, createError } from 'h3'
import { calculateSettlementOffer } from '../../utils/settlementCalculator'
import { SettlementOfferSchema } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = SettlementOfferSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: parsed.error.issues.map((i) => i.message).join(', ')
    })
  }

  const settlement = calculateSettlementOffer({
    principalAmount: parsed.data.principalAmount,
    currency: parsed.data.currency,
    discountPct: parsed.data.discountPct,
    windowHours: parsed.data.windowHours
  })

  return settlement
})
