"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import AuthNavigation from "@/components/auth-navigation"
import Footer from "@/components/footer"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showToast, setShowToast] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      setShowToast(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } else {
      alert("Please fill in all fields")
    }
  }
  // Using inline styles for reliable sticky footer behavior
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AuthNavigation />

      <main style={{ flex: '1' }} className="max-w-4xl mx-auto px-12 py-16">
        <div className="bg-surface rounded-lg border border-border p-10">
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2 text-center">Log In</h1>
          <p className="text-muted text-center mb-8">Welcome back to iBrood</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors"
            >
              Log In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-accent hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-yellow-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <Check className="w-5 h-5" />
          <span className="font-medium">Login successful!</span>
        </div>
      )}
    </div>
  )
}
