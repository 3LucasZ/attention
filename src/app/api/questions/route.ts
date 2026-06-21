import { addClient, removeClient } from '@/lib/sse'

export const dynamic = 'force-dynamic'

export async function GET() {
  const encoder = new TextEncoder()
  let ctrl: ReadableStreamDefaultController<Uint8Array>

  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      ctrl = c
      addClient(ctrl)
      ctrl.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`))
    },
    cancel() {
      removeClient(ctrl)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
