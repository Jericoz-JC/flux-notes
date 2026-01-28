import { RiAddLine, RiCloseLine, RiMenuLine, RiHome5Line, RiFileTextLine, RiCheckboxCircleLine, RiTimerLine, RiMindMap } from '@remixicon/react'

export interface Tab {
  id: string
  title: string
  type: 'home' | 'notes' | 'note' | 'tasks' | 'focus' | 'graph'
  noteId?: string
  isDirty?: boolean
}

interface TabBarProps {
  tabs: Tab[]
  activeTabId: string
  onTabSelect: (tabId: string) => void
  onTabClose: (tabId: string) => void
  onNewTab: () => void
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

const tabIcons: Record<Tab['type'], React.ReactNode> = {
  home: <RiHome5Line className="w-3.5 h-3.5" />,
  notes: <RiFileTextLine className="w-3.5 h-3.5" />,
  note: <RiFileTextLine className="w-3.5 h-3.5" />,
  tasks: <RiCheckboxCircleLine className="w-3.5 h-3.5" />,
  focus: <RiTimerLine className="w-3.5 h-3.5" />,
  graph: <RiMindMap className="w-3.5 h-3.5" />
}

export function TabBar({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onNewTab,
  sidebarCollapsed,
  onToggleSidebar
}: TabBarProps) {
  return (
    <div className="h-10 flex items-center bg-[var(--bg-base)] border-b border-[var(--border-subtle)]">
      {/* Sidebar toggle (when collapsed) */}
      {sidebarCollapsed && (
        <button
          onClick={onToggleSidebar}
          className="h-10 w-10 flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-colors flex-shrink-0"
        >
          <RiMenuLine className="w-4 h-4" />
        </button>
      )}

      {/* Tabs */}
      <div className="flex-1 flex items-center h-full overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onSelect={() => onTabSelect(tab.id)}
            onClose={() => onTabClose(tab.id)}
            canClose={tabs.length > 1}
          />
        ))}

        {/* New tab button */}
        <button
          onClick={onNewTab}
          className="h-8 w-8 flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] rounded-md mx-1 transition-all duration-150 active:scale-95 flex-shrink-0"
        >
          <RiAddLine className="w-4 h-4" />
        </button>
      </div>

      {/* Window controls spacer (for dragging) */}
      <div className="w-4 h-full drag-region flex-shrink-0" />
    </div>
  )
}

function TabItem({
  tab,
  isActive,
  onSelect,
  onClose,
  canClose
}: {
  tab: Tab
  isActive: boolean
  onSelect: () => void
  onClose: () => void
  canClose: boolean
}) {
  return (
    <div
      onClick={onSelect}
      className={`
        group relative h-full flex items-center gap-2 px-3 cursor-pointer
        border-r border-[var(--border-subtle)] min-w-0
        transition-all duration-150
        ${isActive
          ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]'
          : 'bg-[var(--bg-base)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
        }
      `}
      style={{ minWidth: 100, maxWidth: 180 }}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
      )}

      {/* Icon */}
      <span className={`flex-shrink-0 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]'}`}>
        {tabIcons[tab.type]}
      </span>

      {/* Title */}
      <span className="flex-1 text-xs font-medium truncate min-w-0">
        {tab.title}
      </span>

      {/* Dirty indicator */}
      {tab.isDirty && (
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
      )}

      {/* Close button */}
      {canClose && (
        <button
          onClick={e => {
            e.stopPropagation()
            onClose()
          }}
          className={`
            w-5 h-5 flex items-center justify-center rounded flex-shrink-0
            opacity-0 group-hover:opacity-100
            text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)]
            transition-all duration-150 active:scale-90
          `}
        >
          <RiCloseLine className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
