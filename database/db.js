const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pareshsahoo@099",
    database: "sms"
});

db.connect((err) => {
    if (err) {
        console.error("Database Connection Failed:", err);
        return;
    }

    console.log("MySQL Connected");
});

module.exports = db;