# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A React + TypeScript SPA frontend for a crypto/quantitative strategy platform. Connects to a Python backend API (`strategy_platform_service`). Features strategy browsing, backtest reports, trading signals, market research, and a tiered paywall/entitlement system.

## Commands

- `npm run dev` — Start Vite dev server on port 5173
- `npm run build` — Type-check then build (`tsc -b && vite build`)
- `npm run check` — Type-check only (`tsc -b --noEmit`)
- `npm run lint` — ESLint
- `npm run test` — Run all tests (`vitest run`)
- `npx vitest run src/path/to/file.test.ts` — Run a single test file

## Architecture

**Stack:** React 18, TypeScript, Vite, Tailwind CSS 3, Zustand, React Router v7, Vitest + Testing Library.

**Path aliases:** `@/*` maps to `./src/*` (configured in tsconfig.json, resolved by vite-tsconfig-paths).

**API layer** (`src/api/`):
- `client.ts` — Central `request<T>()` function wrapping fetch. All responses follow `{ code, message, data }` shape. Handles JWT access/refresh tokens with auto-refresh on 401. Tokens stored in localStorage (`sp_access_token`, `sp_refresh_token`).
- `types.ts` — Shared backend DTO types (StrategyRead, SignalRead, BacktestResultRead, ReportRead, etc.)
- Domain modules (`strategies.ts`, `reports.ts`, `auth.ts`) export typed API functions.

**State management** (`src/stores/`):
- `authStore.ts` — Zustand store with `persist` middleware (localStorage key `sp_auth_v2`). Holds user, plan, subscription status, and per-strategy grants. Decodes JWT to derive membership/plan.
- `paywallStore.ts` — Controls paywall modal open/close state.
- `localeStore.ts` — Locale preferences.

**Entitlement/paywall system** (`src/lib/entitlements.ts` + `src/components/paywall/`):
- Plans: `guest` → `free` → `member` → `admin`. Entitlement keys map to feature access.
- `decideGate()` returns a `GateDecision` with mode (SHOW/BLUR/HIDE/DELAY/SAMPLE/QUOTA).
- `<Gated>` component wraps content with paywall gating; `<BlurredValue>`, `<LockBadge>`, `<LockedPlaceholder>` handle denied states.
- `useEntitlements()` and `usePaywall()` hooks for consuming in components.

**Routing** (`src/App.tsx`): All routes nest under `<AppShell>` (layout with nav). Key routes: `/`, `/signals`, `/strategies/:strategyId`, `/methodology`, `/market-research`, `/pricing`, `/account`, `/login`, `/register`.

**Data fetching hook:** `useApi<T>(fetcher, deps)` — generic hook with loading/error/refetch state.

**Testing:** Vitest with jsdom environment. Setup in `src/tests/setup.ts` imports `@testing-library/jest-dom/vitest`. Test files are co-located (e.g., `Component.test.tsx` next to `Component.tsx`).

## Environment

Copy `.env.example` to `.env`. Required variable: `VITE_API_BASE_URL` (defaults to `http://localhost:8000/api/v1`).

## Conventions

- UI text is in Chinese (zh-CN).
- Tailwind dark mode uses `class` strategy.
- `clsx` + `tailwind-merge` (via `src/lib/utils.ts`) for className composition.
