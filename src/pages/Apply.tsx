import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Apply() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    video_link: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', video_link: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="py-16 bg-zinc-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 mb-4">Rejoindre le Biiip</h1>
          <p className="text-lg text-zinc-600">
            Vous pensez être drôle ? Prouvez-le. Envoyez-nous une vidéo de vos meilleurs sketchs et on vous dira si on est d'accord.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-zinc-200 p-8 sm:p-12"
        >
          {status === 'success' ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">Candidature envoyée !</h2>
              <p className="text-zinc-600 mb-8">
                Merci pour votre candidature. On va regarder votre vidéo (promis) et on vous recontacte très vite.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="text-cyan-600 font-medium hover:text-cyan-700 transition-colors"
              >
                Envoyer une autre candidature
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-2">
                    Nom de scène (ou vrai nom)
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all bg-zinc-50 focus:bg-white"
                    placeholder="Gad Elmaleh (on peut rêver)"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all bg-zinc-50 focus:bg-white"
                    placeholder="contact@humoriste.fr"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="video_link" className="block text-sm font-medium text-zinc-700 mb-2">
                  Lien vers une vidéo (YouTube, Instagram, TikTok...)
                </label>
                <input
                  type="url"
                  id="video_link"
                  required
                  value={formData.video_link}
                  onChange={e => setFormData({ ...formData, video_link: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all bg-zinc-50 focus:bg-white"
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="text-xs text-zinc-500 mt-2">
                  Une vidéo de 3 à 5 minutes en public est idéale. Pas de sketch devant le miroir de la salle de bain.
                </p>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-700 mb-2">
                  Un petit mot pour nous convaincre ?
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all bg-zinc-50 focus:bg-white resize-none"
                  placeholder="Je suis le roi de la blague de papa..."
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl text-sm">
                  <AlertCircle size={16} />
                  Une erreur est survenue lors de l'envoi. Veuillez réessayer.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-cyan-500 text-white px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  'Envoi en cours...'
                ) : (
                  <>
                    <Send size={20} />
                    Envoyer ma candidature
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
