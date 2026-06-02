export type Tier = 'S' | 'A' | 'B' | 'C' | 'D' | 'watchlist' | 'unranked' | 'skip' | 'maybe';
export type MediaType = 'movie' | 'series' | 'game';

export interface MediaItem {
  id: string;
  title: string;
  year: number;
  type: MediaType;
  genres: string[];
  imdbRating: number;
  yourRating?: number;
  tier: Tier;
}

export const TIERS: Tier[] = ['S', 'A', 'B', 'C', 'D'];

export const TIER_COLORS: Record<string, string> = {
  S: '#ff7f7f',
  A: '#ffbf7f',
  B: '#ffdf7f',
  C: '#bfff7f',
  D: '#7fbfff',
  watchlist: '#a78bfa',
  unranked: '#52525b',
  skip: '#ef4444',
  maybe: '#f59e0b',
};

export const TIER_BG: Record<string, string> = {
  S: 'rgba(255,127,127,0.15)',
  A: 'rgba(255,191,127,0.12)',
  B: 'rgba(255,223,127,0.10)',
  C: 'rgba(191,255,127,0.10)',
  D: 'rgba(127,191,255,0.12)',
  watchlist: 'rgba(167,139,250,0.12)',
  unranked: 'rgba(82,82,91,0.15)',
  skip: 'rgba(239,68,68,0.10)',
  maybe: 'rgba(245,158,11,0.10)',
};
