import { useState, useEffect, useRef } from 'react';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY as string;
const CACHE_KEY = 'movie-tier-omdb';

export interface OmdbData {
  poster: string;
  plot: string;
}

export function useOmdbCache(ids: string[]) {
  const [cache, setCache] = useState<Record<string, OmdbData>>(() => {
    try {
      const saved = localStorage.getItem(CACHE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const cacheRef = useRef(cache);
  cacheRef.current = cache;

  useEffect(() => {
    const missing = ids.filter(id => !cacheRef.current[id]);
    if (missing.length === 0) return;

    let cancelled = false;

    const fetchAll = async () => {
      for (const id of missing) {
        if (cancelled) break;
        try {
          const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
          const data = await res.json();
          if (data.Response === 'True' && !cancelled) {
            const entry: OmdbData = {
              poster: data.Poster !== 'N/A' ? data.Poster : '',
              plot: data.Plot !== 'N/A' ? data.Plot : '',
            };
            setCache(prev => {
              const next = { ...prev, [id]: entry };
              localStorage.setItem(CACHE_KEY, JSON.stringify(next));
              return next;
            });
          }
        } catch {}
        await new Promise(r => setTimeout(r, 120));
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return cache;
}
