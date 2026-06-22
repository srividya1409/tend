import { useEffect, useState } from "react";
import TaskTable from "../components/TaskTable";
import { SearchIcon } from "../components/Icons";

function Dashboard({ setToken }) {
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (Array.isArray(data)) setTasks(data);
    else setTasks([]);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;

    await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        category,
        due_date: dueDate,
        priority,
      }),
    });

    setTitle("");
    setCategory("General");
    setDueDate("");
    setPriority("Medium");
    fetchTasks();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (!token) {
    return <div className="login-gate">Please login first</div>;
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (b.pinned !== a.pinned) return b.pinned - a.pinned;
    if (a.due_date && b.due_date) {
      return new Date(a.due_date) - new Date(b.due_date);
    }
    return 0;
  });

  const filtered = sortedTasks
    .filter((t) => t && t.title)
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    .filter((t) =>
      filter === "all" ? true : filter === "done" ? t.completed : !t.completed
    )
    .filter((t) =>
      categoryFilter === "all" ? true : t.category === categoryFilter
    )
    .filter((t) =>
      priorityFilter === "all" ? true : t.priority === priorityFilter
    );

  const doneCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const progress =
    tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <div className="auth-brand-mark">✓</div>
          <h1 className="app-title">Tend</h1>
        </div>
        <div className="header-right">
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="app-main">
        <h2 className="dash-heading">My Tasks</h2>
        <p className="dash-subtext">Stay on top of everything, one task at a time</p>

        <div className="stats-bar">
          <div className="stat-card total">
            <div className="stat-label">Total</div>
            <div className="stat-value">{tasks.length}</div>
          </div>
          <div className="stat-card done">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{doneCount}</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{pendingCount}</div>
          </div>
        </div>

        <div className="progress-panel">
          <div className="progress-label-row">
            <span className="progress-label">Progress</span>
            <span className="progress-percent">{progress}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="add-task-panel">
          <div className="add-task-row">
            <input
              className="add-task-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done? Press Enter to add..."
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <select
              className="select-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="General">General</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Study">Study</option>
            </select>
            <input
              type="date"
              className="date-field"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <select
              className="select-field"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button className="btn-add" onClick={addTask}>+ Add Task</button>
          </div>
        </div>

        <div className="controls-row">
          <div className="search-wrap">
            <span className="search-icon">
              <SearchIcon size={15} />
            </span>
            <input
              className="search-input"
              placeholder="Search tasks..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >All</button>
            <button
              className={`filter-btn ${filter === "done" ? "active" : ""}`}
              onClick={() => setFilter("done")}
            >Done</button>
            <button
              className={`filter-btn ${filter === "pending" ? "active" : ""}`}
              onClick={() => setFilter("pending")}
            >Pending</button>
          </div>

          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="General">General</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Study">Study</option>
          </select>

          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <TaskTable tasks={filtered} refresh={fetchTasks} />
      </main>
    </div>
  );
}

export default Dashboard;