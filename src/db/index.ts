import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'bip_comedy.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS artists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    bio TEXT,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    price REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    tickets_count INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    video_link TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed some initial data if empty
const artistsCount = db.prepare('SELECT COUNT(*) as count FROM artists').get() as { count: number };
if (artistsCount.count === 0 || artistsCount.count === 3 || artistsCount.count === 5) {
  // Clear existing artists if it's the old seed data
  db.exec('DELETE FROM artists;');
  
  const insertArtist = db.prepare('INSERT INTO artists (name, bio, image_url) VALUES (?, ?, ?)');
  insertArtist.run('SALEM', 'Un humoriste incontournable du Biiip Comedy Club, prêt à vous faire pleurer de rire.', 'https://picsum.photos/seed/salem/400/600');
  insertArtist.run('SPENCER', 'L\'énergie à l\'état pur. Ses anecdotes vont vous surprendre.', 'https://picsum.photos/seed/spencer/400/600');
  insertArtist.run('RIAD', 'Un regard piquant sur le quotidien, avec une touche de folie.', 'https://picsum.photos/seed/riad/400/600');
  insertArtist.run('MONDOR', 'Le maître du stand-up toulonnais, toujours le bon mot au bon moment.', 'https://picsum.photos/seed/mondor/400/600');
  insertArtist.run('PETIT ROBERT', 'Ne vous fiez pas à son nom, son humour est grand et percutant.', 'https://picsum.photos/seed/petitrobert/400/600');
}

const eventsCount = db.prepare('SELECT COUNT(*) as count FROM events').get() as { count: number };
if (eventsCount.count === 0) {
  const insertEvent = db.prepare('INSERT INTO events (title, date, time, description, image_url, price) VALUES (?, ?, ?, ?, ?, ?)');
  insertEvent.run('Soirée Stand-up Découverte', '2026-04-15', '20:30', 'Venez découvrir les nouveaux talents de la région PACA !', 'https://picsum.photos/seed/event1/800/400', 10);
  insertEvent.run('Le Grand Gala du Biiip', '2026-05-02', '21:00', 'Une soirée exceptionnelle avec nos meilleurs humoristes.', 'https://picsum.photos/seed/event2/800/400', 15);
}

export default db;
