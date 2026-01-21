"use client"

import Link from "next/link";
import Footer from "@/components/footer";

export default function StudentModePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-900">
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl p-10 max-w-2xl w-full text-center border-2 border-amber-300">
          <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-4">Student Learning Mode</h1>
          <p className="text-amber-700/80 dark:text-amber-300/80 mb-8 text-lg">Access educational resources, model playground, and learning materials designed for students.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Link href="/research-mode/playground" className="block bg-amber-100 hover:bg-amber-200 dark:bg-gray-800/80 dark:hover:bg-amber-900/30 rounded-xl p-6 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 font-semibold text-lg shadow transition-all">Model Playground</Link>
            <Link href="/research-mode/documentation" className="block bg-amber-100 hover:bg-amber-200 dark:bg-gray-800/80 dark:hover:bg-amber-900/30 rounded-xl p-6 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 font-semibold text-lg shadow transition-all">Learning Resources</Link>
            <Link href="/research-mode/experimentation" className="block bg-amber-100 hover:bg-amber-200 dark:bg-gray-800/80 dark:hover:bg-amber-900/30 rounded-xl p-6 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 font-semibold text-lg shadow transition-all">Experiments</Link>
            <Link href="/research-mode/paper" className="block bg-amber-100 hover:bg-amber-200 dark:bg-gray-800/80 dark:hover:bg-amber-900/30 rounded-xl p-6 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 font-semibold text-lg shadow transition-all">Study Materials</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
