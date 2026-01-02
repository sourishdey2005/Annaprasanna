'use client';
import { useState, useEffect } from 'react';

function getValue<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    const saved = window.localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
    return defaultValue;
}


export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => getValue(key, defaultValue));

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue];
}
