"use client"

import Link from "next/link"
import { Beef as Bee, Grid3X3, CheckCircle } from "lucide-react"
import Footer from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-accent rounded-lg">
              <img src="/honeycomb-logo.svg" alt="iBrood" className="w-7 h-7" />
            </div>
            <span className="font-heading font-bold text-xl">iBrood</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-4 py-2 text-accent hover:bg-surface-hover rounded-lg transition-colors font-medium">
              Log In
            </Link>
            <Link href="/signup" className="px-4 py-2 bg-accent text-white hover:bg-accent-secondary rounded-lg transition-colors font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-text-primary mb-6">
            Intelligent Beekeeping with iBrood
          </h1>
          <p className="text-xl text-muted mb-8 max-w-3xl mx-auto">
            AI-powered analysis for queen cell development and brood patterns. Monitor your hive health with intelligent insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="px-8 py-4 bg-accent text-white rounded-lg font-medium hover:bg-accent-secondary transition-colors text-lg">
              Get Started Free
            </Link>
            <Link href="/login" className="px-8 py-4 border border-border rounded-lg font-medium hover:bg-surface-hover transition-colors text-lg">
              Sign In
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-surface py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-heading font-bold text-center mb-12">Why Choose iBrood?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="p-4 bg-yellow-100 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Bee className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2">Queen Cell Analysis</h3>
                <p className="text-muted">AI-powered detection and maturity assessment of queen cells with precise hatching predictions.</p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-yellow-100 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Grid3X3 className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2">Brood Pattern Analysis</h3>
                <p className="text-muted">Monitor brood health and coverage patterns to ensure optimal colony development.</p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-yellow-100 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2">Smart Analytics</h3>
                <p className="text-muted">Get actionable recommendations and track trends for healthier, more productive hives.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Accuracy Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="bg-surface rounded-lg p-8 border border-border">
            <h2 className="text-2xl font-heading font-bold text-center mb-4">How accurate is the AI analysis?</h2>
            <p className="text-muted text-center max-w-3xl mx-auto">
              iBrood uses YOLOv11-Medium instance segmentation model trained on thousands of hive images. 
              Our queen cell detection achieves <span className="font-semibold text-text-primary">93-98% precision</span>, 
              <span className="font-semibold text-text-primary"> 89-100% recall</span>, and 
              <span className="font-semibold text-text-primary"> 97-99% mAP50</span> across all cell types 
              (Capped, Failed, Matured, Open, Semi-Matured). Results should always be confirmed with visual inspection.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-heading font-bold text-text-primary mb-4">
            Ready to Transform Your Beekeeping?
          </h2>
          <p className="text-lg text-muted mb-8">
            Join thousands of beekeepers using iBrood for smarter hive management.
          </p>
          <Link href="/signup" className="px-8 py-4 bg-accent text-white rounded-lg font-medium hover:bg-accent-secondary transition-colors text-lg">
            Start Your Free Trial
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}
