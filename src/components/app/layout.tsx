import Image from 'next/image';
import { Github, Linkedin, Globe } from 'lucide-react';
import Link from 'next/link';

function Header() {
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="https://res.cloudinary.com/dodhvvewu/image/upload/v1767340219/logo_1_mqba2z.jpg" alt="Annaprasanna Logo" width={32} height={32} className="rounded-full" />
          <h1 className="text-2xl font-bold tracking-tight font-headline">Annaprasanna</h1>
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t py-8">
      <div className="container text-center text-muted-foreground">
        <p className="text-sm">
          Made by <a href="https://sourishdey.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary underline">Sourish Dey</a>
        </p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="https://github.com/sourishdey2005" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/sourish-dey-20b170206/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </a>
           <a href="https://sourishdey.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
            <Globe className="h-5 w-5" />
            <span className="sr-only">Website</span>
          </a>
        </div>
         <div className="mt-8">
            <p className="text-sm">
                "रसवर्जं रसोऽप्यस्य परं दृष्ट्वा निवर्तते"
            </p>
            <p className="text-xs mt-2">
                The soul, upon experiencing a higher taste, ceases to crave for lower attachments.
            </p>
         </div>
      </div>
    </footer>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
