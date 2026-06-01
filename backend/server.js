const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "login_app"
});

db.connect((err) => {
  if (err) {
    console.log("DB error");
  } else {
    console.log("MySQL Connected");
  }
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  const checkSql = "SELECT * FROM users WHERE username=?";

  db.query(checkSql, [username], (err, result) => {
    if (err) {
      return res.send({ success: false, message: "Error" });
    }

    if (result.length > 0) {
      return res.send({ success: false, message: "User already exists" });
    }

    const insertSql = "INSERT INTO users (username, password) VALUES (?, ?)";

    db.query(insertSql, [username, password], (err) => {
      if (err) {
        return res.send({ success: false, message: "Error" });
      }

      res.send({ success: true, message: "Account created" });
    });
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username=? AND password=?";

  db.query(sql, [username, password], (err, result) => {
    if (err) {
      return res.send({ success: false, message: "Error" });
    }

    if (result.length > 0) {
      const token = jwt.sign(
        { username: username },
        "secretkey",
        { expiresIn: "1h" }
      );

      res.send({
        success: true,
        message: "Login successful",
        token: token
      });
    } else {
      res.send({ success: false, message: "Invalid credentials" });
    }
  });
});

app.get("/profile", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.send("No token provided");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err) {
      return res.send("Invalid token");
    }

    res.send("Welcome " + decoded.username);
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});