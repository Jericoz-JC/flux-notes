import { useState, useEffect } from 'react'
import { RiPlayFill, RiPauseFill, RiRestartLine, RiFireLine } from '@remixicon/react'

export function FocusView() {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(25)

  useEffect(() => {
    let interval: number | undefined

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(t => t - 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((selectedPreset * 60 - timeLeft) / (selectedPreset * 60)) * 100

  const selectPreset = (minutes: number) => {
    setSelectedPreset(minutes)
    setTimeLeft(minutes * 60)
    setIsRunning(false)
  }

  const reset = () => {
    setTimeLeft(selectedPreset * 60)
    setIsRunning(false)
  }

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="text-center">
        {/* Streak indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <RiFireLine className="w-5 h-5 text-[var(--warning)]" />
          <span className="text-sm text-[var(--text-secondary)]">3 day streak</span>
        </div>

        {/* Timer circle */}
        <div className="relative w-64 h-64 mb-8">
          {/* Background circle */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="var(--bg-surface)"
              strokeWidth="8"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
              className="transition-all duration-1000"
            />
          </svg>

          {/* Time display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-light text-[var(--text-primary)] tracking-tight">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Presets */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[25, 5, 45, 60].map(minutes => (
            <button
              key={minutes}
              onClick={() => selectPreset(minutes)}
              className={`
                h-8 px-4 rounded-md text-sm transition-colors
                ${selectedPreset === minutes
                  ? 'bg-[var(--accent-muted)] text-[var(--accent)]'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
                }
              `}
            >
              {minutes}m
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-colors"
          >
            <RiRestartLine className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
          >
            {isRunning
              ? <RiPauseFill className="w-6 h-6" />
              : <RiPlayFill className="w-6 h-6 ml-0.5" />
            }
          </button>

          <div className="w-10 h-10" /> {/* Spacer for symmetry */}
        </div>

        {/* Today's sessions */}
        <div className="mt-12 text-center">
          <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Today</p>
          <p className="text-sm text-[var(--text-secondary)]">2 sessions • 50 minutes focused</p>
        </div>
      </div>
    </div>
  )
}
