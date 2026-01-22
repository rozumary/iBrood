"use client"

import { useState, useEffect } from "react"
import Dashboard from "../dashboard/page"

export default function BeekeeperModePage() {
  const [showDisclaimer, setShowDisclaimer] = useState(true)

  function handleProceed() {
    sessionStorage.setItem('ibrood_beekeeper_disclaimer_seen', 'true')
    setShowDisclaimer(false)
  }

  return (
    <>{showDisclaimer ? (
      <div className="fixed inset-0 z-[9999] min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-900 p-4">
        <div className="bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl p-8 max-w-lg w-full text-center border-2 border-amber-300">
          <h2 className="text-2xl font-bold mb-3 text-amber-900 dark:text-amber-100">Beekeeper Mode Disclaimer</h2>
          <p className="mb-6 text-amber-700/90 dark:text-amber-300/90 text-base">
            This mode is intended for actual beekeepers and trained users.<br/>
            Outputs are AI-assisted recommendations and should be validated with expert judgment.
          </p>
          <button onClick={handleProceed} className="w-full bg-[#FFA95C] text-white font-semibold py-3 rounded-xl hover:bg-[#FFA95C]/80 transition-all text-lg shadow-lg">I Understand and Proceed</button>
        </div>
      </div>
    ) : (
      <Dashboard />
    )}</>
  )
}
