import "dotenv/config"

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY — add it to server/.env")
  process.exit(1)
}

const { default: app } = await import("./app.js")

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
