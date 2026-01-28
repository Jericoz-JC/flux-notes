import { useState, useCallback, useRef, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { TabBar, type Tab } from './TabBar'
import { CommandPalette } from '../ui/CommandPalette'
import { SettingsPanel } from '../ui/SettingsPanel'
import { DashboardView } from '../views/DashboardView'
import { NotesView } from '../views/NotesView'
import { TasksView } from '../views/TasksView'
import { FocusView } from '../views/FocusView'
import { GraphView } from '../views/GraphView'

export type NavItem = 'home' | 'notes' | 'tasks' | 'focus' | 'graph'

export function AppShell() {
  const [activeNav, setActiveNav] = useState<NavItem>('home')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(260)
  const [isResizing, setIsResizing] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'home', title: 'Home', type: 'home' }
  ])
  const [activeTabId, setActiveTabId] = useState('home')

  const sidebarRef = useRef<HTMLDivElement>(null)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
      // Cmd/Ctrl + \ to toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault()
        setSidebarCollapsed(prev => !prev)
      }
      // Cmd/Ctrl + N for new note
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        openNewTab('New Note', 'note')
      }
      // Escape to close command palette
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Sidebar resize handling
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = Math.max(200, Math.min(400, e.clientX))
      setSidebarWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  const handleNavChange = (nav: NavItem) => {
    setActiveNav(nav)
    // Also switch or create tab for that view
    const existingTab = tabs.find(t => t.type === nav)
    if (existingTab) {
      setActiveTabId(existingTab.id)
    } else {
      const newTab: Tab = {
        id: `${nav}-${Date.now()}`,
        title: nav.charAt(0).toUpperCase() + nav.slice(1),
        type: nav
      }
      setTabs(prev => [...prev, newTab])
      setActiveTabId(newTab.id)
    }
  }

  const openNewTab = (title: string, type: Tab['type'], noteId?: string) => {
    const newTab: Tab = {
      id: `${type}-${Date.now()}`,
      title,
      type,
      noteId
    }
    setTabs(prev => [...prev, newTab])
    setActiveTabId(newTab.id)
    if (type === 'note') setActiveNav('notes')
  }

  const closeTab = (tabId: string) => {
    const tabIndex = tabs.findIndex(t => t.id === tabId)
    const newTabs = tabs.filter(t => t.id !== tabId)

    if (newTabs.length === 0) {
      // Always keep at least one tab
      newTabs.push({ id: 'home', title: 'Home', type: 'home' })
    }

    setTabs(newTabs)

    if (activeTabId === tabId) {
      // Switch to adjacent tab
      const newIndex = Math.min(tabIndex, newTabs.length - 1)
      setActiveTabId(newTabs[newIndex].id)
    }
  }

  const activeTab = tabs.find(t => t.id === activeTabId)

  const renderContent = () => {
    if (!activeTab) return null

    switch (activeTab.type) {
      case 'home':
        return <DashboardView onOpenNote={(id, title) => openNewTab(title, 'note', id)} />
      case 'notes':
      case 'note':
        return <NotesView onOpenNote={(id, title) => openNewTab(title, 'note', id)} />
      case 'tasks':
        return <TasksView />
      case 'focus':
        return <FocusView />
      case 'graph':
        return <GraphView />
      default:
        return <DashboardView onOpenNote={(id, title) => openNewTab(title, 'note', id)} />
    }
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[var(--bg-base)]">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="relative h-full flex-shrink-0 transition-all duration-200 ease-out"
        style={{ width: sidebarCollapsed ? 0 : sidebarWidth }}
      >
        <div
          className="h-full overflow-hidden"
          style={{ width: sidebarWidth, opacity: sidebarCollapsed ? 0 : 1 }}
        >
          <Sidebar
            activeNav={activeNav}
            onNavChange={handleNavChange}
            onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </div>

        {/* Resize handle */}
        {!sidebarCollapsed && (
          <div
            onMouseDown={startResizing}
            className={`
              absolute top-0 right-0 w-1 h-full cursor-col-resize z-10
              hover:bg-[var(--accent)] transition-colors duration-150
              ${isResizing ? 'bg-[var(--accent)]' : 'bg-transparent'}
            `}
          />
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 h-full flex flex-col overflow-hidden bg-[var(--bg-elevated)]">
        {/* Tab Bar */}
        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onTabSelect={setActiveTabId}
          onTabClose={closeTab}
          onNewTab={() => openNewTab('New Note', 'note')}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </main>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={handleNavChange}
        onNewNote={() => openNewTab('New Note', 'note')}
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  )
}
