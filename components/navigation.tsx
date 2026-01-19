"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, LogOut, Check, Sun, Moon } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { useTranslation } from "@/lib/translation-context"

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showLogoutToast, setShowLogoutToast] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    setShowLogoutToast(true)
    setTimeout(() => {
      setShowLogoutToast(false)
      router.push("/")
    }, 1500)
  }

  const links = [
    { href: "/dashboard", label: t('nav.dashboard') },
    { href: "/analytics", label: t('nav.analytics') },
    { href: "/history", label: t('nav.history') },
    { href: "/settings", label: t('nav.settings') },
  ]

  return (
    <nav className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 border-b border-amber-200/50 dark:border-amber-700/30 sticky top-0 z-50 backdrop-blur-sm">
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm ${
                  pathname === link.href 
                    ? "bg-[#FFA95C] text-white shadow-md" 
                    : "text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:-translate-y-0.5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 ml-4">
              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2.5 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-xl transition-all duration-300"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              )}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-xl transition-all duration-300 font-medium text-sm hover:-translate-y-0.5"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-all duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-all duration-300"
            >
              {mobileOpen ? <X size={24} className="text-amber-700 dark:text-amber-300" /> : <Menu size={24} className="text-amber-700 dark:text-amber-300" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-2 pb-4 border-t border-amber-200/50 dark:border-amber-700/30 pt-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                  pathname === link.href 
                    ? "bg-[#FFA95C] text-white shadow-md" 
                    : "text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2">
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-xl transition-all duration-300 font-medium text-sm"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Logout Toast Notification */}
      {showLogoutToast && (
        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-[#FFA95C] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <Check className="w-5 h-5" />
          <span className="font-medium text-sm sm:text-base">Logged out successfully!</span>
        </div>
      )}
    </nav>
  )
}
