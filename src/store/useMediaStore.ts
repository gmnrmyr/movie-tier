import { useState, useEffect } from 'react';
import type { MediaItem, Tier } from '../types';
import { INITIAL_DATA } from '../data/initialData';

const STORAGE_KEY = 'movie-tier-data';

export function useMediaStore() {
  const [items, setItems] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedItems = JSON.parse(saved) as MediaItem[];
        const savedIds = new Set(savedItems.map(i => i.id));
        const newItems = INITIAL_DATA.filter(i => !savedIds.has(i.id));
        if (newItems.length > 0) {
          const merged = [...savedItems, ...newItems];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }
        return savedItems;
      }
    } catch {}
    return INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const moveTo = (itemId: string, tier: Tier) => {
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, tier } : item));
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'movie-tier.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    if (confirm('Resetar tudo para o estado inicial?')) {
      setItems(INITIAL_DATA);
    }
  };

  return { items, moveTo, exportJSON, reset };
}
