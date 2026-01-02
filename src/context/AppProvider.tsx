'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useMeals } from '@/hooks/use-meals';
import type { Meal } from '@/lib/types';

interface AppContextType {
  meals: Meal[];
  addMeal: (newMeal: Meal) => Promise<Meal>;
  isLoading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { meals, addMeal, isLoading, error } = useMeals();

  return (
    <AppContext.Provider value={{ meals, addMeal, isLoading, error }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
