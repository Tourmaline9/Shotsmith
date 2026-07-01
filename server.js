import Database from 'better-sqlite3'
import cors from 'cors'
import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, 'data')
const dbPath = path.join(dataDir, 'shotsmith.db')
const port = Number(process.env.PORT ?? 4000)

fs.mkdirSync(dataDir, { recursive: true })

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS waitlist_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL COLLATE NOCASE,
    phone TEXT NOT NULL,
    focus TEXT NOT NULL,
    challenge TEXT NOT NULL,
    rituals TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(email),
    UNIQUE(phone)
  );

  CREATE TABLE IF NOT EXISTS questionnaire_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    result TEXT NOT NULL,
    gut_score INTEGER NOT NULL,
    skin_score INTEGER NOT NULL,
    match_score INTEGER NOT NULL,
    answers_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`)

const app = express()

app.use(cors({ origin: true }))
app.use(express.json({ limit: '1mb' }))

const normalizeText = (value) => String(value ?? '').trim()
const normalizeEmail = (value) => normalizeText(value).toLowerCase()
const normalizePhone = (value) => normalizeText(value).replace(/[^\d+]/g, '')

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
const isPhone = (value) => /^\+?\d{7,15}$/.test(value)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, database: dbPath })
})

app.post('/api/waitlist', (req, res) => {
  const name = normalizeText(req.body.name)
  const email = normalizeEmail(req.body.email)
  const phone = normalizePhone(req.body.phone)
  const focus = normalizeText(req.body.focus)
  const challenge = normalizeText(req.body.challenge)
  const rituals = normalizeText(req.body.rituals)

  if (!name || !email || !phone || !focus || !challenge) {
    return res.status(400).json({ message: 'Please fill name, email, phone, focus, and challenge.' })
  }

  if (!isEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' })
  }

  if (!isPhone(phone)) {
    return res.status(400).json({ message: 'Please enter a valid phone number.' })
  }

  try {
    const result = db
      .prepare(
        `INSERT INTO waitlist_submissions
          (name, email, phone, focus, challenge, rituals)
        VALUES
          (@name, @email, @phone, @focus, @challenge, @rituals)`,
      )
      .run({ name, email, phone, focus, challenge, rituals })

    return res.status(201).json({ id: result.lastInsertRowid, message: 'You are on the list.' })
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      const existing = db
        .prepare(
          `SELECT email = @email AS emailExists, phone = @phone AS phoneExists
          FROM waitlist_submissions
          WHERE email = @email OR phone = @phone
          LIMIT 1`,
        )
        .get({ email, phone })

      if (existing?.emailExists) {
        return res.status(409).json({ field: 'email', message: 'This email is already registered.' })
      }

      return res.status(409).json({ field: 'phone', message: 'This phone number is already registered.' })
    }

    console.error(error)
    return res.status(500).json({ message: 'Something went wrong while saving your details.' })
  }
})

app.post('/api/questionnaires', (req, res) => {
  const result = normalizeText(req.body.result)
  const gutScore = Number(req.body.gutScore)
  const skinScore = Number(req.body.skinScore)
  const matchScore = Number(req.body.matchScore)
  const answers = Array.isArray(req.body.answers) ? req.body.answers : []

  if (!['GUT', 'SKIN', 'BOTH'].includes(result) || !Number.isFinite(gutScore) || !Number.isFinite(skinScore)) {
    return res.status(400).json({ message: 'Invalid questionnaire result.' })
  }

  const saved = db
    .prepare(
      `INSERT INTO questionnaire_results
        (result, gut_score, skin_score, match_score, answers_json)
      VALUES
        (@result, @gutScore, @skinScore, @matchScore, @answersJson)`,
    )
    .run({
      result,
      gutScore,
      skinScore,
      matchScore: Number.isFinite(matchScore) ? matchScore : 0,
      answersJson: JSON.stringify(answers),
    })

  res.status(201).json({ id: saved.lastInsertRowid, message: 'Questionnaire saved.' })
})

app.listen(port, () => {
  console.log(`Shotsmith API running at http://localhost:${port}`)
  console.log(`SQLite database: ${dbPath}`)
})
