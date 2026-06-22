const express = require("express");
const router = express.Router();
const db = require("../database/db");

/* GET SUMMARY REPORT */
router.get("/summary", (req, res) => {
    const query = `SELECT
        (SELECT COUNT(*) FROM students) AS totalStudents,
        (SELECT COUNT(DISTINCT course) FROM students) AS totalCourses,
        (SELECT COUNT(*) FROM attendance) AS totalAttendance,
        (SELECT COUNT(*) FROM marks) AS totalMarks,
        (SELECT ROUND(COALESCE(AVG(CASE WHEN status = 'Present' THEN 1 ELSE 0 END), 0) * 100, 2) FROM attendance) AS attendanceRate,
        (SELECT ROUND(COALESCE(AVG(score / NULLIF(max_score, 0)), 0) * 100, 2) FROM marks) AS averageScore`;

    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(result[0]);
    });
});

/* GET STUDENT REPORT */
router.get("/student/:id", (req, res) => {
    const studentId = req.params.id;
    const report = {
        student: null,
        attendance: [],
        marks: []
    };

    db.query(
        "SELECT id, roll_no, name, email, course, semester FROM students WHERE id = ?",
        [studentId],
        (err, studentResult) => {
            if (err) {
                return res.status(500).json(err);
            }

            if (!studentResult.length) {
                return res.status(404).json({ message: "Student not found" });
            }

            report.student = studentResult[0];

            db.query(
                "SELECT DATE_FORMAT(attendance_date, '%Y-%m-%d') AS date, status FROM attendance WHERE student_id = ? ORDER BY attendance_date DESC",
                [studentId],
                (err, attendanceResult) => {
                    if (err) {
                        return res.status(500).json(err);
                    }

                    report.attendance = attendanceResult;

                    db.query(
                        "SELECT subject, score, max_score, semester, DATE_FORMAT(created_at, '%Y-%m-%d') AS recorded_at FROM marks WHERE student_id = ? ORDER BY created_at DESC",
                        [studentId],
                        (err, marksResult) => {
                            if (err) {
                                return res.status(500).json(err);
                            }

                            report.marks = marksResult;
                            res.json(report);
                        }
                    );
                }
            );
        }
    );
});

module.exports = router;
