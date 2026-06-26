const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { requireRole } = require("../middleware/auth");

/* GET MARKS RECORDS */
router.get("/", (req, res) => {
  const params = [];
  let query = `SELECT m.id, m.student_id, s.name, s.roll_no, m.subject, m.score, m.max_score, m.semester, DATE_FORMAT(m.created_at, '%Y-%m-%d') AS recorded_at
               FROM marks m
               JOIN students s ON s.id = m.student_id`;

  if (req.user.role === "student") {
    query += " WHERE m.student_id = ?";
    params.push(req.user.studentId);
  } else if (req.query.studentId) {
    query += " WHERE m.student_id = ?";
    params.push(req.query.studentId);
  }

  query += " ORDER BY m.created_at DESC";

  db.query(query, params, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* ADD MARKS RECORD - teacher only */
router.post("/", requireRole(["teacher"]), (req, res) => {
  const { student_id, subject, score, max_score, semester } = req.body;

  db.query(
    "INSERT INTO marks (student_id, subject, score, max_score, semester) VALUES (?, ?, ?, ?, ?)",
    [student_id, subject, score, max_score, semester],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Marks Saved Successfully" });
    }
  );
});

/* DELETE MARKS RECORD - teacher only */
router.delete("/:id", requireRole(["teacher"]), (req, res) => {
  db.query("DELETE FROM marks WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Marks Record Deleted" });
  });
});

module.exports = router;
