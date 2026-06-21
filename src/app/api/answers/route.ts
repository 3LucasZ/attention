import { submitAnswer } from '@/lib/state'

export async function POST(request: Request) {
  const { answer } = await request.json()
  console.log('[answer]', answer)
  submitAnswer(answer)
  return Response.json({ ok: true })
}
