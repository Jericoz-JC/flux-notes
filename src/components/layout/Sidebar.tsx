import {
  RiFileTextLine,
  RiCheckboxCircleLine,
  RiTimerLine,
  RiMindMap,
  RiSearchLine,
  RiAddLine,
  RiSettings4Line
} from '@remixicon/react'

type NavItem = 'notes' | 'tasks' | 'focus' | 'graph'

interface SidebarProps {
  activeNav: NavItem
  onNavChange: (nav: NavItem) => void
}

export function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  return (
    <aside className="w-60 h-full flex flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-base)]">
      {/* Logo area */}
      <div className="h-12 flex items-center px-4 drag-region">
        <div className="flex items-center gap-2 no-drag">
          <div className="w-6 h-6 rounded-md bg-[var(--accent)] flex items-center justify-center">
            <span className="text-white text-xs font-bold">F</span>
          </div>
          <span className="text-sm font-semibold">FLUX Notes</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 mb-2">
        <button className="w-full h-8 flex items-center gap-2 px-3 text-sm text-[var(--text-tertiary)] bg-[var(--bg-surface)] rounded-md border border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-colors">
          <RiSearchLine className="w-4 h-4" />
          <span>Search</span>
          <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-overlay)] text-[var(--text-tertiary)]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="px-3 mb-4">
        <button className="w-full h-8 flex items-center gap-2 px-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] rounded-md transition-colors">
          <RiAddLine className="w-4 h-4" />
          <span>New Note</span>
          <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-tertiary)]">
            ⌘N
          </kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        <NavButton
          icon={<RiFileTextLine className="w-4 h-4" />}
          label="Notes"
          active={activeNav === 'notes'}
          onClick={() => onNavChange('notes')}
        />
        <NavButton
          icon={<RiCheckboxCircleLine className="w-4 h-4" />}
          label="Tasks"
          active={activeNav === 'tasks'}
          onClick={() => onNavChange('tasks')}
        />
        <NavButton
          icon={<RiTimerLine className="w-4 h-4" />}
          label="Focus"
          active={activeNav === 'focus'}
          onClick={() => onNavChange('focus')}
        />
        <NavButton
          icon={<RiMindMap className="w-4 h-4" />}
          label="Graph"
          active={activeNav === 'graph'}
          onClick={() => onNavChange('graph')}
        />
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-3 border-t border-[var(--border-subtle)]">
        <button className="w-full h-8 flex items-center gap-2 px-3 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] rounded-md transition-colors">
          <RiSettings4Line className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  )
}

function NavButton({
  icon,
  label,
  active,
  onClick
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative w-full h-9 flex items-center gap-2 px-3 text-sm rounded-md transition-colors
        ${active
          ? 'bg-[var(--accent-muted)] text-[var(--text-primary)]'
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
        }
      `}
    >
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[var(--accent)] rounded-r" />
      )}
      {icon}
      <span>{label}</span>
    </button>
  )
}
