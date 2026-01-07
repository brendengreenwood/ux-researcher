# UX Researcher - Design Patterns Documentation

## Overview
This document defines the consistent UI/UX patterns used throughout the UX Researcher application. Follow these patterns religiously to maintain consistency.

---

## Core Hierarchy
```
Project
  └── Persona
      └── Research Exercise
          └── Interview
              ├── Annotations (timestamped notes)
              ├── Transcript (AI-generated)
              └── Analyses (AI insights)
```

**Key Principle**: Each level has its own detail page with breadcrumb navigation. Foreign keys are maintained for data integrity (Interview keeps both personaId AND exerciseId).

---

## 1. CRUD Object Pattern

### Create Flow
1. Parent detail page has a button labeled "New [ObjectType]"
2. Click button → Modal opens on SAME page (no navigation)
3. Modal asks for essential fields (title, name, description, type, etc.)
4. User fills fields and clicks "Create [ObjectType]" button in modal
5. Modal closes and one of two things happens:
   - **Simple objects** (Project, Persona, Exercise): Row appears in table with highlight animation
   - **Complex objects** (Interview): Navigate to recording/detail page with state via query param

### Modal Implementation
- Use `CreateX` component (e.g., `CreateProjectDialog`, `CreateExerciseDialog`)
- Props: `open`, `onOpenChange`, `projectId`/`personaId`/`exerciseId` (context IDs)
- Wrap dialog content in `motion.div` from Framer Motion for entrance animation
- Use `Input`, `Textarea`, `Select` from shadcn/ui
- POST to `/api/[objects]` route
- On success: close modal, trigger table refetch/animation, show toast

### Delete Flow
1. Action button in table row → Delete dialog
2. `DeleteX` component shows red alert with "Are you sure?" warning
3. Emphasize what will be deleted (cascade deletes)
4. User clicks "Delete" → POST to `/api/[objects]/[id]`
5. On success:
   - Row collapses with animation (useEffect in table watching deleted IDs)
   - Toast confirms deletion
   - Table refreshes data

### Detail Page Pattern
- Server component that fetches object and related data
- Breadcrumb navigation showing full hierarchy
- Two sub-components:
  - `[ObjectType]DetailHeader`: title, status badge, delete button
  - `[ObjectType]DetailContent`: main functionality
- Detail header always in top-right: Delete button

---

## 2. Table Design Pattern

### Structure
- **Fat rows** (not cards) - single row per object
- **Columns**: name/title (clickable), description/status, action column
- **Row click**: Navigate to detail page
- **Last column**: ActionButtons component with delete menu

### Animations
- **On create**: New row appears with highlight animation (fade + background color)
- **On delete**: Row collapses smoothly, then removed from DOM
- **Highlight color**: Use `bg-accent` or similar for 2-3 seconds

### ActionButtons Component
```typescript
// Pattern for all tables
<ActionButtons
  onDelete={() => setDeleteId(row.id)}
  deleteLabel="Delete [Object]"
/>
```

### Table Examples
- `ProjectsTable`: Shows projects with counts, click → detail page
- `PersonasTable`: Shows personas with exercise counts, click → detail page
- `ResearchExercisesTable`: Shows exercises with interview counts, click → detail page
- `InterviewsTable`: Shows interviews with duration/annotation counts, click → detail page

---

## 3. Interview Recording Workflow (Special Case)

This is the MOST IMPORTANT workflow. Users often confuse it. Follow exactly:

### Step 1: Exercise Detail Page
```
Exercise Detail Page
├── Header: Exercise name, type badge, description
└── Content: InterviewsTable + "New Interview" button
```

### Step 2: Create Interview Dialog
- Modal on exercise detail page (NOT a new page)
- Single field: Interview Title input
- Button text: **"Create New Interview"** (NOT "Start Recording")
- On submit: Navigate to `/projects/[id]/personas/[id]/exercises/[id]/interviews/new?title=TitleHere`

### Step 3: Recording Page
- Located at: `/projects/[projectId]/personas/[personaId]/exercises/[exerciseId]/interviews/new`
- Server component with useSearchParams to read title from query param
- Shows card-based layout:
  ```
  Left Card:           Right Card:
  ┌─ Recording ─┐     ┌─ Annotations ─┐
  │ Timer 00:00 │     │ Timestamped   │
  │ [Start]     │     │ notes          │
  │ Audio       │     │ [Add] button   │
  └─────────────┘     └────────────────┘

  Bottom Section:
  ┌─────────────────────────────────────┐
  │ Interview Title: [input field]      │
  │ [Save Interview] button             │
  └─────────────────────────────────────┘
  ```

### Step 4: Interview Detail Page
- Located at: `/projects/[projectId]/personas/[personaId]/exercises/[exerciseId]/interviews/[id]`
- Shows same card layout but read-only:
  - Recording card: audio player
  - Annotations card: list of timestamped notes
  - Transcript card: AI-generated transcript
  - AI Analysis cards: insights from agents

---

## 4. State Management Patterns

### Modal State (Client Side)
```typescript
const [openCreateModal, setOpenCreateModal] = useState(false)
const [openDeleteModal, setOpenDeleteModal] = useState(false)
const [deleteId, setDeleteId] = useState<string | null>(null)
```

### List Management in Tables
```typescript
// Track deleted IDs for collapse animation
const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())

// On delete success:
setDeletingIds(prev => new Set([...prev, id]))
setTimeout(() => {
  // Refetch data, remove from table
}, 300) // After collapse animation
```

### Form State
```typescript
const [title, setTitle] = useState('')
const [saving, setSaving] = useState(false)
```

---

## 5. API Endpoint Patterns

### Create Object
```typescript
// POST /api/[objects]
// Body: FormData or JSON depending on file uploads
// Response: 201 with created object (include _count for relationships)

const obj = await db.[model].create({
  data: { /* fields */ },
  include: {
    _count: { select: { [relations]: true } }
  }
})
return Response.json(obj, { status: 201 })
```

### Delete Object
```typescript
// DELETE /api/[objects]/[id]
// Note: Must await params for Next.js 14: const params = await props.params
// Response: 200 with { success: true }

await db.[model].delete({
  where: { id: params.id }
})
return Response.json({ success: true })
```

### Fetch with Relationships
```typescript
// Include full hierarchy when fetching
await db.interview.findUnique({
  where: { id },
  include: {
    persona: { include: { project: true } },
    exercise: true,
    annotations: { orderBy: { timestamp: 'asc' } },
    transcript: true,
    analyses: { orderBy: { createdAt: 'desc' } }
  }
})
```

---

## 6. Toast Notification Pattern

### Use Cases
- **Success**: "Interview created", "Exercise deleted"
- **Error**: "Failed to save", "Something went wrong"
- **Loading**: Show status if operation takes time

### Implementation
```typescript
import { toast } from 'sonner'

toast.success('Interview created')
toast.error('Failed to delete')
toast.loading('Saving...')
```

### When to Show
- On successful CRUD operations
- On API errors
- NOT on validation errors (use inline validation instead)

---

## 7. Breadcrumb Navigation Pattern

### All Detail Pages Include Full Path
```
Projects > Project Name > Persona Name > Exercise Name > Interview Title
```

### Components
- Use `Breadcrumb` from shadcn/ui
- Last item is `BreadcrumbPage` (not clickable)
- All others are `BreadcrumbLink` (clickable)
- Include `BreadcrumbSeparator` between items

---

## 8. Component File Naming Convention

### Patterns (Match Object Type)
- **Tables**: `[Object]sTable` → `ProjectsTable`, `PersonasTable`, `InterviewsTable`
- **Create Dialogs**: `Create[Object]Dialog` → `CreateProjectDialog`, `CreateInterviewDialog`
- **Delete Dialogs**: `Delete[Object]Dialog` → `DeleteProjectDialog`
- **Detail Headers**: `[Object]DetailHeader` → `ProjectDetailHeader`
- **Detail Content**: `[Object]DetailContent` → `ProjectDetailContent`
- **Detail Views**: `[Object]DetailView` → `InterviewDetailView`

### File Locations
- Components: `src/components/[name].tsx`
- Pages: `src/app/[route]/page.tsx`
- API Routes: `src/app/api/[resource]/route.ts` or `src/app/api/[resource]/[id]/route.ts`

---

## 9. Page File Structure Pattern

### Detail Page Template
```typescript
// Server component
export default async function DetailPage({ params }: Props) {
  // Fetch object with relationships
  const obj = await db.model.findUnique({
    where: { id: params.id },
    include: { /* relations */ }
  })
  if (!obj) notFound()

  // Return layout
  return (
    <div className="space-y-6">
      <Breadcrumb>/* full path */</Breadcrumb>
      <DetailHeader {...props} />
      <DetailContent {...props} />
    </div>
  )
}
```

### Content Component Template
```typescript
// Client component
'use client'
export function DetailContent({ /* props */ }) {
  const [state, setState] = useState(...)

  return (
    <div className="space-y-6">
      <Card>/* main content */</Card>
      <Card>/* related objects table */</Card>
    </div>
  )
}
```

---

## 10. Framer Motion Animation Pattern

### Modal Entrance
```typescript
<motion.div
  initial={{ opacity: 0, scale: 0.95, y: 10 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95, y: 10 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
>
  {/* Modal content */}
</motion.div>
```

### Row Highlight (New Items)
```typescript
<motion.tr
  initial={{ backgroundColor: 'hsl(var(--accent))' }}
  animate={{ backgroundColor: 'transparent' }}
  transition={{ duration: 3 }}
>
  {/* Row content */}
</motion.tr>
```

### Row Collapse (Delete)
```typescript
<motion.tr
  initial={{ opacity: 1, height: 'auto' }}
  animate={{ opacity: 0, height: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Row content */}
</motion.tr>
```

---

## 11. Server vs Client Component Rules

### Server Components (Pages)
- Fetch data from database
- Include breadcrumbs
- Render Header + Content components
- File: `src/app/[route]/page.tsx`

### Client Components (Content/Tables/Dialogs)
- Handle user interactions
- Manage state
- Show modals
- Make API calls via fetch
- File: `src/components/*.tsx`

### Mixed Pattern
```typescript
// Page: server component
export default async function Page({ params }: Props) {
  const data = await db.find(...)
  return <Content data={data} /> // Client component
}

// Content: client component
'use client'
export function Content({ data }: Props) {
  const [state, setState] = useState(...)
  return (...)
}
```

---

## 12. Key Don'ts
- ❌ Don't create separate pages for creation (use modals instead)
- ❌ Don't skip breadcrumb navigation
- ❌ Don't use card layout for tables (use fat rows)
- ❌ Don't forget cascade delete warnings
- ❌ Don't navigate on modal open (open ON current page)
- ❌ Don't forget to include _count in API responses
- ❌ Don't forget toast notifications on CRUD success
- ❌ Don't forget collapse animations on delete
- ❌ Don't forget highlight animations on create
- ❌ Don't forget title query param for interview creation

---

## 13. Quick Reference Checklist

When adding a new object type:

- [ ] Add model to `prisma/schema.prisma`
- [ ] Create POST `/api/[objects]` endpoint
- [ ] Create DELETE `/api/[objects]/[id]` endpoint
- [ ] Create `[Object]sTable` component
- [ ] Create `Create[Object]Dialog` component
- [ ] Create `Delete[Object]Dialog` component
- [ ] Create `[Object]DetailHeader` component
- [ ] Create `[Object]DetailContent` component
- [ ] Create detail page at `src/app/[route]/[id]/page.tsx`
- [ ] Update parent page to show table and "New" button
- [ ] Add breadcrumb to detail page
- [ ] Test full CRUD flow with animations

---

## Last Updated
2026-01-07

