import { useState } from 'react'
import { RiFileTextLine, RiAddLine, RiMoreLine, RiSearchLine, RiSortDesc } from '@remixicon/react'

interface NotesViewProps {
  onOpenNote?: (id: string, title: string) => void
}

export function NotesView({ onOpenNote }: NotesViewProps) {
  const [activeNoteId, setActiveNoteId] = useState('1')
  const [searchQuery, setSearchQuery] = useState('')

  const notes = [
    { id: '1', title: 'Getting Started', preview: 'Welcome to FLUX Notes. This is your first note...', date: 'Today', tags: ['welcome'] },
    { id: '2', title: 'Project Ideas', preview: 'Some thoughts on upcoming projects and...', date: 'Yesterday', tags: ['ideas', 'work'] },
    { id: '3', title: 'Meeting Notes', preview: 'Discussed the roadmap for Q1 and the...', date: '2 days ago', tags: ['meetings'] },
    { id: '4', title: 'Research: AI Tools', preview: 'Exploring different AI-powered productivity...', date: '3 days ago', tags: ['research', 'ai'] },
    { id: '5', title: 'Weekly Review', preview: 'What went well this week: completed the...', date: '1 week ago', tags: ['review'] },
  ]

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.preview.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeNote = notes.find(n => n.id === activeNoteId)

  return (
    <div className="h-full flex">
      {/* Notes List */}
      <div className="w-64 lg:w-72 h-full border-r border-[var(--border-subtle)] flex flex-col bg-[var(--bg-base)] flex-shrink-0">
        {/* List Header */}
        <div className="h-12 flex items-center justify-between px-3 border-b border-[var(--border-subtle)]">
          <span className="text-sm font-medium text-[var(--text-primary)]">Notes</span>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-all duration-150">
              <RiSortDesc className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-tertiary)] hover:text-[var(--accent)] hover:bg-[var(--accent-muted)] transition-all duration-150">
              <RiAddLine className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-2 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[var(--bg-surface)] rounded-lg border border-transparent focus-within:border-[var(--accent)] transition-colors">
            <RiSearchLine className="w-3.5 h-3.5 text-[var(--text-tertiary)] flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter notes..."
              className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none min-w-0"
            />
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredNotes.map(note => (
            <NoteListItem
              key={note.id}
              title={note.title}
              preview={note.preview}
              date={note.date}
              tags={note.tags}
              active={note.id === activeNoteId}
              onClick={() => {
                setActiveNoteId(note.id)
                onOpenNote?.(note.id, note.title)
              }}
            />
          ))}
        </div>

        {/* List Footer */}
        <div className="px-3 py-2 border-t border-[var(--border-subtle)]">
          <span className="text-xs text-[var(--text-tertiary)]">{filteredNotes.length} notes</span>
        </div>
      </div>

      {/* Note Editor Area */}
      <div className="flex-1 flex flex-col bg-[var(--bg-elevated)] min-w-0">
        {activeNote ? (
          <>
            {/* Editor Header */}
            <div className="h-12 flex items-center justify-between px-4 lg:px-6 border-b border-[var(--border-subtle)] gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <input
                  type="text"
                  defaultValue={activeNote.title}
                  className="text-base lg:text-lg font-semibold bg-transparent border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] min-w-0 flex-1"
                  placeholder="Untitled"
                />
                <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                  {activeNote.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-tertiary)]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-[var(--text-tertiary)] hidden sm:block">Edited {activeNote.date}</span>
                <button className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-all duration-150">
                  <RiMoreLine className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              <div className="max-w-2xl mx-auto">
                <div className="space-y-4">
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {activeNote.preview}
                  </p>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Use <code className="text-[var(--accent)] bg-[var(--bg-surface)] px-1.5 py-0.5 rounded text-xs font-mono">[[wiki links]]</code> to connect your notes,
                    and <code className="text-[var(--accent)] bg-[var(--bg-surface)] px-1.5 py-0.5 rounded text-xs font-mono">#tags</code> to organize them.
                  </p>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Press <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-tertiary)] border border-[var(--border-subtle)] font-mono">Ctrl+K</kbd> to open the command palette and quickly navigate anywhere.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <RiFileTextLine className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
              <p className="text-[var(--text-secondary)]">Select a note to start editing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function NoteListItem({
  title,
  preview,
  date,
  tags,
  active = false,
  onClick
}: {
  title: string
  preview: string
  date: string
  tags: string[]
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative w-full text-left p-2.5 rounded-lg mb-0.5
        transition-all duration-150 group
        ${active
          ? 'bg-[var(--accent-muted)]'
          : 'hover:bg-[var(--bg-surface)]'
        }
      `}
    >
      {/* Active indicator */}
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-[var(--accent)] rounded-r" />
      )}

      {/* Title row */}
      <div className="flex items-center gap-2 mb-1">
        <RiFileTextLine className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]'} transition-colors`} />
        <span className={`text-sm font-medium truncate ${active ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'} transition-colors`}>
          {title}
        </span>
      </div>

      {/* Preview */}
      <p className="text-xs text-[var(--text-tertiary)] truncate ml-5.5 mb-1">
        {preview}
      </p>

      {/* Meta row */}
      <div className="flex items-center gap-1.5 ml-5.5">
        <span className="text-[10px] text-[var(--text-tertiary)]">{date}</span>
        {tags.slice(0, 2).map(tag => (
          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-tertiary)]">
            #{tag}
          </span>
        ))}
      </div>
    </button>
  )
}
