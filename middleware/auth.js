const crypto = require("crypto");

const users = [
  { id: 1, username: "teacher1", password: "teacher@123", role: "teacher" },
  { id: 2, username: "student1", password: "student@123", role: "student", studentId: 1 },
  { id: 3, username: "student2", password: "student@123", role: "student", studentId: 2 }
];

const sessions = {}; // sessionId -> { id, username, role, studentId }

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

module.exports = { users, sessions, createSession, authenticateSession, requireRole };