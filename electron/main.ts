import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, Notification } from 'electron'
import { join } from 'path'
import { initDatabase, closeDatabase } from './database'
import * as NotesRepo from './repositories/notes'
import * as TodosRepo from './repositories/todos'
import * as FocusRepo from './repositories/focus'
import * as LinksRepo from './repositories/links'

// Prevent garbage collection of window
let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false // Required for better-sqlite3
    },
    titleBarStyle: 'hiddenInset',
    show: false, // Don't show until ready
    backgroundColor: '#18181b' // Zinc-900 for instant paint
  })

  // Show when ready to prevent flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  // Load the app
  if (isDev) {
    // vite-plugin-electron sets VITE_DEV_SERVER_URL
    const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173'
    mainWindow.loadURL(devUrl)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createTray() {
  // Create a simple tray icon (you can replace with actual icon later)
  const icon = nativeImage.createEmpty()
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show FLUX Notes',
      click: () => mainWindow?.show()
    },
    { type: 'separator' },
    {
      label: 'Quick Capture',
      accelerator: 'CmdOrCtrl+Shift+N',
      click: () => {
        mainWindow?.webContents.send('quick-capture')
        mainWindow?.show()
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => app.quit()
    }
  ])

  tray.setToolTip('FLUX Notes')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    mainWindow?.show()
  })
}

// Register IPC handlers
function registerIpcHandlers() {
  // === Notes ===
  ipcMain.handle('db:notes:create', (_, input: NotesRepo.NoteInput) => {
    const note = NotesRepo.createNote(input)
    // Sync tags from content
    NotesRepo.syncNoteTags(note.id, note.body)
    return note
  })

  ipcMain.handle('db:notes:list', () => {
    return NotesRepo.listNotes()
  })

  ipcMain.handle('db:notes:get', (_, id: string) => {
    return NotesRepo.getNote(id)
  })

  ipcMain.handle('db:notes:update', (_, id: string, input: Partial<NotesRepo.NoteInput>) => {
    const note = NotesRepo.updateNote(id, input)
    if (note && input.body !== undefined) {
      // Sync tags when body changes
      NotesRepo.syncNoteTags(note.id, note.body)
      // Update links from wiki syntax
      LinksRepo.createLinksFromContent(note.id, note.body)
    }
    return note
  })

  ipcMain.handle('db:notes:delete', (_, id: string) => {
    // Delete associated links
    LinksRepo.deleteLinksForEntity('note', id)
    return NotesRepo.deleteNote(id)
  })

  ipcMain.handle('db:notes:search', (_, query: string) => {
    return NotesRepo.searchNotes(query)
  })

  ipcMain.handle('db:notes:tags', () => {
    return NotesRepo.getAllTags()
  })

  ipcMain.handle('db:notes:byTag', (_, tagName: string) => {
    return NotesRepo.getNotesByTag(tagName)
  })

  // === Todos ===
  ipcMain.handle('db:todos:create', (_, input: TodosRepo.TodoInput) => {
    return TodosRepo.createTodo(input)
  })

  ipcMain.handle('db:todos:list', (_, filter?: TodosRepo.TodoFilter) => {
    return TodosRepo.listTodos(filter)
  })

  ipcMain.handle('db:todos:get', (_, id: string) => {
    return TodosRepo.getTodo(id)
  })

  ipcMain.handle('db:todos:update', (_, id: string, input: Partial<TodosRepo.TodoInput>) => {
    return TodosRepo.updateTodo(id, input)
  })

  ipcMain.handle('db:todos:delete', (_, id: string) => {
    // Delete associated links
    LinksRepo.deleteLinksForEntity('todo', id)
    return TodosRepo.deleteTodo(id)
  })

  ipcMain.handle('db:todos:search', (_, query: string) => {
    return TodosRepo.searchTodos(query)
  })

  ipcMain.handle('db:todos:stats', () => {
    return TodosRepo.getTodoStats()
  })

  ipcMain.handle('db:todos:subtasks', (_, parentId: string) => {
    return TodosRepo.getSubtasks(parentId)
  })

  // === Focus Sessions ===
  ipcMain.handle('db:focus:start', (_, duration: number, todoId?: string) => {
    return FocusRepo.startSession(duration, todoId)
  })

  ipcMain.handle('db:focus:running', () => {
    return FocusRepo.getRunningSession()
  })

  ipcMain.handle('db:focus:update', (_, id: string, actualDuration: number) => {
    return FocusRepo.updateSessionDuration(id, actualDuration)
  })

  ipcMain.handle('db:focus:complete', (_, id: string) => {
    return FocusRepo.completeSession(id)
  })

  ipcMain.handle('db:focus:cancel', (_, id: string) => {
    return FocusRepo.cancelSession(id)
  })

  ipcMain.handle('db:focus:stats', () => {
    return FocusRepo.getStats()
  })

  ipcMain.handle('db:focus:list', (_, limit?: number) => {
    return FocusRepo.listSessions(limit)
  })

  ipcMain.handle('db:focus:forTodo', (_, todoId: string) => {
    return FocusRepo.getSessionsForTodo(todoId)
  })

  // === Links ===
  ipcMain.handle('db:links:create', (_, input: LinksRepo.LinkInput) => {
    return LinksRepo.createLink(input)
  })

  ipcMain.handle('db:links:list', (_, sourceType: LinksRepo.EntityType, sourceId: string) => {
    return LinksRepo.getLinksFrom(sourceType, sourceId)
  })

  ipcMain.handle('db:links:backlinks', (_, targetType: LinksRepo.EntityType, targetId: string) => {
    return LinksRepo.getBacklinks(targetType, targetId)
  })

  ipcMain.handle('db:links:all', (_, entityType: LinksRepo.EntityType, entityId: string) => {
    return LinksRepo.getAllLinks(entityType, entityId)
  })

  ipcMain.handle('db:links:delete', (_, id: string) => {
    return LinksRepo.deleteLink(id)
  })

  ipcMain.handle('db:links:graph', () => {
    return LinksRepo.getGraphData()
  })

  // === Notifications ===
  ipcMain.handle('notification:show', (_, title: string, body: string) => {
    if (Notification.isSupported()) {
      new Notification({ title, body }).show()
    }
  })
}

// Ensure single instance
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

app.whenReady().then(() => {
  // Initialize database
  initDatabase()

  // Register IPC handlers
  registerIpcHandlers()

  createWindow()
  createTray()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  // Close database connection
  closeDatabase()
})
