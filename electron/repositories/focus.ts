import { getDatabase, generateId } from '../database'

// Types
export type FocusStatus = 'running' | 'completed' | 'cancelled'

export interface FocusSession {
  id: string
  startTime: Date
  endTime: Date | null
  duration: number // target duration in seconds
  actualDuration: number // actual focused time in seconds
  status: FocusStatus
  todoId: string | null
  createdAt: Date
}

export interface FocusStats {
  totalSessions: number
  completedSessions: number
  totalFocusTime: number // in seconds
  averageSessionLength: number // in seconds
  currentStreak: number // days
  longestStreak: number // days
  todayFocusTime: number // in seconds
  thisWeekFocusTime: number // in seconds
}

// Convert database row to FocusSession object
function rowToSession(row: Record<string, unknown>): FocusSession {
  return {
    id: row.id as string,
    startTime: new Date(row.start_time as number),
    endTime: row.end_time ? new Date(row.end_time as number) : null,
    duration: row.duration as number,
    actualDuration: row.actual_duration as number,
    status: row.status as FocusStatus,
    todoId: row.todo_id as string | null,
    createdAt: new Date(row.created_at as number)
  }
}

// Start a new focus session
export function startSession(duration: number, todoId?: string): FocusSession {
  const db = getDatabase()
  const id = generateId()
  const now = Date.now()

  const stmt = db.prepare(`
    INSERT INTO focus_sessions (id, start_time, duration, actual_duration, status, todo_id, created_at)
    VALUES (?, ?, ?, 0, 'running', ?, ?)
  `)

  stmt.run(id, now, duration, todoId ?? null, now)

  return {
    id,
    startTime: new Date(now),
    endTime: null,
    duration,
    actualDuration: 0,
    status: 'running',
    todoId: todoId ?? null,
    createdAt: new Date(now)
  }
}

// Get the currently running session (if any)
export function getRunningSession(): FocusSession | null {
  const db = getDatabase()
  const stmt = db.prepare(`
    SELECT * FROM focus_sessions WHERE status = 'running' LIMIT 1
  `)

  const row = stmt.get() as Record<string, unknown> | undefined
  return row ? rowToSession(row) : null
}

// Update session (for pause/resume - we track actual_duration)
export function updateSessionDuration(id: string, actualDuration: number): FocusSession | null {
  const db = getDatabase()
  const stmt = db.prepare(`
    UPDATE focus_sessions SET actual_duration = ? WHERE id = ?
  `)

  const result = stmt.run(actualDuration, id)
  if (result.changes === 0) return null

  return getSession(id)
}

// Complete a session
export function completeSession(id: string): FocusSession | null {
  const db = getDatabase()
  const session = getSession(id)
  if (!session) return null

  const now = Date.now()
  const actualDuration = Math.floor((now - session.startTime.getTime()) / 1000)

  const stmt = db.prepare(`
    UPDATE focus_sessions SET status = 'completed', end_time = ?, actual_duration = ? WHERE id = ?
  `)

  stmt.run(now, actualDuration, id)
  return getSession(id)
}

// Cancel a session
export function cancelSession(id: string): FocusSession | null {
  const db = getDatabase()
  const session = getSession(id)
  if (!session) return null

  const now = Date.now()
  const actualDuration = Math.floor((now - session.startTime.getTime()) / 1000)

  const stmt = db.prepare(`
    UPDATE focus_sessions SET status = 'cancelled', end_time = ?, actual_duration = ? WHERE id = ?
  `)

  stmt.run(now, actualDuration, id)
  return getSession(id)
}

// Get a session by ID
export function getSession(id: string): FocusSession | null {
  const db = getDatabase()
  const stmt = db.prepare('SELECT * FROM focus_sessions WHERE id = ?')
  const row = stmt.get(id) as Record<string, unknown> | undefined
  return row ? rowToSession(row) : null
}

// Get all sessions (most recent first)
export function listSessions(limit = 100): FocusSession[] {
  const db = getDatabase()
  const stmt = db.prepare(`
    SELECT * FROM focus_sessions ORDER BY created_at DESC LIMIT ?
  `)

  const rows = stmt.all(limit) as Record<string, unknown>[]
  return rows.map(rowToSession)
}

// Get sessions for a specific todo
export function getSessionsForTodo(todoId: string): FocusSession[] {
  const db = getDatabase()
  const stmt = db.prepare(`
    SELECT * FROM focus_sessions WHERE todo_id = ? ORDER BY created_at DESC
  `)

  const rows = stmt.all(todoId) as Record<string, unknown>[]
  return rows.map(rowToSession)
}

// Get focus statistics
export function getStats(): FocusStats {
  const db = getDatabase()

  // Get basic stats
  const basicStats = db.prepare(`
    SELECT
      COUNT(*) as total_sessions,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_sessions,
      SUM(CASE WHEN status = 'completed' THEN actual_duration ELSE 0 END) as total_focus_time
    FROM focus_sessions
  `).get() as Record<string, number>

  const totalSessions = basicStats.total_sessions || 0
  const completedSessions = basicStats.completed_sessions || 0
  const totalFocusTime = basicStats.total_focus_time || 0
  const averageSessionLength = completedSessions > 0 ? totalFocusTime / completedSessions : 0

  // Today's focus time
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const todayStats = db.prepare(`
    SELECT SUM(actual_duration) as today_focus_time
    FROM focus_sessions
    WHERE status = 'completed' AND start_time >= ?
  `).get(startOfDay.getTime()) as { today_focus_time: number | null }

  const todayFocusTime = todayStats.today_focus_time || 0

  // This week's focus time
  const startOfWeek = new Date()
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const weekStats = db.prepare(`
    SELECT SUM(actual_duration) as week_focus_time
    FROM focus_sessions
    WHERE status = 'completed' AND start_time >= ?
  `).get(startOfWeek.getTime()) as { week_focus_time: number | null }

  const thisWeekFocusTime = weekStats.week_focus_time || 0

  // Calculate streaks
  const { currentStreak, longestStreak } = calculateStreaks(db)

  return {
    totalSessions,
    completedSessions,
    totalFocusTime,
    averageSessionLength,
    currentStreak,
    longestStreak,
    todayFocusTime,
    thisWeekFocusTime
  }
}

// Helper function to calculate focus streaks
function calculateStreaks(db: ReturnType<typeof getDatabase>): { currentStreak: number; longestStreak: number } {
  // Get distinct days with completed sessions
  const daysWithSessions = db.prepare(`
    SELECT DISTINCT date(start_time / 1000, 'unixepoch', 'localtime') as session_date
    FROM focus_sessions
    WHERE status = 'completed'
    ORDER BY session_date DESC
  `).all() as Array<{ session_date: string }>

  if (daysWithSessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  let currentStreak = 0
  let longestStreak = 0
  let streak = 0
  let prevDate: Date | null = null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < daysWithSessions.length; i++) {
    const currentDate = new Date(daysWithSessions[i].session_date)
    currentDate.setHours(0, 0, 0, 0)

    if (prevDate === null) {
      // First day
      const diffFromToday = Math.floor((today.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000))
      if (diffFromToday <= 1) {
        // Today or yesterday - start counting current streak
        streak = 1
        currentStreak = 1
      } else {
        // Gap from today - no current streak
        streak = 1
      }
    } else {
      const diff = Math.floor((prevDate.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000))
      if (diff === 1) {
        // Consecutive day
        streak++
        if (currentStreak > 0) {
          currentStreak = streak
        }
      } else {
        // Gap - reset streak
        longestStreak = Math.max(longestStreak, streak)
        streak = 1
        if (currentStreak > 0) {
          currentStreak = 0
        }
      }
    }

    longestStreak = Math.max(longestStreak, streak)
    prevDate = currentDate
  }

  return { currentStreak, longestStreak }
}
