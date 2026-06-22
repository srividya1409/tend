import { useState } from "react";
import { StarIcon, AlertTriangleIcon, ClockIcon, CheckIcon, SparkleIcon } from "./Icons";

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
        <div className="empty-icon"><SparkleIcon size={32} /></div>
        <div className="empty-title">No tasks here</div>
        <div className="empty-sub">Add a task above to get started</div>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((t) => {
        const isDone = t.completed;
        const priority = (t.priority || "Medium").toLowerCase();

        const isOverdue =
          t.due_date && !t.completed && new Date(t.due_date) < new Date();

        const isReminder =
          t.due_date &&
          !t.completed &&
          new Date(t.due_date) > new Date() &&
          new Date(t.due_date) - new Date() < 24 * 60 * 60 * 1000;

        return (
          <div
            key={t.id}
            className={`task-card ${isDone ? "is-done" : ""} ${t.pinned ? "is-pinned" : ""}`}
          >
            <button
              className={`task-toggle ${isDone ? "checked" : ""}`}
              onClick={() => updateTask({ ...t, completed: !t.completed })}
              aria-label="Toggle task"
            >
              {isDone ? <CheckIcon size={12} /> : ""}
            </button>

            <button
              className={`pin-btn ${t.pinned ? "pinned" : ""}`}
              onClick={() => updateTask({ ...t, pinned: !t.pinned })}
              aria-label="Pin task"
            >
              <StarIcon size={15} filled={!!t.pinned} />
            </button>

            <div className="task-body">
              {editingId === t.id ? (
                <div className="edit-row">
                  <input
                    className="add-task-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(t)}
                    autoFocus
                  />
                </div>
              ) : (
                <>
                  <div className="task-title">{t.title}</div>

                  <div className="task-meta">
                    <span className={`badge-status ${isDone ? "done" : "pending"}`}>
                      {isDone ? "Done" : "Pending"}
                    </span>
                    {t.priority && (
                      <span className={`badge-priority ${priority}`}>
                        {t.priority}
                      </span>
                    )}
                    {t.category && (
                      <span className="task-category">{t.category}</span>
                    )}
                  </div>

                  {t.due_date && (
                    <div className="task-due">
                      Due: {new Date(t.due_date).toLocaleDateString()}
                    </div>
                  )}

                  {isOverdue && (
                    <div className="task-flag overdue">
                      <AlertTriangleIcon size={13} /> Overdue
                    </div>
                  )}

                  {isReminder && (
                    <div className="task-flag reminder">
                      <ClockIcon size={13} /> Due soon
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="task-actions">
              {editingId === t.id ? (
                <button className="action-btn edit" onClick={() => saveEdit(t)}>Save</button>
              ) : (
                <button className="action-btn edit" onClick={() => startEdit(t)}>Edit</button>
              )}
              <button className="action-btn delete" onClick={() => deleteTask(t.id)}>Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TaskTable;