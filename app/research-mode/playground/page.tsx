"use client";

import Link from "next/link";
import Footer from "@/components/footer";

export default function ModelPlaygroundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-900">
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl p-10 max-w-xl w-full text-center border-2 border-amber-300">
          <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4">Model Playground</h1>
          <p className="text-amber-700/80 dark:text-amber-300/80 mb-6 text-lg">Upload an image and run the queen cell or brood pattern model. View predictions, confidence scores, and bounding boxes. No operational decisions are made in this mode.</p>
          <div className="flex flex-col gap-4 mt-8">
            <Link href="/queen-cell" className="w-full bg-[#FFA95C] text-white font-semibold py-3 rounded-xl hover:bg-[#FFA95C]/80 transition-all text-lg shadow-lg">Go to Queen Cell Analysis</Link>
            <Link href="/brood-pattern" className="w-full bg-[#FFA95C] text-white font-semibold py-3 rounded-xl hover:bg-[#FFA95C]/80 transition-all text-lg shadow-lg">Go to Brood Pattern Analysis</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
