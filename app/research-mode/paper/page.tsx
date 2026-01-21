"use client";

import Footer from "@/components/footer";

export default function ResearchPaperPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-900">
      <div className="flex-grow w-full p-0">
        <div className="bg-white/90 dark:bg-gray-900/80 w-full h-[90vh] flex flex-col flex-grow border-2 border-amber-300">
          <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-2 text-center p-2">10-PAGER</h1>
          <div className="w-full flex-grow bg-white flex items-center justify-center flex-grow">
            <iframe
              src="/CSA05- 10 PAGER.pdf#zoom=120"
              className="w-full h-full flex-grow"
              title="10-PAGER"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
