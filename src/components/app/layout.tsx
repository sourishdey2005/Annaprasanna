import { LotusIcon } from '@/components/icons/lotus';

function Header() {
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <LotusIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight font-headline">Annaprasanna</h1>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t py-8">
      <div className="container text-center text-muted-foreground">
        <p className="text-sm">
          "रसवर्जं रसोऽप्यस्य परं दृष्ट्वा निवर्तते"
        </p>
        <p className="text-xs mt-2">
          The soul, upon experiencing a higher taste, ceases to crave for lower attachments.
        </p>
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
