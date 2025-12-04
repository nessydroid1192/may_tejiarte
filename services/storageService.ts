import { LibraryItem } from '../types';

const LIBRARY_KEY = 'tejai_library_data';

export const saveLibraryItem = (item: Omit<LibraryItem, 'id'>): LibraryItem => {
  const newItem: LibraryItem = {
    ...item,
    id: Date.now().toString(),
  };

  const existingData = localStorage.getItem(LIBRARY_KEY);
  const items: LibraryItem[] = existingData ? JSON.parse(existingData) : [];
  
  const updatedItems = [newItem, ...items];
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(updatedItems));
  
  return newItem;
};

export const getLibraryItems = (): LibraryItem[] => {
  const existingData = localStorage.getItem(LIBRARY_KEY);
  return existingData ? JSON.parse(existingData) : [];
};

export const deleteLibraryItem = (id: string): LibraryItem[] => {
  const existingData = localStorage.getItem(LIBRARY_KEY);
  if (!existingData) return [];

  const items: LibraryItem[] = JSON.parse(existingData);
  const updatedItems = items.filter(item => item.id !== id);
  
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(updatedItems));
  return updatedItems;
};