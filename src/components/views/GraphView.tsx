import { RiZoomInLine, RiZoomOutLine, RiFocus3Line } from '@remixicon/react'

export function GraphView() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-6 border-b border-[var(--border-subtle)]">
        <span className="text-sm font-medium text-[var(--text-primary)]">Knowledge Graph</span>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-colors">
            <RiZoomOutLine className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-colors">
            <RiZoomInLine className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-colors">
            <RiFocus3Line className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Graph Canvas */}
      <div className="flex-1 relative bg-[var(--bg-base)]">
        {/* Placeholder graph visualization */}
        <svg className="w-full h-full">
          {/* Grid pattern */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="var(--border-subtle)"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Sample nodes and connections */}
          <g transform="translate(0, 0)">
            {/* Connections */}
            <line x1="50%" y1="50%" x2="35%" y2="35%" stroke="var(--border-default)" strokeWidth="1" />
            <line x1="50%" y1="50%" x2="65%" y2="35%" stroke="var(--border-default)" strokeWidth="1" />
            <line x1="50%" y1="50%" x2="40%" y2="65%" stroke="var(--border-default)" strokeWidth="1" />
            <line x1="50%" y1="50%" x2="60%" y2="70%" stroke="var(--border-default)" strokeWidth="1" />
            <line x1="35%" y1="35%" x2="25%" y2="45%" stroke="var(--border-default)" strokeWidth="1" />
            <line x1="65%" y1="35%" x2="75%" y2="45%" stroke="var(--border-default)" strokeWidth="1" />

            {/* Center node */}
            <circle cx="50%" cy="50%" r="24" fill="var(--accent)" opacity="0.2" />
            <circle cx="50%" cy="50%" r="16" fill="var(--accent)" />
            <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fill="white" fontSize="10" fontWeight="500">Main</text>

            {/* Connected nodes */}
            <g className="cursor-pointer">
              <circle cx="35%" cy="35%" r="12" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="1" />
              <text x="35%" y="35%" textAnchor="middle" dy="0.35em" fill="var(--text-secondary)" fontSize="8">Ideas</text>
            </g>

            <g className="cursor-pointer">
              <circle cx="65%" cy="35%" r="12" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="1" />
              <text x="65%" y="35%" textAnchor="middle" dy="0.35em" fill="var(--text-secondary)" fontSize="8">Tasks</text>
            </g>

            <g className="cursor-pointer">
              <circle cx="40%" cy="65%" r="12" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="1" />
              <text x="40%" y="65%" textAnchor="middle" dy="0.35em" fill="var(--text-secondary)" fontSize="8">Notes</text>
            </g>

            <g className="cursor-pointer">
              <circle cx="60%" cy="70%" r="12" fill="var(--bg-surface)" stroke="var(--border-default)" strokeWidth="1" />
              <text x="60%" y="70%" textAnchor="middle" dy="0.35em" fill="var(--text-secondary)" fontSize="8">Refs</text>
            </g>

            {/* Outer nodes */}
            <g className="cursor-pointer">
              <circle cx="25%" cy="45%" r="8" fill="var(--bg-surface)" stroke="var(--border-subtle)" strokeWidth="1" />
            </g>
            <g className="cursor-pointer">
              <circle cx="75%" cy="45%" r="8" fill="var(--bg-surface)" stroke="var(--border-subtle)" strokeWidth="1" />
            </g>
          </g>
        </svg>

        {/* Info panel */}
        <div className="absolute bottom-4 left-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-md px-3 py-2">
          <p className="text-xs text-[var(--text-tertiary)]">
            <span className="text-[var(--text-secondary)]">6</span> notes • <span className="text-[var(--text-secondary)]">5</span> connections
          </p>
        </div>
      </div>
    </div>
  )
}
