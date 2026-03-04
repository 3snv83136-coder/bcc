import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Ticket, X } from 'lucide-react';
import { BOOKING_URL } from '../config';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  image_url: string;
  price: number;
}

export default function Programming() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', tickets_count: 1 });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(console.error);
  }, []);

  const openReservation = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    setSubmitStatus('idle');
    setFormData({ name: '', email: '', tickets_count: 1 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setSubmitStatus('loading');
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: selectedEvent.id,
          ...formData
        }),
      });

      if (res.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          setIsModalOpen(false);
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    }
  };

  return (
    <div className="py-16 bg-zinc-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 mb-4">Programmation</h1>
          <p className="text-lg text-zinc-600">
            Découvrez nos prochaines soirées et réservez vos places. Attention, les places partent vite (enfin, on espère).
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-zinc-200 shadow-sm">
            <Calendar className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
            <h3 className="text-lg font-medium text-zinc-900">Aucun événement prévu</h3>
            <p className="mt-1 text-zinc-500">Revenez plus tard pour découvrir notre nouvelle programmation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-zinc-200 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={event.image_url || `https://picsum.photos/seed/event${event.id}/600/400`}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl font-bold text-zinc-900 shadow-sm">
                    {event.price === 0 ? 'Gratuit' : `${event.price}€`}
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-zinc-900 mb-3">{event.title}</h3>
                  <p className="text-zinc-600 text-sm mb-6 flex-grow">{event.description}</p>
                  
                  <div className="space-y-2 mb-6 text-sm text-zinc-600 bg-zinc-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-cyan-600" />
                      <span>{new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-cyan-600" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-cyan-600" />
                      <span>1 rue de l'humilité, Toulon</span>
                    </div>
                  </div>

                  {BOOKING_URL ? (
                    <a
                      href={BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-cyan-500 text-white px-4 py-3 rounded-xl font-medium transition-colors"
                    >
                      <Ticket size={18} />
                      Réserver ma place
                    </a>
                  ) : (
                    <button
                      onClick={() => openReservation(event)}
                      className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-cyan-500 text-white px-4 py-3 rounded-xl font-medium transition-colors"
                    >
                      <Ticket size={18} />
                      Réserver ma place
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Reservation Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-2 bg-zinc-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-bold text-zinc-900 mb-2">Réservation</h2>
              <p className="text-zinc-600 text-sm mb-6">
                Pour <strong>{selectedEvent.title}</strong> le {new Date(selectedEvent.date).toLocaleDateString('fr-FR')} à {selectedEvent.time}.
              </p>

              {submitStatus === 'success' ? (
                <div className="bg-cyan-50 text-cyan-800 p-6 rounded-2xl text-center border border-cyan-100">
                  <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Ticket size={24} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Réservation confirmée !</h3>
                  <p className="text-sm">Vous allez recevoir un email récapitulatif (enfin, dans une vraie app). À très vite !</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">Nom complet</label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                      placeholder="jean@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="tickets" className="block text-sm font-medium text-zinc-700 mb-1">Nombre de places</label>
                    <select
                      id="tickets"
                      value={formData.tickets_count}
                      onChange={e => setFormData({...formData, tickets_count: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all bg-white"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} {num > 1 ? 'places' : 'place'}</option>
                      ))}
                    </select>
                  </div>

                  {submitStatus === 'error' && (
                    <p className="text-red-500 text-sm mt-2">Une erreur est survenue. Veuillez réessayer.</p>
                  )}

                  <div className="pt-4">
                    <div className="flex justify-between items-center mb-4 text-sm font-medium">
                      <span className="text-zinc-600">Total à payer sur place :</span>
                      <span className="text-lg text-zinc-900">{selectedEvent.price * formData.tickets_count}€</span>
                    </div>
                    <button
                      type="submit"
                      disabled={submitStatus === 'loading'}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitStatus === 'loading' ? 'Réservation en cours...' : 'Confirmer la réservation'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
