import express from 'express';
import { createServer as createViteServer } from 'vite';
import db from './src/db/index.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Artists
  app.get('/api/artists', (req, res) => {
    try {
      const artists = db.prepare('SELECT * FROM artists ORDER BY id DESC').all();
      res.json(artists);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch artists' });
    }
  });

  app.post('/api/artists', (req, res) => {
    const { name, bio, image_url } = req.body;
    try {
      const stmt = db.prepare('INSERT INTO artists (name, bio, image_url) VALUES (?, ?, ?)');
      const info = stmt.run(name, bio, image_url);
      res.json({ id: info.lastInsertRowid, name, bio, image_url });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create artist' });
    }
  });

  app.delete('/api/artists/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM artists WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete artist' });
    }
  });

  // Events
  app.get('/api/events', (req, res) => {
    try {
      const events = db.prepare('SELECT * FROM events ORDER BY date ASC, time ASC').all();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });

  app.post('/api/events', (req, res) => {
    const { title, date, time, description, image_url, price } = req.body;
    try {
      const stmt = db.prepare('INSERT INTO events (title, date, time, description, image_url, price) VALUES (?, ?, ?, ?, ?, ?)');
      const info = stmt.run(title, date, time, description, image_url, price);
      res.json({ id: info.lastInsertRowid, title, date, time, description, image_url, price });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create event' });
    }
  });

  app.delete('/api/events/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete event' });
    }
  });

  // Reservations
  app.get('/api/reservations', (req, res) => {
    try {
      const reservations = db.prepare(`
        SELECT r.*, e.title as event_title, e.date as event_date 
        FROM reservations r 
        LEFT JOIN events e ON r.event_id = e.id 
        ORDER BY r.created_at DESC
      `).all();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reservations' });
    }
  });

  app.post('/api/reservations', (req, res) => {
    const { event_id, name, email, tickets_count } = req.body;
    try {
      const stmt = db.prepare('INSERT INTO reservations (event_id, name, email, tickets_count) VALUES (?, ?, ?, ?)');
      const info = stmt.run(event_id, name, email, tickets_count);
      res.json({ id: info.lastInsertRowid, event_id, name, email, tickets_count });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create reservation' });
    }
  });

  // Applications
  app.get('/api/applications', (req, res) => {
    try {
      const applications = db.prepare('SELECT * FROM applications ORDER BY created_at DESC').all();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch applications' });
    }
  });

  app.post('/api/applications', (req, res) => {
    const { name, email, video_link, message } = req.body;
    try {
      const stmt = db.prepare('INSERT INTO applications (name, email, video_link, message) VALUES (?, ?, ?, ?)');
      const info = stmt.run(name, email, video_link, message);
      res.json({ id: info.lastInsertRowid, name, email, video_link, message });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create application' });
    }
  });


  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
