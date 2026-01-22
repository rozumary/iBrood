"use client";

import Footer from "@/components/footer";

export default function ResearchPaperPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-900">
      <div className="flex-grow w-full p-2 md:p-4">
        <div className="bg-white/90 dark:bg-gray-900/80 w-full h-[85vh] md:h-[90vh] flex flex-col border-2 border-amber-300 rounded-lg overflow-hidden">
          <h1 className="text-xl md:text-2xl font-bold text-amber-900 dark:text-amber-100 py-3 text-center bg-amber-50 dark:bg-gray-800">10-PAGER</h1>
          <div className="w-full flex-grow overflow-auto relative">
            <iframe
              src="/CSA05- 10 PAGER.pdf"
              className="w-full h-full absolute inset-0"
              title="10-PAGER"
            />
            <div className="md:hidden absolute inset-0 flex items-center justify-center bg-amber-50/95 dark:bg-gray-800/95">
              <div className="text-center p-6">
                <p className="text-amber-900 dark:text-amber-100 mb-4">PDF viewer works best in full screen</p>
                <a 
                  href="/CSA05- 10 PAGER.pdf" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors"
                >
                  Open PDF in New Tab
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
