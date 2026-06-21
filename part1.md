- src/app/page.tsx — the student-facing UI: dark #050508 background with drifting violet/indigo ambient orbs, pulsing LIVE indicator when idle, and animated question popups when a question arrives. Supports MCQ (2-column option grid with A/B/C/D badges) and FRQ (textarea + char count). After submitting, shows a green checkmark animation, then auto-dismisses.
- src/app/globals.css — orb keyframe animations.
- SSE stream at GET /api/questions

# MCQ

curl -X POST http://localhost:3000/api/send \
 -H 'Content-Type: application/json' \
 -d '{"type":"mcq","question":"What is...","options":["A","B","C","D"]}'

# FRQ

curl -X POST http://localhost:3000/api/send \
 -H 'Content-Type: application/json' \
 -d '{"type":"frq","question":"Explain..."}'
