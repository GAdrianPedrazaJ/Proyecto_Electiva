import { useAuth } from '../context/AuthContext.jsx';
import { useVideos } from '../context/VideoContext.jsx';
import VideoCard from '../components/VideoCard.jsx';

function Profile() {
  const { user } = useAuth();
  const { savedVideos, rawVideos } = useVideos();

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-3xl object-cover" />
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Perfil</p>
              <h1 className="text-3xl font-semibold text-white">{user.name}</h1>
              <p className="text-sm text-slate-400">{user.role} • @{user.username}</p>
            </div>
          </div>
          <div className="space-y-2 rounded-3xl bg-slate-950/80 p-5 text-sm text-slate-300">
            <p>
              Videos totales: <span className="font-semibold text-white">{rawVideos.length}</span>
            </p>
            <p>
              Guardados: <span className="font-semibold text-white">{savedVideos.length}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Colecciones</p>
            <h2 className="text-2xl font-semibold text-white">Tus videos guardados</h2>
          </div>
          <p className="text-sm text-slate-400">Revisa lo que guardaste y vuelve a compartir ideas.</p>
        </div>

        {savedVideos.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/90 p-10 text-center text-slate-400">
            No hay videos guardados aún. Guarda videos desde el feed para verlos aquí.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {savedVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Profile;
