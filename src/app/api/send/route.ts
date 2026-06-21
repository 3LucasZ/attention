import { setQuestion, waitForAnswer } from '@/lib/state'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const { correctAnswer: _ca, explanation: _ex, ...question } = await request.json()
  setQuestion(question)
  const answer = await waitForAnswer()
  return Response.json({ ok: true, answer })
}
