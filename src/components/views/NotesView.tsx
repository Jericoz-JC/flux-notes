import { RiFileTextLine, RiAddLine, RiMoreLine } from '@remixicon/react'

export function NotesView() {
  return (
    <div className="h-full flex">
      {/* Notes List */}
      <div className="w-72 h-full border-r border-[var(--border-subtle)] flex flex-col">
        <div className="h-12 flex items-center justify-between px-4 border-b border-[var(--border-subtle)]">
          <span className="text-sm font-medium text-[var(--text-primary)]">Notes</span>
          <button className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-colors">
            <RiAddLine className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-2">
          <NoteListItem
            title="Getting Started"
            preview="Welcome to FLUX Notes. This is your first note..."
            date="Today"
            active
          />
          <NoteListItem
            title="Project Ideas"
            preview="Some thoughts on upcoming projects and..."
            date="Yesterday"
          />
          <NoteListItem
            title="Meeting Notes"
            preview="Discussed the roadmap for Q1 and the..."
            date="2 days ago"
          />
        </div>
      </div>

      {/* Note Editor Area */}
      <div className="flex-1 flex flex-col">
        <div className="h-12 flex items-center justify-between px-6 border-b border-[var(--border-subtle)]">
          <input
            type="text"
            defaultValue="Getting Started"
            className="text-lg font-semibold bg-transparent border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
            placeholder="Untitled"
          />
          <button className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-colors">
            <RiMoreLine className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <div className="prose prose-invert prose-sm">
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Welcome to FLUX Notes. Start typing to capture your thoughts.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mt-4">
                Use <code className="text-[var(--accent)] bg-[var(--bg-surface)] px-1.5 py-0.5 rounded text-xs">[[wiki links]]</code> to connect your notes,
                and <code className="text-[var(--accent)] bg-[var(--bg-surface)] px-1.5 py-0.5 rounded text-xs">#tags</code> to organize them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NoteListItem({
  title,
  preview,
  date,
  active = false
}: {
  title: string
  preview: string
  date: string
  active?: boolean
}) {
  return (
    <button
      className={`
        relative w-full text-left p-3 rounded-md mb-1 transition-colors
        ${active
          ? 'bg-[var(--accent-muted)]'
          : 'hover:bg-[var(--bg-surface)]'
        }
      `}
    >
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-[var(--accent)] rounded-r" />
      )}
      <div className="flex items-center gap-2 mb-1">
        <RiFileTextLine className={`w-3.5 h-3.5 ${active ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'}`} />
        <span className={`text-sm font-medium truncate ${active ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
          {title}
        </span>
      </div>
      <p className="text-xs text-[var(--text-tertiary)] truncate pl-5.5">
        {preview}
      </p>
      <span className="text-[10px] text-[var(--text-tertiary)] pl-5.5 mt-1 block">
        {date}
      </span>
    </button>
  )
}
