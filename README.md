# ChatGenius

A modern, lightweight chat application built with React, Vite, TypeScript, and Tailwind CSS. ChatGenius demonstrates a polished UI, form validation, search with debouncing, and a responsive chat interface.

Live demo: https://chatgenius-kuvaka.netlify.app

## Table of contents

- Project overview
- Quick setup & run
- Project structure
- Key implementation details
  - Throttling / Debouncing
  - Pagination
  - Infinite scroll & auto-scroll behavior
  - Form validation (phone + OTP)
- Scripts

## Project overview

ChatGenius is an application that lets a user create chat rooms and interact with a conversational interface. It focuses on UI/UX details and front-end patterns you commonly need in production apps:

- Form validation and friendly error messages (using react-hook-form + zod)
- Debounced search (for performance when filtering lists)
- Accessible pagination UI components
- Chat message list with auto-scroll and skeleton loading

This repository is intended as a UI-focused starter and demo — backend/integration pieces (real SMS delivery, persistent storage, or real LLM APIs) are intentionally simulated.

## Quick setup & run

Prerequisites

- Node.js 18+ (or your preferred Node 18-compatible runtime)
- npm (bundled) or yarn / pnpm

Local development (Windows PowerShell example)

```powershell
# install deps
npm install

# run dev server
npm run dev
```

Open http://localhost:8080 (or the port printed by Vite) in your browser.

Build for production

```powershell
npm run build
```

## Project structure (high level)

Files and folders you'll care about:

- `src/`
  - `components/` — UI and feature components organized by area (auth, chat, layout, ui primitives)
    - `auth/` — `CountrySelector.tsx`, `OTPInput.tsx` (phone + OTP UI pieces)
    - `chat/` — `ChatInput.tsx`, `MessageItem.tsx`, `MessageList.tsx`, `TypingIndicator.tsx`
    - `layout/` — `ThemeToggle.tsx`
    - `ui/` — collection of shadcn-style primitive components (button, input, pagination, form helpers, etc.)
  - `hooks/` — `useDebounce.ts` (debounce hook used across the app)
  - `lib/` — small utilities (`utils.ts`)
  - `pages/` — top-level views: `Auth.tsx`, `Chat.tsx`, `Dashboard.tsx`, `Index.tsx`, `NotFound.tsx`
  - `store/` — lightweight Zustand stores: `authStore.ts`, `chatStore.ts`, `themeStore.ts`

This structure keeps feature components colocated and UI primitives reusable across pages.

## Key implementation details

Below are concise explanations of how throttling/debouncing, pagination, infinite scroll/auto-scroll, and form validation are implemented in this repo. Where relevant, file paths and small code excerpts are referenced so you can jump straight to the implementation.

### Throttling / Debouncing

- Implementation: `src/hooks/useDebounce.ts`
- Pattern: The app uses a standard debounce hook which sets a timeout when the input value changes and only updates the debounced value after the delay elapses. This avoids running heavy filtering or requests on every keystroke.

Key points:

- Used in: `src/pages/Dashboard.tsx` — the chatrooms search input uses the hook:

```ts
const debouncedSearch = useDebounce(searchQuery, 300);
```

- Hook behavior (summary): `useDebounce<T>(value, delay)` returns the last stable value after `delay` ms. Internally it uses a setTimeout cleared in the cleanup function of useEffect.

When to use: Any user input that triggers expensive work (API calls, large client-side filters) benefits from debouncing.

### Pagination

- Implementation: `src/components/ui/pagination.tsx`
- Pattern: Presentation-only pagination components (Previous, Next, page links, ellipsis) implemented as accessible buttons/links. These components are intentionally UI-focused, unopinionated about data fetching strategy.

Key points:

- `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, and `PaginationEllipsis` are exported from `src/components/ui/pagination.tsx`.
- The components wrap button/link variants (`buttonVariants`) so they visually match the design system. Use them in combination with your data fetching logic to drive which pages are shown and which buttons are active.

Example usage pattern (pseudo):

```tsx
<Pagination>
  <PaginationContent>
    <PaginationPrevious onClick={goToPrev} />
    {pages.map((p) => (
      <PaginationItem key={p}>
        <PaginationLink
          isActive={p === currentPage}
          onClick={() => goToPage(p)}
        >
          {p}
        </PaginationLink>
      </PaginationItem>
    ))}
    <PaginationNext onClick={goToNext} />
  </PaginationContent>
</Pagination>
```

### Infinite scroll & auto-scroll behavior

- Files: `src/components/chat/MessageList.tsx`
- What it does: The chat message list implements two related behaviors:
  1. Auto-scroll to bottom when new messages arrive if the user is already near the bottom (common chat UX). If the user scrolled up to read history, the view doesn't force-scroll.
  2. Skeleton loading state while initial messages are loading.

Implementation details:

- A container `div` is set with `overflow-y-auto` and a `ref` (`containerRef`).
- `bottomRef` is attached to an empty element at the end of the list — calling `bottomRef.current?.scrollIntoView({ behavior: 'smooth' })` scrolls to the bottom.
- `handleScroll` computes whether the user is near the bottom using `scrollHeight - scrollTop - clientHeight < 100` and toggles `shouldAutoScroll` accordingly. When `shouldAutoScroll` is true, incoming messages cause smooth scroll. When false, new messages do not interrupt the user’s reading.

Why this approach: It's simple, reliable, and works without external libraries. For server-driven infinite scroll (loading older messages when scrolled to top), you can combine an IntersectionObserver on a sentinel element at the top to call a loader that prepends messages and preserves scroll position.

### Form validation (phone + OTP)

- Files: `src/pages/Auth.tsx` and `src/components/ui/form.tsx`
- Libraries: `react-hook-form` + `zod` + `@hookform/resolvers/zod`

What it enforces:

- Phone form (`phoneSchema`) validates `countryCode` as required and `phone` as digits only with minimum and maximum length constraints.
- The `Form` / `FormField` primitives wrap `react-hook-form` control and display `FormMessage` / validation feedback.

Example (from `Auth.tsx`):

```ts
const phoneSchema = z.object({
  countryCode: z.string().min(1, "Please select a country code"),
  phone: z
    .string()
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(6)
    .max(15),
});

const form = useForm<PhoneFormValues>({
  resolver: zodResolver(phoneSchema),
  defaultValues: { countryCode: "+91", phone: "" },
});
```

The OTP verification is currently simulated with a 6-digit check on the client.

## Scripts

Key npm scripts (see `package.json`):

- `npm run dev` — Run Vite dev server
- `npm run build` — Build production assets

## Screenshots

<img width="1847" height="907" alt="image" src="https://github.com/user-attachments/assets/9e2c99e5-91d1-4ad0-a7a9-7caaf2aab476" />

<img width="1853" height="911" alt="image" src="https://github.com/user-attachments/assets/0535aa81-77b6-48c2-be96-eb4ed29ee9f9" />

<img width="1843" height="908" alt="image" src="https://github.com/user-attachments/assets/fa8be166-b11b-4418-b5a1-6a598b2afedb" />

<img width="1824" height="907" alt="image" src="https://github.com/user-attachments/assets/2f2da256-c0b4-4806-9648-7acc026d4630" />

<img width="1847" height="922" alt="image" src="https://github.com/user-attachments/assets/5e2b443f-38fe-40d3-b6b0-b5ed6924071c" />

<img width="1853" height="910" alt="image" src="https://github.com/user-attachments/assets/b6593c9c-a7e0-40ae-8692-c04a4ddeab94" />

<img width="1834" height="898" alt="image" src="https://github.com/user-attachments/assets/cdb23e86-750d-4789-86ca-dde4c5d4e10e" />

<img width="1837" height="911" alt="image" src="https://github.com/user-attachments/assets/a66e8d50-9c78-48a9-84bf-e42e8cd7cb50" />








