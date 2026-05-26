import { HeartIcon, BookmarkIcon } from './icons.jsx';
import { useLikes } from '../hooks/useLikes.js';
import { useSaved } from '../hooks/useSaved.js';

const isImage = (url) => /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);

function VideoCard({ video }) {
  const { toggleLike } = useLikes();
  const { toggleSave } = useSaved();

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-soft transition hover:-translate-y-0.5 hover:border-slate-700">
      <div className="relative overflow-hidden bg-slate-950">
        {video.url ? (
          isImage(video.url) ? (
            <img
              src={video.url}
              alt={video.title}
              className="h-52 w-full object-cover"
            />
          ) : (
            <video
              src={video.url}
              controls
              className="h-52 w-full object-cover"
            />
          )
        ) : (
          <div className="flex h-52 items-center justify-center bg-slate-900 text-slate-500">
            Sin vista previa
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent px-4 py-3 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{video.category}</p>
          <h3 className="mt-2 text-lg font-semibold leading-6">{video.title}</h3>
        </div>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
          <span>{video.creator}</span>
          <span>{new Date(video.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
        </div>
        <div className="flex flex-col gap-4 text-sm text-slate-300">
          {video.description && <p>{video.description}</p>}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => toggleLike(video.id)}
              className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm transition ${
                video.liked ? 'bg-rose-500/15 text-rose-300' : 'bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              <HeartIcon filled={video.liked} />
              {video.likes}
            </button>
            <button
              type="button"
              onClick={() => toggleSave(video.id)}
              className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm transition ${
                video.saved ? 'bg-cyan-500/15 text-cyan-300' : 'bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              <BookmarkIcon filled={video.saved} />
              {video.saved ? 'Guardado' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default VideoCard;

