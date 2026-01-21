"use client";

import { useEffect, useState } from "react"
import { Folder } from "lucide-react";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";

export default function ModelExperimentationPage() {
  const [folders, setFolders] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();

  useEffect(() => {
    // Fetch the list of folders from the API route
    fetch("/api/models")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch model folders")
        return res.json()
      })
      .then((data) => setFolders(data.folders))
      .catch((err) => setError(err.message))
  }, [])

  const handleFolderClick = (folderName: string) => {
    // Navigate to the folder content page
    router.push(`/research-mode/experimentation/${encodeURIComponent(folderName)}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-900">
      <div className="flex-grow flex items-center justify-center w-full p-4">
        <div className="bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-xl p-8 max-w-2xl w-full border-2 border-amber-300">
          <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-6 text-center">Model Experimentation</h1>
          <p className="text-amber-700/80 dark:text-amber-300/80 mb-8 text-center max-w-xl mx-auto">Browse the available model folders below:</p>
          <div className="w-full text-left">
            {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
            <ul className="divide-y divide-amber-100 dark:divide-amber-800 rounded-lg overflow-hidden">
                {folders.length === 0 && !error && <li className="py-6 text-center text-amber-700/80 dark:text-amber-300/80">No folders found.</li>}
              {folders.map((folder) => (
                <li 
                  key={folder} 
                  className="flex items-center gap-4 py-4 px-6 cursor-pointer hover:bg-amber-50 dark:hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-[1.02]"
                  onClick={() => handleFolderClick(folder)}
                >
                  <Folder className="w-6 h-6 text-amber-500 flex-shrink-0" />
                  <span className="font-medium text-lg text-amber-900 dark:text-amber-100 break-all">{folder}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
