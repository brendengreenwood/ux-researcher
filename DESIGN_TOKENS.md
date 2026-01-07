# Design Tokens & Patterns

Documentation for reusable design patterns, animations, and component variants used throughout the UX Researcher app.

## Theme Setup

**Default Theme**: Dark mode (shadcn/ui dark theme)
- Set in `src/app/layout.tsx` with `className="dark"` on `<html>` element
- All shadcn color tokens automatically use dark mode values
- Custom styles use `!important` to override shadcn defaults when needed

---

## Core Token Sets

### Color Tokens

#### Semantic Colors
| Token | Light | Dark | CSS Variable |
|-------|-------|------|--------------|
| Background | oklch(1 0 0) - White | oklch(0.145 0 0) - Almost Black | `--background` |
| Foreground | oklch(0.145 0 0) - Almost Black | oklch(0.985 0 0) - White | `--foreground` |
| Card | oklch(1 0 0) - White | oklch(0.205 0 0) - Dark Gray | `--card` |
| Card Foreground | oklch(0.145 0 0) - Almost Black | oklch(0.985 0 0) - White | `--card-foreground` |
| Primary | oklch(0.205 0 0) - Dark Gray | oklch(0.922 0 0) - Light Gray | `--primary` |
| Primary Foreground | oklch(0.985 0 0) - White | oklch(0.205 0 0) - Dark Gray | `--primary-foreground` |
| Secondary | oklch(0.97 0 0) - Very Light Gray | oklch(0.269 0 0) - Dark Gray | `--secondary` |
| Secondary Foreground | oklch(0.205 0 0) - Dark Gray | oklch(0.985 0 0) - White | `--secondary-foreground` |
| Muted | oklch(0.97 0 0) - Very Light Gray | oklch(0.269 0 0) - Dark Gray | `--muted` |
| Muted Foreground | oklch(0.556 0 0) - Mid Gray | oklch(0.708 0 0) - Light Gray | `--muted-foreground` |
| Accent | oklch(0.97 0 0) - Very Light Gray | oklch(0.269 0 0) - Dark Gray | `--accent` |
| Accent Foreground | oklch(0.205 0 0) - Dark Gray | oklch(0.985 0 0) - White | `--accent-foreground` |
| Destructive | oklch(0.577 0.245 27.325) - Red | oklch(0.704 0.191 22.216) - Red | `--destructive` |
| Border | oklch(0.922 0 0) - Light Gray | oklch(1 0 0 / 10%) - White 10% | `--border` |
| Input | oklch(0.922 0 0) - Light Gray | oklch(1 0 0 / 15%) - White 15% | `--input` |
| Ring | oklch(0.708 0 0) - Mid Gray | oklch(0.556 0 0) - Mid Gray | `--ring` |

#### Data Visualization
| Token | Value | CSS Variable |
|-------|-------|--------------|
| Chart 1 | oklch(0.646 0.222 41.116) - Orange | `--chart-1` |
| Chart 2 | oklch(0.6 0.118 184.704) - Blue | `--chart-2` |
| Chart 3 | oklch(0.398 0.07 227.392) - Dark Blue | `--chart-3` |
| Chart 4 | oklch(0.828 0.189 84.429) - Yellow | `--chart-4` |
| Chart 5 | oklch(0.769 0.188 70.08) - Orange | `--chart-5` |

#### Sidebar (Component)
| Token | Light | Dark | CSS Variable |
|-------|-------|------|--------------|
| Sidebar | oklch(0.985 0 0) - Off White | oklch(0.205 0 0) - Dark Gray | `--sidebar` |
| Sidebar Foreground | oklch(0.145 0 0) - Almost Black | oklch(0.985 0 0) - White | `--sidebar-foreground` |
| Sidebar Primary | oklch(0.205 0 0) - Dark Gray | oklch(0.488 0.243 264.376) - Purple | `--sidebar-primary` |
| Sidebar Primary Foreground | oklch(0.985 0 0) - White | oklch(0.985 0 0) - White | `--sidebar-primary-foreground` |
| Sidebar Accent | oklch(0.97 0 0) - Very Light Gray | oklch(0.269 0 0) - Dark Gray | `--sidebar-accent` |
| Sidebar Accent Foreground | oklch(0.205 0 0) - Dark Gray | oklch(0.985 0 0) - White | `--sidebar-accent-foreground` |
| Sidebar Border | oklch(0.922 0 0) - Light Gray | oklch(1 0 0 / 10%) - White 10% | `--sidebar-border` |
| Sidebar Ring | oklch(0.708 0 0) - Mid Gray | oklch(0.556 0 0) - Mid Gray | `--sidebar-ring` |

### Spacing Tokens
| Token | Value | Use Case |
|-------|-------|----------|
| Table Cell Padding | `p-6` (24px) | Fat row tables, generous spacing |
| Section Gap | `space-y-6` (24px) | Vertical rhythm between major sections |
| Component Gap | `space-y-4` (16px) | Spacing between components |
| Tight Gap | `gap-2` (8px) | Inline element spacing |

### Border Radius Tokens
| Token | Value | CSS Variable |
|-------|-------|--------------|
| Base | 0.625rem (10px) | `--radius` |
| Small | calc(var(--radius) - 4px) = 6px | `--radius-sm` |
| Medium | calc(var(--radius) - 2px) = 8px | `--radius-md` |
| Large | var(--radius) = 10px | `--radius-lg` |
| XL | calc(var(--radius) + 4px) = 14px | `--radius-xl` |
| 2XL | calc(var(--radius) + 8px) = 18px | `--radius-2xl` |
| 3XL | calc(var(--radius) + 12px) = 22px | `--radius-3xl` |
| 4XL | calc(var(--radius) + 16px) = 26px | `--radius-4xl` |

### Typography Tokens
| Token | Size | Weight | Use Case |
|-------|------|--------|----------|
| Display | 2xl-3xl | bold | Page titles |
| Heading | xl | semibold | Section headers |
| Subheading | lg | semibold | Subsection headers |
| Body | sm | regular | Default text |
| Caption | xs | regular | Labels, hints |
| Button | sm | medium | Button text |

### Transition Tokens
| Token | Value | Use Case |
|-------|-------|----------|
| Color Transition | `transition-colors` | Color changes |
| All Transition | `transition-all` | Multiple property changes |
| Smooth | `cubic-bezier(0.4, 0, 0.6, 1)` | Animation easing |

---

## Button Variants

### `action` - User Guidance Button
**Purpose:** Guide users to the next logical step in a workflow. Used above tables and list views, empty states, and on newly created objects to draw attention.

**Usage:**
```tsx
<Button variant="action" onClick={() => setDialogOpen(true)}>
  Create New Object
</Button>
```

Or with Link:
```tsx
<Button asChild variant="action">
  <Link href="/create-path">Create New</Link>
</Button>
```

**Styling Details:**
- Class: `.action-button-energy`
- Animation: `action-pulse-glow` (2s, cubic-bezier(0.4, 0, 0.6, 1))
- Border: 2px solid rgba(0, 212, 255, 0.6) - **neon cyan-blue**
- Glow: Expands outward from 0px to 12px, then fades
- Hover: Animation speeds up to 1.5s, border becomes brighter (0.8 opacity)
- Active: Animation stops, shows 3px ring shadow in cyan-blue
- Uses `!important` to override shadcn defaults

**CSS Location:** `src/app/globals.css` (`.action-button-energy` class and `@keyframes action-pulse-glow`)

**Component:** `src/components/ui/button.tsx` (added to `buttonVariants`)

**Dark Mode:** Works seamlessly in dark mode with neon cyan-blue that pops against dark backgrounds

---

## Animation Patterns

### Pulse Glow (`action-pulse-glow`)
Expanding outward glow that pulses to draw attention subtly.

```css
@keyframes action-pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74, 85, 104, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(74, 85, 104, 0); }
}
```

**When to use:**
- Buttons that guide users to next steps
- CTAs that should subtly draw attention without being aggressive
- Progressive workflow indicators

---

## Color Values
- **Glow color:** `rgba(74, 85, 104, ...)` - Neutral slate gray that works across light/dark modes
- **Primary:** `var(--primary)` - Use for base button color

---

## Future Tokens to Add
- [ ] Loading/progress animations
- [ ] Hover state patterns
- [ ] Edge tracing animations
- [ ] Success/confirmation patterns
- [ ] Error/warning patterns
- [ ] Transition timing standards

---

---

## How to Use Tokens

### In CSS
```css
.my-element {
  background-color: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.my-element:hover {
  background-color: var(--accent);
  color: var(--accent-foreground);
}
```

### In Tailwind Classes
```tsx
<div className="bg-background text-foreground border border-border rounded-lg p-6">
  <h1 className="text-xl font-semibold text-foreground">Heading</h1>
  <p className="text-muted-foreground">Muted text</p>
</div>
```

### For Custom Animations
```css
@keyframes custom-animation {
  0% { background: var(--accent); }
  100% { background: var(--background); }
}
```

### Color Token Naming Convention
- Base token (e.g., `--primary`) = background/fill color
- `-foreground` variant (e.g., `--primary-foreground`) = text/content color on that base

Always pair them together for proper contrast!

---

## How to Update
When adding new design patterns or animations:
1. Add the CSS/animation to `src/app/globals.css`
2. Add a variant to `buttonVariants` in `src/components/ui/button.tsx` if it's button-related
3. Update relevant section in this file with token values and usage
4. Link to where it's being used in the codebase

---

## Files to Reference
- **Theme variables:** `src/app/globals.css` (`:root` and `.dark` selectors)
- **Button variants:** `src/components/ui/button.tsx` (buttonVariants CVA)
- **Animations/effects:** `src/app/globals.css` (@keyframes and custom classes)
- **Tailwind config:** `tailwind.config.js` (if using Tailwind for tokens)
