"use client"

import Link from "next/link"
import { Beef as Bee, Grid3X3, CheckCircle, Sparkles, BarChart3, Hexagon } from "lucide-react"
import Footer from "@/components/footer"
import { useEffect } from "react"

export default function LandingPage() {
  // Using inline styles for reliable sticky footer behavior
  
  // Clear user data when landing on this page (for logout functionality)
  useEffect(() => {
    // Clear all user-related data from localStorage when landing on the home page
    // This handles the logout scenario where user data should be cleared
    localStorage.removeItem('ibrood_current_user');
    localStorage.removeItem('ibrood_queen_cell_analyses');
    localStorage.removeItem('ibrood_brood_analyses');
    localStorage.removeItem('ibrood_queen_cell_logs');
    localStorage.removeItem('ibrood_brood_logs');
    localStorage.removeItem('ibrood_preferences');
    localStorage.removeItem('ibrood_notifications');
 }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', margin: 0, padding: 0 }} className="bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* ...existing code... */}
      {/* Header removed, only dark mode toggle remains in layout */}

      <main>
        {/* Hero Section */}
        <section className="w-full px-0 py-12 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/50 rounded-full text-amber-700 dark:text-amber-300 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Beekeeping Analysis
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-amber-900 dark:text-amber-100 mb-6 leading-tight">
            Intelligent Beekeeping<br />
            <span className="text-[#FFA95C]">with iBrood</span>
          </h1>
          <p className="text-base sm:text-xl text-amber-700/80 dark:text-amber-300/80 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
            Analyze queen cell development and brood patterns using computer vision technology, and keep your hive healthy with actionable insights and timely recommendations.
          </p>
          <hr className="my-8 border-amber-200 dark:border-amber-700/60 max-w-3xl mx-auto" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            {/* Removed 'Enter the Server' button */}
            <Link href="/try-model" className="px-6 sm:px-8 py-3 sm:py-4 bg-[#FFA95C] rounded-2xl font-semibold hover:bg-[#FFA95C]/80 transition-all duration-300 text-base sm:text-lg text-white shadow-lg">
              Explore Model
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gradient-to-b from-amber-100/50 to-orange-100/50 dark:from-gray-800/50 dark:to-gray-900/50 py-16 sm:py-24">
          <div className="w-full px-0">
            <h2 className="text-2xl sm:text-4xl font-heading font-bold text-center mb-4 text-amber-900 dark:text-amber-100">Why Choose iBrood?</h2>
            <p className="text-center text-amber-700/70 dark:text-amber-300/70 mb-12 sm:mb-16 max-w-2xl mx-auto px-4">Advanced AI technology designed specifically for beekeepers who want the best for their colonies.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-amber-200/50 dark:border-amber-700/30 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center">
                <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-2xl w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                  <Bee className="w-8 sm:w-10 h-8 sm:h-10 text-amber-600" />
                </div>
                <h3 className="font-heading font-semibold text-lg sm:text-xl mb-3 text-amber-900 dark:text-amber-100">Queen Cell Analysis</h3>
                <p className="text-amber-700/70 dark:text-amber-300/70 leading-relaxed text-sm sm:text-base">AI-powered detection and maturity assessment of queen cells with precise hatching predictions.</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-amber-200/50 dark:border-amber-700/30 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center">
                <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-2xl w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                  <Grid3X3 className="w-8 sm:w-10 h-8 sm:h-10 text-amber-600" />
                </div>
                <h3 className="font-heading font-semibold text-lg sm:text-xl mb-3 text-amber-900 dark:text-amber-100">Brood Pattern Analysis</h3>
                <p className="text-amber-700/70 dark:text-amber-300/70 leading-relaxed text-sm sm:text-base">Monitor brood health through counts of egg, larva, and pupa proportions to detect early signs of colony collapse.</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-amber-200/50 dark:border-amber-700/30 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center">
                <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-2xl w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                  <CheckCircle className="w-8 sm:w-10 h-8 sm:h-10 text-amber-600" />
                </div>
                <h3 className="font-heading font-semibold text-lg sm:text-xl mb-3 text-amber-900 dark:text-amber-100">Health Risk Indicators</h3>
                <p className="text-amber-700/70 dark:text-amber-300/70 leading-relaxed text-sm sm:text-base">Derive health-risk indicators from brood proportions with trend analysis and early warning systems.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Accuracy Section */}
        <section className="w-full px-0 py-12 sm:py-20">
          <div className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-gray-900/50 rounded-3xl p-6 sm:p-10 border border-amber-200/50 dark:border-amber-700/30 shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BarChart3 className="w-6 sm:w-8 h-6 sm:h-8 text-amber-600" />
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-amber-900 dark:text-amber-100">How accurate is the AI analysis?</h2>
            </div>
            <p className="text-amber-700/80 dark:text-amber-300/80 text-center max-w-3xl mx-auto leading-relaxed mb-8 text-sm sm:text-base px-4">
              iBrood uses YOLOv11-Medium instance segmentation model trained on thousands of hive images.
              Results should always be confirmed with visual inspection.
            </p>
            
            {/* Model Performance Metrics Table */}
            <div className="overflow-x-auto">
              <table className="w-full max-w-2xl mx-auto border-collapse text-sm sm:text-base">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50">
                    <th className="px-4 sm:px-6 py-3 text-left text-amber-900 dark:text-amber-100 font-semibold border border-amber-200 dark:border-amber-700/50 rounded-tl-xl">Metric</th>
                    <th className="px-4 sm:px-6 py-3 text-center text-amber-900 dark:text-amber-100 font-semibold border border-amber-200 dark:border-amber-700/50 rounded-tr-xl">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white dark:bg-gray-800/50 hover:bg-amber-50/50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 border border-amber-200 dark:border-amber-700/50 text-amber-800 dark:text-amber-200 font-medium">Precision</td>
                    <td className="px-4 sm:px-6 py-4 border border-amber-200 dark:border-amber-700/50 text-center">
                      <span className="font-bold text-amber-900 dark:text-amber-100 bg-amber-100 dark:bg-amber-900/50 px-3 py-1 rounded-lg">0.956</span>
                    </td>
                  </tr>
                  <tr className="bg-amber-50/30 dark:bg-gray-900/30 hover:bg-amber-50/50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 border border-amber-200 dark:border-amber-700/50 text-amber-800 dark:text-amber-200 font-medium">Recall</td>
                    <td className="px-4 sm:px-6 py-4 border border-amber-200 dark:border-amber-700/50 text-center">
                      <span className="font-bold text-amber-900 dark:text-amber-100 bg-amber-100 dark:bg-amber-900/50 px-3 py-1 rounded-lg">0.950</span>
                    </td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800/50 hover:bg-amber-50/50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 border border-amber-200 dark:border-amber-700/50 text-amber-800 dark:text-amber-200 font-medium">mAP50</td>
                    <td className="px-4 sm:px-6 py-4 border border-amber-200 dark:border-amber-700/50 text-center">
                      <span className="font-bold text-amber-900 dark:text-amber-100 bg-amber-100 dark:bg-amber-900/50 px-3 py-1 rounded-lg">0.985</span>
                    </td>
                  </tr>
                  <tr className="bg-amber-50/30 dark:bg-gray-900/30 hover:bg-amber-50/50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 border border-amber-200 dark:border-amber-700/50 text-amber-800 dark:text-amber-200 font-medium rounded-bl-xl">mAP50-95</td>
                    <td className="px-4 sm:px-6 py-4 border border-amber-200 dark:border-amber-700/50 text-center rounded-br-xl">
                      <span className="font-bold text-amber-900 dark:text-amber-100 bg-amber-100 dark:bg-amber-900/50 px-3 py-1 rounded-lg">0.879</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-0 py-16 sm:py-24 text-center">
          <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-2xl w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-6 flex items-center justify-center">
            <Hexagon className="w-8 sm:w-10 h-8 sm:h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-amber-900 dark:text-amber-100 mb-6 px-4">
            Ready to Transform Your Beekeeping?
          </h2>
          <p className="text-base sm:text-lg text-amber-700/80 dark:text-amber-300/80 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
            Join thousands of beekeepers using iBrood for smarter hive management and healthier colonies.
          </p>
          {/* Removed 'Enter the Server' button */}
        </section>

        {/* Research & Learning Mode Section (screenshot style, now with 4 buttons) */}
        <section className="w-full px-0 py-16 sm:py-24 flex justify-center items-center">
          <div className="bg-white/80 border border-amber-200 rounded-2xl shadow-lg p-8 sm:p-12 max-w-xl w-full text-center" style={{ boxShadow: '0 6px 32px 0 rgba(0,0,0,0.07)' }}>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-amber-900 mb-4">Research & Learning Mode</h2>
            <p className="text-amber-700/80 mb-8 text-base sm:text-lg">Access the model playground, documentation, experimentation, and research resources for academic and learning purposes.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/research-mode/playground" className="block bg-[#FFA95C] hover:bg-[#FFA95C]/80 text-white font-semibold rounded-xl py-4 px-6 transition-all border border-amber-200 shadow-sm text-base sm:text-lg">Model Playground</Link>
              <Link href="/research-mode/documentation" className="block bg-[#FFA95C] hover:bg-[#FFA95C]/80 text-white font-semibold rounded-xl py-4 px-6 transition-all border border-amber-200 shadow-sm text-base sm:text-lg">Model Documentation</Link>
              <Link href="/research-mode/experimentation" className="block bg-[#FFA95C] hover:bg-[#FFA95C]/80 text-white font-semibold rounded-xl py-4 px-6 transition-all border border-amber-200 shadow-sm text-base sm:text-lg">Model Experimentation</Link>
              <Link href="/research-mode/paper" className="block bg-[#FFA95C] hover:bg-[#FFA95C]/80 text-white font-semibold rounded-xl py-4 px-6 transition-all border border-amber-200 shadow-sm text-base sm:text-lg">Research Paper / Thesis</Link>
            </div>
          </div>
        </section>

        {/* Research & Model Tools Section */}
        <section className="w-full px-0 py-16 sm:py-24 text-center">
          <h2 className="text-2xl sm:text-4xl font-heading font-bold text-amber-900 dark:text-amber-100 mb-6 px-4">
            Explore iBrood Research & Tools
          </h2>
          <p className="text-base sm:text-lg text-amber-700/80 dark:text-amber-300/80 mb-10 max-w-2xl mx-auto px-4">
            Dive deeper into our AI models, documentation, and research resources.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Link href="/research-mode/playground" className="block bg-white/80 dark:bg-gray-800/80 border border-amber-200/50 dark:border-amber-700/30 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="font-heading font-semibold text-lg text-amber-900 dark:text-amber-100 mb-2">Model Playground</div>
              <div className="text-amber-700/70 dark:text-amber-300/70 text-sm">Test and interact with the AI model in a sandbox environment.</div>
            </Link>
            <Link href="/research-mode/documentation" className="block bg-white/80 dark:bg-gray-800/80 border border-amber-200/50 dark:border-amber-700/30 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="font-heading font-semibold text-lg text-amber-900 dark:text-amber-100 mb-2">Model Documentation</div>
              <div className="text-amber-700/70 dark:text-amber-300/70 text-sm">Read technical docs, guides, and API references for iBrood.</div>
            </Link>
            <Link href="/research-mode/experimentation" className="block bg-white/80 dark:bg-gray-800/80 border border-amber-200/50 dark:border-amber-700/30 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="font-heading font-semibold text-lg text-amber-900 dark:text-amber-100 mb-2">Model Experimentation</div>
              <div className="text-amber-700/70 dark:text-amber-300/70 text-sm">Experiment with different model settings and datasets.</div>
            </Link>
            <Link href="/research-mode/paper" className="block bg-white/80 dark:bg-gray-800/80 border border-amber-200/50 dark:border-amber-700/30 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="font-heading font-semibold text-lg text-amber-900 dark:text-amber-100 mb-2">Research Paper / Thesis</div>
              <div className="text-amber-700/70 dark:text-amber-300/70 text-sm">View the full research paper or thesis behind iBrood.</div>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
