export async function POST(request: Request) {
  const body = await request.json()
  console.log('[answer]', JSON.stringify(body))
  return Response.json({ ok: true })
}
