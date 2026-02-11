# Nudge

AI-powered health risk prediction demo — React + Express + OpenAI.

## How It Works

1. You describe your health profile (age, sex, lifestyle, medical history)
2. Server sends the description to OpenAI (`gpt-4o-mini`) with a medical risk assessment prompt
3. OpenAI returns exactly 3 risks ranked by urgency using structured outputs (JSON Schema)
4. Client displays the risks as expandable cards color-coded by severity (red / amber / blue)

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

## Architecture

```
client/                 React + Vite (port 5173)
  src/
    App.jsx             Main UI — form, loading, results, error states
    RiskCard.jsx        Expandable risk card component
    index.css           CSS custom properties (dark/light mode)
    App.css             Layout and component styles
    RiskCard.css        Card-specific styles

server/                 Express (port 3001)
  index.js              /api/predict endpoint + OpenAI integration
```

The Vite dev server proxies `/api` requests to the Express server, so no hardcoded URLs or CORS issues in development.

## Design Decisions

- **Structured Outputs**: Uses OpenAI's JSON Schema response format (`strict: true`) instead of hoping the model returns valid JSON. This guarantees the response shape at the API level.
- **Single endpoint**: One `POST /api/predict` route keeps the API surface minimal. The structured output schema enforces exactly 3 risks with title/explanation/action.
- **CSS custom properties**: Dark mode by default with automatic light mode via `prefers-color-scheme`. No CSS-in-JS library needed.
- **BEM naming**: CSS classes follow Block-Element-Modifier convention for predictable scoping without a CSS framework.
- **No component library**: Plain React + CSS keeps the bundle small and demonstrates UI fundamentals.

## Shortcuts & Known Limitations

- **No database** — results are not persisted
- **No authentication** — open access to the API
- **No rate limiting** — relies on OpenAI's own rate limits
- **No streaming** — waits for the full response (structured outputs require it)
- **No tests** — would add Jest + React Testing Library for production
- **No input sanitization beyond length** — would add more validation for production
- **Medical grounding** — the system prompt references Framingham/WHO/AHA frameworks, but this is an AI demo, not a clinical tool. Real medical risk assessment requires validated instruments and clinical oversight.
