const crypto = require("crypto");
const db = require("../database/db");

const sessions = {}; // sessionId -> { id, username, role, studentId }

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function findUserByUsername(username) {
  const [rows] = await db.promise().query("SELECT * FROM users WHERE username = ?", [username]);
  if (!rows || rows.length === 0) return null;
  const user = rows[0];
  return {
    id: user.id,
    username: user.username,
    password: user.password,
    role: user.role,
    studentId: user.student_id || null
  };
}

async function createUser({ username, password, role, studentId }) {
  const hashedPassword = hashPassword(password);
  const [result] = await db.promise().query(
    "INSERT INTO users (username, password, role, student_id) VALUES (?, ?, ?, ?)",
    [username, hashedPassword, role, studentId || null]
  );
  return {
    id: result.insertId,
    username,
    role,
    studentId: studentId || null
  };
}

function createSession(user) {
  const sessionId = crypto.randomUUID();
  sessions[sessionId] = {
    id: user.id,
    username: user.username,
    role: user.role,
    studentId: user.studentId || null
  };
  return sessionId;
}

function authenticateSession(req, res, next) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return res.status(401).json({ message: "Authorization required" });
  const sessionId = authHeader.slice(7);
  const user = sessions[sessionId];
  if (!user) return res.status(401).json({ message: "Invalid session" });
  req.user = user;
  req.sessionId = sessionId;
  next();
}

function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}

module.exports = { sessions, createSession, authenticateSession, requireRole, findUserByUsername, createUser, hashPassword };