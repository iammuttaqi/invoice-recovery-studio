import { defineEventHandler, setResponseStatus } from 'h3'
import { getPrisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  getPrisma()
  setResponseStatus(event, 200)
  return 'OK'
})
