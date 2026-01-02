'use client';
import { useState, useEffect, useCallback } from 'react';
import { initDB, getAllMealsFromDB, saveMealToDB } from '@/lib/db';
import type { Meal } from '@/lib/types';

export function useMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMeals = async () => {
      try {
        await initDB();
        const allMeals = await getAllMealsFromDB();
        setMeals(allMeals);
      } catch (err) {
        console.error(err);
        setError('Could not load meal data. Please check your browser settings.');
      } finally {
        setIsLoading(false);
      }
    };
    loadMeals();
  }, []);

  const addMeal = useCallback(async (newMeal: Omit<Meal, 'id'>) => {
    try {
      const savedMeal = await saveMealToDB(newMeal);
      setMeals((prevMeals) => [...prevMeals, savedMeal].sort((a,b) => b.timestamp - a.timestamp));
      return savedMeal;
    } catch (err) {
      console.error(err);
      setError('Could not save the meal. Please try again.');
      throw err;
    }
  }, []);

  return { meals, addMeal, isLoading, error };
}
