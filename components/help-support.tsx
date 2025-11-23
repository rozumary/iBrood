"use client"

import { HelpCircle, ExternalLink, Mail } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpSupport() {
  const faqs = [
    {
      question: "How accurate is the AI analysis?",
      answer:
        "iBrood uses YOLOv11-Medium instance segmentation model trained on thousands of hive images. Our queen cell detection achieves 93-98% precision, 89-100% recall, and 97-99% mAP50 across all cell types (Capped, Failed, Matured, Open, Semi-Matured). Results should always be confirmed with visual inspection.",
    },
    {
      question: "How often should I analyze my hives?",
      answer:
        "For optimal monitoring, we recommend analyzing each frame every 7-10 days during active season. During winter, bi-weekly or monthly checks are usually sufficient.",
    },
    {
      question: "What image quality is needed?",
      answer:
        "Clear, well-lit images work best. Avoid shadows and ensure the frame is fully visible in the image. Daylight or bright LED lighting produces the most accurate results.",
    },
    {
      question: "Can I use iBrood offline?",
      answer:
        "Yes! iBrood is a Progressive Web App (PWA) that works offline. Your analyses are saved locally on your device.",
    },
    {
      question: "How do I backup my data?",
      answer:
        "Go to Settings > Data Management to export your data as JSON. Enable auto-backup for daily automatic backups.",
    },
    {
      question: "Is my data private?",
      answer:
        "All your data is stored locally on your device. iBrood does not send your images or data to any server unless you explicitly enable cloud sync (coming soon).",
    },
  ]

  return (
    <div className="space-y-8">
      {/* About Section */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h2 className="font-heading font-semibold text-lg mb-4">About iBrood</h2>
        <p className="text-sm text-text-primary leading-relaxed mb-4">
          iBrood is an intelligent system designed to help beekeepers monitor hive health through AI-powered analysis of
          queen cell development and brood patterns. Our mission is to make advanced hive monitoring accessible to
          beekeepers of all experience levels.
        </p>
        <div className="space-y-2">
          <p className="text-sm">
            <strong>Version:</strong> 1.0.0
          </p>
          <p className="text-sm">
            <strong>Last Updated:</strong> November 23, 2025
          </p>
          <p className="text-sm">
            <strong>Build:</strong> PWA v1
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-accent" />
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-text-primary hover:text-accent">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Support & Links */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h2 className="font-heading font-semibold text-lg mb-4">Support & Documentation</h2>
        <div className="space-y-3">
          <a
            href="#"
            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-surface-hover transition-colors group"
          >
            <span className="font-medium text-text-primary group-hover:text-accent">Privacy Policy</span>
            <ExternalLink className="w-4 h-4 text-muted" />
          </a>
          <a
            href="#"
            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-surface-hover transition-colors group"
          >
            <span className="font-medium text-text-primary group-hover:text-accent">Terms of Service</span>
            <ExternalLink className="w-4 h-4 text-muted" />
          </a>
          <a
            href="#"
            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-surface-hover transition-colors group"
          >
            <span className="font-medium text-text-primary group-hover:text-accent">User Guide & Tutorials</span>
            <ExternalLink className="w-4 h-4 text-muted" />
          </a>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-start gap-4">
          <Mail className="w-6 h-6 text-info flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-heading font-semibold text-text-primary mb-2">Contact Developer</h3>
            <p className="text-sm text-text-primary mb-3">Have questions or feedback? We'd love to hear from you.</p>
            <a
              href="mailto:support@ibrood.app"
              className="inline-block px-4 py-2 bg-info text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
