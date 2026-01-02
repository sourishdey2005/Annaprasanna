'use client';
import type { Meal } from './types';

let db: IDBDatabase;

const DB_NAME = 'AnnaprasannaDB';
const DB_VERSION = 1;
const STORE_NAME = 'daily_meals';

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(true);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(true);
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
      reject(false);
    };
  });
};

export const saveMealToDB = (meal: Meal): Promise<Meal> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(meal);

    request.onsuccess = (event) => {
      const generatedId = (event.target as IDBRequest).result as number;
      resolve({ ...meal, id: generatedId });
    };

    request.onerror = (event) => {
      console.error('Error saving meal:', (event.target as IDBRequest).error);
      reject((event.target as IDBRequest).error);
    };
  });
};

export const getAllMealsFromDB = (): Promise<Meal[]> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event) => {
      console.error('Error fetching all meals:', (event.target as IDBRequest).error);
      reject((event.target as IDBRequest).error);
    };
  });
};
