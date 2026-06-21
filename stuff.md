- src/app/page.tsx — the student-facing UI: dark #050508 background with drifting violet/indigo ambient orbs, pulsing LIVE indicator when idle, and animated question popups when a question arrives. Supports MCQ (2-column option grid with A/B/C/D badges) and FRQ (textarea + char count). After submitting, shows a green checkmark animation, then auto-dismisses.
- src/app/globals.css — orb keyframe animations.
- SSE stream at GET /api/questions
- On question submit, POST /api/answers receives { question: { type, id?, question, options? }, answer: "..." }. The endpoint logs it — swap the console.log in answers/route.ts for whatever persistence you need (database write, forwarding to another service, etc.).
- Submit → spinner ("Checking your answer…")
- POST /api/feedback arrives → correct/incorrect view

# MCQ

curl -X POST http://localhost:3000/api/send \
 -H 'Content-Type: application/json' \
 -d '{"type":"mcq","question":"What is Jonahs favorite dish?","options":["A: fish","B: dog","C: peanuts","D: milk"]}'

# FRQ

curl -X POST http://localhost:3000/api/send \
 -H 'Content-Type: application/json' \
 -d '{"type":"frq","question":"Explain..."}'

# Correct

curl -X POST http://localhost:3000/api/feedback \
 -H 'Content-Type: application/json' \
 -d '{"correct": true, "explanation": "The mitochondria generates ATP via oxidative phosphorylation."}'

# Incorrect

curl -X POST http://localhost:3000/api/feedback \
 -H 'Content-Type: application/json' \
 -d '{"correct": false, "explanation": "Close — the answer is the mitochondria, not the nucleus."}'

GET /api/questions ← client polls every 1.5s
POST /api/send ← external process sends question
POST /api/answers ← client submits answer, gets feedback in response
