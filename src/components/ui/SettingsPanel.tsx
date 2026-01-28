import { useState, useEffect } from 'react'
import { RiCloseLine, RiMoonLine, RiSunLine, RiComputerLine, RiCheckLine } from '@remixicon/react'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

type Theme = 'dark' | 'light' | 'system'
type AccentColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink'

const accentColors: { name: AccentColor; value: string; label: string }[] = [
  { name: 'blue', value: 'oklch(0.65 0.14 250)', label: 'Blue' },
  { name: 'purple', value: 'oklch(0.60 0.18 290)', label: 'Purple' },
  { name: 'green', value: 'oklch(0.65 0.15 145)', label: 'Green' },
  { name: 'orange', value: 'oklch(0.70 0.15 50)', label: 'Orange' },
  { name: 'pink', value: 'oklch(0.65 0.18 350)', label: 'Pink' },
]

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [accent, setAccent] = useState<AccentColor>('blue')

  useEffect(() => {
    // Apply theme
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light')
    } else {
      root.classList.remove('light')
    }
  }, [theme])

  useEffect(() => {
    // Apply accent color
    const root = document.documentElement
    const accentObj = accentColors.find(a => a.name === accent)
    if (accentObj) {
      root.style.setProperty('--accent', accentObj.value)
      root.style.setProperty('--accent-hover', accentObj.value.replace('0.65', '0.70').replace('0.60', '0.65'))
      root.style.setProperty('--accent-muted', `${accentObj.value.split(')')[0]} / 0.12)`)
    }
  }, [accent])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-80 bg-[var(--bg-elevated)] border-l border-[var(--border-subtle)] z-50 animate-slide-in-right shadow-2xl">
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-[var(--border-subtle)]">
          <span className="text-sm font-medium text-[var(--text-primary)]">Settings</span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-all duration-150"
          >
            <RiCloseLine className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Appearance Section */}
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
              Appearance
            </h3>

            {/* Theme */}
            <div className="mb-4">
              <label className="text-sm text-[var(--text-secondary)] mb-2 block">Theme</label>
              <div className="grid grid-cols-3 gap-2">
                <ThemeButton
                  icon={<RiMoonLine className="w-4 h-4" />}
                  label="Dark"
                  active={theme === 'dark'}
                  onClick={() => setTheme('dark')}
                />
                <ThemeButton
                  icon={<RiSunLine className="w-4 h-4" />}
                  label="Light"
                  active={theme === 'light'}
                  onClick={() => setTheme('light')}
                />
                <ThemeButton
                  icon={<RiComputerLine className="w-4 h-4" />}
                  label="System"
                  active={theme === 'system'}
                  onClick={() => setTheme('system')}
                />
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label className="text-sm text-[var(--text-secondary)] mb-2 block">Accent Color</label>
              <div className="flex gap-2">
                {accentColors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setAccent(color.name)}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      transition-all duration-150
                      ${accent === color.name ? 'ring-2 ring-offset-2 ring-offset-[var(--bg-elevated)]' : ''}
                    `}
                    style={{
                      background: color.value,
                      // @ts-expect-error CSS custom property
                      '--tw-ring-color': color.value
                    }}
                    title={color.label}
                  >
                    {accent === color.name && (
                      <RiCheckLine className="w-4 h-4 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Editor Section */}
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
              Editor
            </h3>

            <SettingRow label="Font size" value="14px" />
            <SettingRow label="Line height" value="1.6" />
            <SettingRow label="Tab size" value="2 spaces" />
          </section>

          {/* Data Section */}
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
              Data
            </h3>

            <div className="space-y-2">
              <button className="w-full h-9 flex items-center justify-center text-sm text-[var(--text-secondary)] bg-[var(--bg-surface)] hover:bg-[var(--bg-overlay)] rounded-lg transition-colors">
                Export All Data
              </button>
              <button className="w-full h-9 flex items-center justify-center text-sm text-[var(--text-secondary)] bg-[var(--bg-surface)] hover:bg-[var(--bg-overlay)] rounded-lg transition-colors">
                Import from Markdown
              </button>
            </div>
          </section>

          {/* About */}
          <section className="pt-4 border-t border-[var(--border-subtle)]">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-[var(--accent)] to-purple-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">F</span>
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)]">FLUX Notes</p>
              <p className="text-xs text-[var(--text-tertiary)]">Version 0.1.0</p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

function ThemeButton({
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
        flex flex-col items-center justify-center gap-1 p-3 rounded-lg
        border transition-all duration-150
        ${active
          ? 'bg-[var(--accent-muted)] border-[var(--accent)] text-[var(--text-primary)]'
          : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-default)]'
        }
      `}
    >
      <span className={active ? 'text-[var(--accent)]' : ''}>{icon}</span>
      <span className="text-xs">{label}</span>
    </button>
  )
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <span className="text-sm text-[var(--text-tertiary)]">{value}</span>
    </div>
  )
}
