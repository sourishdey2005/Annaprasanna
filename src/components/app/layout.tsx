import Image from 'next/image';
import { Github, Linkedin, Globe } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group transition-all">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
            <Image src="https://res.cloudinary.com/dodhvvewu/image/upload/v1767340219/logo_1_mqba2z.jpg" alt="Annaprasanna Logo" fill className="object-cover" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight font-headline group-hover:text-primary transition-colors">Annaprasanna</h1>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</Link>
          <Button asChild size="sm" className="rounded-xl">
            <Link href="/app">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-secondary/30 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left items-start">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Image src="https://res.cloudinary.com/dodhvvewu/image/upload/v1767340219/logo_1_mqba2z.jpg" alt="Annaprasanna Logo" width={32} height={32} className="rounded-full" />
              <span className="text-xl font-bold font-headline">Annaprasanna</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering your journey towards holistic nourishment through the wisdom of Ayurveda and the power of AI.
            </p>
          </div>

          <div className="space-y-4 text-center">
            <h4 className="font-bold text-sm uppercase tracking-widest text-primary">Vedic Insight</h4>
            <div className="space-y-2">
              <p className="text-lg italic font-headline">
                "रसवर्जं रसोऽप्यस्य परं दृष्ट्वा निवर्तते"
              </p>
              <p className="text-xs text-muted-foreground px-4">
                The soul, upon experiencing a higher taste, ceases to crave for lower attachments.
              </p>
            </div>
          </div>

          <div className="space-y-4 md:text-right">
            <h4 className="font-bold text-sm uppercase tracking-widest text-primary">Developer</h4>
            <p className="text-sm">
              Crafted with 🪷 by <a href="https://sourishdey.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all">Sourish Dey</a>
            </p>
            <div className="flex justify-center md:justify-end gap-5 pt-2">
              {[
                { icon: <Github className="h-5 w-5" />, href: "https://github.com/sourishdey2005", label: "GitHub" },
                { icon: <Linkedin className="h-5 w-5" />, href: "https://www.linkedin.com/in/sourish-dey-20b170206/", label: "LinkedIn" },
                { icon: <Globe className="h-5 w-5" />, href: "https://sourishdey.vercel.app/", label: "Website" }
              ].map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background shadow-sm hover:shadow-md hover:text-primary hover:-translate-y-1 transition-all">
                  {social.icon}
                  <span className="sr-only">{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-muted text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Annaprasanna. Privacy-First. Ad-Free. Mindful.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Wisdom</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col font-sans selection:bg-primary/20 selection:text-primary">
      <Header />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      <Footer />
    </div>
  );
}
