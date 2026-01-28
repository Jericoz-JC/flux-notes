import {
  RiFileTextLine,
  RiAddLine,
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiTimerLine,
  RiFireLine,
  RiCalendarLine,
  RiSunLine,
  RiMoonLine,
  RiCloudyLine
} from '@remixicon/react'
import { getModKey } from '@/lib/platform'

interface DashboardViewProps {
  onOpenNote: (id: string, title: string) => void
}

export function DashboardView({ onOpenNote }: DashboardViewProps) {
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening'
  const GreetingIcon = currentHour < 6 || currentHour >= 20 ? RiMoonLine : currentHour < 12 ? RiSunLine : RiCloudyLine
  const mod = getModKey()

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        {/* Greeting */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <GreetingIcon className="w-5 h-5 text-[var(--warning)]" />
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">{greeting}</h1>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <QuickAction
            icon={<RiAddLine className="w-5 h-5" />}
            label="New Note"
            shortcut={`${mod}+N`}
            color="blue"
            onClick={() => onOpenNote('new', 'New Note')}
          />
          <QuickAction
            icon={<RiCheckboxCircleLine className="w-5 h-5" />}
            label="New Task"
            shortcut={`${mod}+Shift+T`}
            color="green"
            onClick={() => {}}
          />
          <QuickAction
            icon={<RiTimerLine className="w-5 h-5" />}
            label="Start Focus"
            shortcut={`${mod}+Shift+F`}
            color="orange"
            onClick={() => {}}
          />
          <QuickAction
            icon={<RiCalendarLine className="w-5 h-5" />}
            label="Daily Note"
            color="purple"
            onClick={() => {}}
          />
        </div>

        {/* Main Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Notes */}
          <Widget title="Recent Notes" icon={<RiFileTextLine className="w-4 h-4" />} action="View all">
            <div className="space-y-0.5">
              <NoteItem
                title="Getting Started"
                preview="Welcome to FLUX Notes..."
                time="2 min ago"
                onClick={() => onOpenNote('1', 'Getting Started')}
              />
              <NoteItem
                title="Project Ideas"
                preview="Some thoughts on upcoming..."
                time="1 hour ago"
                onClick={() => onOpenNote('2', 'Project Ideas')}
              />
              <NoteItem
                title="Meeting Notes"
                preview="Discussed the roadmap..."
                time="Yesterday"
                onClick={() => onOpenNote('3', 'Meeting Notes')}
              />
            </div>
          </Widget>

          {/* Today's Tasks */}
          <Widget title="Today's Tasks" icon={<RiCheckboxCircleLine className="w-4 h-4" />} action="View all">
            <div className="space-y-0.5">
              <TaskItem title="Review project requirements" priority="high" />
              <TaskItem title="Set up development environment" priority="medium" completed />
              <TaskItem title="Create initial database schema" priority="medium" />
            </div>
            <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-tertiary)]">1 of 3 completed</span>
                <div className="w-20 h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-[var(--success)] rounded-full transition-all duration-500" />
                </div>
              </div>
            </div>
          </Widget>

          {/* Focus Stats */}
          <Widget title="Focus" icon={<RiTimerLine className="w-4 h-4" />}>
            <div className="flex items-center gap-4">
              {/* Timer preview */}
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="var(--bg-surface)" strokeWidth="4" />
                  <circle
                    cx="40" cy="40" r="36"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 36}
                    strokeDashoffset={2 * Math.PI * 36 * 0.75}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-base font-medium text-[var(--text-primary)]">25:00</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <RiFireLine className="w-4 h-4 text-[var(--warning)] flex-shrink-0" />
                  <span className="text-sm font-medium text-[var(--text-primary)]">3 day streak</span>
                </div>
                <div className="space-y-1.5">
                  <StatRow label="Today" value="1h 25m" />
                  <StatRow label="This week" value="8h 45m" />
                </div>
              </div>
            </div>
          </Widget>

          {/* Activity / Graph Preview */}
          <Widget title="Connections" icon={<RiArrowRightLine className="w-4 h-4" />}>
            <div className="h-28 flex items-center justify-center bg-[var(--bg-surface)] rounded-lg border border-[var(--border-subtle)]">
              {/* Mini graph visualization */}
              <svg className="w-full h-full p-3" viewBox="0 0 200 100">
                <line x1="100" y1="50" x2="40" y2="30" stroke="var(--border-default)" strokeWidth="1" />
                <line x1="100" y1="50" x2="160" y2="30" stroke="var(--border-default)" strokeWidth="1" />
                <line x1="100" y1="50" x2="60" y2="75" stroke="var(--border-default)" strokeWidth="1" />
                <line x1="100" y1="50" x2="140" y2="80" stroke="var(--border-default)" strokeWidth="1" />

                <circle cx="100" cy="50" r="8" fill="var(--accent)" />
                <circle cx="40" cy="30" r="5" fill="var(--bg-overlay)" stroke="var(--border-default)" />
                <circle cx="160" cy="30" r="5" fill="var(--bg-overlay)" stroke="var(--border-default)" />
                <circle cx="60" cy="75" r="5" fill="var(--bg-overlay)" stroke="var(--border-default)" />
                <circle cx="140" cy="80" r="5" fill="var(--bg-overlay)" stroke="var(--border-default)" />
              </svg>
            </div>
            <div className="mt-2 text-xs text-[var(--text-tertiary)]">
              6 notes · 5 connections
            </div>
          </Widget>
        </div>
      </div>
    </div>
  )
}

function QuickAction({
  icon,
  label,
  shortcut,
  color,
  onClick
}: {
  icon: React.ReactNode
  label: string
  shortcut?: string
  color: 'blue' | 'green' | 'orange' | 'purple'
  onClick: () => void
}) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20',
    orange: 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border-orange-500/20',
    purple: 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/20',
  }

  return (
    <button
      onClick={onClick}
      className={`
        group flex flex-col items-center justify-center gap-2 p-4 rounded-xl
        border transition-all duration-200 active:scale-[0.98]
        ${colorClasses[color]}
      `}
    >
      <div className="transition-transform duration-200 group-hover:scale-110">
        {icon}
      </div>
      <span className="text-xs font-medium text-[var(--text-primary)]">{label}</span>
      {shortcut && (
        <kbd className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-tertiary)] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
          {shortcut}
        </kbd>
      )}
    </button>
  )
}

function Widget({
  title,
  icon,
  action,
  children
}: {
  title: string
  icon: React.ReactNode
  action?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl p-4 hover:border-[var(--border-default)] transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[var(--text-tertiary)]">{icon}</span>
          <h3 className="text-sm font-medium text-[var(--text-primary)]">{title}</h3>
        </div>
        {action && (
          <button className="text-xs text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors">
            {action}
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

function NoteItem({
  title,
  preview,
  time,
  onClick
}: {
  title: string
  preview: string
  time: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 p-2.5 rounded-lg text-left hover:bg-[var(--bg-surface)] transition-all duration-150 group"
    >
      <RiFileTextLine className="w-4 h-4 text-[var(--text-tertiary)] mt-0.5 flex-shrink-0 group-hover:text-[var(--accent)] transition-colors" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="text-sm font-medium text-[var(--text-primary)] truncate">{title}</span>
          <span className="text-[10px] text-[var(--text-tertiary)] flex-shrink-0">{time}</span>
        </div>
        <p className="text-xs text-[var(--text-tertiary)] truncate">{preview}</p>
      </div>
    </button>
  )
}

function TaskItem({
  title,
  priority,
  completed = false
}: {
  title: string
  priority: 'low' | 'medium' | 'high'
  completed?: boolean
}) {
  const priorityColors = {
    low: 'bg-[var(--text-tertiary)]',
    medium: 'bg-[var(--warning)]',
    high: 'bg-[var(--error)]'
  }

  return (
    <div className={`flex items-center gap-3 p-2.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors ${completed ? 'opacity-50' : ''}`}>
      <button className="flex-shrink-0 text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors">
        <RiCheckboxCircleLine className={`w-4 h-4 ${completed ? 'text-[var(--success)]' : ''}`} />
      </button>
      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${priorityColors[priority]}`} />
      <span className={`flex-1 text-sm truncate ${completed ? 'line-through text-[var(--text-tertiary)]' : 'text-[var(--text-primary)]'}`}>
        {title}
      </span>
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-[var(--text-tertiary)]">{label}</span>
      <span className="text-[var(--text-secondary)] font-medium">{value}</span>
    </div>
  )
}
