import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useVideos } from '../context/VideoContext.jsx';
import Button from './Button.jsx';

const navItems = [
  { label: 'Inicio', path: '/' },
  { label: 'Subir', path: '/upload' },
  { label: 'Perfil', path: '/profile' },
];

function Navbar() {
  const { user } = useAuth();
  const { query, setQuery } = useVideos();
  const location = useLocation();

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-lg font-bold shadow-soft">
              C
            </div>
            <div>
              <p className="text-sm font-semibold">ConTalento</p>
              <p className="text-xs text-slate-400">Feed de videos</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-2 text-sm text-slate-300 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 transition ${
                    isActive ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/80'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="relative flex w-full items-center overflow-hidden rounded-full border border-slate-800 bg-slate-900/80 sm:max-w-md">
            <span className="px-3 text-slate-500">🔍</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar videos, creadores o temas"
              className="w-full bg-transparent px-2 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <Link to="/upload">
              <Button className="hidden sm:inline-flex">Subir Video</Button>
            </Link>
            <Link to="/profile" className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/90 px-3 py-2 transition hover:border-slate-700">
              <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
              <div className="hidden min-w-[8rem] flex-col text-left sm:flex">
                <span className="text-sm font-semibold text-white">{user.name}</span>
                <span className="text-xs text-slate-500">@{user.username}</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      {location.pathname === '/' && (
        <div className="mx-auto max-w-7xl px-4 py-2 text-sm text-slate-400 sm:px-6 lg:px-8">
          Consejos diarios para talento tech, creatividad y crecimiento profesional.
        </div>
      )}
    </header>
  );
}

export default Navbar;
