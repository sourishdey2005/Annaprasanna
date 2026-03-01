'use client';
import { useState, useRef, ChangeEvent, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, FileImage, Sparkles, Check, Zap, SwitchCamera } from 'lucide-react';
import { useApp } from '@/context/AppProvider';
import { analyzeFoodImage } from '@/app/_actions/meal';
import type { Meal } from '@/lib/types';
import type { IdentifyFoodFromImageOutput } from '@/ai/flows/identify-food-from-image';
import { MealCard } from './meal-card';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
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
  const [analysisResult, setAnalysisResult] = useState<IdentifyFoodFromImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mealContext, setMealContext] = useState<'Prasadam' | 'Home-cooked' | 'Outside'>('Home-cooked');
  const [view, setView] = useState<'idle' | 'camera' | 'preview' | 'reflect'>('idle');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [mood, setMood] = useState<'Peaceful' | 'Energetic' | 'Heavy' | 'Anxious' | 'Dull'>('Peaceful');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { addMeal, dosha } = useApp();
  const { toast } = useToast();

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    const getCamera = async () => {
      if (view !== 'camera') {
        stopStream();
        return;
      }

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        setVideoDevices(cameras);

        let deviceId = selectedDeviceId;
        if (!deviceId && cameras.length > 0) {
          const backCamera = cameras.find(d => d.label.toLowerCase().includes('back'));
          deviceId = backCamera?.deviceId || cameras[0].deviceId;
          setSelectedDeviceId(deviceId);
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: deviceId ? { exact: deviceId } : undefined
          }
        });

        setHasCameraPermission(true);
        streamRef.current = stream;

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

    getCamera();

    return () => {
      stopStream();
    };
  }, [view, selectedDeviceId, toast, stopStream]);

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
      const mealToSave: Omit<Meal, 'id'> = {
        ...analysisResult,
        timestamp: Date.now(),
        date: format(new Date(), 'yyyy-MM-dd'),
        imageUrl: image!,
        meal_context: mealContext,
        mood_after_meal: mood,
      };

      await addMeal(mealToSave);
      toast({
        title: 'Meal Saved',
        description: `${analysisResult.food_name} has been added with your reflection.`,
      });
      resetState();
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

  const handleSwitchCamera = () => {
    if (videoDevices.length > 1) {
      const currentIndex = videoDevices.findIndex(device => device.deviceId === selectedDeviceId);
      const nextIndex = (currentIndex + 1) % videoDevices.length;
      setSelectedDeviceId(videoDevices[nextIndex].deviceId);
    }
  };

  const resetState = () => {
    setImage(null);
    setAnalysisResult(null);
    setIsLoading(false);
    setMood('Peaceful');
    setView('idle');
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <Card className="shadow-lg">
        <CardContent className="p-6 flex flex-col items-center gap-6">
          {view === 'idle' && !isLoading && (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-headline font-bold">Anna Darshan (Vision of Food)</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Capture or upload an image of your meal. Our Vedic intelligence will reveal its essence.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button size="lg" className="rounded-2xl" onClick={() => fileInputRef.current?.click()}>
                  <FileImage className="mr-2 h-5 w-5" /> Upload Image
                </Button>
                <Button size="lg" variant="secondary" className="rounded-2xl" onClick={() => setView('camera')}>
                  <Camera className="mr-2 h-5 w-5" /> Use Camera
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
              <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border-4 border-primary/20 shadow-2xl">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              </div>
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
                <Button size="lg" className="rounded-2xl w-32" onClick={handleCapture} disabled={!hasCameraPermission}>
                  <Zap className="mr-2 h-5 w-5 fill-current" /> Capture
                </Button>
                {videoDevices.length > 1 && (
                  <Button size="lg" variant="outline" className="rounded-2xl" onClick={handleSwitchCamera} disabled={!hasCameraPermission}>
                    <SwitchCamera className="h-5 w-5" />
                  </Button>
                )}
                <Button size="lg" variant="outline" className="rounded-2xl" onClick={resetState}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {view === 'preview' && image && !analysisResult && !isLoading && (
            <div className="w-full max-w-md space-y-6">
              <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
                <img src={image} alt="Meal to analyze" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col items-center gap-6">
                <RadioGroup
                  value={mealContext}
                  onValueChange={(value: any) => setMealContext(value)}
                  className="grid grid-cols-3 gap-4 w-full"
                >
                  {(['Prasadam', 'Home-cooked', 'Outside']).map((d) => (
                    <Label key={d} htmlFor={d} className={`flex flex-col items-center justify-center rounded-2xl border-2 bg-popover p-4 cursor-pointer hover:bg-accent transition-all ${mealContext === d ? 'border-primary ring-2 ring-primary/20' : 'border-muted'}`}>
                      <RadioGroupItem value={d} id={d} className="sr-only" />
                      <span className="font-semibold">{d}</span>
                    </Label>
                  ))}
                </RadioGroup>
                <div className="flex gap-4 w-full">
                  <Button size="lg" className="flex-1 rounded-2xl h-14 text-lg shadow-xl" onClick={handleAnalyze}>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Analyze Meal
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-2xl h-14" onClick={resetState}>
                    Retake
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isLoading && <LotusLoader />}

          {analysisResult && view === 'preview' && (
            <div className="w-full max-w-2xl space-y-6 animate-in slide-in-from-bottom-4">
              <h2 className="text-2xl font-headline text-center font-bold">Analysis Complete</h2>
              <MealCard meal={analysisResult as any as Meal} defaultOpen={true} />
              <div className="flex justify-center gap-4">
                <Button size="lg" className="rounded-2xl h-14 px-8 shadow-xl" onClick={() => setView('reflect')}>
                  <Check className="mr-2 h-5 w-5" /> Add to Daily Intake
                </Button>
                <Button size="lg" variant="outline" className="rounded-2xl h-14" onClick={resetState}>Scan Another</Button>
              </div>
            </div>
          )}

          {view === 'reflect' && (
            <div className="w-full max-w-lg space-y-8 text-center animate-in zoom-in duration-500">
              <div>
                <h2 className="text-3xl font-headline font-bold mb-2">How do you feel?</h2>
                <p className="text-muted-foreground">Take a moment to observe your state after this meal.</p>
              </div>

              <RadioGroup
                defaultValue={mood}
                onValueChange={(v: any) => setMood(v)}
                className="grid grid-cols-1 gap-3 text-left"
              >
                {[
                  { id: 'Peaceful', label: 'Peaceful', desc: 'Calm, clear-headed, and content.' },
                  { id: 'Energetic', label: 'Energetic', desc: 'Vibrant, motivated, and light.' },
                  { id: 'Heavy', label: 'Heavy', desc: 'Full, grounded, or slightly sleepy.' },
                  { id: 'Anxious', label: 'Anxious', desc: 'Restless, overstimulated, or uneasy.' },
                  { id: 'Dull', label: 'Dull', desc: 'Lethargic, unmotivated, or foggy.' },
                ].map((item) => (
                  <Label
                    key={item.id}
                    htmlFor={item.id}
                    className="flex flex-col items-start p-5 border rounded-[1.5rem] cursor-pointer hover:bg-accent hover:border-primary transition-all [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 [&:has([data-state=checked])]:ring-2 [&:has([data-state=checked])]:ring-primary/20"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-bold text-xl">{item.label}</span>
                      <RadioGroupItem value={item.id} id={item.id} className="sr-only" />
                    </div>
                    <span className="text-sm text-muted-foreground leading-relaxed">{item.desc}</span>
                  </Label>
                ))}
              </RadioGroup>

              <div className="flex flex-col gap-3 pt-4">
                <Button size="lg" className="h-16 rounded-3xl text-xl shadow-2xl hover:scale-105 transition-transform" onClick={handleSaveMeal}>
                  Log Reflection & Save
                </Button>
                <Button variant="ghost" className="rounded-2xl" onClick={() => setView('preview')}>
                  Back to Analysis
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
