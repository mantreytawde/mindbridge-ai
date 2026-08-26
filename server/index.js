import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import 'dotenv/config'
import express from 'express'
import { chatHandler } from './chatHandler.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = 3001
const distPath = path.join(__dirname, '..', 'dist')

const app = express()
app.use(express.json({ limit: '1mb' }))

app.post('/api/chat', chatHandler)

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`MindBridge API listening on http://localhost:${PORT}`)
})
