"use client"

import Link from "next/link"
import Image from "next/image"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export default function AuthNavigation() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 border-b border-amber-200/50 dark:border-amber-700/30 backdrop-blur-sm">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg sm:rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <Image
                src="/IMG_3630.png"
                alt="iBrood Logo"
                width={22}
                height={22}
                className="w-5 h-5 sm:w-[26px] sm:h-[26px]"
              />
            </div>
            <span className="font-heading font-bold text-lg sm:text-xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">iBrood</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-all duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            <Link
              href="/login"
              className="px-3 sm:px-5 py-2 sm:py-2.5 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-xl transition-all duration-300 font-medium hover:-translate-y-0.5 text-sm sm:text-base"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 rounded-xl transition-all duration-300 font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm sm:text-base"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
