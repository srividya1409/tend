import { useState } from "react";

function TaskTable({ tasks = [], refresh }) {
  const token = localStorage.getItem("token");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const updateTask = async (task) => {
    await fetch(`http://localhost:5000/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });
    refresh();
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    refresh();
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  const saveEdit = async (task) => {
    if (!editText.trim()) return;
    await updateTask({ ...task, title: editText });
    setEditingId(null);
  };

  if (!tasks.length) {
    return (
      <div className="empty-state">
        <div className="empty-icon">✦</div>
        <div className="empty-title">No tasks here</div>
        <div className="empty-sub">Add a task above to get started</div>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((t) => {
        const isDone = t.completed;

        return (
          <div key={t.id} className={`task-card ${isDone ? "is-done" : ""}`}>
            
            <button
              className={`task-toggle ${isDone ? "checked" : ""}`}
              onClick={() => updateTask({ ...t, completed: !t.completed })}
            >
              {isDone ? "✓" : ""}
            </button>

            <div className="task-body">
              {editingId === t.id ? (
                <input
                  className="add-task-input"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(t)}
                  autoFocus
                />
              ) : (
                <div className="task-title">{t.title}</div>
              )}

              <div className="task-meta">
                <span className={`badge-status ${isDone ? "done" : "pending"}`}>
                  {isDone ? "Done" : "Pending"}
                </span>
              </div>
            </div>

            <div className="task-actions">
              {editingId === t.id ? (
                <button className="action-btn edit" onClick={() => saveEdit(t)}>
                  Save
                </button>
              ) : (
                <button className="action-btn edit" onClick={() => startEdit(t)}>
                  Edit
                </button>
              )}

              <button
                className="action-btn delete"
                onClick={() => deleteTask(t.id)}
              >
                Delete
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
}

export default TaskTable;