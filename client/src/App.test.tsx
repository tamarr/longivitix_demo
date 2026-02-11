import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import App from "./App"

describe("App", () => {
  it("disables submit button when textarea is empty", () => {
    render(<App />)
    expect(screen.getByRole("button", { name: /assess risks/i })).toBeDisabled()
  })

  it("enables submit button when textarea has input", () => {
    render(<App />)
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "30 year old female" } })
    expect(screen.getByRole("button", { name: /assess risks/i })).toBeEnabled()
  })

  it("renders all checklist items", () => {
    render(<App />)
    expect(screen.getByText(/biological sex/i)).toBeInTheDocument()
    expect(screen.getByText(/lifestyle/i)).toBeInTheDocument()
    expect(screen.getByText(/medical conditions/i)).toBeInTheDocument()
    expect(screen.getByText(/family history/i)).toBeInTheDocument()
  })
})
