const express = require("express");
const router = express.Router();
const db = require("../database/db");

/* GET ATTENDANCE RECORDS */
router.get("/", (req, res) => {
    const studentId = req.query.studentId;
    let query = `SELECT a.id, a.student_id, s.name, s.roll_no, DATE_FORMAT(a.attendance_date, '%Y-%m-%d') AS date, a.status
                 FROM attendance a
                 JOIN students s ON s.id = a.student_id`;
    const params = [];

    if (studentId) {
        query += " WHERE a.student_id = ?";
        params.push(studentId);
    }

    query += " ORDER BY a.attendance_date DESC";

    db.query(query, params, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});

/* ADD ATTENDANCE RECORD */
router.post("/", (req, res) => {
    const { student_id, attendance_date, status } = req.body;

    db.query(
        "INSERT INTO attendance (student_id, attendance_date, status) VALUES (?, ?, ?)",
        [student_id, attendance_date, status],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Attendance Recorded Successfully"
            });
        }
    );
});

/* DELETE ATTENDANCE RECORD */
router.delete("/:id", (req, res) => {
    db.query(
        "DELETE FROM attendance WHERE id = ?",
        [req.params.id],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Attendance Record Deleted"
            });
        }
    );
});

module.exports = router;
