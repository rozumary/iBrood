"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Beef as Bee, AlertCircle } from "lucide-react"
import AuthNavigation from "@/components/auth-navigation"
import Footer from "@/components/footer"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState({ type: 'success', message: '' })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const showToastMessage = (type: 'success' | 'error', message: string) => {
    setToastMessage({ type, message })
    setShowToast(true)
    if (type === 'error') {
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      showToastMessage('error', 'Please fill in all fields')
      return
    }
    
    setIsLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_DATABASE_API_URL || 'http://localhost:8001'
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        showToastMessage('error', data.detail || 'Login failed')
        return
      }
      
      // Save session to localStorage for frontend state
      localStorage.setItem('ibrood_current_user', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        session_token: data.session_token
      }))
      
      showToastMessage('success', 'Login successful!')
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error) {
      showToastMessage('error', 'Unable to connect to server. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  // Using inline styles for reliable sticky footer behavior
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AuthNavigation />

      <main style={{ flex: '1' }} className="max-w-lg mx-auto px-6 py-16 w-full">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-amber-200/50 dark:border-amber-700/30 p-10 shadow-lg">
          <div className="text-center mb-8">
            <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Bee className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-amber-900 dark:text-amber-100 mb-2">Welcome Back</h1>
            <p className="text-amber-700/70 dark:text-amber-300/70">Sign in to continue to iBrood</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 border-2 border-amber-200 dark:border-amber-700/50 rounded-xl bg-white dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 text-amber-900 dark:text-amber-100 placeholder-amber-400 dark:placeholder-amber-500/50"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 border-2 border-amber-200 dark:border-amber-700/50 rounded-xl bg-white dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 text-amber-900 dark:text-amber-100 placeholder-amber-400 dark:placeholder-amber-500/50"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-amber-700/70 dark:text-amber-300/70 text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold hover:underline transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed bottom-8 right-8 ${toastMessage.type === 'success' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-red-500 to-red-600'} text-white px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50`}>
          {toastMessage.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{toastMessage.message}</span>
        </div>
      )}
    </div>
  )
}
