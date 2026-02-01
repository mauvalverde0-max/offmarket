const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_local';

function createToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

async function register(email, password) {
  const hash = await bcrypt.hash(password, 10);
  const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
  const info = stmt.run(email, hash);
  return { id: info.lastInsertRowid, email };
}

async function login(email, password) {
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!row) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) throw new Error('Invalid credentials');
  return { token: createToken(row), user: { id: row.id, email: row.email } };
}

function middleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) { res.status(401).json({ error: 'Invalid token' }); }
}

module.exports = { register, login, middleware, createToken };
