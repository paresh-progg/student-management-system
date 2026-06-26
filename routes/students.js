const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { requireRole } = require("../middleware/auth");

/* GET ALL STUDENTS */
router.get("/", (req, res) => {
  if (req.user.role === "student") {
    db.query("SELECT * FROM students WHERE id = ?", [req.user.studentId], (err, result) => {
      if (err) return res.status(500).json(err);
      return res.json(result);
    });
    return;
  }

  db.query("SELECT * FROM students", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* ADD STUDENT - teacher only */
router.post("/", requireRole(["teacher"]), (req, res) => {
  const { roll_no, name, email, course, semester } = req.body;
  db.query(
    "INSERT INTO students (roll_no,name,email,course,semester) VALUES (?,?,?,?,?)",
    [roll_no, name, email, course, semester],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Student Added Successfully" });
    }
  );
});

/* DELETE STUDENT - teacher only */
router.delete("/:id", requireRole(["teacher"]), (req, res) => {
  db.query("DELETE FROM students WHERE id=?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Student Deleted" });
  });
});

/* UPDATE STUDENT - teacher only */
router.put("/:id", requireRole(["teacher"]), (req, res) => {
  const { roll_no, name, email, course, semester } = req.body;
  db.query(
    "UPDATE students SET roll_no=?, name=?, email=?, course=?, semester=? WHERE id=?",
    [roll_no, name, email, course, semester, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Student Updated Successfully" });
    }
  );
});

module.exports = router;
