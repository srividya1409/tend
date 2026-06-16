const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET = "secret123";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tend",
});

db.connect((err) => {
  if (err) {
    console.log("DB CONNECTION ERROR:", err);
  } else {
    console.log("MySQL Connected");
  }
});

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};


app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Username already exists" });
          }
          return res.status(500).json({ message: "Server error" });
        }

        res.json({ message: "User created successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});


app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "DB error" });
      }

      if (result.length === 0) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const user = result[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id }, SECRET);

      res.json({ token });
    }
  );
});


app.get("/tasks", auth, (req, res) => {
  db.query(
    "SELECT * FROM tasks WHERE user_id = ? ORDER BY id DESC",
    [req.user.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "DB error" });
      }

      res.json(result);
    }
  );
});


app.post("/tasks", auth, (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title required" });
  }

  db.query(
    "INSERT INTO tasks (title, user_id) VALUES (?, ?)",
    [title, req.user.id],
    (err) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({ message: "DB error" });
      }

      res.json({ message: "Task added successfully" });
    }
  );
});


app.put("/tasks/:id", auth, (req, res) => {
  const { title, completed } = req.body;

  db.query(
    "UPDATE tasks SET title = ?, completed = ? WHERE id = ? AND user_id = ?",
    [title, completed, req.params.id, req.user.id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "DB error" });
      }

      res.json({ message: "Task updated" });
    }
  );
});


app.delete("/tasks/:id", auth, (req, res) => {
  db.query(
    "DELETE FROM tasks WHERE id = ? AND user_id = ?",
    [req.params.id, req.user.id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "DB error" });
      }

      res.json({ message: "Task deleted" });
    }
  );
});


app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});