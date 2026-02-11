import "dotenv/config"
import express from "express"
import cors from "cors"

const app = express()
app.use(cors(), express.json())

// Routes will be added here

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || "Internal server error" })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
