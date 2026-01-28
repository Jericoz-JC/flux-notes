import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

let db: Database.Database | null = null

// Get the database path based on environment
function getDatabasePath(): string {
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

  if (isDev) {
    return join(process.cwd(), 'flux-notes.db')
  }

  const userDataPath = app.getPath('userData')
  if (!existsSync(userDataPath)) {
    mkdirSync(userDataPath, { recursive: true })
  }

  return join(userDataPath, 'flux-notes.db')
}

// Initialize database with schema
export function initDatabase(): Database.Database {
  if (db) return db

  const dbPath = getDatabasePath()
  console.log('Initializing database at:', dbPath)

  db = new Database(dbPath)

  // Enable WAL mode for better performance
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  // Create tables
  db.exec(`
    -- Notes table
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT DEFAULT '',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- Todos table
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      status TEXT CHECK(status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
      priority TEXT CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
      due_date INTEGER,
      note_id TEXT REFERENCES notes(id) ON DELETE SET NULL,
      parent_id TEXT REFERENCES todos(id) ON DELETE CASCADE,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    -- Tags table (auto-extracted from content)
    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    );

    -- Note-Tags junction table
    CREATE TABLE IF NOT EXISTS note_tags (
      note_id TEXT REFERENCES notes(id) ON DELETE CASCADE,
      tag_id TEXT REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (note_id, tag_id)
    );

    -- Links table (bidirectional)
    CREATE TABLE IF NOT EXISTS links (
      id TEXT PRIMARY KEY,
      source_type TEXT CHECK(source_type IN ('note', 'todo')) NOT NULL,
      source_id TEXT NOT NULL,
      target_type TEXT CHECK(target_type IN ('note', 'todo')) NOT NULL,
      target_id TEXT NOT NULL,
      link_type TEXT CHECK(link_type IN ('related', 'contains', 'references')) DEFAULT 'related',
      created_at INTEGER NOT NULL
    );

    -- Focus sessions table
    CREATE TABLE IF NOT EXISTS focus_sessions (
      id TEXT PRIMARY KEY,
      start_time INTEGER NOT NULL,
      end_time INTEGER,
      duration INTEGER NOT NULL,
      actual_duration INTEGER DEFAULT 0,
      status TEXT CHECK(status IN ('running', 'completed', 'cancelled')) DEFAULT 'running',
      todo_id TEXT REFERENCES todos(id) ON DELETE SET NULL,
      created_at INTEGER NOT NULL
    );

    -- Full-text search for notes
    CREATE VIRTUAL TABLE IF NOT EXISTS notes_fts USING fts5(
      title,
      body,
      content='notes',
      content_rowid='rowid',
      tokenize='porter unicode61'
    );

    -- Full-text search for todos
    CREATE VIRTUAL TABLE IF NOT EXISTS todos_fts USING fts5(
      title,
      description,
      content='todos',
      content_rowid='rowid',
      tokenize='porter unicode61'
    );

    -- Triggers to keep FTS in sync with notes
    CREATE TRIGGER IF NOT EXISTS notes_ai AFTER INSERT ON notes BEGIN
      INSERT INTO notes_fts(rowid, title, body) VALUES (NEW.rowid, NEW.title, NEW.body);
    END;

    CREATE TRIGGER IF NOT EXISTS notes_ad AFTER DELETE ON notes BEGIN
      INSERT INTO notes_fts(notes_fts, rowid, title, body) VALUES('delete', OLD.rowid, OLD.title, OLD.body);
    END;

    CREATE TRIGGER IF NOT EXISTS notes_au AFTER UPDATE ON notes BEGIN
      INSERT INTO notes_fts(notes_fts, rowid, title, body) VALUES('delete', OLD.rowid, OLD.title, OLD.body);
      INSERT INTO notes_fts(rowid, title, body) VALUES (NEW.rowid, NEW.title, NEW.body);
    END;

    -- Triggers to keep FTS in sync with todos
    CREATE TRIGGER IF NOT EXISTS todos_ai AFTER INSERT ON todos BEGIN
      INSERT INTO todos_fts(rowid, title, description) VALUES (NEW.rowid, NEW.title, NEW.description);
    END;

    CREATE TRIGGER IF NOT EXISTS todos_ad AFTER DELETE ON todos BEGIN
      INSERT INTO todos_fts(todos_fts, rowid, title, description) VALUES('delete', OLD.rowid, OLD.title, OLD.description);
    END;

    CREATE TRIGGER IF NOT EXISTS todos_au AFTER UPDATE ON todos BEGIN
      INSERT INTO todos_fts(todos_fts, rowid, title, description) VALUES('delete', OLD.rowid, OLD.title, OLD.description);
      INSERT INTO todos_fts(rowid, title, description) VALUES (NEW.rowid, NEW.title, NEW.description);
    END;

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_notes_updated ON notes(updated_at DESC);
    CREATE INDEX IF NOT EXISTS idx_notes_created ON notes(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_todos_status ON todos(status);
    CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);
    CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);
    CREATE INDEX IF NOT EXISTS idx_todos_note_id ON todos(note_id);
    CREATE INDEX IF NOT EXISTS idx_links_source ON links(source_type, source_id);
    CREATE INDEX IF NOT EXISTS idx_links_target ON links(target_type, target_id);
    CREATE INDEX IF NOT EXISTS idx_focus_sessions_status ON focus_sessions(status);
    CREATE INDEX IF NOT EXISTS idx_focus_sessions_start ON focus_sessions(start_time DESC);
  `)

  return db
}

// Close database connection
export function closeDatabase(): void {
  if (db) {
    db.close()
    db = null
  }
}

// Get database instance
export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase first.')
  }
  return db
}

// Generate a unique ID (simple UUID v4 implementation)
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
