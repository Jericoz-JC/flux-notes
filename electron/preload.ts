import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// specific ipcRenderer methods without exposing the entire API
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,

  // Notes operations (to be implemented)
  notes: {
    create: (note: unknown) => ipcRenderer.invoke('db:notes:create', note),
    list: () => ipcRenderer.invoke('db:notes:list'),
    get: (id: string) => ipcRenderer.invoke('db:notes:get', id),
    update: (id: string, data: unknown) => ipcRenderer.invoke('db:notes:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('db:notes:delete', id),
    search: (query: string) => ipcRenderer.invoke('db:notes:search', query)
  },

  // Todos operations (to be implemented)
  todos: {
    create: (todo: unknown) => ipcRenderer.invoke('db:todos:create', todo),
    list: (filter?: unknown) => ipcRenderer.invoke('db:todos:list', filter),
    get: (id: string) => ipcRenderer.invoke('db:todos:get', id),
    update: (id: string, data: unknown) => ipcRenderer.invoke('db:todos:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('db:todos:delete', id)
  },

  // Focus sessions (to be implemented)
  focus: {
    start: (duration: number, todoId?: string) => ipcRenderer.invoke('db:focus:start', duration, todoId),
    pause: (id: string) => ipcRenderer.invoke('db:focus:pause', id),
    resume: (id: string) => ipcRenderer.invoke('db:focus:resume', id),
    complete: (id: string) => ipcRenderer.invoke('db:focus:complete', id),
    cancel: (id: string) => ipcRenderer.invoke('db:focus:cancel', id),
    getStats: () => ipcRenderer.invoke('db:focus:stats')
  },

  // Links (to be implemented)
  links: {
    create: (link: unknown) => ipcRenderer.invoke('db:links:create', link),
    list: (sourceId: string, sourceType: string) => ipcRenderer.invoke('db:links:list', sourceId, sourceType),
    delete: (id: string) => ipcRenderer.invoke('db:links:delete', id),
    getBacklinks: (targetId: string, targetType: string) => ipcRenderer.invoke('db:links:backlinks', targetId, targetType)
  },

  // Window events
  onQuickCapture: (callback: () => void) => {
    ipcRenderer.on('quick-capture', callback)
    return () => ipcRenderer.removeListener('quick-capture', callback)
  },

  // Notifications
  showNotification: (title: string, body: string) => {
    ipcRenderer.invoke('notification:show', title, body)
  }
})

// TypeScript type declarations for the exposed API
declare global {
  interface Window {
    electronAPI: {
      platform: NodeJS.Platform
      notes: {
        create: (note: unknown) => Promise<unknown>
        list: () => Promise<unknown[]>
        get: (id: string) => Promise<unknown>
        update: (id: string, data: unknown) => Promise<unknown>
        delete: (id: string) => Promise<void>
        search: (query: string) => Promise<unknown[]>
      }
      todos: {
        create: (todo: unknown) => Promise<unknown>
        list: (filter?: unknown) => Promise<unknown[]>
        get: (id: string) => Promise<unknown>
        update: (id: string, data: unknown) => Promise<unknown>
        delete: (id: string) => Promise<void>
      }
      focus: {
        start: (duration: number, todoId?: string) => Promise<unknown>
        pause: (id: string) => Promise<void>
        resume: (id: string) => Promise<void>
        complete: (id: string) => Promise<void>
        cancel: (id: string) => Promise<void>
        getStats: () => Promise<unknown>
      }
      links: {
        create: (link: unknown) => Promise<unknown>
        list: (sourceId: string, sourceType: string) => Promise<unknown[]>
        delete: (id: string) => Promise<void>
        getBacklinks: (targetId: string, targetType: string) => Promise<unknown[]>
      }
      onQuickCapture: (callback: () => void) => () => void
      showNotification: (title: string, body: string) => void
    }
  }
}
