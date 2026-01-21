"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
 const router = useRouter();

  useEffect(() => {
    // Clear user session from localStorage
    localStorage.removeItem('ibrood_current_user');
    localStorage.removeItem('ibrood_queen_cell_logs');
    localStorage.removeItem('ibrood_brood_logs');
    
    // Dispatch a custom event to notify other components about the logout
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
    
    // Redirect to start session page immediately after cleanup
    router.push('/try-model');
    router.refresh(); // Refresh to update the UI
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
        <p className="text-amber-700 dark:text-amber-300 text-lg">Logging out...</p>
      </div>
    </div>
  );
}
