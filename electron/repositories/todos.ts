import { getDatabase, generateId } from '../database'

// Types
export type TodoStatus = 'pending' | 'in_progress' | 'completed'
export type TodoPriority = 'low' | 'medium' | 'high'

export interface Todo {
  id: string
  title: string
  description: string
  status: TodoStatus
  priority: TodoPriority
  dueDate: Date | null
  noteId: string | null
  parentId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface TodoInput {
  title: string
  description?: string
  status?: TodoStatus
  priority?: TodoPriority
  dueDate?: Date | null
  noteId?: string | null
  parentId?: string | null
}

export interface TodoFilter {
  status?: TodoStatus | TodoStatus[]
  priority?: TodoPriority | TodoPriority[]
  noteId?: string
  parentId?: string | null
  hasDueDate?: boolean
  overdue?: boolean
  dueToday?: boolean
  dueSoon?: number // days from now
}

// Convert database row to Todo object
function rowToTodo(row: Record<string, unknown>): Todo {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    status: row.status as TodoStatus,
    priority: row.priority as TodoPriority,
    dueDate: row.due_date ? new Date(row.due_date as number) : null,
    noteId: row.note_id as string | null,
    parentId: row.parent_id as string | null,
    createdAt: new Date(row.created_at as number),
    updatedAt: new Date(row.updated_at as number)
  }
}

// Create a new todo
export function createTodo(input: TodoInput): Todo {
  const db = getDatabase()
  const id = generateId()
  const now = Date.now()

  const stmt = db.prepare(`
    INSERT INTO todos (id, title, description, status, priority, due_date, note_id, parent_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  stmt.run(
    id,
    input.title,
    input.description ?? '',
    input.status ?? 'pending',
    input.priority ?? 'medium',
    input.dueDate ? input.dueDate.getTime() : null,
    input.noteId ?? null,
    input.parentId ?? null,
    now,
    now
  )

  return {
    id,
    title: input.title,
    description: input.description ?? '',
    status: input.status ?? 'pending',
    priority: input.priority ?? 'medium',
    dueDate: input.dueDate ?? null,
    noteId: input.noteId ?? null,
    parentId: input.parentId ?? null,
    createdAt: new Date(now),
    updatedAt: new Date(now)
  }
}

// Get all todos with optional filtering
export function listTodos(filter?: TodoFilter): Todo[] {
  const db = getDatabase()

  let query = 'SELECT * FROM todos WHERE 1=1'
  const params: unknown[] = []

  if (filter) {
    if (filter.status) {
      const statuses = Array.isArray(filter.status) ? filter.status : [filter.status]
      query += ` AND status IN (${statuses.map(() => '?').join(', ')})`
      params.push(...statuses)
    }

    if (filter.priority) {
      const priorities = Array.isArray(filter.priority) ? filter.priority : [filter.priority]
      query += ` AND priority IN (${priorities.map(() => '?').join(', ')})`
      params.push(...priorities)
    }

    if (filter.noteId) {
      query += ' AND note_id = ?'
      params.push(filter.noteId)
    }

    if (filter.parentId !== undefined) {
      if (filter.parentId === null) {
        query += ' AND parent_id IS NULL'
      } else {
        query += ' AND parent_id = ?'
        params.push(filter.parentId)
      }
    }

    if (filter.hasDueDate !== undefined) {
      query += filter.hasDueDate ? ' AND due_date IS NOT NULL' : ' AND due_date IS NULL'
    }

    if (filter.overdue) {
      query += ' AND due_date < ? AND status != ?'
      params.push(Date.now(), 'completed')
    }

    if (filter.dueToday) {
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)
      query += ' AND due_date >= ? AND due_date <= ?'
      params.push(startOfDay.getTime(), endOfDay.getTime())
    }

    if (filter.dueSoon) {
      const now = Date.now()
      const soonTime = now + filter.dueSoon * 24 * 60 * 60 * 1000
      query += ' AND due_date > ? AND due_date <= ?'
      params.push(now, soonTime)
    }
  }

  query += ' ORDER BY CASE status WHEN \'in_progress\' THEN 0 WHEN \'pending\' THEN 1 ELSE 2 END, '
  query += 'CASE priority WHEN \'high\' THEN 0 WHEN \'medium\' THEN 1 ELSE 2 END, '
  query += 'due_date ASC NULLS LAST, created_at DESC'

  const stmt = db.prepare(query)
  const rows = stmt.all(...params) as Record<string, unknown>[]
  return rows.map(rowToTodo)
}

// Get a single todo by ID
export function getTodo(id: string): Todo | null {
  const db = getDatabase()
  const stmt = db.prepare('SELECT * FROM todos WHERE id = ?')
  const row = stmt.get(id) as Record<string, unknown> | undefined
  return row ? rowToTodo(row) : null
}

// Update a todo
export function updateTodo(id: string, input: Partial<TodoInput>): Todo | null {
  const db = getDatabase()
  const now = Date.now()

  const updates: string[] = []
  const values: unknown[] = []

  if (input.title !== undefined) {
    updates.push('title = ?')
    values.push(input.title)
  }

  if (input.description !== undefined) {
    updates.push('description = ?')
    values.push(input.description)
  }

  if (input.status !== undefined) {
    updates.push('status = ?')
    values.push(input.status)
  }

  if (input.priority !== undefined) {
    updates.push('priority = ?')
    values.push(input.priority)
  }

  if (input.dueDate !== undefined) {
    updates.push('due_date = ?')
    values.push(input.dueDate ? input.dueDate.getTime() : null)
  }

  if (input.noteId !== undefined) {
    updates.push('note_id = ?')
    values.push(input.noteId)
  }

  if (input.parentId !== undefined) {
    updates.push('parent_id = ?')
    values.push(input.parentId)
  }

  if (updates.length === 0) {
    return getTodo(id)
  }

  updates.push('updated_at = ?')
  values.push(now)
  values.push(id)

  const stmt = db.prepare(`UPDATE todos SET ${updates.join(', ')} WHERE id = ?`)
  const result = stmt.run(...values)

  if (result.changes === 0) {
    return null
  }

  return getTodo(id)
}

// Delete a todo
export function deleteTodo(id: string): boolean {
  const db = getDatabase()
  const stmt = db.prepare('DELETE FROM todos WHERE id = ?')
  const result = stmt.run(id)
  return result.changes > 0
}

// Get subtasks of a todo
export function getSubtasks(parentId: string): Todo[] {
  return listTodos({ parentId })
}

// Search todos using full-text search
export function searchTodos(query: string): Todo[] {
  const db = getDatabase()

  const escapedQuery = query.replace(/['"]/g, '').trim()
  if (!escapedQuery) {
    return []
  }

  const stmt = db.prepare(`
    SELECT todos.* FROM todos
    JOIN todos_fts ON todos.rowid = todos_fts.rowid
    WHERE todos_fts MATCH ?
    ORDER BY rank
    LIMIT 100
  `)

  const rows = stmt.all(`${escapedQuery}*`) as Record<string, unknown>[]
  return rows.map(rowToTodo)
}

// Get todos linked to a specific note
export function getTodosByNote(noteId: string): Todo[] {
  return listTodos({ noteId })
}

// Get statistics for todos
export function getTodoStats(): {
  total: number
  pending: number
  inProgress: number
  completed: number
  overdue: number
} {
  const db = getDatabase()
  const now = Date.now()

  const stats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN due_date < ? AND status != 'completed' THEN 1 ELSE 0 END) as overdue
    FROM todos
  `).get(now) as Record<string, number>

  return {
    total: stats.total,
    pending: stats.pending,
    inProgress: stats.in_progress,
    completed: stats.completed,
    overdue: stats.overdue
  }
}
