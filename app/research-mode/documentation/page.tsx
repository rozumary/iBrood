"use client";

import Link from "next/link";
import Footer from "@/components/footer";

const datasets = [
  {
    name: "Queen Cell Dataset",
    url: "https://app.roboflow.com/space-ujzmi/queen-cells-segment-ri9y6-f88wd-p286k/2"
  },
  {
    name: "Brood Dataset",
    url: "https://app.roboflow.com/tree-soyjd/brood-analysis-9rgya-0akhc/1"
  }
]

export default function ModelDocumentationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-900">
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl p-10 max-w-lg w-full text-center border-2 border-amber-300 mx-auto">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-amber-900 dark:text-amber-100 mb-4">Model Documentation</h1>
          <p className="text-amber-700/80 dark:text-amber-300/80 mb-8">Explore datasets and resources used for model training and evaluation. Below are sample Roboflow datasets:</p>
          <div className="mx-auto text-left w-full">
            <ul className="space-y-4">
              {datasets.map((ds, idx) => (
                <li key={idx} className="bg-amber-50 dark:bg-gray-800/50 border border-amber-200 dark:border-amber-700/30 rounded-xl px-5 py-4 flex items-center justify-between hover:bg-amber-100 dark:hover:bg-gray-700/50 transition-all">
                  <span className="font-medium text-amber-900 dark:text-amber-100">{ds.name}</span>
                  <Link href={ds.url} target="_blank" className="text-amber-700 dark:text-amber-300 underline font-medium hover:text-orange-600 dark:hover:text-orange-400 transition-all">View Dataset</Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-amber-700/70 dark:text-amber-300/70 text-center">Add more dataset links as needed.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
