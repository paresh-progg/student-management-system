const express = require("express");
const router = express.Router();
const db = require("../database/db");

/* GET ALL STUDENTS */
router.get("/", (req, res) => {

    db.query(
        "SELECT * FROM students",
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );

});

/* ADD STUDENT */
router.post("/", (req, res) => {

    const {
        roll_no,
        name,
        email,
        course,
        semester
    } = req.body;

    db.query(
        "INSERT INTO students (roll_no,name,email,course,semester) VALUES (?,?,?,?,?)",
        [roll_no,name,email,course,semester],
        (err,result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:"Student Added Successfully"
            });
        }
    );

});
router.delete("/:id", (req, res) => {

    db.query(
        "DELETE FROM students WHERE id=?",
        [req.params.id],
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:"Student Deleted"
            });

        }
    );

});
router.put("/:id", (req, res) => {

    const {
        roll_no,
        name,
        email,
        course,
        semester
    } = req.body;

    db.query(
        "UPDATE students SET roll_no=?, name=?, email=?, course=?, semester=? WHERE id=?",
        [
            roll_no,
            name,
            email,
            course,
            semester,
            req.params.id
        ],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message: "Student Updated Successfully"
            });

        }
    );

});

module.exports = router;