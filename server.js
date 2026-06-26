const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { createSession, authenticateSession, users, sessions } = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const studentRoutes = require("./routes/students");
const attendanceRoutes = require("./routes/attendance");
const marksRoutes = require("./routes/marks");
const reportRoutes = require("./routes/reports");

// Protected route mounting: authenticate first
app.use("/api/students", authenticateSession, studentRoutes);
app.use("/api/attendance", authenticateSession, attendanceRoutes);
app.use("/api/marks", authenticateSession, marksRoutes);
app.use("/api/reports", authenticateSession, reportRoutes);

// Login - returns sessionId, role, studentId
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required" });
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid username or password" });
  const sessionId = createSession(user);
  res.json({ message: "Login successful", username: user.username, role: user.role, studentId: user.studentId || null, sessionId });
});

// Logout
app.post("/api/logout", authenticateSession, (req, res) => {
  delete sessions[req.sessionId];
  res.json({ message: "Logout successful" });
});

// Current user
app.get("/api/me", authenticateSession, (req, res) => {
  res.json({ user: req.user });
});

app.listen(3000, () => console.log("Server Running on Port 3000"));