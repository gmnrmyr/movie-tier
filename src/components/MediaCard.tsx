import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { MediaItem } from '../types';
import type { OmdbData } from '../hooks/useOmdbCache';

interface Props {
  item: MediaItem;
  omdb?: OmdbData;
}

export function MediaCard({ item, omdb }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.35 : 1,
  };

  const openImdb = (e: React.MouseEvent) => {
    // só abre se não foi drag (pointer não se moveu)
    e.stopPropagation();
    window.open(`https://www.imdb.com/title/${item.id}`, '_blank');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="relative group w-[110px] shrink-0 cursor-grab active:cursor-grabbing select-none"
    >
      {/* Poster */}
      <div className="w-full aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800 border border-white/10">
        {omdb?.poster ? (
          <img
            src={omdb.poster}
            alt={item.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-2">
            <span className="text-zinc-500 text-[10px] text-center leading-tight">{item.title}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 rounded-lg bg-black/85 opacity-0 group-hover:opacity-100
                     transition-opacity duration-200 flex flex-col justify-end p-2 cursor-pointer"
          onClick={openImdb}
        >
          <div className="text-xs font-semibold text-white leading-tight mb-1">{item.title}</div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[10px] text-zinc-400">{item.year}</span>
            <span className="text-[10px] text-yellow-400">★{item.imdbRating}</span>
            {item.yourRating && (
              <span className="text-[10px] text-emerald-400">você:{item.yourRating}</span>
            )}
          </div>
          {omdb?.plot && (
            <p className="text-[10px] text-zinc-300 leading-tight line-clamp-4">{omdb.plot}</p>
          )}
          <div className="mt-1.5 text-[9px] text-zinc-500 flex items-center gap-1">
            <span>↗</span> abrir IMDb
          </div>
        </div>
      </div>

      {/* Título embaixo */}
      <div className="mt-1 px-0.5">
        <p className="text-[10px] text-zinc-400 truncate leading-tight">{item.title}</p>
      </div>
    </div>
  );
}
