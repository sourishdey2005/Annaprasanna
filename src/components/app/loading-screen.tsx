'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LoadingScreen() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
                >
                    <div className="relative flex flex-col items-center">
                        {/* Animated Rings */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="relative"
                        >
                            <div className="h-32 w-32 rounded-full border-4 border-primary/10" />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-0 h-32 w-32 rounded-full border-t-4 border-primary shadow-[0_-4px_0_0_rgba(var(--primary-rgb),0.5)]"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-2 h-28 w-28 rounded-full border-b-4 border-orange-400 opacity-50"
                            />
                        </motion.div>

                        {/* Logo */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="mt-8 flex flex-col items-center gap-4"
                        >
                            <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary/20 bg-white shadow-2xl">
                                <Image
                                    src="https://res.cloudinary.com/dodhvvewu/image/upload/v1767340219/logo_1_mqba2z.jpg"
                                    alt="Annaprasanna Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h2 className="text-3xl font-bold font-headline tracking-widest text-primary animate-pulse">
                                ANNAPRASANNA
                            </h2>
                            <p className="text-sm font-medium tracking-[0.3em] uppercase opacity-40">
                                Ayurvedic Intelligence
                            </p>
                        </motion.div>

                        {/* Quote Reveal */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 1 }}
                            className="absolute -bottom-24 text-center italic text-muted-foreground w-64"
                        >
                            "Annam Brahma" — Food is God
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
