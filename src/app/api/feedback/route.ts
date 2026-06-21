import { broadcast } from '@/lib/sse'

export async function POST(request: Request) {
  const { correct, explanation } = await request.json()
  broadcast({ type: 'feedback', correct, explanation })
  return Response.json({ ok: true })
}
