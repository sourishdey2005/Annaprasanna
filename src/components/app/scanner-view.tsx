'use client';
import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, FileImage, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppProvider';
import { analyzeFoodImage } from '@/app/_actions/meal';
import type { Meal } from '@/lib/types';
import { MealCard } from './meal-card';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { LotusIcon } from '../icons/lotus';

function LotusLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <div className="lotus-loader">
        <LotusIcon className="h-24 w-24 text-primary" />
      </div>
      <p className="text-muted-foreground font-medium">Recognizing your meal...</p>
      <p className="text-sm text-muted-foreground/80">"Annaṁ Brahma" - Food is divine.</p>
    </div>
  );
}


export default function ScannerView() {
  const [image, setImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<Omit<Meal, 'id' | 'timestamp' | 'date'> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addMeal } = useApp();
  const { toast } = useToast();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImage(dataUri);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeFoodImage({ imageUri: image });
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
      const mealToSave: Meal = {
        ...analysisResult,
        timestamp: Date.now(),
        date: format(new Date(), 'yyyy-MM-dd'),
        imageUrl: image!, // save the image for history
      };
      await addMeal(mealToSave);
      toast({
        title: 'Meal Saved',
        description: `${analysisResult.food_name} has been added to your daily intake.`,
      });
      // Reset state for next scan
      setImage(null);
      setAnalysisResult(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Could not save the meal. Please try again.',
      });
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <Card className="shadow-lg">
        <CardContent className="p-6 flex flex-col items-center gap-6">
          {!image && !isLoading && (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-headline">Anna Darshan (Vision of Food)</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Capture or upload an image of your meal. Our Vedic intelligence will reveal its essence.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button size="lg" onClick={() => fileInputRef.current?.click()}>
                  <FileImage className="mr-2" /> Upload Image
                </Button>
                <Button size="lg" variant="secondary" onClick={() => fileInputRef.current?.click()} disabled>
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

          {image && (
            <div className="w-full max-w-md relative">
              <img src={image} alt="Meal to analyze" className="rounded-lg object-cover w-full" />
            </div>
          )}

          {isLoading && <LotusLoader />}

          {!isLoading && image && !analysisResult && (
            <Button size="lg" onClick={handleAnalyze}>
              <Sparkles className="mr-2" />
              Analyze Meal
            </Button>
          )}

          {analysisResult && (
            <div className="w-full max-w-2xl space-y-6">
              <h2 className="text-2xl font-headline text-center">Analysis Complete</h2>
              <MealCard meal={analysisResult as Meal} defaultOpen={true} />
              <div className="flex justify-center gap-4">
                <Button size="lg" onClick={handleSaveMeal}>Add to Today's Intake</Button>
                <Button size="lg" variant="outline" onClick={() => {setImage(null); setAnalysisResult(null);}}>Scan Another</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
