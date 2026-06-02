import { useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useMediaStore } from './store/useMediaStore';
import { useOmdbCache } from './hooks/useOmdbCache';
import { TierRow } from './components/TierRow';
import { WatchlistPool } from './components/WatchlistPool';
import { MediaCard } from './components/MediaCard';
import { TIERS } from './types';
import type { Tier, MediaType } from './types';

type Tab = 'movie' | 'series';

export default function App() {
  const { items, moveTo, exportJSON, reset } = useMediaStore();
  const [activeTab, setActiveTab] = useState<Tab>('movie');
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const allIds = items.map(i => i.id);
  const omdbCache = useOmdbCache(allIds);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const tabTypes: MediaType[] = activeTab === 'movie' ? ['movie', 'game'] : ['series'];
  const filtered = items.filter(i => tabTypes.includes(i.type));

  const byTier = (tier: Tier) => filtered.filter(i => i.tier === tier);

  const draggingItem = draggingId ? items.find(i => i.id === draggingId) : null;

  const handleDragStart = (e: DragStartEvent) => setDraggingId(e.active.id as string);

  const handleDragEnd = (e: DragEndEvent) => {
    setDraggingId(null);
    if (!e.over) return;
    const validTiers: Tier[] = [...TIERS, 'watchlist', 'unranked', 'skip', 'maybe'];
    const target = e.over.id as Tier;
    if (validTiers.includes(target)) moveTo(e.active.id as string, target);
  };

  const totalRanked = TIERS.reduce((acc, t) => acc + byTier(t).length, 0);
  const movieCount = items.filter(i => ['movie', 'game'].includes(i.type)).length;
  const seriesCount = items.filter(i => i.type === 'series').length;

  const cachedCount = Object.keys(omdbCache).length;
  const loadingPosters = cachedCount < allIds.length;

  return (
    <div className="min-h-screen bg-[#0f0f13] text-zinc-100">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tier List</h1>
            <p className="text-sm text-zinc-500 mt-1">
              {totalRanked} rankeados · {byTier('watchlist').length} watchlist · {byTier('unranked').length} não vistos
              {loadingPosters && (
                <span className="ml-2 text-zinc-600">· carregando posters {cachedCount}/{allIds.length}</span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportJSON}
              className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Export JSON
            </button>
            <button
              onClick={reset}
              className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-500 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/5 p-1 rounded-lg w-fit">
          {(['movie', 'series'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === tab ? 'bg-white/10 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab === 'movie' ? 'Filmes' : 'Séries'}
              <span className="ml-1.5 text-xs text-zinc-600">
                {tab === 'movie' ? movieCount : seriesCount}
              </span>
            </button>
          ))}
        </div>

        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {/* Tiers S→D */}
          <div className="flex flex-col gap-2 mb-6">
            {TIERS.map(tier => (
              <TierRow key={tier} tier={tier} label={tier} items={byTier(tier)} omdbCache={omdbCache} />
            ))}
          </div>

          {/* Seções inferiores */}
          <div className="grid grid-cols-1 gap-3 mb-3">
            <WatchlistPool tierId="watchlist" title="Watchlist" subtitle="quero assistir" items={byTier('watchlist')} omdbCache={omdbCache} />
            <WatchlistPool tierId="maybe" title="Não lembro se assisti" subtitle="talvez sim, talvez não" items={byTier('maybe')} omdbCache={omdbCache} />
            <WatchlistPool tierId="skip" title="Não quero assistir" subtitle="deixa pra lá" items={byTier('skip')} omdbCache={omdbCache} />
            <WatchlistPool tierId="unranked" title="Não rankeado" subtitle="ainda não vi" items={byTier('unranked')} omdbCache={omdbCache} />
          </div>

          <DragOverlay>
            {draggingItem && <MediaCard item={draggingItem} omdb={omdbCache[draggingItem.id]} />}
          </DragOverlay>
        </DndContext>

      </div>
    </div>
  );
}
