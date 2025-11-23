export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="font-heading font-bold text-lg mb-2">iBrood</h3>
            <p className="text-muted text-sm">Intelligent beekeeping analysis for healthier hives</p>
          </div>
          
          <div className="flex gap-6 text-sm">
            <a href="/about" className="text-muted hover:text-accent transition-colors">About Us</a>
            <a href="/contact" className="text-muted hover:text-accent transition-colors">Contact</a>
            <a href="/privacy" className="text-muted hover:text-accent transition-colors">Privacy</a>
          </div>
        </div>
        
        <div className="border-t border-border mt-6 pt-6 text-center text-xs text-muted">
          <p>© 2026 iBrood. All rights reserved.</p>
          <p className="mt-1">Developer: Rosemarie Montesa</p>
        </div>
      </div>
    </footer>
  )
}