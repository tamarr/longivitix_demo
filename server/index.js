import "dotenv/config"
import express from "express"
import cors from "cors"
import OpenAI from "openai"

const app = express()
app.use(cors(), express.json())

const openai = new OpenAI()

const RISK_SCHEMA = {
  name: "health_risks",
  strict: true,
  schema: {
    type: "object",
    properties: {
      risks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            explanation: { type: "string" },
            action: { type: "string" },
          },
          required: ["title", "explanation", "action"],
          additionalProperties: false,
        },
      },
    },
    required: ["risks"],
    additionalProperties: false,
  },
}

const SYSTEM_PROMPT = `You are a health risk assessment engine grounded in established medical research (Framingham Risk Score, WHO guidelines, AHA recommendations).

Given a person's health profile, return exactly 3 health risks ranked by urgency (highest first).

Rules:
- Reference the person's specific inputs in each explanation (age, habits, family history, etc.)
- Give concrete, specific action items — not generic advice
- If information is incomplete, note your assumptions and still provide 3 risks based on available data
- Keep explanations to 2-3 sentences and actions to 1-2 sentences
- Use plain language accessible to non-medical readers`

app.post("/api/predict", async (req, res) => {
  const { input } = req.body

  if (!input || typeof input !== "string" || !input.trim()) {
    return res.status(400).json({ error: "Please provide a health profile." })
  }

  if (input.length > 2000) {
    return res.status(400).json({ error: "Input must be 2000 characters or fewer." })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: input.trim() },
      ],
      response_format: {
        type: "json_schema",
        json_schema: RISK_SCHEMA,
      },
    })

    const message = completion.choices[0]?.message

    if (message?.refusal) {
      return res.status(422).json({ error: "The model declined to assess this input. Please rephrase." })
    }

    const parsed = JSON.parse(message.content)

    if (!Array.isArray(parsed.risks) || parsed.risks.length !== 3) {
      return res.status(502).json({ error: "Unexpected response format. Please try again." })
    }

    res.json(parsed)
  } catch (err) {
    console.error("OpenAI error:", err.message)

    if (err instanceof OpenAI.AuthenticationError) {
      return res.status(500).json({ error: "OpenAI API key is not configured correctly." })
    }
    if (err instanceof OpenAI.RateLimitError) {
      return res.status(429).json({ error: "Rate limit reached. Please wait a moment and try again." })
    }

    res.status(500).json({ error: "Failed to generate risk assessment. Please try again." })
  }
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || "Internal server error" })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
