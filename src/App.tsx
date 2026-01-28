function App() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">FLUX Notes</h1>
        <p className="text-zinc-400 mb-8">Local-first productivity for flow state</p>
        <div className="flex gap-4 justify-center">
          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
            <h2 className="text-xl font-semibold mb-2">Notes</h2>
            <p className="text-zinc-400 text-sm">Connected thinking</p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
            <h2 className="text-xl font-semibold mb-2">Todos</h2>
            <p className="text-zinc-400 text-sm">Task management</p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
            <h2 className="text-xl font-semibold mb-2">Focus</h2>
            <p className="text-zinc-400 text-sm">Timer & stats</p>
          </div>
        </div>
        <p className="text-zinc-500 mt-8 text-sm">
          Platform: {window.electronAPI?.platform ?? 'web'}
        </p>
      </div>
    </div>
  )
}

export default App
