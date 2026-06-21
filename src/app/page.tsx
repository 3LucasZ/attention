"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Bookmark, CheckCircle, Zap } from "lucide-react";

// Mock data to simulate the live Deepgram transcript
const MOCK_TRANSCRIPT = [
  "Alright, let's get started.",
  "Today we are diving into Gradient Descent.",
  "At its core, Gradient Descent is an optimization algorithm.",
  "We use it to minimize the loss function in our machine learning models.",
  "Imagine you are blindfolded at the top of a hill...",
];

export default function SidecarApp() {
  const [transcript, setTranscript] = useState<string[]>([]);
  const [showQuestion, setShowQuestion] = useState(false);
  const [answeredState, setAnsweredState] = useState<null | "correct">(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulates the live rolling transcript coming in from Deepgram
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < MOCK_TRANSCRIPT.length) {
        setTranscript((prev) => [...prev, MOCK_TRANSCRIPT[index]]);
        index++;
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to the bottom of the transcript
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  const handleAnswer = () => {
    setAnsweredState("correct");
    // Wait 2 seconds for them to see their score, then dismiss
    setTimeout(() => {
      setShowQuestion(false);
      setAnsweredState(null);
    }, 2000);
  };

  return (
    // The main container forces a narrow, vertical layout
    <div className="flex justify-center w-full h-screen bg-gray-100">
      <main className="w-full max-w-[400px] h-full bg-white shadow-2xl border-l border-r border-gray-200 flex flex-col relative overflow-hidden">
        {/* Header - Listening Indicator */}
        <header className="p-4 border-b flex items-center justify-between bg-white z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </div>
            <span className="font-semibold text-gray-800 text-sm flex items-center gap-1">
              <Mic size={16} /> Listening...
            </span>
          </div>
          <div className="flex items-center gap-1 text-orange-500 font-bold bg-orange-50 px-3 py-1 rounded-full text-sm">
            <Zap size={16} /> 120 pts
          </div>
        </header>

        {/* Transcript Feed Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 pb-32 scroll-smooth"
        >
          {transcript.map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gray-600 text-sm leading-relaxed"
            >
              {text}
            </motion.div>
          ))}
        </div>

        {/* --- DEMO TRIGGER BUTTON --- */}
        {/* In the final app, this is triggered by the AI backend, not a button */}
        {!showQuestion && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
            <button
              onClick={() => setShowQuestion(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:bg-blue-700 transition-colors"
            >
              Simulate AI Question
            </button>
          </div>
        )}

        {/* Slide-Up Question Card */}
        <AnimatePresence>
          {showQuestion && (
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-2xl z-20"
            >
              {answeredState === "correct" ? (
                // Success State (Simulating Redis Similarity Search match)
                <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    <CheckCircle className="text-green-500 w-16 h-16" />
                  </motion.div>
                  <h3 className="font-bold text-xl text-gray-800">Spot On!</h3>
                  <p className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    Similarity Score: 92%
                  </p>
                  <p className="text-xs text-gray-400 mt-2">+50 Speed Bonus</p>
                </div>
              ) : (
                // Question State
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      Quick Check
                    </span>
                    <button
                      onClick={() => setShowQuestion(false)}
                      className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-xs font-medium bg-gray-100 px-2 py-1 rounded"
                    >
                      <Bookmark size={12} /> Save for later
                    </button>
                  </div>

                  <h3 className="font-semibold text-gray-800 text-base mb-4 leading-tight">
                    What is the primary purpose of Gradient Descent?
                  </h3>

                  <div className="space-y-2">
                    {[
                      "To maximize the learning rate",
                      "To minimize the loss function",
                      "To generate random weights",
                    ].map((opt, i) => (
                      <button
                        key={i}
                        onClick={handleAnswer}
                        className="w-full text-left p-3 rounded-xl border border-gray-200 text-sm text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition-all focus:ring-2 focus:ring-blue-500"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
