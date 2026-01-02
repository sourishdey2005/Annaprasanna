'use client';
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, FileImage, Sparkles, Check, Video, CircleUserRound, Zap } from 'lucide-react';
import { useApp } from '@/context/AppProvider';
import { analyzeFoodImage } from '@/app/_actions/meal';
import type { Meal } from '@/lib/types';
import { MealCard } from './meal-card';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { LotusIcon } from '../icons/lotus';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

function LotusLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <div className="lotus-loader">
         <Image src="https://res.cloudinary.com/dodhvvewu/image/upload/v1767340219/logo_1_mqba2z.jpg" alt="Annaprasanna Logo" width={96} height={96} className="rounded-full" />
      </div>
      <p className="text-muted-foreground font-medium">Recognizing your meal...</p>
      <p className="text-sm text-muted-foreground/80">"Annaṁ Brahma" - Food is divine.</p>
    </div>
  );
}

export default function ScannerView() {
  const [image, setImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<Omit<Meal, 'id'> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mealContext, setMealContext] = useState<'Prasadam' | 'Home-cooked' | 'Outside'>('Home-cooked');
  const [view, setView] = useState<'idle' | 'camera' | 'preview'>('idle');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { addMeal, dosha } = useApp();
  const { toast } = useToast();
  
  useEffect(() => {
    if (view !== 'camera') return;
    
    let stream: MediaStream;
    const getCameraPermission = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
        setView('idle');
      }
    };

    getCameraPermission();

    return () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [view, toast]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImage(dataUri);
        setAnalysisResult(null);
        setView('preview');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeFoodImage({ imageUri: image, dosha, timestamp: Date.now() });
      if (result.success && result.data) {
        setAnalysisResult(result.data);
      } else {
        throw new Error(result.error || 'Unknown error occurred.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: error.message || 'Could not analyze the image. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMeal = async () => {
    if (!analysisResult) return;
    try {
      // The meal object created here should not have an id property yet
      const mealToSave: Omit<Meal, 'id'> & { timestamp: number; date: string; imageUrl: string; meal_context: 'Prasadam' | 'Home-cooked' | 'Outside' } = {
        ...analysisResult,
        timestamp: Date.now(),
        date: format(new Date(), 'yyyy-MM-dd'),
        imageUrl: image!, // save the image for history
        meal_context: mealContext,
      };

      await addMeal(mealToSave);
      toast({
        title: 'Meal Saved',
        description: `${analysisResult.food_name} has been added to your daily intake.`,
      });
      // Reset state for next scan
      setImage(null);
      setAnalysisResult(null);
      setView('idle');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Could not save the meal. Please try again.',
      });
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        setImage(dataUri);
        setView('preview');
    }
  };

  const resetView = () => {
    setImage(null);
    setAnalysisResult(null);
    setIsLoading(false);
    setView('idle');
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <Card className="shadow-lg">
        <CardContent className="p-6 flex flex-col items-center gap-6">
          {view === 'idle' && !isLoading && (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-headline">Anna Darshan (Vision of Food)</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Capture or upload an image of your meal. Our Vedic intelligence will reveal its essence.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button size="lg" onClick={() => fileInputRef.current?.click()}>
                  <FileImage className="mr-2" /> Upload Image
                </Button>
                <Button size="lg" variant="secondary" onClick={() => setView('camera')}>
                  <Camera className="mr-2" /> Use Camera
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          )}
          
          {view === 'camera' && (
             <div className="w-full max-w-md flex flex-col items-center gap-4">
                <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                <canvas ref={canvasRef} className="hidden" />
                {hasCameraPermission === false && (
                    <Alert variant="destructive">
                      <AlertTitle>Camera Access Required</AlertTitle>
                      <AlertDescription>
                        Please allow camera access in your browser settings to use this feature.
                      </AlertDescription>
                   </Alert>
                )}
                <div className="flex gap-4">
                    <Button size="lg" onClick={handleCapture} disabled={!hasCameraPermission}>
                        <Zap className="mr-2" /> Capture
                    </Button>
                    <Button size="lg" variant="outline" onClick={resetView}>
                        Cancel
                    </Button>
                </div>
            </div>
          )}

          {view === 'preview' && image && (
            <div className="w-full max-w-md relative">
              <img src={image} alt="Meal to analyze" className="rounded-lg object-cover w-full" />
            </div>
          )}

          {isLoading && <LotusLoader />}

          {!isLoading && view === 'preview' && image && !analysisResult && (
            <div className="flex flex-col items-center gap-6 w-full max-w-md">
               <RadioGroup
                value={mealContext}
                onValueChange={(value: 'Prasadam' | 'Home-cooked' | 'Outside') => setMealContext(value)}
                className="grid grid-cols-3 gap-4 w-full"
              >
                {(['Prasadam', 'Home-cooked', 'Outside']).map((d) => (
                  <Label key={d} htmlFor={d} className={`flex flex-col items-center justify-center rounded-md border-2 bg-popover p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground ${mealContext === d ? 'border-primary' : 'border-muted'}`}>
                    <RadioGroupItem value={d} id={d} className="sr-only" />
                    <span>{d}</span>
                  </Label>
                ))}
              </RadioGroup>
              <div className="flex gap-4">
                <Button size="lg" onClick={handleAnalyze}>
                    <Sparkles className="mr-2" />
                    Analyze Meal
                </Button>
                 <Button size="lg" variant="outline" onClick={resetView}>
                    Retake / Cancel
                </Button>
              </div>
            </div>
          )}

          {analysisResult && (
            <div className="w-full max-w-2xl space-y-6">
              <h2 className="text-2xl font-headline text-center">Analysis Complete</h2>
              <MealCard meal={analysisResult as Meal} defaultOpen={true} />
              <div className="flex justify-center gap-4">
                <Button size="lg" onClick={handleSaveMeal}><Check className="mr-2"/>Add to Today's Intake</Button>
                <Button size="lg" variant="outline" onClick={resetView}>Scan Another</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
