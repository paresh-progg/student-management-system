require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

// Import database and auth
const db = require("./database/db");
const { createSession, authenticateSession, sessions, findUserByUsername, createUser, hashPassword } = require("./middleware/auth");

const app = express();

// ============ MIDDLEWARE ============
app.use(cors());
app.use(bodyParser.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ============ TEST ROUTES (for debugging) ============
app.get("/", (req, res) => {
    res.send("SERVER IS WORKING");
});

app.get("/api/test", (req, res) => {
    console.log("API TEST HIT");
    res.send("API TEST OK");
});

app.get("/api/db-test", async (req, res) => {
    try {
        const [result] = await db.promise().query("SELECT 1 as test");
        res.json({ 
            message: "✅ Database connected!", 
            test: result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Database test error:", error);
        res.status(500).json({ 
            message: "❌ Database connection failed", 
            error: error.message 
        });
    }
});

// ============ STATIC FILES ============
// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// ============ ROUTE IMPORTS ============
const studentRoutes = require("./routes/students");
const attendanceRoutes = require("./routes/attendance");
const marksRoutes = require("./routes/marks");
const reportRoutes = require("./routes/reports");

// ============ API ROUTES ============

// Protected routes
app.use("/api/students", authenticateSession, studentRoutes);
app.use("/api/attendance", authenticateSession, attendanceRoutes);
app.use("/api/marks", authenticateSession, marksRoutes);
app.use("/api/reports", authenticateSession, reportRoutes);

// Registration
app.post("/api/register", async (req, res) => {
    try {
        const { username, password, role, studentId } = req.body;
        if (!username || !password || !role) {
            return res.status(400).json({ message: "Username, password, and role required" });
        }

        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const newUser = await createUser({ 
            username, 
            password, 
            role, 
            studentId: role === "student" ? studentId : null 
        });
        
        res.json({ 
            message: "Registration successful", 
            username: newUser.username, 
            role: newUser.role 
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Registration failed: " + error.message });
    }
});

// Login
app.post("/api/login", async (req, res) => {
    try {
        console.log("📩 Login attempt for:", req.body.username);
        
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password required" });
        }

        const user = await findUserByUsername(username);
        if (!user) {
            console.log("❌ User not found:", username);
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const hashedInput = hashPassword(password);
        if (user.password !== hashedInput) {
            console.log("❌ Invalid password for:", username);
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const sessionId = createSession(user);
        console.log("✅ Login successful for:", username);
        
        res.json({ 
            message: "Login successful", 
            username: user.username, 
            role: user.role, 
            studentId: user.studentId || null, 
            sessionId 
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed: " + error.message });
    }
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

// ============ ERROR HANDLING ============
// Catch-all for undefined routes
app.use((req, res) => {
    console.log("❌ Route not found:", req.method, req.url);
    res.status(404).json({ 
        message: "Route not found", 
        url: req.url,
        method: req.method
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("❌ Server error:", err);
    res.status(500).json({ 
        message: "Internal server error", 
        error: err.message 
    });
});

// ============ START SERVER ============
const PORT = 3000;
app.listen(PORT, async () => {
    console.log(`🚀 Server Running on Port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`📄 Login page: http://localhost:${PORT}/login.html`);
    console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
    
    // Create test user if none exists
  
  


});
