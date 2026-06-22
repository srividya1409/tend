const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "secretkey";

// DB CONNECTION
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tend",
});

db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err);
  } else {
    console.log("MySQL Connected");
  }
});

// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });

      if (!result || result.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: result[0].id }, SECRET);
      res.json({ token });
    }
  );
});

// SIGNUP
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "INSERT INTO users (username, password) VALUES (?,?)",
    [username, password],
    (err) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json({ message: "User created" });
    }
  );
});

// AUTH
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// GET TASKS
app.get("/tasks", auth, (req, res) => {
  db.query(
    "SELECT * FROM tasks WHERE user_id=?",
    [req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json(result);
    }
  );
});

// ADD TASK
app.post("/tasks", auth, (req, res) => {
  const { title, category, due_date, priority } = req.body;

  db.query(
    "INSERT INTO tasks (title, category, due_date, priority, user_id) VALUES (?,?,?,?,?)",
    [
      title,
      category || "General",
      due_date || null,
      priority || "Medium",
      req.user.id,
    ],
    (err) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json({ message: "Added" });
    }
  );
});

// UPDATE TASK (FIXED + PINNED)
app.put("/tasks/:id", auth, (req, res) => {
  const { title, completed, category, priority, pinned } = req.body;

  db.query(
    "UPDATE tasks SET title=?, completed=?, category=?, priority=?, pinned=? WHERE id=?",
    [
      title,
      completed,
      category || "General",
      priority || "Medium",
      pinned || false,
      req.params.id,
    ],
    (err) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json({ message: "Updated" });
    }
  );
});

// DELETE TASK
app.delete("/tasks/:id", auth, (req, res) => {
  db.query(
    "DELETE FROM tasks WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json({ message: "Deleted" });
    }
  );
});

app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);