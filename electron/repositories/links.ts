import { getDatabase, generateId } from '../database'

// Types
export type EntityType = 'note' | 'todo'
export type LinkType = 'related' | 'contains' | 'references'

export interface Link {
  id: string
  sourceType: EntityType
  sourceId: string
  targetType: EntityType
  targetId: string
  linkType: LinkType
  createdAt: Date
}

export interface LinkInput {
  sourceType: EntityType
  sourceId: string
  targetType: EntityType
  targetId: string
  linkType?: LinkType
}

// Convert database row to Link object
function rowToLink(row: Record<string, unknown>): Link {
  return {
    id: row.id as string,
    sourceType: row.source_type as EntityType,
    sourceId: row.source_id as string,
    targetType: row.target_type as EntityType,
    targetId: row.target_id as string,
    linkType: row.link_type as LinkType,
    createdAt: new Date(row.created_at as number)
  }
}

// Create a new link
export function createLink(input: LinkInput): Link {
  const db = getDatabase()
  const id = generateId()
  const now = Date.now()

  // Check if link already exists (in either direction for bidirectional)
  const existing = db.prepare(`
    SELECT id FROM links
    WHERE (source_type = ? AND source_id = ? AND target_type = ? AND target_id = ?)
       OR (source_type = ? AND source_id = ? AND target_type = ? AND target_id = ?)
  `).get(
    input.sourceType, input.sourceId, input.targetType, input.targetId,
    input.targetType, input.targetId, input.sourceType, input.sourceId
  )

  if (existing) {
    // Return the existing link
    return getLink((existing as { id: string }).id)!
  }

  const stmt = db.prepare(`
    INSERT INTO links (id, source_type, source_id, target_type, target_id, link_type, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  stmt.run(
    id,
    input.sourceType,
    input.sourceId,
    input.targetType,
    input.targetId,
    input.linkType ?? 'related',
    now
  )

  return {
    id,
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    targetType: input.targetType,
    targetId: input.targetId,
    linkType: input.linkType ?? 'related',
    createdAt: new Date(now)
  }
}

// Get a link by ID
export function getLink(id: string): Link | null {
  const db = getDatabase()
  const stmt = db.prepare('SELECT * FROM links WHERE id = ?')
  const row = stmt.get(id) as Record<string, unknown> | undefined
  return row ? rowToLink(row) : null
}

// Get all links from a source
export function getLinksFrom(sourceType: EntityType, sourceId: string): Link[] {
  const db = getDatabase()
  const stmt = db.prepare(`
    SELECT * FROM links WHERE source_type = ? AND source_id = ?
    ORDER BY created_at DESC
  `)

  const rows = stmt.all(sourceType, sourceId) as Record<string, unknown>[]
  return rows.map(rowToLink)
}

// Get all backlinks (links pointing to an entity)
export function getBacklinks(targetType: EntityType, targetId: string): Link[] {
  const db = getDatabase()
  const stmt = db.prepare(`
    SELECT * FROM links WHERE target_type = ? AND target_id = ?
    ORDER BY created_at DESC
  `)

  const rows = stmt.all(targetType, targetId) as Record<string, unknown>[]
  return rows.map(rowToLink)
}

// Get all links involving an entity (both directions)
export function getAllLinks(entityType: EntityType, entityId: string): Link[] {
  const db = getDatabase()
  const stmt = db.prepare(`
    SELECT * FROM links
    WHERE (source_type = ? AND source_id = ?)
       OR (target_type = ? AND target_id = ?)
    ORDER BY created_at DESC
  `)

  const rows = stmt.all(entityType, entityId, entityType, entityId) as Record<string, unknown>[]
  return rows.map(rowToLink)
}

// Delete a link by ID
export function deleteLink(id: string): boolean {
  const db = getDatabase()
  const stmt = db.prepare('DELETE FROM links WHERE id = ?')
  const result = stmt.run(id)
  return result.changes > 0
}

// Delete all links involving an entity
export function deleteLinksForEntity(entityType: EntityType, entityId: string): number {
  const db = getDatabase()
  const stmt = db.prepare(`
    DELETE FROM links
    WHERE (source_type = ? AND source_id = ?)
       OR (target_type = ? AND target_id = ?)
  `)

  const result = stmt.run(entityType, entityId, entityType, entityId)
  return result.changes
}

// Get graph data for visualization
export function getGraphData(): {
  nodes: Array<{ id: string; type: EntityType; label: string }>
  edges: Array<{ source: string; target: string; type: LinkType }>
} {
  const db = getDatabase()

  // Get all notes
  const notes = db.prepare(`
    SELECT id, title FROM notes
  `).all() as Array<{ id: string; title: string }>

  // Get all todos
  const todos = db.prepare(`
    SELECT id, title FROM todos
  `).all() as Array<{ id: string; title: string }>

  // Get all links
  const links = db.prepare(`
    SELECT source_type, source_id, target_type, target_id, link_type FROM links
  `).all() as Array<{
    source_type: EntityType
    source_id: string
    target_type: EntityType
    target_id: string
    link_type: LinkType
  }>

  const nodes = [
    ...notes.map(n => ({ id: n.id, type: 'note' as EntityType, label: n.title })),
    ...todos.map(t => ({ id: t.id, type: 'todo' as EntityType, label: t.title }))
  ]

  const edges = links.map(l => ({
    source: l.source_id,
    target: l.target_id,
    type: l.link_type
  }))

  return { nodes, edges }
}

// Parse wiki-style links from content and return target note titles
export function parseWikiLinks(content: string): string[] {
  const wikiLinkPattern = /\[\[([^\]]+)\]\]/g
  const links: string[] = []
  let match

  while ((match = wikiLinkPattern.exec(content)) !== null) {
    links.push(match[1].trim())
  }

  return links
}

// Create links from wiki-style syntax in note content
export function createLinksFromContent(sourceNoteId: string, content: string): Link[] {
  const db = getDatabase()
  const wikiLinks = parseWikiLinks(content)
  const createdLinks: Link[] = []

  for (const linkTitle of wikiLinks) {
    // Find the target note by title
    const targetNote = db.prepare(`
      SELECT id FROM notes WHERE title = ? COLLATE NOCASE
    `).get(linkTitle) as { id: string } | undefined

    if (targetNote && targetNote.id !== sourceNoteId) {
      const link = createLink({
        sourceType: 'note',
        sourceId: sourceNoteId,
        targetType: 'note',
        targetId: targetNote.id,
        linkType: 'references'
      })
      createdLinks.push(link)
    }
  }

  return createdLinks
}
