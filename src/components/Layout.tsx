import { Link, Outlet, useLocation } from 'react-router-dom';
import { Mic2, Calendar, Users, Send, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Accueil', path: '/', icon: Mic2 },
    { name: 'Programmation', path: '/programming', icon: Calendar },
    { name: 'Nos Artistes', path: '/artists', icon: Users },
    { name: 'Postuler', path: '/apply', icon: Send },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex items-center justify-center bg-zinc-900 rounded-xl p-2 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                  <Mic2 size={24} className="text-cyan-400" />
                </div>
                <span className="font-bold text-xl tracking-tight text-zinc-900">
                  Biiip <span className="text-cyan-500">Comedy Club</span>
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors hover:text-cyan-600",
                      isActive ? "text-cyan-600" : "text-zinc-600"
                    )}
                  >
                    <Icon size={16} />
                    {item.name}
                  </Link>
                );
              })}
              <Link
                to="/admin"
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
                title="Espace Admin"
              >
                <Settings size={20} />
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-zinc-500 hover:text-zinc-700 p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium",
                      isActive
                        ? "bg-cyan-50 text-cyan-600"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    )}
                  >
                    <Icon size={20} />
                    {item.name}
                  </Link>
                );
              })}
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              >
                <Settings size={20} />
                Espace Admin
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center bg-zinc-900 rounded-xl p-1.5 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                <Mic2 size={20} className="text-cyan-400" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Biiip <span className="text-cyan-400">Comedy Club</span>
              </span>
            </div>
            <p className="text-sm">
              L'association de stand-up incontournable de Toulon et de la région PACA.
              Venez rire avec nous !
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Informations Pratiques</h3>
            <ul className="space-y-2 text-sm">
              <li>📍 1 rue de l'humilité, 83000 Toulon</li>
              <li>📧 contact@biiipcomedy.fr</li>
              <li>📞 04 94 XX XX XX</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/programming" className="hover:text-cyan-400 transition-colors">Réserver une place</Link></li>
              <li><Link to="/apply" className="hover:text-cyan-400 transition-colors">Devenir artiste</Link></li>
              <li><Link to="/artists" className="hover:text-cyan-400 transition-colors">Nos humoristes</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-zinc-800 text-sm text-center">
          &copy; {new Date().getFullYear()} Biiip Comedy Club. Tous droits réservés. (Ceci est un site vitrine)
        </div>
      </footer>
    </div>
  );
}
