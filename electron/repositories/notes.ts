import { getDatabase, generateId } from '../database'

// Types
export interface Note {
  id: string
  title: string
  body: string
  createdAt: Date
  updatedAt: Date
}

export interface NoteInput {
  title: string
  body?: string
}

// Convert database row to Note object
function rowToNote(row: Record<string, unknown>): Note {
  return {
    id: row.id as string,
    title: row.title as string,
    body: row.body as string,
    createdAt: new Date(row.created_at as number),
    updatedAt: new Date(row.updated_at as number)
  }
}

// Create a new note
export function createNote(input: NoteInput): Note {
  const db = getDatabase()
  const id = generateId()
  const now = Date.now()

  const stmt = db.prepare(`
    INSERT INTO notes (id, title, body, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `)

  stmt.run(id, input.title, input.body ?? '', now, now)

  return {
    id,
    title: input.title,
    body: input.body ?? '',
    createdAt: new Date(now),
    updatedAt: new Date(now)
  }
}

// Get all notes
export function listNotes(): Note[] {
  const db = getDatabase()
  const stmt = db.prepare(`
    SELECT * FROM notes ORDER BY updated_at DESC
  `)

  const rows = stmt.all() as Record<string, unknown>[]
  return rows.map(rowToNote)
}

// Get a single note by ID
export function getNote(id: string): Note | null {
  const db = getDatabase()
  const stmt = db.prepare(`
    SELECT * FROM notes WHERE id = ?
  `)

  const row = stmt.get(id) as Record<string, unknown> | undefined
  return row ? rowToNote(row) : null
}

// Update a note
export function updateNote(id: string, input: Partial<NoteInput>): Note | null {
  const db = getDatabase()
  const now = Date.now()

  // Build update query dynamically based on provided fields
  const updates: string[] = []
  const values: unknown[] = []

  if (input.title !== undefined) {
    updates.push('title = ?')
    values.push(input.title)
  }

  if (input.body !== undefined) {
    updates.push('body = ?')
    values.push(input.body)
  }

  if (updates.length === 0) {
    return getNote(id)
  }

  updates.push('updated_at = ?')
  values.push(now)
  values.push(id)

  const stmt = db.prepare(`
    UPDATE notes SET ${updates.join(', ')} WHERE id = ?
  `)

  const result = stmt.run(...values)

  if (result.changes === 0) {
    return null
  }

  return getNote(id)
}

// Delete a note
export function deleteNote(id: string): boolean {
  const db = getDatabase()
  const stmt = db.prepare(`
    DELETE FROM notes WHERE id = ?
  `)

  const result = stmt.run(id)
  return result.changes > 0
}

// Search notes using full-text search
export function searchNotes(query: string): Note[] {
  const db = getDatabase()

  // Escape special FTS characters
  const escapedQuery = query.replace(/['"]/g, '').trim()
  if (!escapedQuery) {
    return []
  }

  const stmt = db.prepare(`
    SELECT notes.* FROM notes
    JOIN notes_fts ON notes.rowid = notes_fts.rowid
    WHERE notes_fts MATCH ?
    ORDER BY rank
    LIMIT 100
  `)

  const rows = stmt.all(`${escapedQuery}*`) as Record<string, unknown>[]
  return rows.map(rowToNote)
}

// Extract tags from note body (hashtags and mentions)
export function extractTags(body: string): string[] {
  const tagPattern = /#(\w+)/g
  const mentionPattern = /@(\w+)/g

  const tags = new Set<string>()

  let match
  while ((match = tagPattern.exec(body)) !== null) {
    tags.add(match[1].toLowerCase())
  }

  while ((match = mentionPattern.exec(body)) !== null) {
    tags.add(match[1].toLowerCase())
  }

  return Array.from(tags)
}

// Get notes with specific tag
export function getNotesByTag(tagName: string): Note[] {
  const db = getDatabase()
  const stmt = db.prepare(`
    SELECT notes.* FROM notes
    JOIN note_tags ON notes.id = note_tags.note_id
    JOIN tags ON note_tags.tag_id = tags.id
    WHERE tags.name = ?
    ORDER BY notes.updated_at DESC
  `)

  const rows = stmt.all(tagName.toLowerCase()) as Record<string, unknown>[]
  return rows.map(rowToNote)
}

// Sync tags for a note
export function syncNoteTags(noteId: string, body: string): void {
  const db = getDatabase()
  const tagNames = extractTags(body)

  // Start transaction
  const transaction = db.transaction(() => {
    // Remove existing tags for this note
    db.prepare('DELETE FROM note_tags WHERE note_id = ?').run(noteId)

    // Add new tags
    for (const tagName of tagNames) {
      // Insert tag if it doesn't exist
      const insertTag = db.prepare(`
        INSERT OR IGNORE INTO tags (id, name) VALUES (?, ?)
      `)
      const tagId = generateId()
      insertTag.run(tagId, tagName)

      // Get the tag ID
      const getTagId = db.prepare('SELECT id FROM tags WHERE name = ?')
      const tag = getTagId.get(tagName) as { id: string }

      // Link note to tag
      const linkTag = db.prepare(`
        INSERT INTO note_tags (note_id, tag_id) VALUES (?, ?)
      `)
      linkTag.run(noteId, tag.id)
    }
  })

  transaction()
}

// Get all tags with usage counts
export function getAllTags(): Array<{ name: string; count: number }> {
  const db = getDatabase()
  const stmt = db.prepare(`
    SELECT tags.name, COUNT(note_tags.note_id) as count
    FROM tags
    LEFT JOIN note_tags ON tags.id = note_tags.tag_id
    GROUP BY tags.id
    ORDER BY count DESC, tags.name ASC
  `)

  return stmt.all() as Array<{ name: string; count: number }>
}
