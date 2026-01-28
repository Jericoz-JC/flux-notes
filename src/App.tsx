import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  RiFileTextLine,
  RiCheckboxCircleLine,
  RiTimerLine,
  RiMindMap,
  RiSearchLine,
  RiKeyboardBoxLine,
  RiShieldCheckLine,
  RiSpeedLine,
  RiAddLine,
  RiArrowRightLine,
  RiGithubFill
} from '@remixicon/react'

function App() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 overflow-x-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-zinc-800/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-zinc-700/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-950/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-200 to-zinc-400 flex items-center justify-center">
              <span className="text-zinc-900 font-bold text-sm">F</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">FLUX Notes</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-zinc-800 text-zinc-400 border-zinc-700">
              v0.1.0
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100">
              <RiGithubFill className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100">
              <RiKeyboardBoxLine className="size-4" />
              <span className="ml-1.5 text-xs">⌘K</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div
          className={`transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="flex items-center gap-2 mb-6">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
              Local-first
            </Badge>
            <Badge variant="outline" className="border-zinc-700 text-zinc-400">
              Privacy-respecting
            </Badge>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
            Your thoughts,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-400">
              beautifully connected.
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
            A distraction-free productivity app that combines connected notes,
            intelligent task management, and focus tools — all running locally on your device.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-medium">
              <RiAddLine className="size-4" />
              New Note
            </Button>
            <Button size="lg" variant="outline" className="border-zinc-700 hover:bg-zinc-800/50">
              Quick Capture
              <kbd className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
                ⌘⇧N
              </kbd>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-700 delay-200 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <FeatureCard
            icon={<RiFileTextLine className="size-5" />}
            title="Connected Notes"
            description="Rich markdown editing with bidirectional links. Your ideas naturally connect through [[wiki-style]] syntax."
            gradient="from-blue-500/10 to-transparent"
          />
          <FeatureCard
            icon={<RiCheckboxCircleLine className="size-5" />}
            title="Smart Tasks"
            description="Tasks linked to notes give context. Kanban boards, priorities, and due dates keep you organized."
            gradient="from-emerald-500/10 to-transparent"
          />
          <FeatureCard
            icon={<RiTimerLine className="size-5" />}
            title="Focus Timer"
            description="Built-in Pomodoro timer with session tracking. See your focus streaks and daily statistics."
            gradient="from-amber-500/10 to-transparent"
          />
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto bg-zinc-800/50" />

      {/* Tabs Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div
          className={`transition-all duration-700 delay-300 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <h2 className="text-3xl font-bold tracking-tight mb-2">Everything you need</h2>
          <p className="text-zinc-400 mb-8">No plugins. No configuration. Just flow.</p>

          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="bg-zinc-900 border border-zinc-800 p-1">
              <TabsTrigger value="notes" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
                Notes
              </TabsTrigger>
              <TabsTrigger value="tasks" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
                Tasks
              </TabsTrigger>
              <TabsTrigger value="graph" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
                Graph
              </TabsTrigger>
              <TabsTrigger value="focus" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
                Focus
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="mt-6">
              <PreviewCard
                title="Write without friction"
                features={[
                  'Rich markdown with live preview',
                  'Auto-extracted #tags and @mentions',
                  'Wiki-style [[links]] create connections',
                  'Full-text search across all notes'
                ]}
              />
            </TabsContent>

            <TabsContent value="tasks" className="mt-6">
              <PreviewCard
                title="Tasks with context"
                features={[
                  'Link tasks to related notes',
                  'Kanban board & list views',
                  'Priority levels and due dates',
                  'Today / Upcoming / Someday filters'
                ]}
              />
            </TabsContent>

            <TabsContent value="graph" className="mt-6">
              <PreviewCard
                title="See your thinking"
                features={[
                  'Interactive knowledge graph',
                  'Discover hidden connections',
                  'Local & global graph views',
                  'Backlinks panel for each note'
                ]}
              />
            </TabsContent>

            <TabsContent value="focus" className="mt-6">
              <PreviewCard
                title="Deep work made easy"
                features={[
                  'Pomodoro timer presets (25/5/45/60 min)',
                  'Desktop notifications when complete',
                  'Session history & statistics',
                  'Daily and weekly focus streaks'
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Principles */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <div
          className={`transition-all duration-700 delay-400 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <h2 className="text-3xl font-bold tracking-tight mb-2">Built different</h2>
          <p className="text-zinc-400 mb-8">Opinionated choices for focused work.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <PrincipleCard
              icon={<RiShieldCheckLine className="size-5" />}
              title="Local-first"
              description="All data stays on your device. No account required."
            />
            <PrincipleCard
              icon={<RiSpeedLine className="size-5" />}
              title="Instant"
              description="<500ms startup. No loading spinners for local ops."
            />
            <PrincipleCard
              icon={<RiKeyboardBoxLine className="size-5" />}
              title="Keyboard-first"
              description="Everything accessible via shortcuts. Cmd+K for anything."
            />
            <PrincipleCard
              icon={<RiMindMap className="size-5" />}
              title="Connected"
              description="Notes and tasks aren't silos. Everything links."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/50 bg-zinc-950/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-zinc-300 to-zinc-500 flex items-center justify-center">
                <span className="text-zinc-900 font-bold text-[10px]">F</span>
              </div>
              <span>FLUX Notes — Flow state first.</span>
            </div>
            <div className="flex items-center gap-4 text-zinc-500 text-sm">
              <span>Platform: {window.electronAPI?.platform ?? 'web'}</span>
              <Separator orientation="vertical" className="h-4 bg-zinc-800" />
              <span>SQLite + React + Electron</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
  gradient
}: {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
}) {
  return (
    <Card className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors group overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
      <CardHeader className="relative">
        <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 mb-2 group-hover:border-zinc-600 transition-colors">
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-zinc-400">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}

// Preview Card Component
function PreviewCard({
  title,
  features
}: {
  title: string
  features: string[]
}) {
  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">{title}</h3>
            <ul className="space-y-3">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-300">
                  <RiArrowRightLine className="size-4 text-zinc-500 mt-1 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-zinc-950 rounded-lg border border-zinc-800 h-48 flex items-center justify-center">
            <div className="text-center text-zinc-600">
              <RiSearchLine className="size-8 mx-auto mb-2" />
              <span className="text-sm">Preview coming soon</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Principle Card Component
function PrincipleCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
      <div className="text-zinc-400 mb-3">{icon}</div>
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-zinc-500">{description}</p>
    </div>
  )
}

export default App
