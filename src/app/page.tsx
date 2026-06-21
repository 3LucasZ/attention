'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type MCQQuestion = {
  type: 'mcq'
  id?: string
  question: string
  options: string[]
}

type FRQQuestion = {
  type: 'frq'
  id?: string
  question: string
}

type Question = MCQQuestion | FRQQuestion

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F']

function MCQOptions({ question, onSubmit }: { question: MCQQuestion; onSubmit: (answer: string) => void }) {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-2">
        {question.options.map((opt, i) => (
          <motion.button
            key={i}
            onClick={() => setSelected(i)}
            className={`flex items-center gap-3 p-3.5 rounded-xl text-left transition-colors
              ${selected === i
                ? 'bg-violet-500/20 ring-1 ring-violet-400/50'
                : 'bg-white/[0.04] hover:bg-white/[0.08]'
              }`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.25 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
              ${selected === i ? 'bg-violet-500 text-white' : 'bg-white/10 text-white/50'}`}>
              {LABELS[i]}
            </span>
            <span className={`text-sm leading-snug ${selected === i ? 'text-white' : 'text-white/70'}`}>
              {opt}
            </span>
          </motion.button>
        ))}
      </div>

      <motion.button
        onClick={() => selected !== null && onSubmit(question.options[selected])}
        disabled={selected === null}
        className="mt-4 w-full py-3 rounded-xl font-semibold text-sm text-white
          bg-gradient-to-r from-violet-600 to-indigo-600
          disabled:opacity-30 disabled:cursor-not-allowed
          transition-all hover:brightness-110 active:scale-[0.98]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: question.options.length * 0.06 + 0.1 }}
      >
        Submit Answer
      </motion.button>
    </>
  )
}

function FRQInput({ question, onSubmit }: { question: FRQQuestion; onSubmit: (answer: string) => void }) {
  const [text, setText] = useState('')

  return (
    <>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full h-28 rounded-xl bg-white/[0.04] border border-white/[0.08]
          text-white text-sm placeholder-white/25 p-3.5 resize-none
          focus:outline-none focus:ring-1 focus:ring-violet-400/50 focus:bg-white/[0.06]
          transition-colors"
        autoFocus
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-white/25 text-xs">{text.length} chars</span>
        <button
          onClick={() => text.trim() && onSubmit(text)}
          disabled={!text.trim()}
          className="px-5 py-2 rounded-xl font-semibold text-sm text-white
            bg-gradient-to-r from-violet-600 to-indigo-600
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-all hover:brightness-110 active:scale-[0.98]"
        >
          Submit
        </button>
      </div>
    </>
  )
}

function SuccessView() {
  return (
    <motion.div
      className="flex flex-col items-center gap-3 py-6"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 16 }}
    >
      <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
        <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-emerald-400 font-semibold">Answer submitted!</p>
        <p className="text-white/40 text-sm mt-0.5">Nice work</p>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const [question, setQuestion] = useState<Question | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const es = new EventSource('/api/questions')
    es.onopen = () => setConnected(true)
    es.onerror = () => setConnected(false)
    es.onmessage = e => {
      try {
        const msg = JSON.parse(e.data as string)
        if (msg.type === 'question') {
          setQuestion(msg.question)
          setSubmitted(false)
        } else if (msg.type === 'connected') {
          setConnected(true)
        }
      } catch { /* ignore malformed messages */ }
    }
    return () => es.close()
  }, [])

  function handleSubmit(_answer: string) {
    setSubmitted(true)
    setTimeout(() => {
      setQuestion(null)
      setSubmitted(false)
    }, 2400)
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050508] flex items-center justify-center">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="orb orb-violet" />
        <div className="orb orb-indigo" />
        <div className="orb orb-blue" />
      </div>

      {/* Connection badge */}
      <div className="fixed top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07]">
        <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-500/80'}`} />
        <span className="text-white/35 text-xs">{connected ? 'Live' : 'Connecting…'}</span>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {!question ? (
          <motion.div
            key="idle"
            className="flex flex-col items-center gap-5 select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <div className="relative flex items-center justify-center">
              <motion.div
                className="absolute w-40 h-40 rounded-full bg-violet-600/10"
                animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="w-28 h-28 rounded-full border border-white/[0.09] bg-white/[0.025] flex flex-col items-center justify-center"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-white font-bold text-xs tracking-[0.22em]">LIVE</span>
                </div>
              </motion.div>
            </div>
            <div className="text-center">
              <p className="text-white/55 font-medium">Stay focused</p>
              <p className="text-white/22 text-sm mt-1">Questions will appear here</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="question"
            className="w-full max-w-md mx-4"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 310 }}
          >
            {/* Gradient-border card */}
            <div className="p-px rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-400">
              <div className="rounded-[15px] bg-[#0e0e18] p-5">
                {/* Type badge */}
                <div className="mb-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase
                    bg-violet-500/12 text-violet-300 border border-violet-500/20">
                    {question.type === 'mcq' ? 'Multiple Choice' : 'Free Response'}
                  </span>
                </div>

                {/* Question */}
                <p className="text-white text-lg font-semibold leading-snug mb-4">
                  {question.question}
                </p>

                <div className="h-px bg-white/[0.07] mb-4" />

                {/* Answer area */}
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <SuccessView key="success" />
                  ) : question.type === 'mcq' ? (
                    <motion.div key="mcq" exit={{ opacity: 0 }}>
                      <MCQOptions question={question} onSubmit={handleSubmit} />
                    </motion.div>
                  ) : (
                    <motion.div key="frq" exit={{ opacity: 0 }}>
                      <FRQInput question={question} onSubmit={handleSubmit} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
