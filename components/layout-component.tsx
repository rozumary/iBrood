'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import SidebarWrapper from './sidebar-wrapper';
import { ThemeProvider } from './theme-provider';
import { ThemeSwitcher } from './theme-switcher';

export default function LayoutComponent({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  let pathname = usePathname() || "";
  // Normalize pathname to remove trailing slashes (except for root)
  if (pathname !== "/") {
    pathname = pathname.replace(/\/+$/, "");
  }
  const isLanding = pathname === "/";
  const isTryModel = pathname === "/try-model";
  const isResearchMode = pathname.startsWith("/research-mode");
  const isStudentMode = pathname.startsWith("/student-mode");
  
  // Determine sidebar mode based on current path or stored preference
  let sidebarMode: "beekeeper" | "research" | "student" = "beekeeper";
  if (isResearchMode) {
    sidebarMode = "research";
  } else if (isStudentMode) {
    sidebarMode = "student";
  } else {
    // Check if there's a stored mode preference (for when user navigates from research mode)
    if (typeof window !== 'undefined') {
      const storedMode = localStorage.getItem('ibrood_user_mode');
      if (storedMode === 'research' || storedMode === 'student') {
        sidebarMode = storedMode;
      }
    }
  }

  // Store the current mode when in research or student mode
  useEffect(() => {
    if (isResearchMode) {
      localStorage.setItem('ibrood_user_mode', 'research');
    } else if (isStudentMode) {
      localStorage.setItem('ibrood_user_mode', 'student');
    } else if (pathname === '/') {
      // Clear stored mode when going to homepage
      localStorage.removeItem('ibrood_user_mode');
    }
  }, [pathname, isResearchMode, isStudentMode]);

  return (
    <>
      {!isLanding && !isTryModel && <SidebarWrapper mode={sidebarMode} />}
      <main className="flex-1 flex flex-col bg-transparent relative min-h-screen h-full w-full overflow-y-auto">
        <div className="w-full flex flex-col justify-start items-start px-4 sm:px-6 py-4 flex-grow">
          <div className="w-full flex-grow">
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
