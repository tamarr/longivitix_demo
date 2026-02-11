import { useState } from "react"
import RiskCard from "./RiskCard"
import "./App.css"

interface Risk {
  title: string
  explanation: string
  action: string
}

const MAX_CHARS = 2000

const DISCLAIMER =
  "This is an AI-generated assessment for informational purposes only. It is not medical advice. Always consult a qualified healthcare professional."

export default function App() {
  const [input, setInput] = useState("")
  const [risks, setRisks] = useState<Risk[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const canSubmit = input.trim().length > 0 && !loading

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.")
      }

      setRisks(data.risks)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setRisks(null)
    setError("")
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Nudge</h1>
        <p className="app__tagline">A smarter look at your health</p>
      </header>

      {renderBody()}

      <p className="disclaimer">{DISCLAIMER}</p>
    </div>
  )

  function renderBody() {
    if (loading) {
      return (
        <section className="results">
          <h2 className="results__heading">Analyzing your profile&hellip;</h2>
          <div className="results__cards">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        </section>
      )
    }

    if (risks) {
      return (
        <section className="results">
          <h2 className="results__heading">Your Top Health Risks</h2>
          <div className="results__cards">
            {risks.map((risk, i) => (
              <RiskCard key={risk.title} risk={risk} index={i} />
            ))}
          </div>
          <button className="results__reset" onClick={handleReset}>
            Assess Again
          </button>
        </section>
      )
    }

    return (
      <form className="form" onSubmit={handleSubmit}>
        <p className="form__instructions">
          Tell us about yourself and we'll identify your top 3 health risks.
        </p>
        <ul className="form__checklist">
          <li><Icon path="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-6 9v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /> Age & biological sex</li>
          <li><Icon path="M22 12h-4l-3 9L9 3l-3 9H2" /> Lifestyle (diet, exercise, smoking)</li>
          <li><Icon path="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M8 2h8v4H8z" /> Medical conditions</li>
          <li><Icon path="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm14 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /> Family history</li>
        </ul>
        <p className="form__hint">
          <Icon path="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7ZM14 2v4a2 2 0 0 0 2 2h4" />
          You can also paste from medical records or lab results.
        </p>

        <textarea
          className="form__textarea"
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
          placeholder={"e.g. \"I'm a 45-year-old male, I smoke, mostly sedentary, my dad had a heart attack at 55, BMI around 31\"\n\nOr paste from a medical record, lab report, or doctor's note."}
          rows={5}
          disabled={loading}
        />

        <div className="form__footer">
          <span className="form__char-count">
            {input.length}/{MAX_CHARS}
          </span>
          <button className="form__submit" type="submit" disabled={!canSubmit}>
            Assess Risks
          </button>
        </div>

        {error && <p className="form__error">{error}</p>}
      </form>
    )
  }
}

function Icon({ path }: { path: string }) {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  )
}
