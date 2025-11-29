"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, LogOut } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    // In production, clear auth tokens/session
    alert("Logged out successfully!")
    router.push("/")
  }

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/analytics", label: "Analytics" },
    { href: "/history", label: "History" },
    { href: "/settings", label: "Settings" },
  ]

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-accent rounded-lg group-hover:shadow-lg transition-shadow">
              <Image
                src="/IMG_3630.png"
                alt="iBrood Logo"
                width={28}
                height={28}
              />
            </div>
            <span className="font-heading font-bold text-xl">iBrood</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                  pathname === link.href ? "bg-accent text-white" : "text-text-primary hover:bg-surface-hover"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 ml-4">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-2 pb-4 border-t border-border pt-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                  pathname === link.href ? "bg-accent text-white" : "text-text-primary hover:bg-surface-hover"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2">
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
