import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { NotesView, TasksView, FocusView, GraphView } from '@/components/views'

type NavItem = 'notes' | 'tasks' | 'focus' | 'graph'

function App() {
  const [activeNav, setActiveNav] = useState<NavItem>('notes')

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[var(--bg-base)]">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <main className="flex-1 h-full overflow-hidden bg-[var(--bg-elevated)]">
        {activeNav === 'notes' && <NotesView />}
        {activeNav === 'tasks' && <TasksView />}
        {activeNav === 'focus' && <FocusView />}
        {activeNav === 'graph' && <GraphView />}
      </main>
    </div>
  )
}

export default App
