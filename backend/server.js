const express = require('express')
const cors = require('cors')
const multer = require('multer')
const fs = require('fs').promises
const path = require('path')
const { MongoClient } = require('mongodb')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const DATA_DIR = path.join(__dirname, 'data')
const UPLOADS_DIR = path.join(__dirname, 'uploads')

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.mkdir(UPLOADS_DIR, { recursive: true })
}

// Optional MongoDB client - if MONGODB_URI is provided, use DB collections
const MONGODB_URI = process.env.MONGODB_URI || null
let dbClient = null
let db = null
async function initDb() {
  if (!MONGODB_URI) return
  dbClient = new MongoClient(MONGODB_URI)
  await dbClient.connect()
  db = dbClient.db()
  console.log('Connected to MongoDB')
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const basename = path
      .basename(file.originalname, ext)
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
    cb(null, `${Date.now()}_${basename}${ext}`)
  },
})
const upload = multer({ storage })

async function readJSON(name) {
  if (db) {
    const col = db.collection(name)
    return await col.find().sort({ _id: -1 }).toArray()
  }
  const file = path.join(DATA_DIR, `${name}.json`)
  try {
    const txt = await fs.readFile(file, 'utf8')
    return JSON.parse(txt || '[]')
  } catch (err) {
    if (err.code === 'ENOENT') return []
    throw err
  }
}

async function writeJSON(name, data) {
  if (db) {
    // when using MongoDB we perform operations per-endpoint
    return
  }
  const file = path.join(DATA_DIR, `${name}.json`)
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8')
}

// Projects
app.get('/projects', async (req, res) => {
  const projects = await readJSON('projects')
  res.json(
    projects.map((p) => ({
      id: p._id ? p._id.toString() : p.id,
      name: p.name,
      description: p.description,
      image: p.image,
    })),
  )
})

app.post('/projects', upload.single('image'), async (req, res) => {
  const { name, description } = req.body
  const image = req.file ? `/uploads/${req.file.filename}` : null
  if (db) {
    const col = db.collection('projects')
    const r = await col.insertOne({ name, description, image, createdAt: new Date() })
    return res.json({ id: r.insertedId.toString(), name, description, image })
  }
  const projects = await readJSON('projects')
  const project = { id: Date.now().toString(), name, description, image }
  projects.unshift(project)
  await writeJSON('projects', projects)
  res.json(project)
})

// Clients
app.get('/clients', async (req, res) => {
  const clients = await readJSON('clients')
  res.json(
    clients.map((c) => ({
      id: c._id ? c._id.toString() : c.id,
      name: c.name,
      designation: c.designation,
      description: c.description,
      image: c.image,
    })),
  )
})

app.post('/clients', upload.single('image'), async (req, res) => {
  const { name, designation, description } = req.body
  const image = req.file ? `/uploads/${req.file.filename}` : null
  if (db) {
    const col = db.collection('clients')
    const r = await col.insertOne({ name, designation, description, image, createdAt: new Date() })
    return res.json({ id: r.insertedId.toString(), name, designation, description, image })
  }
  const clients = await readJSON('clients')
  const client = {
    id: Date.now().toString(),
    name,
    designation,
    description,
    image,
  }
  clients.unshift(client)
  await writeJSON('clients', clients)
  res.json(client)
})

// Contact form
app.post('/contacts', async (req, res) => {
  const { fullName, email, mobile, city } = req.body
  const contact = { fullName, email, mobile, city, createdAt: new Date() }
  if (db) {
    const col = db.collection('contacts')
    const r = await col.insertOne(contact)
    return res.json({ id: r.insertedId.toString(), ...contact })
  }
  const contacts = await readJSON('contacts')
  const c = { id: Date.now().toString(), ...contact }
  contacts.unshift(c)
  await writeJSON('contacts', contacts)
  res.json(c)
})

app.get('/contacts', async (req, res) => {
  const contacts = await readJSON('contacts')
  res.json(
    contacts.map((c) => ({
      id: c._id ? c._id.toString() : c.id,
      fullName: c.fullName,
      email: c.email,
      mobile: c.mobile,
      city: c.city,
      createdAt: c.createdAt,
    })),
  )
})

// Subscribers
app.post('/subscribe', async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email required' })
  if (db) {
    const col = db.collection('subscribers')
    const existing = await col.findOne({ email })
    if (existing) return res.status(409).json({ error: 'Already subscribed' })
    const r = await col.insertOne({ email, createdAt: new Date() })
    return res.json({ id: r.insertedId.toString(), email })
  }
  const subscribers = await readJSON('subscribers')
  if (subscribers.find((s) => s.email === email))
    return res.status(409).json({ error: 'Already subscribed' })
  const sub = { id: Date.now().toString(), email, createdAt: new Date().toISOString() }
  subscribers.unshift(sub)
  await writeJSON('subscribers', subscribers)
  res.json(sub)
})

app.get('/subscribers', async (req, res) => {
  const subscribers = await readJSON('subscribers')
  res.json(
    subscribers.map((s) => ({ id: s._id ? s._id.toString() : s.id, email: s.email, createdAt: s.createdAt })),
  )
})

;(async () => {
  await ensureDirs()
  await initDb()
  app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`))
})()
