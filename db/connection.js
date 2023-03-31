const mysql = require("mysql2");

require('dotenv').config()

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // Your MySQL username
    user: "root",
    // Your MySQL password
    password: "Trongredwood02",
    database: "company"
  },
  console.log("Employee Tracker connected!")
);

module.exports = db;