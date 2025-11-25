"use client"

import Link from "next/link"
import Image from "next/image"

export default function AuthNavigation() {
  return (
    <nav className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-accent rounded-lg group-hover:shadow-lg transition-shadow">
              <Image 
                src="/honeycomb-logo.svg" 
                alt="iBrood Logo" 
                width={28} 
                height={28}
              />
            </div>
            <span className="font-heading font-bold text-xl">iBrood</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-accent hover:bg-surface-hover rounded-lg transition-colors font-medium"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-accent text-white hover:bg-accent-secondary rounded-lg transition-colors font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}