import { useState, useEffect, useRef } from 'react';
import type { MediaItem, Tier } from '../types';
import { INITIAL_DATA } from '../data/initialData';

const STORAGE_KEY = 'movie-tier-data';
const SAVE_URL = 'http://localhost:3001/save';
const DATA_URL = 'http://localhost:3001/data';

// garante que filmes novos do INITIAL_DATA apareçam mesmo em dados salvos antigos
function merge(base: MediaItem[]): MediaItem[] {
  const ids = new Set(base.map(i => i.id));
  const extra = INITIAL_DATA.filter(i => !ids.has(i.id));
  return extra.length ? [...base, ...extra] : base;
}

export function useMediaStore() {
  const [items, setItems] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return merge(JSON.parse(saved) as MediaItem[]);
    } catch {}
    return INITIAL_DATA;
  });
  const loaded = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  // BOOT: carrega do movie-tier.json (fonte de verdade), não só do localStorage
  useEffect(() => {
    fetch(DATA_URL)
      .then(r => (r.ok ? r.json() : null))
      .then(data => { if (Array.isArray(data)) setItems(merge(data as MediaItem[])); })
      .catch(() => {})
      .finally(() => { loaded.current = true; });
  }, []);

  // SAVE automático: localStorage na hora + JSON no servidor (debounced) -> auto-commit
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    if (!loaded.current) return;            // não grava enquanto o boot ainda está carregando
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      fetch(SAVE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      }).catch(() => {});
    }, 1200);
  }, [items]);

  const moveTo = (itemId: string, tier: Tier) =>
    setItems(prev => prev.map(item => (item.id === itemId ? { ...item, tier } : item)));

  // salvar agora (sem esperar o debounce) — fallback: baixa o arquivo se o server estiver off
  const exportJSON = async () => {
    try {
      await fetch(SAVE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      });
    } catch {
      const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'movie-tier.json'; a.click();
      URL.revokeObjectURL(url);
    }
  };

  const reset = () => {
    if (confirm('Resetar tudo para o estado inicial?')) setItems(INITIAL_DATA);
  };

  return { items, moveTo, exportJSON, reset };
}
