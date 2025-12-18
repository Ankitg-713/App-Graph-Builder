# App Graph Builder

🔗 **Live Demo:** [https://app-graph-builder-eight.vercel.app](https://app-graph-builder-eight.vercel.app)

A ReactFlow-based application graph builder UI built with React, TypeScript, and modern tooling.

## Tech Stack

- **React 19** + **Vite** - Modern React with fast build tooling
- **TypeScript** (strict mode) - Type-safe development
- **ReactFlow (xyflow)** - Graph visualization library
- **shadcn/ui** - UI component library
- **TanStack Query** - Data fetching and caching
- **Zustand** - Lightweight state management
- **MSW** - Mock Service Worker for API mocking
- **Tailwind CSS** - Utility-first CSS framework

## Setup Instructions

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Run type checking
npm run typecheck
```

## Key Decisions

1. **Zustand** - Minimal UI state (selectedAppId, selectedNodeId, isMobilePanelOpen, activeInspectorTab)
2. **TanStack Query** - Server state with 5-minute cache, manual retry on error
3. **MSW** - Mock Service Worker for realistic API simulation with configurable errors
4. **Custom shadcn/ui** - Hand-crafted components for full control over styling
5. **ReactFlow hooks** - `useNodesState`, `useEdgesState` for predictable state updates
6. **CSS-only node styling** - Removed ReactFlow default styles for cleaner custom nodes

## Known Limitations

1. Graph changes are not persisted to backend (in-memory only)
2. Mock data is static per app (same 3 nodes for each)
3. No authentication/authorization implemented
4. Node connections cannot be removed (only nodes)

## Features

### Layout
- Top bar with search and actions
- Left icon rail navigation
- Right panel (App Selector / Node Inspector)
- Dotted canvas background

### Responsive Design
- Right panel becomes slide-over drawer on mobile
- Touch-enabled dragging and panning
- Keyboard shortcut hints hidden on mobile

### ReactFlow Canvas
- Custom styled nodes (Service = green, Database = blue)
- Drag, select, delete nodes
- Zoom/pan with mouse and touch
- Fit view on load

### Node Inspector
- Status pill (Healthy, Degraded, Down)
- Two tabs: Config and Runtime
- Synced slider + numeric input (0-100)
- Editable name and description
- Changes persist to node data

### Data Fetching
- `GET /api/apps` - List of applications
- `GET /api/apps/:appId/graph` - Nodes and edges
- Loading spinner state
- Error state with Retry button
- Cached results via TanStack Query

## Bonus Features

- **Add Node buttons** - Create new Service or Database nodes
- **Node types** - Service (green/CPU icon) vs Database (blue/HardDrive icon)
- **Keyboard shortcuts**:
  - `F` - Fit view
  - `P` - Toggle right panel
  - `Delete/Backspace` - Delete selected node

## Error Simulation

To test error states, edit `src/mocks/handlers.ts`:

```typescript
const SIMULATE_RANDOM_ERRORS = true; // Enable random failures
const ERROR_PROBABILITY = 0.5;       // 50% failure rate
```

## Project Structure

```
src/
├── components/
│   ├── canvas/          # ReactFlow components
│   │   ├── CustomNode.tsx
│   │   └── FlowCanvas.tsx
│   ├── layout/          # Layout components
│   │   ├── AppSelector.tsx
│   │   ├── LeftRail.tsx
│   │   ├── NodeInspector.tsx
│   │   ├── RightPanel.tsx
│   │   └── TopBar.tsx
│   └── ui/              # shadcn/ui components
├── hooks/               # TanStack Query hooks
├── mocks/               # MSW handlers
├── store/               # Zustand store
├── types/               # TypeScript types
└── lib/                 # Utilities
```

