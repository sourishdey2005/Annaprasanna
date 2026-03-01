'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppProvider';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BookHeart, HeartPulse, Sparkles, Sun } from 'lucide-react';
import type { Dosha, Sankalpa } from '@/lib/types';

export function OnboardingDialog() {
    const { isOnboarded, setIsOnboarded, setDosha, setSankalpa, dosha, sankalpa } = useApp();
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            setIsOnboarded(true);
        }
    };

    return (
        <Dialog open={!isOnboarded}>
            <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden bg-background">
                <div className="bg-primary p-8 text-primary-foreground">
                    <div className="flex justify-between items-center mb-4">
                        <Sun className="h-8 w-8 animate-spin-slow" />
                        <div className="text-xs font-bold uppercase tracking-widest opacity-70">
                            Step {step} of {totalSteps}
                        </div>
                    </div>
                    <DialogTitle className="text-3xl font-headline mb-2">
                        {step === 1 && "Discover Your Nature"}
                        {step === 2 && "Set Your Sankalpa"}
                        {step === 3 && "Welcome to Annaprasanna"}
                    </DialogTitle>
                    <DialogDescription className="text-primary-foreground/80 text-lg">
                        {step === 1 && "Ayurveda categorizes life forces into three Doshas. Which one describes you best?"}
                        {step === 2 && "What is your primary intention for this mindful journey?"}
                        {step === 3 && "Your journey towards mindful nourishment begins now."}
                    </DialogDescription>
                </div>

                <div className="p-8">
                    {step === 1 && (
                        <RadioGroup
                            defaultValue={dosha}
                            onValueChange={(v: Dosha) => setDosha(v)}
                            className="grid gap-4"
                        >
                            {[
                                { id: 'Vata', label: 'Vata', desc: 'Creative, energetic, but prone to anxiety. Like air and ether.' },
                                { id: 'Pitta', label: 'Pitta', desc: 'Determined, intellectual, but prone to heat. Like fire and water.' },
                                { id: 'Kapha', label: 'Kapha', desc: 'Calm, loyal, but prone to lethargy. Like earth and water.' },
                                { id: 'Tridoshic', label: 'Tridoshic', desc: 'A balanced blend of all three life forces.' },
                            ].map((item) => (
                                <Label
                                    key={item.id}
                                    htmlFor={item.id}
                                    className="flex items-center justify-between p-4 border rounded-2xl cursor-pointer hover:bg-accent hover:border-primary/50 transition-all duration-300 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="font-bold text-lg">{item.label}</span>
                                        <span className="text-xs text-muted-foreground">{item.desc}</span>
                                    </div>
                                    <RadioGroupItem value={item.id} id={item.id} className="sr-only" />
                                </Label>
                            ))}
                        </RadioGroup>
                    )}

                    {step === 2 && (
                        <RadioGroup
                            defaultValue={sankalpa}
                            onValueChange={(v: Sankalpa) => setSankalpa(v)}
                            className="grid gap-4"
                        >
                            {[
                                { id: 'increase-sattvic', label: 'Increase Sattvic Flow', icon: <HeartPulse className="h-5 w-5" /> },
                                { id: 'reduce-rajasic', label: 'Balance Rajasic Energy', icon: <Sparkles className="h-5 w-5" /> },
                                { id: 'reduce-tamasic', label: 'Lift Tamasic Heavy', icon: <BookHeart className="h-5 w-5" /> },
                                { id: 'reduce-late-eating', label: 'Mindful Timing', icon: <Sun className="h-5 w-5" /> },
                            ].map((item) => (
                                <Label
                                    key={item.id}
                                    htmlFor={item.id}
                                    className="flex items-center gap-4 p-5 border rounded-2xl cursor-pointer hover:bg-accent hover:border-primary/50 transition-all duration-300 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                                >
                                    <RadioGroupItem value={item.id} id={item.id} className="sr-only" />
                                    <div className="bg-primary/10 p-3 rounded-xl text-primary">
                                        {item.icon}
                                    </div>
                                    <span className="font-bold text-lg">{item.label}</span>
                                </Label>
                            ))}
                        </RadioGroup>
                    )}

                    {step === 3 && (
                        <div className="text-center py-8">
                            <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                                <Sparkles className="h-12 w-12 text-primary" />
                            </div>
                            <p className="text-muted-foreground text-lg mb-4">
                                "As the food is, so is the mind."
                            </p>
                            <p className="font-headline italic">
                                You are ready to explore your Ahara.
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-8 pt-0">
                    <Button
                        onClick={handleNext}
                        size="lg"
                        className="w-full h-14 rounded-2xl text-lg shadow-xl"
                    >
                        {step === totalSteps ? "Begin Journey" : "Continue"}
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Helper icons for the flow
function ArrowRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}
