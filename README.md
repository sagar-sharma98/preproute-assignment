# PrepRoute Test Management

Admin-facing React app for creating, editing, and publishing tests on the PrepRoute platform.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **React Router** for routing
- **React Hook Form** + **Zod** for forms
- **Axios** for API calls

## Quick start

```bash
npm install
npm run dev
```

Default dev API proxy: `/api` → staging backend (see `vite.config.ts`).

## Application flow

1. **Login** — JWT stored in `localStorage`
2. **Dashboard** — list, search, and filter tests
3. **Create / Edit test** — metadata, marking scheme, subject hierarchy
4. **Question builder** — add MCQs per test slot
5. **Preview & publish** — confirm and set test `status: live`

## Project structure

```
src/
├── api/                 # HTTP layer (one concern per module)
│   ├── client.ts        # Axios instance, auth headers, error parsing
│   ├── auth.ts          # Login
│   ├── entities.api.ts  # Subjects, topics, sub-topics
│   ├── tests.api.ts     # Test CRUD + publish
│   ├── questions.api.ts # Bulk question create/fetch
│   └── tests.ts         # Barrel re-exports
├── components/
│   ├── dashboard/       # Dashboard-only UI
│   ├── layout/          # Shell, sidebar, top bar, profile
│   ├── login/           # Login screen UI
│   ├── shared/          # Reusable primitives (Button, Field, Dialog)
│   └── tests/           # Test-creation flow UI
├── constants/           # App-wide config (e.g. navigation)
├── context/             # React context (auth)
├── hooks/               # Stateful logic extracted from pages
├── pages/               # Route entry points (composition only)
├── types/               # Shared TypeScript contracts
└── utils/               # Pure helpers (formatting, filters, entities)
```

### Design principles

- **Pages are thin** — they compose components and hooks; they do not own business logic.
- **Single responsibility** — each component/hook/module does one job (e.g. `DashboardToolbar` = search + refresh UI only).
- **API split by domain** — entities, tests, and questions live in separate modules with shared normalizers in `api/lib/`.
- **Hooks own side effects** — data fetching, mutations, and filter state live in `hooks/`, not in presentational components.

## Key routes

| Route | Purpose |
|---|---|
| `/login` | Authentication |
| `/tests` | Dashboard |
| `/tests/new` | Create test |
| `/tests/:id/edit` | Edit test metadata |
| `/tests/:id/questions` | Question builder |
| `/tests/:id/preview` | Publish confirmation |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
