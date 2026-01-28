// Platform detection utilities

export function isMac(): boolean {
  if (typeof window === 'undefined') return false
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0
}

export function isWindows(): boolean {
  if (typeof window === 'undefined') return false
  return navigator.platform.toUpperCase().indexOf('WIN') >= 0
}

// Get the modifier key for the current platform
export function getModKey(): string {
  return isMac() ? '⌘' : 'Ctrl'
}

// Format a shortcut for display
export function formatShortcut(shortcut: string): string {
  const mod = getModKey()
  return shortcut
    .replace('Mod', mod)
    .replace('⌘', mod)
    .replace('Cmd', mod)
    .replace('Ctrl', mod)
}

// Common shortcuts
export const shortcuts = {
  search: () => `${getModKey()}+K`,
  newNote: () => `${getModKey()}+N`,
  newTask: () => `${getModKey()}+Shift+T`,
  toggleSidebar: () => `${getModKey()}+\\`,
  save: () => `${getModKey()}+S`,
  close: () => 'Esc',
}
