'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useMeals } from '@/hooks/use-meals';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Meal, Dosha, Sankalpa } from '@/lib/types';

interface AppContextType {
  meals: Meal[];
  addMeal: (newMeal: Omit<Meal, 'id'>) => Promise<Meal>;
  isLoading: boolean;
  error: string | null;
  dosha: Dosha;
  setDosha: (dosha: Dosha) => void;
  sankalpa: Sankalpa;
  setSankalpa: (sankalpa: Sankalpa) => void;
  silentMode: boolean;
  setSilentMode: (silent: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { meals, addMeal, isLoading, error } = useMeals();
  const [dosha, setDosha] = useLocalStorage<Dosha>('user-dosha', 'Tridoshic');
  const [sankalpa, setSankalpa] = useLocalStorage<Sankalpa>('user-sankalpa', 'increase-sattvic');
  const [silentMode, setSilentMode] = useLocalStorage<boolean>('silent-mode', false);

  return (
    <AppContext.Provider value={{ meals, addMeal, isLoading, error, dosha, setDosha, sankalpa, setSankalpa, silentMode, setSilentMode }}>
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
