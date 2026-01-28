// Type declarations for the Electron API exposed via preload
import type { Note, NoteInput } from '../../electron/repositories/notes'
import type { Todo, TodoInput, TodoFilter } from '../../electron/repositories/todos'
import type { FocusSession, FocusStats } from '../../electron/repositories/focus'
import type { Link, LinkInput, EntityType } from '../../electron/repositories/links'

export interface ElectronAPI {
  platform: NodeJS.Platform

  notes: {
    create: (input: NoteInput) => Promise<Note>
    list: () => Promise<Note[]>
    get: (id: string) => Promise<Note | null>
    update: (id: string, input: Partial<NoteInput>) => Promise<Note | null>
    delete: (id: string) => Promise<boolean>
    search: (query: string) => Promise<Note[]>
  }

  todos: {
    create: (input: TodoInput) => Promise<Todo>
    list: (filter?: TodoFilter) => Promise<Todo[]>
    get: (id: string) => Promise<Todo | null>
    update: (id: string, input: Partial<TodoInput>) => Promise<Todo | null>
    delete: (id: string) => Promise<boolean>
  }

  focus: {
    start: (duration: number, todoId?: string) => Promise<FocusSession>
    pause: (id: string) => Promise<void>
    resume: (id: string) => Promise<void>
    complete: (id: string) => Promise<FocusSession | null>
    cancel: (id: string) => Promise<FocusSession | null>
    getStats: () => Promise<FocusStats>
  }

  links: {
    create: (input: LinkInput) => Promise<Link>
    list: (sourceType: EntityType, sourceId: string) => Promise<Link[]>
    delete: (id: string) => Promise<boolean>
    getBacklinks: (targetType: EntityType, targetId: string) => Promise<Link[]>
  }

  onQuickCapture: (callback: () => void) => () => void
  showNotification: (title: string, body: string) => void
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export {}
