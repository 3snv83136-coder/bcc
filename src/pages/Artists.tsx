import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Mic2 } from 'lucide-react';
import petitRobertImg from '../assets/petit-robert.png';
import mondorImg from '../assets/mondor.png';
import salemImg from '../assets/salem.png';
import riadImg from '../assets/riad.png';
import spencerImg from '../assets/spencer.png';

interface Artist {
  id: number;
  name: string;
  bio: string;
  image_url: string;
}

// Données de repli pour affichage statique (ex. déploiement Vercel sans API)
const fallbackArtists: Artist[] = [
  { id: 1, name: 'PETIT ROBERT', bio: "Ne vous fiez pas à son nom, son humour est grand et percutant.", image_url: '' },
  { id: 2, name: 'MONDOR', bio: "Le maître du stand-up toulonnais, toujours le bon mot au bon moment.", image_url: '' },
  { id: 3, name: 'SALEM', bio: "Un humoriste incontournable du Biiip Comedy Club, prêt à vous faire pleurer de rire.", image_url: '' },
  { id: 4, name: 'RIAD', bio: "Un regard piquant sur le quotidien, avec une touche de folie.", image_url: '' },
  { id: 5, name: 'SPENCER', bio: "L'énergie à l'état pur. Ses anecdotes vont vous surprendre.", image_url: '' },
];

export default function Artists() {
  const [artists, setArtists] = useState<Artist[]>([]);

  const artistImages: Record<string, string> = {
    'petit robert': petitRobertImg,
    mondor: mondorImg,
    salem: salemImg,
    riad: riadImg,
    spencer: spencerImg,
  };

  const getArtistImage = (artist: Artist) => {
    const normalizedName = artist.name.toLowerCase().trim();
    return artistImages[normalizedName] || artist.image_url || `https://picsum.photos/seed/artist${artist.id}/400/600`;
  };

  useEffect(() => {
    fetch('/api/artists')
      .then(res => res.ok ? res.json() : Promise.reject(new Error('API indisponible')))
      .then(data => setArtists(Array.isArray(data) ? data : fallbackArtists))
      .catch(() => setArtists(fallbackArtists));
  }, []);

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 mb-4">Nos Artistes</h1>
          <p className="text-lg text-zinc-600">
            Ils sont drôles, ils sont beaux (pour la plupart), et ils font vivre le Biiip Comedy Club.
            Découvrez les talents de notre association.
          </p>
        </div>

        {artists.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-zinc-200">
            <Mic2 className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
            <h3 className="text-lg font-medium text-zinc-900">Aucun artiste pour le moment</h3>
            <p className="mt-1 text-zinc-500">Mais ça ne saurait tarder !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {artists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-4 bg-zinc-100">
                  <img
                    src={getArtistImage(artist)}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <p className="text-white text-sm font-medium line-clamp-4">"{artist.bio}"</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 text-center">{artist.name}</h3>
                <p className="text-cyan-600 text-sm font-medium text-center mt-1">Humoriste</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
