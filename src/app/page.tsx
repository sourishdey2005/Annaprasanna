'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookHeart, BrainCircuit, Scan, HeartPulse, PieChart, Sparkles, Sprout, Sun } from 'lucide-react';
import { AppLayout } from '@/components/app/layout';
import LoadingScreen from '@/components/app/loading-screen';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Scan className="h-10 w-10 text-primary" />,
    title: 'Vedic Food Scanner',
    description: 'Instantly learn the Guna, nutritional value, and Vedic wisdom behind any meal with a simple photo.',
  },
  {
    icon: <PieChart className="h-10 w-10 text-primary" />,
    title: 'Guna Balance Insights',
    description: 'Visualize your Sattvic, Rajasic, and Tamasic intake with intuitive charts to foster spiritual and physical balance.',
  },
  {
    icon: <HeartPulse className="h-10 w-10 text-primary" />,
    title: 'Dosha Alignment',
    description: 'Select your Prakriti (Vata, Pitta, Kapha) to receive gentle suggestions for aligning your diet with your constitution.',
  },
  {
    icon: <BrainCircuit className="h-10 w-10 text-primary" />,
    title: 'AI-Powered Wisdom',
    description: 'Receive AI-generated insights on meal timing, portion size, cooking methods, and seasonal eating.',
  },
  {
    icon: <BookHeart className="h-10 w-10 text-primary" />,
    title: 'Mindful Journaling',
    description: 'Set weekly intentions (Sankalpa), track your habits, and generate a personal "Food Scripture" from your logs.',
  },
  {
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    title: 'Silent Mode',
    description: 'Hide all numbers like calories and macros to focus purely on the quality and mindfulness of your eating habits.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut' as any },
  },
};

export default function LandingPage() {
  return (
    <>
      <LoadingScreen />
      <AppLayout>
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-background">
          <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_left_-10px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="container relative mx-auto px-4 py-24 lg:py-40"
          >
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-left"
              >
                <motion.div
                  variants={itemVariants}
                  className="mb-8 inline-flex items-center rounded-full bg-accent/50 backdrop-blur-sm px-5 py-2 text-sm font-semibold text-accent-foreground border border-primary/10"
                >
                  <Sun className="mr-2 h-4 w-4 text-orange-500" />
                  Privacy-First Vedic Nutrition
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="text-5xl font-extrabold tracking-tight font-headline lg:text-8xl mb-8 bg-gradient-to-r from-primary via-orange-600 to-amber-700 bg-clip-text text-transparent leading-none"
                >
                  Eat with Awareness, <br />Balance, and Wisdom
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="max-w-[640px] text-2xl text-muted-foreground mb-12 leading-relaxed"
                >
                  Annaprasanna is more than a calorie counter. It's a mindful companion on your journey to holistic well-being, blending ancient Vedic wisdom with modern AI.
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-6"
                >
                  <Button asChild size="lg" className="text-xl px-10 py-8 rounded-3xl shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all group overflow-hidden relative">
                    <Link href="/app" className="relative z-10">
                      <span className="relative z-20 flex items-center">
                        Enter the App <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="text-xl px-10 py-8 rounded-3xl border-2 hover:bg-accent/30 transition-all">
                    <Link href="#features">Learn More</Link>
                  </Button>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="mt-16 flex flex-wrap items-center gap-10 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/60"
                >
                  <div className="flex items-center gap-2 pt-2 border-t-2 border-primary/10">Sattvic Living</div>
                  <div className="flex items-center gap-2 pt-2 border-t-2 border-primary/10">AI Insights</div>
                  <div className="flex items-center gap-2 pt-2 border-t-2 border-primary/10">Dosha Balance</div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0, x: 50 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 1.2, ease: 'easeOut' }}
                className="relative lg:block"
              >
                <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-tr from-primary/30 to-orange-500/10 blur-3xl opacity-50" />
                <div className="relative aspect-square overflow-hidden rounded-[3rem] border-[12px] border-white/50 backdrop-blur-3xl shadow-3xl">
                  <Image
                    src="/annaprasanna_hero_illustration_1772378829945.png"
                    alt="Vedic Mindful Eating"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="absolute -bottom-10 -left-10 rounded-3xl bg-background/80 backdrop-blur-2xl p-8 shadow-2xl border border-primary/10 max-w-xs"
                >
                  <div className="flex items-start gap-5">
                    <div className="rounded-2xl bg-primary/20 p-4 text-primary">
                      <Sparkles className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-widest text-primary/60 mb-1">Today's Wisdom</p>
                      <p className="text-xl font-headline italic leading-snug">"Annam Brahma" — Food is God</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-6 -right-6 h-20 w-20 rounded-2xl bg-orange-400/20 backdrop-blur-md border border-white/20 flex items-center justify-center"
                >
                  <Sprout className="h-10 w-10 text-orange-600" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div id="features" className="bg-secondary/20 py-32 scroll-mt-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-5">
            <BrainCircuit className="h-96 w-96 text-primary" />
          </div>
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto mb-20"
            >
              <h2 className="text-5xl font-extrabold tracking-tight font-headline mb-6">Features for a Conscious Life</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">Discover the tools designed to align your body, mind, and spirit through every bite.</p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="group relative overflow-hidden border-none bg-background/40 backdrop-blur-md shadow-lg hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-700 rounded-[3rem] p-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <CardHeader className="pt-10 items-center">
                      <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-accent/50 group-hover:bg-primary group-hover:rotate-12 transition-all duration-700 shadow-inner overflow-hidden relative">
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                        <span className="group-hover:text-white transition-colors relative z-10">
                          {feature.icon}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="text-center pb-12 px-8">
                      <CardTitle className="text-3xl font-headline mb-5 group-hover:text-primary transition-colors leading-tight">{feature.title}</CardTitle>
                      <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Wisdom Quote Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="py-32 bg-primary text-primary-foreground relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-white/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[50rem] h-[50rem] bg-orange-400/20 rounded-full blur-[140px] translate-x-1/3 translate-y-1/3" />

          <div className="container mx-auto px-4 relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-5xl mx-auto text-center"
            >
              <h2 className="text-sm font-bold uppercase tracking-[0.5em] mb-16 opacity-60">Ancient Vedic Tradition</h2>
              <blockquote className="text-5xl lg:text-7xl font-headline italic leading-tight mb-12 relative">
                <span className="absolute -top-10 -left-10 text-9xl opacity-10">“</span>
                "The food one eats is as important as the thoughts one thinks."
                <span className="absolute -bottom-10 -right-10 text-9xl opacity-10 rotate-180">“</span>
              </blockquote>
              <div className="h-1 w-24 bg-white/30 mx-auto mb-8 rounded-full" />
              <p className="text-2xl font-medium tracking-widest uppercase opacity-80">— Maharishi's AHARA SUTRA</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Final Call to Action */}
        <div className="py-40 container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-5xl mx-auto bg-gradient-to-br from-accent/50 to-background rounded-[4rem] p-16 lg:p-32 shadow-[inset_0_4px_12px_0_rgba(0,0,0,0.05)] border border-primary/5 border-b-primary/10"
          >
            <h2 className="text-6xl font-black font-headline mb-10 leading-tight">Ready to Transform <br />Your Ahara?</h2>
            <p className="text-2xl text-muted-foreground mb-16 max-w-2xl mx-auto leading-relaxed">
              Join a community of seekers reclaiming the ritual of their plate. Secure, private, and deeply meaningful.
            </p>
            <Button asChild size="lg" className="text-2xl px-16 py-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.5)] hover:scale-105 hover:shadow-primary/60 transition-all duration-500 bg-primary group overflow-hidden relative">
              <Link href="/app" className="relative z-10">
                <span className="relative z-20">Start Your Journey Today</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              </Link>
            </Button>

            <div className="mt-16 flex items-center justify-center gap-4 text-sm font-bold tracking-[0.2em] text-muted-foreground/40 uppercase">
              <span>Free Forever</span>
              <div className="h-1 w-1 rounded-full bg-current" />
              <span>Open Source</span>
              <div className="h-1 w-1 rounded-full bg-current" />
              <span>No Ads</span>
            </div>
          </motion.div>
        </div>
      </AppLayout>
    </>
  );
}
