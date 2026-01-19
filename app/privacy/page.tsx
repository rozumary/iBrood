"use client"

import { Shield, Lock, Eye, Database, UserCheck, Mail } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="bg-gradient-to-b from-amber-50/50 to-orange-50/30">
      <Navigation />

      <main style={{ flex: '1' }} className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-700 text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Your Privacy Matters
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-amber-700/70">Last updated: December 2025</p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 p-6 shadow-sm">
            <p className="text-amber-700/80 leading-relaxed">
              At iBrood, we are committed to protecting your privacy. This Privacy Policy explains how we collect, 
              use, and safeguard your information when you use our beekeeping analysis application.
            </p>
          </div>

          {/* Data Collection */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                <Database className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-heading font-bold text-amber-900">Information We Collect</h2>
            </div>
            <ul className="space-y-3 text-amber-700/80">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold mt-1">•</span>
                <span><strong>Images:</strong> Photos of hive frames you upload for analysis. These are processed locally and not permanently stored on our servers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold mt-1">•</span>
                <span><strong>Analysis Results:</strong> Detection results are stored in your browser's local storage for your convenience.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold mt-1">•</span>
                <span><strong>Account Information:</strong> Basic profile information if you create an account (email, name).</span>
              </li>
            </ul>
          </div>

          {/* Data Usage */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                <Eye className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-heading font-bold text-amber-900">How We Use Your Data</h2>
            </div>
            <ul className="space-y-3 text-amber-700/80">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold mt-1">•</span>
                <span>To provide AI-powered queen cell and brood pattern analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold mt-1">•</span>
                <span>To improve our detection models and user experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold mt-1">•</span>
                <span>To store your analysis history for future reference</span>
              </li>
            </ul>
          </div>

          {/* Data Security */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                <Lock className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-heading font-bold text-amber-900">Data Security</h2>
            </div>
            <p className="text-amber-700/80 leading-relaxed">
              We implement appropriate security measures to protect your personal information. 
              Your uploaded images are processed in real-time and are not permanently stored on our servers. 
              Analysis results are stored locally in your browser and can be cleared at any time through the Settings page.
            </p>
          </div>

          {/* Your Rights */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                <UserCheck className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-heading font-bold text-amber-900">Your Rights</h2>
            </div>
            <ul className="space-y-3 text-amber-700/80">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold mt-1">•</span>
                <span>Access and view your stored analysis data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold mt-1">•</span>
                <span>Delete your local data at any time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold mt-1">•</span>
                <span>Request information about data we may hold</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-amber-100/50 to-orange-100/50 rounded-2xl border border-amber-200/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#FFA95C] rounded-xl">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-heading font-bold text-amber-900">Questions?</h2>
            </div>
            <p className="text-amber-700/80 mb-3">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="text-amber-800 font-medium">
              <p>Rosemarie D. Montesa</p>
              <p>Email: rosedecastromontesa@gmail.com</p>
              <p>Phone: 09812515648</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
