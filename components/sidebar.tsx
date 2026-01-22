
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, Grid3X3, BarChart3, History, Settings, LogOut, BookOpen, FileText, FlaskConical, GraduationCap, LayoutGrid } from "lucide-react";

interface SidebarProps {
  mode: "beekeeper" | "research" | "student";
  showExitSession?: boolean;
}

const amber = "#FFA95C";
const sidebarColor = "#565656";

const menuConfig = {
  beekeeper: {
    name: "iBrood",
    menu: [
      { label: "Home", href: "/", icon: Home },
      { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
      { label: "History", href: "/history", icon: History },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
  research: {
    name: "iBrood Research",
    menu: [
      { label: "Home", href: "/", icon: Home },
      { label: "Model Playground", href: "/research-mode/playground", icon: FlaskConical },
      { label: "Model Documentation", href: "/research-mode/documentation", icon: BookOpen },
      { label: "Model Experimentation", href: "/research-mode/experimentation", icon: FlaskConical },
      { label: "Thesis Paper", href: "/research-mode/paper", icon: FileText },
    ],
  },
  student: {
    name: "iBrood Student",
    menu: [
      { label: "Home", href: "/", icon: Home },
      { label: "Model Playground", href: "/research-mode/playground", icon: FlaskConical },
      { label: "Model Documentation", href: "/research-mode/documentation", icon: BookOpen },
      { label: "Model Experimentation", href: "/research-mode/experimentation", icon: FlaskConical },
      { label: "Thesis Paper", href: "/research-mode/paper", icon: GraduationCap },
    ],
  },
};

export default function Sidebar({ mode, showExitSession }: SidebarProps) {
  const pathname = usePathname();
  const { name, menu } = menuConfig[mode];
  const [open, setOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Sidebar content
  const sidebarContent = (
    <aside
      style={{ background: sidebarColor }}
      className="flex flex-col h-full text-white w-auto transition-all duration-300 shadow-xl m-0 p-0"
    >
      <div className="mb-8 flex items-center justify-center pt-6 gap-3 px-2">
        <img src="/IMG_3630.png" alt="Logo" className="w-10 h-10 rounded-lg bg-[#FFA95C] flex-shrink-0" />
        <span
          className="font-heading font-bold text-2xl md:text-3xl tracking-tight"
          style={{ color: amber }}
        >
          {name}
        </span>
      </div>
      <nav className="flex flex-col gap-2 flex-1">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-colors duration-200 text-lg ${
                  pathname === item.href
                    ? "bg-white/20 text-amber-300"
                    : "hover:bg-[#FFA95C]/80 hover:text-white text-white"
                }`}
                onClick={() => setOpen(false)}
              >
                <Icon className="w-6 h-6" />
                {item.label}
              </Link>
          );
        })}
      </nav>
      {showExitSession && (
        <button
          className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-colors duration-200 text-base md:text-lg bg-[#FFA95C] hover:bg-[#FFA95C]/80 text-white mb-4 mx-2 mt-auto"
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => {
              window.location.href = "/try-model";
            }, 1000);
          }}
        >
          <LogOut className="w-5 h-5 md:w-6 md:h-6" />
          Exit Session
        </button>
      )}
    </aside>
  );

  return (
    <>
      {isExiting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mx-auto mb-4"></div>
            <p className="text-amber-900 dark:text-amber-100 font-semibold">Exiting session...</p>
          </div>
        </div>
      )}
      {/* Mobile toggle - small vertical line */}
      <button
        className="md:hidden fixed left-2 top-[80px] h-12 w-1 z-40 bg-amber-500 rounded-full hover:w-1.5 hover:h-16 transition-all focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open sidebar"
      />
      {/* Sidebar overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />
      {/* Sidebar itself */}
      <div
        className={`fixed top-0 left-0 h-full z-50 md:relative md:z-0 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ width: 320, maxWidth: 320 }}
      >
        {sidebarContent}
      </div>
      {/* Desktop sidebar is always visible (handled by parent layout) */}
    </>
  );
}
