import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { createClient } from '@supabase/supabase-js'

const port = Number(process.env.PORT ?? 4000)
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null

const app = express()

app.use(cors({ origin: true }))
app.use(express.json({ limit: '1mb' }))

const normalizeText = (value) => String(value ?? '').trim()
const normalizeEmail = (value) => normalizeText(value).toLowerCase()
const normalizePhone = (value) => normalizeText(value).replace(/[^\d+]/g, '')

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
const isPhone = (value) => /^\+?\d{7,15}$/.test(value)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, provider: supabase ? 'supabase' : 'not-configured' })
})

app.post('/api/waitlist', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({
      message: 'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
    })
  }

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

  const [{ data: emailMatch }, { data: phoneMatch }] = await Promise.all([
    supabase.from('waitlist_submissions').select('id').eq('email', email).maybeSingle(),
    supabase.from('waitlist_submissions').select('id').eq('phone', phone).maybeSingle(),
  ])

  if (emailMatch) {
    return res.status(409).json({ field: 'email', message: 'This email is already registered.' })
  }

  if (phoneMatch) {
    return res.status(409).json({ field: 'phone', message: 'This phone number is already registered.' })
  }

  const { data, error } = await supabase
    .from('waitlist_submissions')
    .insert([{ name, email, phone, focus, challenge, rituals }])
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'This email or phone number is already registered.' })
    }

    console.error(error)
    return res.status(500).json({ message: 'Something went wrong while saving your details.' })
  }

  return res.status(201).json({ id: data.id, message: 'You are on the list.' })
})

app.post('/api/questionnaires', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({
      message: 'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
    })
  }

  const result = normalizeText(req.body.result)
  const gutScore = Number(req.body.gutScore)
  const skinScore = Number(req.body.skinScore)
  const matchScore = Number(req.body.matchScore)
  const answers = Array.isArray(req.body.answers) ? req.body.answers : []

  if (!['GUT', 'SKIN', 'BOTH'].includes(result) || !Number.isFinite(gutScore) || !Number.isFinite(skinScore)) {
    return res.status(400).json({ message: 'Invalid questionnaire result.' })
  }

  const { data, error } = await supabase
    .from('questionnaire_results')
    .insert([
      {
        result,
        gut_score: gutScore,
        skin_score: skinScore,
        match_score: Number.isFinite(matchScore) ? matchScore : 0,
        answers_json: answers,
      },
    ])
    .select('id')
    .single()

  if (error) {
    console.error(error)
    return res.status(500).json({ message: 'Something went wrong while saving the questionnaire.' })
  }

  res.status(201).json({ id: data.id, message: 'Questionnaire saved.' })
})

app.listen(port, () => {
  console.log(`Shotsmith API running at http://localhost:${port}`)
  console.log(`Supabase configured: ${Boolean(supabase)}`)
})
