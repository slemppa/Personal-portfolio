// Runs the Vercel-style (req, res) handlers in src/server/handlers as Next.js
// route handlers, so their logic stayed untouched in the move from Vite.
// Only the subset of req/res those handlers use is provided.

type NodeReq = {
  method: string
  url: string
  headers: Record<string, string>
  query: Record<string, string>
  body: string | undefined
}

type NodeRes = {
  setHeader: (k: string, v: string) => void
  status: (n: number) => NodeRes
  json: (b: unknown) => void
  end: (b?: string) => void
}

// The handlers declare their own narrower req/res types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = (req: any, res: any) => Promise<void>

export function toRouteHandler(handler: Handler) {
  return async (request: Request): Promise<Response> => {
    const url = new URL(request.url)
    const text = request.method === 'GET' || request.method === 'HEAD' ? '' : await request.text()
    const req: NodeReq = {
      method: request.method,
      url: url.pathname + url.search,
      headers: Object.fromEntries(request.headers),
      query: Object.fromEntries(url.searchParams),
      // Handlers JSON.parse string bodies themselves.
      body: text || undefined,
    }

    let status = 200
    let body: string | null = null
    const headers = new Headers()
    const res: NodeRes = {
      setHeader: (k, v) => headers.set(k, v),
      status: (n) => {
        status = n
        return res
      },
      json: (b) => {
        headers.set('Content-Type', 'application/json')
        body = JSON.stringify(b)
      },
      end: (b) => {
        body = b ?? null
      },
    }

    await handler(req, res)
    return new Response(status === 204 ? null : body, { status, headers })
  }
}
