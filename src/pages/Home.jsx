import { useVideos } from '../context/VideoContext.jsx';
import VideoCard from '../components/VideoCard.jsx';

function Home() {
  const { videos, query } = useVideos();

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-900/90 p-6 shadow-soft">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">Feed recomendado</p>
            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Descubre videos que elevan tu talento profesional.</h1>
            <p className="mt-3 max-w-xl text-slate-400">Sigue creadores, aprende nuevas habilidades y comparte contenido para crecer en la comunidad ConTalento.</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Tus resultados</p>
              <div className="flex items-center justify-between gap-4 rounded-3xl bg-slate-900 p-4 text-white">
                <div>
                  <p className="text-xs uppercase text-slate-500">Consultas</p>
                  <p className="text-3xl font-semibold">{query ? videos.length : videos.length}</p>
                </div>
                <p className="text-sm text-slate-400">Explora el contenido más nuevo y guarda tus favoritos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Tendencias</p>
            <h2 className="text-2xl font-semibold text-white">Videos recientes</h2>
          </div>
          <p className="text-sm text-slate-400">Interactúa con likes y guarda lo que más te inspire.</p>
        </div>

        {videos.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/90 p-10 text-center text-slate-400">
            {query
              ? 'No se encontraron videos con esa búsqueda. Intenta otra palabra clave.'
              : 'Aún no hay videos en el feed. Sube tu primer video para que aparezca aquí.'}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
