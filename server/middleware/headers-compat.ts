import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  const req = (event as any).node?.req || (event as any).req

  // Polyfill Web Request methods on Node incoming requests for universal h3 compatibility
  if (req) {
    if (req.headers && typeof req.headers.get !== 'function') {
      const raw = req.headers
      req.headers.get = (name: string) => {
        const val = raw[name.toLowerCase()]
        return Array.isArray(val) ? val.join(', ') : (val ?? null)
      }
      req.headers.has = (name: string) => name.toLowerCase() in raw
    }

    if (typeof req.text !== 'function') {
      let bodyTextPromise: Promise<string> | null = null
      req.text = () => {
        if (!bodyTextPromise) {
          bodyTextPromise = new Promise<string>((resolve, reject) => {
            if (req.body && typeof req.body === 'string') return resolve(req.body)
            if (req.body && typeof req.body === 'object') return resolve(JSON.stringify(req.body))
            const chunks: Buffer[] = []
            req.on('data', (chunk: any) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)))
            req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
            req.on('error', reject)
          })
        }
        return bodyTextPromise
      }
    }

    if (typeof req.json !== 'function') {
      req.json = async () => {
        const text = await req.text()
        return text ? JSON.parse(text) : {}
      }
    }

    if (typeof req.arrayBuffer !== 'function') {
      req.arrayBuffer = async () => {
        const text = await req.text()
        return Buffer.from(text, 'utf8').buffer
      }
    }

    // Ensure event.req has same references
    const eventReq = (event as any).req
    if (eventReq && eventReq !== req) {
      if (eventReq.headers && typeof eventReq.headers.get !== 'function') {
        eventReq.headers.get = req.headers.get
        eventReq.headers.has = req.headers.has
      }
      if (typeof eventReq.text !== 'function') eventReq.text = req.text
      if (typeof eventReq.json !== 'function') eventReq.json = req.json
      if (typeof eventReq.arrayBuffer !== 'function') eventReq.arrayBuffer = req.arrayBuffer
    }
  }
})
