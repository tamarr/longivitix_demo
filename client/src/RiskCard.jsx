import { useState } from "react"
import "./RiskCard.css"

export default function RiskCard({ risk, index }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`risk-card risk-card--${index}`}>
      <button
        className="risk-card__header"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <span className="risk-card__badge">{index + 1}</span>
        <span className="risk-card__title">{risk.title}</span>
        <span className={`risk-card__chevron ${expanded ? "risk-card__chevron--open" : ""}`} />
      </button>

      {expanded && (
        <div className="risk-card__body">
          <div className="risk-card__section">
            <h4 className="risk-card__label">Why this matters</h4>
            <p>{risk.explanation}</p>
          </div>
          <div className="risk-card__section">
            <h4 className="risk-card__label">What you can do</h4>
            <p>{risk.action}</p>
          </div>
        </div>
      )}
    </div>
  )
}
