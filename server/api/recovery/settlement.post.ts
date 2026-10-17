import { defineEventHandler, readBody, createError } from 'h3'
import { calculateSettlementOffer } from '../../utils/settlementCalculator'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body || body.principalAmount === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'principalAmount is required for settlement formulation.'
    })
  }

  const settlement = calculateSettlementOffer({
    principalAmount: Number(body.principalAmount),
    currency: body.currency || 'USD',
    discountPct: body.discountPct !== undefined ? Number(body.discountPct) : 8.0,
    windowHours: body.windowHours !== undefined ? Number(body.windowHours) : 48
  })

  return settlement
})
