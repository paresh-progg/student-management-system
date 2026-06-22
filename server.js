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

app.listen(3000, () => {
    console.log("Server Running on Port 3000");
});