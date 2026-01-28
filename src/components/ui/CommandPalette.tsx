import { useState, useEffect, useRef } from 'react'
import {
  RiSearchLine,
  RiHome5Line,
  RiFileTextLine,
  RiCheckboxCircleLine,
  RiTimerLine,
  RiMindMap,
  RiAddLine,
  RiSettings4Line,
  RiMoonLine,
  RiSunLine,
  RiKeyboardBoxLine
} from '@remixicon/react'
import { getModKey } from '@/lib/platform'
import type { NavItem } from '../layout/AppShell'

interface Command {
  id: string
  title: string
  subtitle?: string
  icon: React.ReactNode
  action: () => void
  shortcut?: string
  category: 'navigation' | 'actions' | 'settings'
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (nav: NavItem) => void
  onNewNote: () => void
}

export function CommandPalette({ isOpen, onClose, onNavigate, onNewNote }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const mod = getModKey()

  const commands: Command[] = [
    // Navigation
    { id: 'home', title: 'Go to Home', icon: <RiHome5Line className="w-4 h-4" />, action: () => { onNavigate('home'); onClose() }, shortcut: `${mod}+1`, category: 'navigation' },
    { id: 'notes', title: 'Go to Notes', icon: <RiFileTextLine className="w-4 h-4" />, action: () => { onNavigate('notes'); onClose() }, shortcut: `${mod}+2`, category: 'navigation' },
    { id: 'tasks', title: 'Go to Tasks', icon: <RiCheckboxCircleLine className="w-4 h-4" />, action: () => { onNavigate('tasks'); onClose() }, shortcut: `${mod}+3`, category: 'navigation' },
    { id: 'focus', title: 'Go to Focus', icon: <RiTimerLine className="w-4 h-4" />, action: () => { onNavigate('focus'); onClose() }, shortcut: `${mod}+4`, category: 'navigation' },
    { id: 'graph', title: 'Go to Graph', icon: <RiMindMap className="w-4 h-4" />, action: () => { onNavigate('graph'); onClose() }, shortcut: `${mod}+5`, category: 'navigation' },
    // Actions
    { id: 'new-note', title: 'New Note', subtitle: 'Create a new note', icon: <RiAddLine className="w-4 h-4" />, action: () => { onNewNote(); onClose() }, shortcut: `${mod}+N`, category: 'actions' },
    { id: 'new-task', title: 'New Task', subtitle: 'Create a new task', icon: <RiAddLine className="w-4 h-4" />, action: () => { onClose() }, shortcut: `${mod}+Shift+T`, category: 'actions' },
    { id: 'start-focus', title: 'Start Focus Session', subtitle: '25 minute pomodoro', icon: <RiTimerLine className="w-4 h-4" />, action: () => { onNavigate('focus'); onClose() }, category: 'actions' },
    // Settings
    { id: 'settings', title: 'Settings', subtitle: 'App preferences', icon: <RiSettings4Line className="w-4 h-4" />, action: () => onClose(), category: 'settings' },
    { id: 'theme-dark', title: 'Dark Mode', subtitle: 'Switch to dark theme', icon: <RiMoonLine className="w-4 h-4" />, action: () => onClose(), category: 'settings' },
    { id: 'theme-light', title: 'Light Mode', subtitle: 'Switch to light theme', icon: <RiSunLine className="w-4 h-4" />, action: () => onClose(), category: 'settings' },
    { id: 'shortcuts', title: 'Keyboard Shortcuts', subtitle: 'View all shortcuts', icon: <RiKeyboardBoxLine className="w-4 h-4" />, action: () => onClose(), category: 'settings' },
  ]

  const filteredCommands = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.subtitle?.toLowerCase().includes(query.toLowerCase())
  )

  // Group by category
  const groupedCommands = {
    navigation: filteredCommands.filter(c => c.category === 'navigation'),
    actions: filteredCommands.filter(c => c.category === 'actions'),
    settings: filteredCommands.filter(c => c.category === 'settings'),
  }

  const flatFiltered = [...groupedCommands.navigation, ...groupedCommands.actions, ...groupedCommands.settings]

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(i => Math.min(i + 1, flatFiltered.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(i => Math.max(i - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          flatFiltered[selectedIndex]?.action()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, flatFiltered, selectedIndex])

  // Scroll selected into view
  useEffect(() => {
    const selectedEl = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`)
    selectedEl?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Palette */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50 animate-slide-up px-4">
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 h-12 border-b border-[var(--border-subtle)]">
            <RiSearchLine className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setSelectedIndex(0) }}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none text-sm min-w-0"
            />
            <kbd className="flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-tertiary)] border border-[var(--border-subtle)] font-mono">
              Esc
            </kbd>
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-[320px] overflow-y-auto py-2">
            {flatFiltered.length === 0 ? (
              <div className="px-4 py-8 text-center text-[var(--text-tertiary)] text-sm">
                No commands found
              </div>
            ) : (
              <>
                {groupedCommands.navigation.length > 0 && (
                  <CommandGroup title="Navigation" commands={groupedCommands.navigation} selectedIndex={selectedIndex} startIndex={0} />
                )}
                {groupedCommands.actions.length > 0 && (
                  <CommandGroup title="Actions" commands={groupedCommands.actions} selectedIndex={selectedIndex} startIndex={groupedCommands.navigation.length} />
                )}
                {groupedCommands.settings.length > 0 && (
                  <CommandGroup title="Settings" commands={groupedCommands.settings} selectedIndex={selectedIndex} startIndex={groupedCommands.navigation.length + groupedCommands.actions.length} />
                )}
              </>
            )}
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2 border-t border-[var(--border-subtle)] flex items-center gap-4 text-[10px] text-[var(--text-tertiary)]">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono">↑</kbd>
              <kbd className="px-1 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono">↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono">Enter</kbd>
              <span>Select</span>
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

function CommandGroup({
  title,
  commands,
  selectedIndex,
  startIndex
}: {
  title: string
  commands: Command[]
  selectedIndex: number
  startIndex: number
}) {
  return (
    <div className="mb-1">
      <div className="px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
        {title}
      </div>
      {commands.map((cmd, i) => {
        const globalIndex = startIndex + i
        const isSelected = globalIndex === selectedIndex

        return (
          <button
            key={cmd.id}
            data-index={globalIndex}
            onClick={cmd.action}
            className={`
              w-full flex items-center gap-3 px-4 py-2.5 text-left
              transition-colors duration-75
              ${isSelected
                ? 'bg-[var(--accent-muted)] text-[var(--text-primary)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
              }
            `}
          >
            <span className={`flex-shrink-0 ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'}`}>
              {cmd.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{cmd.title}</div>
              {cmd.subtitle && (
                <div className="text-xs text-[var(--text-tertiary)] truncate">{cmd.subtitle}</div>
              )}
            </div>
            {cmd.shortcut && (
              <kbd className="flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-tertiary)] border border-[var(--border-subtle)] font-mono">
                {cmd.shortcut}
              </kbd>
            )}
          </button>
        )
      })}
    </div>
  )
}
