import { Beef as Bee, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 border-t border-amber-200 dark:border-amber-700/30 mt-16">
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-2 mb-3 justify-center sm:justify-start">
              <div className="p-1.5 bg-[#FFA95C] rounded-lg">
                <Bee className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-heading font-bold text-xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">iBrood</h3>
            </div>
            <p className="text-amber-700/70 dark:text-amber-300/70 text-sm max-w-xs mx-auto sm:mx-0">Intelligent beekeeping analysis for healthier hives and thriving colonies</p>
          </div>
          
          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/about" className="text-amber-700/70 dark:text-amber-300/70 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-300 hover:-translate-y-0.5 font-medium">About Us</Link>
              <Link href="/contact" className="text-amber-700/70 dark:text-amber-300/70 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-300 hover:-translate-y-0.5 font-medium">Contact</Link>
              <Link href="/privacy" className="text-amber-700/70 dark:text-amber-300/70 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-300 hover:-translate-y-0.5 font-medium">Privacy Policy</Link>
            </div>
          </div>
          
          {/* Contact Developer */}
          <div className="text-center sm:text-left sm:col-span-2 md:col-span-1">
            <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-3">Contact Developer</h4>
            <p className="text-xs text-amber-700/70 dark:text-amber-300/70 mb-2">For technical issues:</p>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Rosemarie D. Montesa</p>
            <div className="flex items-center gap-2 text-sm text-amber-700/70 dark:text-amber-300/70 mt-1 justify-center sm:justify-start">
              <Phone className="w-3.5 h-3.5" />
              <span>09812515648</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-amber-700/70 dark:text-amber-300/70 mt-1 justify-center sm:justify-start">
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              <a href="mailto:rosedecastromontesa@gmail.com" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors break-all">
                rosedecastromontesa@gmail.com
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-amber-200/50 dark:border-amber-700/30 pt-6 text-center text-xs text-amber-600/60 dark:text-amber-400/60">
          <p>© 2026 iBrood. All rights reserved. | BSCS 4AIS Thesis Project</p>
        </div>
      </div>
    </footer>
  )
}