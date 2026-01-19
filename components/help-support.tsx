"use client"

import { HelpCircle, ExternalLink, Mail } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpSupport() {
  const faqs = [
    {
      question: "How accurate is the AI analysis?",
      answer:
        "iBrood uses YOLOv11-Medium instance segmentation model trained on thousands of hive images. Our model achieves 0.956 Precision, 0.950 Recall, 0.985 mAP50, and 0.879 mAP50-95. Results should always be confirmed with visual inspection.",
    },
    {
      question: "How often should I analyze my hives?",
      answer:
        "For optimal monitoring, we recommend analyzing each frame every 7-10 days. During rainy season, you may reduce frequency to bi-weekly checks. Regular monitoring helps track queen cell development and brood health effectively.",
    },
    {
      question: "What image quality is needed?",
      answer:
        "Clear, well-lit images work best. Avoid shadows and ensure the frame is fully visible in the image. Daylight or bright LED lighting produces the most accurate results.",
    },
    {
      question: "Does iBrood require internet?",
      answer:
        "Yes, iBrood requires an internet connection to perform AI analysis. The detection is processed on our cloud servers for accurate results. Your analysis history is saved locally on your device.",
    },
    {
      question: "How do I backup my data?",
      answer:
        "Go to Settings > Data Management to export your data as JSON. Enable auto-backup for daily automatic backups.",
    },
    {
      question: "Is my data private?",
      answer:
        "Your analysis history is stored locally on your device. Images are only sent temporarily for AI processing and are not stored on our servers.",
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* About Section */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/30 p-4 sm:p-6 shadow-sm">
        <h2 className="font-heading font-semibold text-lg mb-4 text-amber-900 dark:text-amber-100">About iBrood</h2>
        <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed mb-4">
          iBrood is an intelligent system designed to help beekeepers monitor hive health through AI-powered analysis of
          queen cell development and brood patterns. Our mission is to make advanced hive monitoring accessible to
          beekeepers of all experience levels.
        </p>
        <div className="space-y-2">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <strong className="text-amber-900 dark:text-amber-100">Version:</strong> 1.0.0
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <strong className="text-amber-900 dark:text-amber-100">Last Updated:</strong> Jan 19, 2026
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <strong className="text-amber-900 dark:text-amber-100">Build:</strong> PWA v1
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/30 p-4 sm:p-6 shadow-sm">
        <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2 text-amber-900 dark:text-amber-100">
          <HelpCircle className="w-5 h-5 text-amber-600" />
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-amber-200 dark:border-amber-700/50">
              <AccordionTrigger className="text-amber-900 dark:text-amber-100 hover:text-amber-600 dark:hover:text-amber-400 text-left text-sm sm:text-base">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-amber-700 dark:text-amber-300 text-sm">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Support & Links */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 dark:border-amber-700/30 p-4 sm:p-6 shadow-sm">
        <h2 className="font-heading font-semibold text-lg mb-4 text-amber-900 dark:text-amber-100">Support & Documentation</h2>
        <div className="space-y-3">
          <a
            href="/privacy"
            className="flex items-center justify-between p-3 border border-amber-200 dark:border-amber-700/50 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors group"
          >
            <span className="font-medium text-amber-800 dark:text-amber-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">Privacy Policy</span>
            <ExternalLink className="w-4 h-4 text-amber-500" />
          </a>
          <a
            href="/about"
            className="flex items-center justify-between p-3 border border-amber-200 dark:border-amber-700/50 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors group"
          >
            <span className="font-medium text-amber-800 dark:text-amber-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">About the Researchers</span>
            <ExternalLink className="w-4 h-4 text-amber-500" />
          </a>
          <a
            href="/contact"
            className="flex items-center justify-between p-3 border border-amber-200 dark:border-amber-700/50 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors group"
          >
            <span className="font-medium text-amber-800 dark:text-amber-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">Contact Developer</span>
            <ExternalLink className="w-4 h-4 text-amber-500" />
          </a>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl border border-amber-300 dark:border-amber-700/50 p-4 sm:p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <Mail className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-heading font-semibold text-amber-900 dark:text-amber-100 mb-2">Need Help?</h3>
            <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">Have questions or feedback? Contact the developer.</p>
            <a
              href="mailto:rosedecastromontesa@gmail.com"
              className="inline-block px-4 py-2 bg-[#FFA95C] text-white rounded-xl font-medium hover:bg-[#ff9b40] transition-all shadow-md text-sm sm:text-base"
            >
              Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
