import React, { useEffect, useState } from 'react';
import { Trash2, Plus, Users, Calendar, Ticket, Send } from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'artists' | 'events' | 'reservations' | 'applications'>('artists');
  
  const [artists, setArtists] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  // Forms state
  const [newArtist, setNewArtist] = useState({ name: '', bio: '', image_url: '' });
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', description: '', image_url: '', price: 0 });

  const fetchData = async () => {
    try {
      const [artRes, evRes, resRes, appRes] = await Promise.all([
        fetch('/api/artists'),
        fetch('/api/events'),
        fetch('/api/reservations'),
        fetch('/api/applications')
      ]);
      setArtists(await artRes.json());
      setEvents(await evRes.json());
      setReservations(await resRes.json());
      setApplications(await appRes.json());
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/artists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newArtist)
    });
    setNewArtist({ name: '', bio: '', image_url: '' });
    fetchData();
  };

  const handleDeleteArtist = async (id: number) => {
    if (confirm('Supprimer cet artiste ?')) {
      await fetch(`/api/artists/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    });
    setNewEvent({ title: '', date: '', time: '', description: '', image_url: '', price: 0 });
    fetchData();
  };

  const handleDeleteEvent = async (id: number) => {
    if (confirm('Supprimer cet événement ?')) {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Espace Administration</h1>
          <p className="text-zinc-500">Gérez le Biiip Comedy Club en toute simplicité.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-zinc-200">
          {[
            { id: 'artists', label: 'Artistes', icon: Users, count: artists.length },
            { id: 'events', label: 'Événements', icon: Calendar, count: events.length },
            { id: 'reservations', label: 'Réservations', icon: Ticket, count: reservations.length },
            { id: 'applications', label: 'Candidatures', icon: Send, count: applications.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-200 text-zinc-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 p-6 sm:p-8">
          
          {/* ARTISTS TAB */}
          {activeTab === 'artists' && (
            <div>
              <div className="mb-8 bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                  <Plus size={20} className="text-cyan-600" /> Ajouter un artiste
                </h3>
                <form onSubmit={handleAddArtist} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nom"
                    required
                    value={newArtist.name}
                    onChange={e => setNewArtist({...newArtist, name: e.target.value})}
                    className="px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                  <input
                    type="url"
                    placeholder="URL de l'image (ex: https://...)"
                    value={newArtist.image_url}
                    onChange={e => setNewArtist({...newArtist, image_url: e.target.value})}
                    className="px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                  <textarea
                    placeholder="Biographie courte"
                    required
                    value={newArtist.bio}
                    onChange={e => setNewArtist({...newArtist, bio: e.target.value})}
                    className="px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-cyan-500 outline-none sm:col-span-2"
                  />
                  <button type="submit" className="bg-zinc-900 hover:bg-cyan-600 text-white px-4 py-2 rounded-xl font-medium transition-colors sm:col-span-2">
                    Ajouter
                  </button>
                </form>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-zinc-500 border-b border-zinc-200">
                    <tr>
                      <th className="pb-3 font-medium">Nom</th>
                      <th className="pb-3 font-medium">Bio</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {artists.map(artist => (
                      <tr key={artist.id} className="hover:bg-zinc-50">
                        <td className="py-4 font-medium text-zinc-900 flex items-center gap-3">
                          <img src={artist.image_url || `https://picsum.photos/seed/artist${artist.id}/100/100`} alt="" className="w-10 h-10 rounded-full object-cover" />
                          {artist.name}
                        </td>
                        <td className="py-4 text-zinc-600 max-w-xs truncate">{artist.bio}</td>
                        <td className="py-4 text-right">
                          <button onClick={() => handleDeleteArtist(artist.id)} className="text-red-500 hover:text-red-700 p-2">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <div>
              <div className="mb-8 bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                  <Plus size={20} className="text-cyan-600" /> Ajouter un événement
                </h3>
                <form onSubmit={handleAddEvent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Titre de la soirée"
                    required
                    value={newEvent.title}
                    onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                    className="px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                    className="px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                  <input
                    type="time"
                    required
                    value={newEvent.time}
                    onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                    className="px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Prix (€)"
                    required
                    min="0"
                    value={newEvent.price}
                    onChange={e => setNewEvent({...newEvent, price: parseFloat(e.target.value)})}
                    className="px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                  <input
                    type="url"
                    placeholder="URL de l'image"
                    value={newEvent.image_url}
                    onChange={e => setNewEvent({...newEvent, image_url: e.target.value})}
                    className="px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-cyan-500 outline-none lg:col-span-2"
                  />
                  <textarea
                    placeholder="Description"
                    required
                    value={newEvent.description}
                    onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                    className="px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-cyan-500 outline-none sm:col-span-2 lg:col-span-3"
                  />
                  <button type="submit" className="bg-zinc-900 hover:bg-cyan-600 text-white px-4 py-2 rounded-xl font-medium transition-colors sm:col-span-2 lg:col-span-3">
                    Ajouter
                  </button>
                </form>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-zinc-500 border-b border-zinc-200">
                    <tr>
                      <th className="pb-3 font-medium">Date & Heure</th>
                      <th className="pb-3 font-medium">Titre</th>
                      <th className="pb-3 font-medium">Prix</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {events.map(event => (
                      <tr key={event.id} className="hover:bg-zinc-50">
                        <td className="py-4 font-medium text-zinc-900 whitespace-nowrap">
                          {new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}
                        </td>
                        <td className="py-4 font-medium text-zinc-900">{event.title}</td>
                        <td className="py-4 text-zinc-600">{event.price}€</td>
                        <td className="py-4 text-right">
                          <button onClick={() => handleDeleteEvent(event.id)} className="text-red-500 hover:text-red-700 p-2">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* RESERVATIONS TAB */}
          {activeTab === 'reservations' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-zinc-500 border-b border-zinc-200">
                  <tr>
                    <th className="pb-3 font-medium">Date résa</th>
                    <th className="pb-3 font-medium">Soirée</th>
                    <th className="pb-3 font-medium">Nom</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium text-center">Places</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {reservations.map(res => (
                    <tr key={res.id} className="hover:bg-zinc-50">
                      <td className="py-4 text-zinc-500 whitespace-nowrap">
                        {new Date(res.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-4 font-medium text-zinc-900">
                        {res.event_title}
                        <div className="text-xs text-zinc-500 font-normal">{new Date(res.event_date).toLocaleDateString('fr-FR')}</div>
                      </td>
                      <td className="py-4 text-zinc-900">{res.name}</td>
                      <td className="py-4 text-zinc-600">{res.email}</td>
                      <td className="py-4 text-center font-bold text-cyan-600 bg-cyan-50 rounded-lg my-2 inline-block px-3 py-1">
                        {res.tickets_count}
                      </td>
                    </tr>
                  ))}
                  {reservations.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-zinc-500">Aucune réservation pour le moment.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* APPLICATIONS TAB */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              {applications.map(app => (
                <div key={app.id} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-zinc-900">{app.name}</h4>
                      <a href={`mailto:${app.email}`} className="text-cyan-600 text-sm hover:underline">{app.email}</a>
                    </div>
                    <span className="text-xs text-zinc-500">
                      {new Date(app.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="mb-4">
                    <a href={app.video_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                      Voir la vidéo
                    </a>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-zinc-100 text-sm text-zinc-700 italic">
                    "{app.message}"
                  </div>
                </div>
              ))}
              {applications.length === 0 && (
                <div className="text-center py-12 text-zinc-500">
                  Aucune candidature pour le moment.
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
