"use client"

import Link from "next/link"

export default function EnterServerPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-900">
      <div className="bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-amber-900 dark:text-amber-100">Enter Your Server</h1>
        <p className="mb-6 text-amber-700/80 dark:text-amber-300/80">Register your server to get started with iBrood. No account needed!</p>
        {/* Replace with your server registration form or instructions */}
        <form>
          <input type="text" placeholder="Server URL or IP" className="w-full mb-4 px-4 py-2 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400" />
          <button type="submit" className="w-full bg-[#FFA95C] text-white font-semibold py-2 rounded-lg hover:bg-[#ff9b40] transition-all">Register Server</button>
        </form>
      </div>
    </div>
  )
}
