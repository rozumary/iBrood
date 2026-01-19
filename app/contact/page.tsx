"use client"

import { Phone, Mail, MapPin, MessageCircle } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="bg-gradient-to-b from-amber-50/50 to-orange-50/30">
      <Navigation />

      <main style={{ flex: '1' }} className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-700 text-sm font-medium mb-4">
            <MessageCircle className="w-4 h-4" />
            Get in Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-amber-700/80 max-w-2xl mx-auto">
            Have questions or experiencing technical issues? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 p-6 shadow-sm">
              <h2 className="text-xl font-heading font-bold text-amber-900 mb-6">Developer Contact</h2>
              <p className="text-amber-700/70 mb-6">
                For any technical issues, bugs, or feature requests, please contact our lead developer:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                    <Mail className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-amber-600 font-medium">Email</p>
                    <a href="mailto:rosedecastromontesa@gmail.com" className="text-amber-900 hover:text-amber-600 transition-colors">
                      rosedecastromontesa@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                    <Phone className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-amber-600 font-medium">Phone</p>
                    <a href="tel:09812515648" className="text-amber-900 hover:text-amber-600 transition-colors">
                      09812515648
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-amber-600 font-medium">Location</p>
                    <p className="text-amber-900">Santa Rosa, Laguna, Philippines</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-100/50 to-orange-100/50 rounded-2xl border border-amber-200/50 p-6">
              <h3 className="font-heading font-bold text-amber-900 mb-2">Response Time</h3>
              <p className="text-amber-700/80 text-sm">
                We typically respond within 24-48 hours during weekdays. For urgent issues, please call directly.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 p-6 shadow-sm">
            <h2 className="text-xl font-heading font-bold text-amber-900 mb-6">Send a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-amber-800 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 text-amber-900 placeholder-amber-400"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-amber-800 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 text-amber-900 placeholder-amber-400"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-amber-800 mb-2">Subject</label>
                <select className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 text-amber-900">
                  <option value="">Select a topic</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="question">General Question</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-amber-800 mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 text-amber-900 placeholder-amber-400 resize-none"
                  placeholder="Describe your issue or question..."
                />
              </div>
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault()
                  window.location.href = 'mailto:rosedecastromontesa@gmail.com'
                }}
                className="w-full px-6 py-3.5 bg-[#FFA95C] text-white rounded-xl font-semibold hover:bg-[#ff9b40] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
