"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import AuthNavigation from "@/components/auth-navigation"
import Footer from "@/components/footer"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields")
      return
    }
    if (password !== confirmPassword) {
      alert("Passwords don't match")
      return
    }
    // Simple mock signup - in production, validate with backend
    alert("Account created successfully!")
    router.push("/login")
  }
  return (
    <div className="min-h-screen bg-background">
      <AuthNavigation />

      <main className="max-w-md mx-auto px-6 py-16">
        <div className="bg-surface rounded-lg border border-border p-8">
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2 text-center">Sign Up</h1>
          <p className="text-muted text-center mb-8">Join iBrood today</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter your full name"
                required
              />
            </div>

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
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-secondary transition-colors"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}