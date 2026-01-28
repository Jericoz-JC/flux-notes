import {
  RiFileTextLine,
  RiCheckboxCircleLine,
  RiTimerLine,
  RiMindMap,
  RiSearchLine,
  RiAddLine,
  RiSettings4Line,
  RiHome5Line,
  RiSidebarFoldLine,
  RiKeyboardBoxLine
} from '@remixicon/react'
import { getModKey } from '@/lib/platform'
import type { NavItem } from './AppShell'

interface SidebarProps {
  activeNav: NavItem
  onNavChange: (nav: NavItem) => void
  onToggleCollapse: () => void
  onOpenCommandPalette: () => void
  onOpenSettings: () => void
}

export function Sidebar({ activeNav, onNavChange, onToggleCollapse, onOpenCommandPalette, onOpenSettings }: SidebarProps) {
  const mod = getModKey()

  return (
    <aside className="w-full h-full flex flex-col bg-[var(--bg-base)]">
      {/* Logo area */}
      <div className="h-12 flex items-center justify-between px-3 border-b border-[var(--border-subtle)] drag-region">
        <div className="flex items-center gap-2.5 no-drag">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--accent)] to-purple-500 flex items-center justify-center shadow-lg shadow-[var(--accent)]/20">
            <span className="text-white text-xs font-bold">F</span>
          </div>
          <span className="text-sm font-semibold text-[var(--text-primary)]">FLUX</span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="no-drag w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-all duration-150"
          title={`Toggle sidebar (${mod}+\\)`}
        >
          <RiSidebarFoldLine className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="p-3">
        <button
          onClick={onOpenCommandPalette}
          className="w-full h-9 flex items-center gap-2.5 px-3 text-sm text-[var(--text-tertiary)] bg-[var(--bg-surface)] rounded-lg border border-[var(--border-subtle)] hover:border-[var(--border-default)] hover:text-[var(--text-secondary)] transition-all duration-150"
        >
          <RiSearchLine className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1 text-left">Search</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-overlay)] text-[var(--text-tertiary)] font-mono">
            {mod}+K
          </kbd>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="px-3 pb-3">
        <button className="w-full h-9 flex items-center gap-2.5 px-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] rounded-lg transition-all duration-150 group">
          <RiAddLine className="w-4 h-4 flex-shrink-0 group-hover:text-[var(--accent)] transition-colors" />
          <span className="flex-1 text-left">New Note</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-tertiary)] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
            {mod}+N
          </kbd>
        </button>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-[var(--border-subtle)]" />

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <NavButton
          icon={<RiHome5Line className="w-4 h-4" />}
          label="Home"
          active={activeNav === 'home'}
          onClick={() => onNavChange('home')}
        />
        <NavButton
          icon={<RiFileTextLine className="w-4 h-4" />}
          label="Notes"
          active={activeNav === 'notes'}
          onClick={() => onNavChange('notes')}
          badge={12}
        />
        <NavButton
          icon={<RiCheckboxCircleLine className="w-4 h-4" />}
          label="Tasks"
          active={activeNav === 'tasks'}
          onClick={() => onNavChange('tasks')}
          badge={3}
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
      <div className="p-3 border-t border-[var(--border-subtle)] space-y-1">
        <button className="w-full h-9 flex items-center gap-2.5 px-3 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] rounded-lg transition-all duration-150">
          <RiKeyboardBoxLine className="w-4 h-4 flex-shrink-0" />
          <span>Shortcuts</span>
        </button>
        <button
          onClick={onOpenSettings}
          className="w-full h-9 flex items-center gap-2.5 px-3 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] rounded-lg transition-all duration-150"
        >
          <RiSettings4Line className="w-4 h-4 flex-shrink-0" />
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
  onClick,
  badge
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
  badge?: number
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative w-full h-9 flex items-center gap-2.5 px-3 text-sm rounded-lg
        transition-all duration-150 group
        ${active
          ? 'bg-[var(--accent-muted)] text-[var(--text-primary)]'
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
        }
      `}
    >
      {/* Active indicator */}
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[var(--accent)] rounded-r" />
      )}

      {/* Icon */}
      <span className={`flex-shrink-0 transition-colors duration-150 ${active ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]'}`}>
        {icon}
      </span>

      {/* Label */}
      <span className="flex-1 text-left truncate">{label}</span>

      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <span className={`
          flex-shrink-0 text-[10px] font-medium min-w-[18px] h-[18px] flex items-center justify-center rounded-full
          ${active
            ? 'bg-[var(--accent)] text-white'
            : 'bg-[var(--bg-surface)] text-[var(--text-tertiary)]'
          }
        `}>
          {badge}
        </span>
      )}
    </button>
  )
}
