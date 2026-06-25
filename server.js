const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const studentRoutes = require("./routes/students");
const attendanceRoutes = require("./routes/attendance");
const marksRoutes = require("./routes/marks");
const reportRoutes = require("./routes/reports");

app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/reports", reportRoutes);

/* LOGIN ENDPOINT */
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    // Valid credentials
    const validUsername = "admin";
    const validPassword = "admin@123";

    if (username === validUsername && password === validPassword) {
        res.json({
            message: "Login successful",
            username: username
        });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

app.listen(3000, () => {
    console.log("Server Running on Port 3000");
});