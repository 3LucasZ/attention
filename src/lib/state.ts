type ActiveQuestion = {
  id: number
  question: Record<string, unknown>
}

type Feedback = {
  correct: boolean | null
  explanation: string | null
}

type Waiter<T> = {
  resolve: (v: T | null) => void
  timeout: ReturnType<typeof setTimeout>
}

declare global {
  var appState: {
    active: ActiveQuestion | null
    counter: number
    questionWaiters: Waiter<ActiveQuestion>[]
    answerWaiters: Waiter<string>[]
    feedbackWaiters: Waiter<Feedback>[]
  } | undefined
}

function getState() {
  global.appState ??= {
    active: null,
    counter: 0,
    questionWaiters: [],
    answerWaiters: [],
    feedbackWaiters: [],
  }
  return global.appState
}

function resolveAll<T>(waiters: Waiter<T>[], value: T | null) {
  for (const w of waiters) {
    clearTimeout(w.timeout)
    w.resolve(value)
  }
  waiters.length = 0
}

function waitFor<T>(waiters: Waiter<T>[], timeoutMs: number): Promise<T | null> {
  return new Promise<T | null>((resolve) => {
    const timeout = setTimeout(() => {
      const i = waiters.findIndex(w => w.resolve === resolve)
      if (i >= 0) waiters.splice(i, 1)
      resolve(null)
    }, timeoutMs)
    waiters.push({ resolve, timeout })
  })
}

export function setQuestion(question: Record<string, unknown>) {
  const state = getState()
  state.counter++
  state.active = { id: state.counter, question }
  resolveAll(state.answerWaiters, null)
  resolveAll(state.feedbackWaiters, null)
  resolveAll(state.questionWaiters, state.active)
}

export function getActive() {
  return getState().active
}

export function waitForQuestion(afterId: number): Promise<ActiveQuestion | null> {
  const state = getState()
  if (state.active && state.active.id > afterId) return Promise.resolve(state.active)
  return waitFor(state.questionWaiters, 30_000)
}

export function submitAnswer(answer: string) {
  resolveAll(getState().answerWaiters, answer)
}

export function waitForAnswer(): Promise<string | null> {
  return waitFor(getState().answerWaiters, 120_000)
}

export function setFeedback(feedback: Feedback) {
  resolveAll(getState().feedbackWaiters, feedback)
}

export function waitForFeedback(): Promise<Feedback | null> {
  return waitFor(getState().feedbackWaiters, 60_000)
}
