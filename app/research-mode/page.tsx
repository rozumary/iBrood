"use client";

import Link from "next/link";
import Footer from "@/components/footer";


export default function ResearchModePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-900">
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl p-10 max-w-2xl w-full text-center border-2 border-amber-300">
          <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-4">Research & Learning Mode</h1>
          <p className="text-amber-700/80 dark:text-amber-300/80 mb-8 text-lg">Access the model playground, documentation, and research resources for academic and learning purposes.</p>
        </div>
      </div>
        {/* Sidebar is now only rendered in the layout, not here */}
        <Footer />
    </div>
  )
}
