import { waitForQuestion } from '@/lib/state'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const afterId = parseInt(url.searchParams.get('after') ?? '-1', 10)
  const active = await waitForQuestion(afterId)
  if (!active) return Response.json({ question: null })
  return Response.json({ id: active.id, question: active.question })
}
