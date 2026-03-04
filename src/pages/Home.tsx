import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mic2, Calendar, Users, ArrowRight, Star, Laugh } from 'lucide-react';
import { useEffect, useState } from 'react';
import biiipHero from '../assets/biiip-hero.png';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  image_url: string;
  price: number;
}

// Données de repli pour affichage statique (ex. déploiement Vercel sans API)
const fallbackEvents: Event[] = [
  { id: 1, title: 'Soirée Stand-up Découverte', date: '2026-04-15', time: '20:30', description: 'Venez découvrir les nouveaux talents de la région PACA !', image_url: 'https://picsum.photos/seed/event1/800/400', price: 10 },
  { id: 2, title: 'Le Grand Gala du Biiip', date: '2026-05-02', time: '21:00', description: 'Une soirée exceptionnelle avec nos meilleurs humoristes.', image_url: 'https://picsum.photos/seed/event2/800/400', price: 15 },
];

export default function Home() {
  const [nextEvents, setNextEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.ok ? res.json() : Promise.reject(new Error('API indisponible')))
      .then(data => setNextEvents(Array.isArray(data) ? data.slice(0, 2) : fallbackEvents))
      .catch(() => setNextEvents(fallbackEvents));
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-zinc-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={biiipHero}
            alt="Biiip Comedy Club"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-900/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm font-medium mb-6 border border-cyan-500/30">
              <Star size={14} />
              <span>Le meilleur du stand-up à Toulon</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Riez. <br className="hidden md:block" />
              <span className="text-cyan-500">Pleurez de rire.</span> <br className="hidden md:block" />
              Recommencez.
            </h1>
            <p className="text-xl text-zinc-300 mb-10 max-w-2xl leading-relaxed">
              Bienvenue au Biiip Comedy Club, l'association qui fait vibrer Toulon et la région PACA.
              Découvrez les talents de demain et les pointures d'aujourd'hui dans une ambiance intimiste.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/programming"
                className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/25"
              >
                <Calendar size={20} />
                Voir la programmation
              </Link>
              <Link
                to="/artists"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold backdrop-blur-sm transition-all border border-white/10"
              >
                <Users size={20} />
                Découvrir les artistes
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Next Events Section */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Prochains Plateaux</h2>
              <p className="text-zinc-600">Ne manquez pas nos prochaines soirées stand-up.</p>
            </div>
            <Link
              to="/programming"
              className="hidden md:flex items-center gap-2 text-cyan-600 font-medium hover:text-cyan-700 transition-colors"
            >
              Toute la programmation <ArrowRight size={16} />
            </Link>
          </div>

          {nextEvents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-zinc-200">
              <p className="text-zinc-500">Chargement des événements...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {nextEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-zinc-200 flex flex-col sm:flex-row"
                >
                  <div className="sm:w-2/5 relative overflow-hidden">
                    <img
                      src={event.image_url || `https://picsum.photos/seed/event${event.id}/400/400`}
                      alt={event.title}
                      className="w-full h-48 sm:h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-bold text-zinc-900 shadow-sm">
                      {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-cyan-600 text-sm font-semibold mb-2">
                        <Calendar size={14} />
                        {event.time}
                      </div>
                      <h3 className="text-xl font-bold text-zinc-900 mb-2 leading-tight group-hover:text-cyan-600 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-zinc-600 text-sm line-clamp-2 mb-4">
                        {event.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100">
                      <span className="font-bold text-lg text-zinc-900">
                        {event.price === 0 ? 'Gratuit' : `${event.price}€`}
                      </span>
                      <Link
                        to="/programming"
                        className="text-sm font-medium text-white bg-zinc-900 hover:bg-cyan-500 px-4 py-2 rounded-lg transition-colors"
                      >
                        Réserver
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <Link
              to="/programming"
              className="inline-flex items-center gap-2 text-cyan-600 font-medium hover:text-cyan-700 transition-colors"
            >
              Toute la programmation <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">Pourquoi venir au Biiip ?</h2>
            <p className="text-zinc-600 text-lg">
              Parce qu'on est sympas, qu'on a des blagues, et qu'on est à Toulon. Que demander de plus ?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 text-center">
              <div className="bg-cyan-100 text-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-3">
                <Laugh size={32} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Rires Garantis</h3>
              <p className="text-zinc-600">
                Des artistes sélectionnés avec soin pour vous faire passer une soirée inoubliable. Si vous ne riez pas, on vous rembourse (non c'est faux).
              </p>
            </div>
            <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Ambiance Intimiste</h3>
              <p className="text-zinc-600">
                Un lieu chaleureux au 1 rue de l'humilité. Proximité avec les artistes, bar sur place, et bonne humeur.
              </p>
            </div>
            <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 text-center">
              <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-3">
                <Mic2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Tremplin Local</h3>
              <p className="text-zinc-600">
                Nous soutenons la scène locale de la région PACA. Venez découvrir les futures stars du stand-up avant tout le monde.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
