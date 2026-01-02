import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookHeart, BrainCircuit, Scan, HeartPulse, PieChart } from 'lucide-react';
import { AppLayout } from '@/components/app/layout';

const features = [
  {
    icon: <Scan className="h-8 w-8 text-primary" />,
    title: 'Vedic Food Scanner',
    description: 'Instantly learn the Guna, nutritional value, and Vedic wisdom behind any meal with a simple photo.',
  },
  {
    icon: <PieChart className="h-8 w-8 text-primary" />,
    title: 'Guna Balance Insights',
    description: 'Visualize your Sattvic, Rajasic, and Tamasic intake with intuitive charts to foster spiritual and physical balance.',
  },
  {
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
    title: 'Dosha Alignment',
    description: 'Select your Prakriti (Vata, Pitta, Kapha) to receive gentle suggestions for aligning your diet with your constitution.',
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Wisdom',
    description: 'Receive AI-generated insights on meal timing, portion size, cooking methods, and seasonal eating.',
  },
  {
    icon: <BookHeart className="h-8 w-8 text-primary" />,
    title: 'Mindful Journaling',
    description: 'Set weekly intentions (Sankalpa), track your habits, and generate a personal "Food Scripture" from your logs.',
  },
  {
    icon: <Button variant="outline" size="sm" className="h-8 w-8 bg-transparent border-primary text-primary">#</Button>,
    title: 'Silent Mode',
    description: 'Hide all numbers like calories and macros to focus purely on the quality and mindfulness of your eating habits.',
  },
];

export default function LandingPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-block rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground">
            A Privacy-First Vedic Nutrition Intelligence App
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight font-headline lg:text-6xl">
            Eat with Awareness, Balance, and Wisdom
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Annaprasanna is more than a calorie counter. It's a mindful companion on your journey to holistic well-being, blending ancient Vedic wisdom with modern AI to transform your relationship with food.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href="/app">
                Enter the App <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-secondary/50 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight font-headline">Features at a Glance</h2>
          <p className="text-center mt-2 text-muted-foreground">Discover the tools for a more conscious lifestyle.</p>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="flex flex-col items-center text-center shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                    {feature.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl font-headline mb-2">{feature.title}</CardTitle>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}