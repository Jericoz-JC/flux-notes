import { RiAddLine, RiCheckboxCircleLine, RiCheckboxBlankCircleLine, RiTimeLine } from '@remixicon/react'

export function TasksView() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-[var(--text-primary)]">Tasks</span>
          <div className="flex items-center gap-1">
            <FilterButton label="All" active />
            <FilterButton label="Today" />
            <FilterButton label="Upcoming" />
          </div>
        </div>
        <button className="h-7 px-2.5 flex items-center gap-1.5 rounded-md text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors">
          <RiAddLine className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-1">
          <TaskItem
            title="Review project requirements"
            priority="high"
            dueDate="Today"
          />
          <TaskItem
            title="Set up development environment"
            priority="medium"
            completed
          />
          <TaskItem
            title="Create initial database schema"
            priority="medium"
            dueDate="Tomorrow"
          />
          <TaskItem
            title="Design component library"
            priority="low"
            dueDate="This week"
          />
          <TaskItem
            title="Write documentation"
            priority="low"
          />
        </div>
      </div>
    </div>
  )
}

function FilterButton({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      className={`
        h-6 px-2 text-xs rounded-md transition-colors
        ${active
          ? 'bg-[var(--bg-surface)] text-[var(--text-primary)]'
          : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
        }
      `}
    >
      {label}
    </button>
  )
}

function TaskItem({
  title,
  priority = 'medium',
  dueDate,
  completed = false
}: {
  title: string
  priority?: 'low' | 'medium' | 'high'
  dueDate?: string
  completed?: boolean
}) {
  const priorityColors = {
    low: 'bg-[var(--text-tertiary)]',
    medium: 'bg-[var(--warning)]',
    high: 'bg-[var(--error)]'
  }

  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-md transition-colors
        hover:bg-[var(--bg-surface)]
        ${completed ? 'opacity-50' : ''}
      `}
    >
      <button className="text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors">
        {completed
          ? <RiCheckboxCircleLine className="w-5 h-5 text-[var(--success)]" />
          : <RiCheckboxBlankCircleLine className="w-5 h-5" />
        }
      </button>

      <div className={`w-1.5 h-1.5 rounded-full ${priorityColors[priority]}`} />

      <span className={`flex-1 text-sm ${completed ? 'line-through text-[var(--text-tertiary)]' : 'text-[var(--text-primary)]'}`}>
        {title}
      </span>

      {dueDate && (
        <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
          <RiTimeLine className="w-3.5 h-3.5" />
          <span>{dueDate}</span>
        </div>
      )}
    </div>
  )
}
