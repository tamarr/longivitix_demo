import { describe, it, expect } from "vitest"
import request from "supertest"

process.env.OPENAI_API_KEY = "test-key"
const { default: app } = await import("./app.js")

describe("POST /api/predict", () => {
  it("returns 400 when input is empty", async () => {
    const res = await request(app).post("/api/predict").send({ input: "" })
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/health profile/i)
  })

  it("returns 400 when input is missing", async () => {
    const res = await request(app).post("/api/predict").send({})
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/health profile/i)
  })

  it("returns 400 when input exceeds 2000 characters", async () => {
    const res = await request(app).post("/api/predict").send({ input: "a".repeat(2001) })
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/2000/)
  })
})
