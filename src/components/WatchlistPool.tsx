import { useDroppable } from '@dnd-kit/core';
import { TIER_COLORS, TIER_BG } from '../types';
import type { MediaItem, Tier } from '../types';
import type { OmdbData } from '../hooks/useOmdbCache';
import { MediaCard } from './MediaCard';

interface Props {
  items: MediaItem[];
  tierId: Tier;
  title: string;
  subtitle?: string;
  omdbCache: Record<string, OmdbData>;
}

export function WatchlistPool({ items, tierId, title, subtitle, omdbCache }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: tierId });
  const color = TIER_COLORS[tierId];
  const bg = TIER_BG[tierId];

  return (
    <div
      className="rounded-xl border border-white/5 overflow-hidden transition-all"
      style={{ boxShadow: isOver ? `0 0 0 2px ${color}` : undefined }}
    >
      <div className="px-4 py-2 border-b border-white/5" style={{ background: bg }}>
        <span className="font-semibold text-sm" style={{ color }}>{title}</span>
        {subtitle && <span className="text-xs text-zinc-500 ml-2">{subtitle}</span>}
        <span className="text-xs text-zinc-600 ml-2">({items.length})</span>
      </div>
      <div
        ref={setNodeRef}
        className="flex flex-wrap gap-2 p-3 min-h-[80px] transition-colors"
        style={{ background: isOver ? bg : 'transparent' }}
      >
        {items.length === 0 && (
          <span className="text-xs text-zinc-700 self-center italic">vazio</span>
        )}
        {items.map(item => (
          <MediaCard key={item.id} item={item} omdb={omdbCache[item.id]} />
        ))}
      </div>
    </div>
  );
}
