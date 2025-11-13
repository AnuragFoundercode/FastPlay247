// require("dotenv").config();

// module.exports = {
//   jwtSecret: process.env.JWT_SECRET,
//   sessionSecret: process.env.SESSION_SECRET,
// };
 //const mysql = require("mysql2/promise");
// require("dotenv").config();

// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
  
// });

// module.exports = db;

const mysql = require("mysql2");
require("dotenv").config();

// ✅ Use mysql2 with Promise support
const db = mysql.createPool({
    host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Test connection on startup
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database Connection Failed:", err.message);
  } else {
    console.log("✅ MySQL Database Connected!");
    connection.release();
  }
});

module.exports = db;

