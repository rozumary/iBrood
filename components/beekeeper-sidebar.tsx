"use client"

import Link from "next/link"
import { Folder, FileText, FlaskConical, BookOpen, Home, BarChart3, Grid3X3, CheckCircle } from "lucide-react"

const beekeeperNav = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Brood Pattern", href: "/brood-pattern", icon: Grid3X3 },
  { label: "Queen Cell", href: "/queen-cell", icon: CheckCircle },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "History", href: "/history", icon: FileText },
  { label: "Settings", href: "/settings", icon: BookOpen },
]

export default function BeekeeperSidebar({ current, title = "iBrood Beekeeper", nav = beekeeperNav, widthClass = "w-60" }: { current?: string, title?: string, nav?: typeof beekeeperNav, widthClass?: string }) {
  return (
    <aside className={`h-screen min-h-screen ${widthClass}`} style={{ background: '#565656', color: '#fff' }}>
      <div className="mb-8 flex items-center gap-3 px-2 py-6">
        <img src="/IMG_3630.png" alt="iBrood" className="w-8 h-8 rounded-lg bg-[#FFA95C] shadow" />
        <span className="font-heading font-bold text-xl bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">{title}</span>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium hover:bg-gray-700/80 ${current === item.href ? 'bg-gray-700/90 text-amber-400' : 'text-white'}`} style={{ color: current === item.href ? '#FFC04D' : '#fff' }}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-8 text-xs text-gray-300 px-2">iBrood Beekeeper Sidebar</div>
    </aside>
  )
}
