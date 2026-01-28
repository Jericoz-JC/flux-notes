# FLUX Notes Design System

> Inspired by Linear, Raycast, and Obsidian — minimal, fast, focused.

## Design Philosophy

### Core Principles

1. **Minimal by Default** — Every element must earn its place. Remove clutter ruthlessly.
2. **Content First** — The UI should disappear. Your notes and tasks are the focus.
3. **Fast & Responsive** — Instant feedback. No loading states for local operations.
4. **Keyboard Native** — Everything accessible via shortcuts. Mouse is optional.
5. **Quiet Confidence** — Subtle, refined details over flashy effects.

### What We Avoid

- ❌ Gradients for decoration (only functional use)
- ❌ Drop shadows everywhere
- ❌ Busy backgrounds and textures
- ❌ Multiple accent colors competing
- ❌ Rounded corners > 8px (keep it crisp)
- ❌ Marketing-style hero sections in the app
- ❌ Excessive whitespace padding

---

## Color System

Using OKLCH for perceptual uniformity. Three base colors define everything:

### Dark Theme (Default)

```css
/* Base surfaces - NOT pure black */
--bg-base: oklch(0.13 0.004 285);      /* #1a1a1c - Main background */
--bg-elevated: oklch(0.16 0.004 285);  /* #232326 - Cards, panels */
--bg-surface: oklch(0.19 0.004 285);   /* #2c2c30 - Hover states */
--bg-overlay: oklch(0.22 0.004 285);   /* #37373b - Active states */

/* Text - NOT pure white */
--text-primary: oklch(0.93 0.004 285);   /* #ededef - Primary text */
--text-secondary: oklch(0.65 0.01 285);  /* #9898a0 - Secondary text */
--text-tertiary: oklch(0.45 0.01 285);   /* #5f5f67 - Subtle text */

/* Borders */
--border-subtle: oklch(0.24 0.006 285);  /* #3a3a40 - Subtle dividers */
--border-default: oklch(0.28 0.006 285); /* #454550 - Default borders */
--border-strong: oklch(0.35 0.006 285);  /* #565662 - Emphasized borders */

/* Single accent color - use sparingly */
--accent: oklch(0.65 0.15 250);          /* Soft blue */
--accent-hover: oklch(0.70 0.15 250);
--accent-muted: oklch(0.65 0.15 250 / 0.15);

/* Semantic colors */
--success: oklch(0.65 0.15 145);         /* Green */
--warning: oklch(0.75 0.15 85);          /* Amber */
--error: oklch(0.60 0.20 25);            /* Red */
```

### Light Theme

```css
--bg-base: oklch(0.985 0.002 285);
--bg-elevated: oklch(1.0 0 0);
--bg-surface: oklch(0.97 0.002 285);
--text-primary: oklch(0.15 0.01 285);
--text-secondary: oklch(0.45 0.01 285);
--border-subtle: oklch(0.92 0.004 285);
```

---

## Typography

### Font Stack

```css
--font-sans: "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
```

### Scale (4px grid based)

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Display | 24px | 600 | 1.2 |
| Title | 16px | 600 | 1.3 |
| Body | 14px | 400 | 1.5 |
| Small | 13px | 400 | 1.4 |
| Caption | 12px | 500 | 1.3 |
| Micro | 11px | 500 | 1.2 |

---

## Spacing (4px Grid)

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
```

---

## Layout Structure

### App Shell

```
┌─────────────────────────────────────────────────────┐
│  Traffic Lights        Title Bar (draggable)    ─□× │
├────────────┬────────────────────────────────────────┤
│            │                                        │
│  Sidebar   │           Main Content                 │
│   240px    │                                        │
│            │                                        │
│  ┌──────┐  │  ┌────────────────────────────────┐   │
│  │ Nav  │  │  │                                │   │
│  └──────┘  │  │     Content Area               │   │
│            │  │                                │   │
│  ┌──────┐  │  │                                │   │
│  │ List │  │  └────────────────────────────────┘   │
│  └──────┘  │                                        │
│            │                                        │
├────────────┴────────────────────────────────────────┤
│  Status Bar (optional)                              │
└─────────────────────────────────────────────────────┘
```

### Sidebar (240px fixed)

- Logo + App name (compact)
- Navigation items (Notes, Tasks, Focus, Graph)
- Section dividers
- Quick actions at bottom

### Main Content

- Full width minus sidebar
- Content max-width: 720px for reading
- Centered with comfortable margins

---

## Component Patterns

### Buttons

```
Primary:   Solid accent, white text. For primary actions only.
Secondary: Subtle background, default text. For secondary actions.
Ghost:     No background, default text. For tertiary actions.
```

**Sizing:**
- Default: 32px height, 12px horizontal padding
- Small: 28px height, 8px horizontal padding
- Icon-only: 32x32px or 28x28px

### Cards/Panels

- Background: `--bg-elevated`
- Border: `--border-subtle` (1px)
- Border-radius: 6px
- Padding: 12px or 16px
- No drop shadows (use borders for separation)

### List Items

- Height: 36px (comfortable click target)
- Padding: 8px 12px
- Hover: `--bg-surface`
- Active: `--bg-overlay`
- Selected: `--accent-muted` background, `--accent` left border (2px)

### Inputs

- Height: 32px
- Background: `--bg-surface`
- Border: `--border-default`
- Border-radius: 6px
- Focus: `--accent` border, subtle ring

---

## Iconography

Using Remix Icon (line style) at:
- 16px for inline/small contexts
- 20px for navigation/actions
- 24px for empty states

Icons should be `--text-secondary` by default, `--text-primary` on hover/active.

---

## Motion

### Principles

- Instant for local operations (<100ms)
- Subtle for state changes (150ms ease-out)
- No decorative animations

### Durations

```css
--duration-instant: 0ms;
--duration-fast: 100ms;
--duration-normal: 150ms;
--duration-slow: 250ms;
```

### Easing

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Command palette | `Cmd+K` |
| Quick capture | `Cmd+Shift+N` |
| New note | `Cmd+N` |
| New task | `Cmd+Shift+T` |
| Search | `Cmd+F` or `/` |
| Toggle sidebar | `Cmd+\` |
| Focus mode | `Cmd+Shift+F` |

---

## Do's and Don'ts

### Do

✓ Use consistent spacing (4px increments)
✓ Maintain clear visual hierarchy
✓ Keep interactions snappy
✓ Use the accent color sparingly
✓ Provide keyboard alternatives
✓ Test in both light and dark modes

### Don't

✗ Add decorative elements
✗ Use multiple font families
✗ Create deep nesting (max 2 levels)
✗ Use shadows for everything
✗ Animate without purpose
✗ Ignore accessibility contrast

---

## References

- [Linear.app](https://linear.app) — Issue tracking with exceptional UI
- [Raycast](https://raycast.com) — Launcher with minimal, fast interface
- [Obsidian](https://obsidian.md) — Note-taking with 4px grid system
- [GitHub](https://github.com) — Dark mode done right
