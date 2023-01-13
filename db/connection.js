const mysql = require("mysql2");

require('dotenv').config()

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // Your MySQL username
    user: "",
    // Your MySQL password
    password: "",
    database: ""
  },
  console.log("Employee Tracker connected!")
);

module.exports = db;