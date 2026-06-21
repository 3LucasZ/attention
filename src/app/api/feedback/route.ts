import { setFeedback, waitForFeedback } from '@/lib/state'

export const dynamic = 'force-dynamic'

export async function GET() {
  const feedback = await waitForFeedback()
  return Response.json(feedback ?? { correct: null, explanation: null })
}

export async function POST(request: Request) {
  const { correct, explanation } = await request.json()
  setFeedback({ correct: correct ?? null, explanation: explanation ?? null })
  return Response.json({ ok: true })
}
