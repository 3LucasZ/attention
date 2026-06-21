declare global {
  var sseClients: Set<ReadableStreamDefaultController<Uint8Array>> | undefined
}

const encoder = new TextEncoder()

function clients(): Set<ReadableStreamDefaultController<Uint8Array>> {
  global.sseClients ??= new Set()
  return global.sseClients
}

export function addClient(ctrl: ReadableStreamDefaultController<Uint8Array>) {
  clients().add(ctrl)
}

export function removeClient(ctrl: ReadableStreamDefaultController<Uint8Array>) {
  clients().delete(ctrl)
}

export function clientCount() {
  return clients().size
}

export function broadcast(data: unknown) {
  const chunk = encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
  const dead: ReadableStreamDefaultController<Uint8Array>[] = []
  for (const ctrl of clients()) {
    try {
      ctrl.enqueue(chunk)
    } catch {
      dead.push(ctrl)
    }
  }
  dead.forEach(c => clients().delete(c))
}
