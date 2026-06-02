import { useDroppable } from '@dnd-kit/core';
import { TIER_COLORS, TIER_BG } from '../types';
import type { MediaItem, Tier } from '../types';
import type { OmdbData } from '../hooks/useOmdbCache';
import { MediaCard } from './MediaCard';

interface Props {
  tier: Tier;
  label: string;
  items: MediaItem[];
  omdbCache: Record<string, OmdbData>;
}

export function TierRow({ tier, label, items, omdbCache }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: tier });
  const color = TIER_COLORS[tier];
  const bg = TIER_BG[tier];

  return (
    <div
      className="flex gap-0 rounded-xl overflow-hidden border border-white/5 transition-all"
      style={{ boxShadow: isOver ? `0 0 0 2px ${color}` : undefined }}
    >
      <div
        className="flex items-center justify-center font-bold text-2xl w-14 shrink-0"
        style={{ background: color, color: '#0f0f13' }}
      >
        {label}
      </div>
      <div
        ref={setNodeRef}
        className="flex flex-wrap gap-2 flex-1 p-3 min-h-[80px] transition-colors"
        style={{ background: isOver ? bg : `${bg}` }}
      >
        {items.length === 0 && (
          <span className="text-xs text-zinc-700 self-center italic">arraste para cá</span>
        )}
        {items.map(item => (
          <MediaCard key={item.id} item={item} omdb={omdbCache[item.id]} />
        ))}
      </div>
    </div>
  );
}
