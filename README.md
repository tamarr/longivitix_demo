# Nudge

AI-powered health risk prediction demo — TypeScript, React, Express, OpenAI.

## How It Works

1. You describe your health profile (age, biological sex, lifestyle, medical history) or paste from medical records
2. Server sends the description to OpenAI (`gpt-4o-mini`) with a medical risk assessment prompt
3. OpenAI returns exactly 3 risks ranked by urgency using structured outputs (JSON Schema)
4. Client displays the risks as expandable cards color-coded by severity

## Setup

```bash
# Server
cd server
cp .env.example .env   # add your OPENAI_API_KEY
npm install
npm run dev

# Client (separate terminal)
cd client
npm install
npm run dev
```

Client runs on `http://localhost:5173`, server on `http://localhost:3001`.

## Tests

```bash
# Client (Vitest + Testing Library)
cd client && npm test

# Server (Vitest + Supertest)
cd server && npm test
```

## Deploy (Render)

The app is configured for single-service deployment — Express serves the built React client in production.

1. Create a **Web Service** on Render and connect your repo
2. Set the `OPENAI_API_KEY` environment variable in the Render dashboard
3. Render picks up the `render.yaml` blueprint automatically:
   - **Build**: `npm run render-build` (installs deps + builds client)
   - **Start**: `npm run start` (runs Express serving both API and static files)

Or deploy manually:

```bash
npm run render-build   # install all deps + build client
npm run start          # start Express on port 3001
```

## Architecture

```
client/                 React + Vite + TypeScript (port 5173)
  src/
    App.tsx             Main UI — form, loading skeleton, results, error states
    App.test.tsx        Component tests (submit state, checklist rendering)
    RiskCard.tsx        Expandable risk card component
    index.css           CSS custom properties (dark/light mode)
    App.css             Layout, component styles, skeleton animation
    RiskCard.css        Card-specific styles

server/                 Express (port 3001)
  app.js                Express app — API route, error handler, static serving
  app.test.js           API validation tests (empty input, missing input, length)
  index.js              Entry point — env validation, starts server

render.yaml             Render deploy blueprint
package.json            Root scripts for build + deploy
```

The Vite dev server proxies `/api` requests to the Express server, so no hardcoded URLs or CORS issues in development. In production, Express serves the built client from `client/dist/`.

## Design Decisions

- **Structured Outputs**: Uses OpenAI's JSON Schema response format (`strict: true`) instead of hoping the model returns valid JSON. This guarantees the response shape at the API level.
- **Single endpoint**: One `POST /api/predict` route keeps the API surface minimal. The structured output schema enforces exactly 3 risks with title/explanation/action.
- **TypeScript**: Typed props, state, and API responses for safer refactoring and editor support.
- **CSS custom properties**: Dark mode by default with automatic light mode via `prefers-color-scheme`. No CSS-in-JS library needed.
- **BEM naming**: CSS classes follow Block-Element-Modifier convention for predictable scoping without a CSS framework.
- **No component library**: Plain React + CSS keeps the bundle small and demonstrates UI fundamentals.
- **Single-service deploy**: Express serves the client build in production, avoiding CORS and simplifying infrastructure to one Render service.

## Shortcuts & Known Limitations

- **No database** — results are not persisted
- **No authentication** — open access to the API
- **No rate limiting** — relies on OpenAI's own rate limits
- **No streaming** — waits for the full response (structured outputs require it)
- **No input sanitization beyond length** — would add more validation for production
- **Medical grounding** — the system prompt references Framingham/WHO/AHA frameworks, but this is an AI demo, not a clinical tool. Real medical risk assessment requires validated instruments and clinical oversight.
