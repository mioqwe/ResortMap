# Project Plan: Resort Map Cabana Booking Webapp

## Overview

Build a webapp that displays an interactive resort map and allows guests to book poolside cabanas. The frontend relies entirely on a RESTful API for all data, provided by SvelteKit's server routes.

---

## Tech Stack

- **Framework:** SvelteKit (Svelte 5) + TypeScript
- **Single entrypoint:** Node.js script that runs SvelteKit dev server with CLI args

---

## Architecture

SvelteKit handles both frontend (map view) and backend (REST API) in a single process:

```
┌─────────────────────────────────────────────────┐
│                  Single Entry Point              │
│              (node start.js)                    │
│                  accepts --map                  │
│                  accepts --bookings             │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │   SvelteKit App     │
        │      :5173          │
        │                     │
        │  +page.svelte       │  ← Frontend (map view)
        │  +page.server.js     │  ← Initial map data loading
        │  +server.js          │  ← API routes (REST endpoints)
        └─────────────────────┘
                  │
                  ▼
              Browser
```

**Key simplification:** No separate Express backend needed. SvelteKit's `+server.js` files provide the REST API.

---

## API Design (SvelteKit +server.js)

| Method | Endpoint | File | Description |
|--------|----------|------|-------------|
| GET | `/api/map` | `src/routes/api/map/+server.js` | Returns map layout + cabana positions with availability |
| GET | `/api/bookings` | `src/routes/api/bookings/+server.js` | Returns guest list |
| POST | `/api/book` | `src/routes/api/book/+server.js` | Book cabana: `{ cabanaId, room, guestName }` |

**Cabana IDs:** Use coordinates like `row_col` (e.g., `12_3` for row 12, col 3)

---

## Map Legend

- `W` = cabana
- `p` = pool
- `#` = path
- `c` = chalet
- `.` = empty space

---

## Project Structure

```
src/
├── routes/
│   ├── +page.svelte              # Main map view (receives data via +page.server.js)
│   ├── +page.server.js           # Server-side load: reads map, returns initial data
│   ├── +layout.svelte            # App layout with nav/footer
│   └── api/
│       ├── map/+server.js        # GET /api/map
│       ├── bookings/+server.js   # GET /api/bookings
│       └── book/+server.js       # POST /api/book
├── lib/
│   ├── components/
│   │   ├── MapTile.svelte        # Renders single map tile (image)
│   │   ├── CabanaPopup.svelte   # Booking dialog (room + name form)
│   │   └── Legend.svelte         # Map legend (W/p/#/c/. explanation)
│   └── services/
│       └── api.ts                # API client (fetch wrappers)
├── hooks.server.ts               # Parses CLI args, stores in event.locals
└── app.html

static/
└── assets/                       # PNG tiles copied here

start.js                          # Entry point: parses --map/--bookings, runs dev server
```

**CLI Options:**
- `--map <path>` - Path to ASCII map file (default: `map.ascii`)
- `--bookings <path>` - Path to bookings JSON file (default: `bookings.json`)

---

## CLI Args Handling

SvelteKit doesn't natively support `--map` and `--bookings` args. We use `hooks.server.ts`:

1. `start.js` parses CLI args, passes via environment variables to SvelteKit
2. `hooks.server.ts` reads env vars, stores parsed paths in `event.locals`
3. Routes (`+page.server.js`, `+server.js`) access `event.locals` for file paths

---

## In-Memory State

- **Cabana bookings:** Module-level `Map<cabanaId, { room, guestName }>` in `src/lib/server/state.ts`
- **Guest validation:** Read from bookings.json file on each validation request
- **No persistence:** Restart clears all bookings

---

## Implementation Steps

### 1. Project Setup
- Create SvelteKit project: `npx sv create resort-map --template minimal`
- Copy assets to `static/assets/`
- Create `start.js` entry point that passes env vars to Vite

### 2. CLI Args Parsing
- Create `start.js` to parse `--map` and `--bookings`
- Set environment variables: `VITE_MAP_PATH`, `VITE_BOOKINGS_PATH`
- Create `hooks.server.ts` to read env vars into `event.locals`

### 3. Server State Module
- Create `src/lib/server/state.ts` with in-memory Map for cabana bookings
- Functions: `getCabanaBookings()`, `bookCabana()`, `isCabanaBooked()`

### 4. API Routes (+server.js)
- `api/map/+server.js` - reads ASCII map, returns tiles + cabana positions with booking status
- `api/bookings/+server.js` - returns guest list from bookings.json
- `api/book/+server.js` - validates room+guestName, books cabana if valid

### 5. Map Data Loading (+page.server.js)
- `+page.server.js` reads map file, returns initial map state
- Also returns current cabana availability (from in-memory state)

### 6. Frontend Components
- `MapTile.svelte` - displays PNG based on tile type ('W', 'p', '#', 'c', '.')
- `CabanaPopup.svelte` - modal with room number + guest name form
- `Legend.svelte` - shows map symbol meanings
- `+page.svelte` - renders map grid, handles cabana clicks

### 7. Booking Flow
1. User clicks cabana tile
2. If booked → show "Not Available" message
3. If available → show `CabanaPopup` with form
4. User enters room number + guest name
5. Submit → `POST /api/book`
6. Success → close popup, cabana now shows as booked (different style)
7. Failure → show error message from API

### 8. Assets Mapping
- `W` → `/assets/cabana.png`
- `p` → `/assets/pool.png`
- `#` → `/assets/parchmentBasic.png` (simplified path tile)
- `c` → `/assets/houseChimney.png`
- `.` → `/assets/parchmentBasic.png`

### 9. Testing
- Vitest for unit tests (API handlers, state logic)
- Playwright for e2e (click cabana, book, verify UI update)

### 10. Documentation
- README.md with run instructions, API docs, design decisions
- AI.md for workflow documentation

---

## Key Svelte 5 / SvelteKit Patterns

### Runes (Svelte 5)
- `$state` - reactive state (e.g., `selectedCabana`, `bookingStatus`)
- `$derived` - computed values (e.g., `availableCabanas`)
- `$effect` - side effects (e.g., fetching map data on mount)
- `$props()` - component props (e.g., `let { cabana } = $props()`)

### SvelteKit
- `+page.server.js` - server-only load function for initial page data
- `+server.js` - REST API endpoints
- `event.locals` - access parsed CLI args in routes
- `$app/server` - `getRequestEvent()` for shared server logic
- `+layout.svelte` - shared UI wrapper with `{@render children()}`

### API Patterns
- Use `json()` helper from `@sveltejs/kit` for responses
- Use `error()` helper for error responses (400, 404, 500)
- Validate inputs before processing

---

## Trade-offs & Decisions

1. **Single-process architecture:** SvelteKit handles both frontend and API, eliminating separate Express server. Simplifies deployment and avoids CORS issues.
2. **Path tile simplification:** Use single parchment background for all non-specific tiles instead of complex context-based tile detection.
3. **In-memory state:** No persistent storage. Bookings cleared on restart. Acceptable per requirements.
4. **No auth:** Room number + guest name validation is sufficient "auth" per requirements.
5. **Asset handling:** Copy PNG assets to `static/assets/` for direct URL access (`/assets/cabana.png`).

---

## Verification Plan

1. Run `node start.js --map map.ascii --bookings bookings.json`
2. Open browser to http://localhost:5173
3. Map renders with all tile types visible
4. Click available cabana → booking popup appears
5. Enter valid room/guest (e.g., "101", "Alice Smith") → booking succeeds
6. Cabana now shows distinct visual style (e.g., red overlay or checkmark)
7. Click booked cabana → "Not Available" message
8. Enter invalid room/guest → error message shown
9. Refresh page → booked cabanas remain (in-memory, survives refresh)

---

## File Summary

| File | Purpose |
|------|---------|
| `start.js` | Entry point, parses CLI args, starts SvelteKit |
| `src/hooks.server.ts` | Reads env vars, populates `event.locals` |
| `src/lib/server/state.ts` | In-memory cabana booking state |
| `src/routes/+page.server.js` | Initial map data loading |
| `src/routes/+page.svelte` | Main map view component |
| `src/routes/api/map/+server.js` | GET /api/map endpoint |
| `src/routes/api/bookings/+server.js` | GET /api/bookings endpoint |
| `src/routes/api/book/+server.js` | POST /api/book endpoint |
| `src/lib/components/MapTile.svelte` | Single tile renderer |
| `src/lib/components/CabanaPopup.svelte` | Booking form modal |
| `src/lib/components/Legend.svelte` | Map legend display |