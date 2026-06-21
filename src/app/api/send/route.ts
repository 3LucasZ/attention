import { broadcast, clientCount } from '@/lib/sse'

export async function POST(request: Request) {
  const question = await request.json()
  broadcast({ type: 'question', question })
  return Response.json({ ok: true, clients: clientCount() })
}
