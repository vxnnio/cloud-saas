import { useEffect, useState } from "react";
import "./TasksPage.css";

const API_BASE = "http://127.0.0.1:8000";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      // 取得 user
      const userRes = await fetch("http://127.0.0.1:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = await userRes.json();
      setUser(userData);

      // 取得 tasks
      const taskRes = await fetch("http://127.0.0.1:8000/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const tasks = await taskRes.json();

      const total = tasks.length;
      const completed = tasks.filter(t => t.completed).length;
      const pending = total - completed;

      setStats({ total, completed, pending });

    } catch (err) {
      console.error(err);
    }
  };

  fetchData();
}, []);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    try {
      setError("");

      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTask,
          completed: false,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add task");
      }

      setNewTask("");
      fetchTasks();
    } catch (err) {
      setError(err.message || "Failed to add task");
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");

      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }

      fetchTasks();
    } catch (err) {
      setError(err.message || "Failed to delete task");
    }
  };

  const handleToggle = async (task) => {
    try {
      setError("");

      const res = await fetch(`${API_BASE}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: task.title,
          completed: !task.completed,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update task");
      }

      fetchTasks();
    } catch (err) {
      setError(err.message || "Failed to update task");
    }
  };

  return (
    <div className="tasks-page">
      <div className="tasks-container">
        <div className="tasks-header">
          <h1>Tasks</h1>
          <p>Manage your tasks efficiently</p>
        </div>

        <div className="task-input-card">
          <input
            type="text"
            placeholder="Enter a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTask();
            }}
          />
          <button onClick={handleAddTask}>Add</button>
        </div>

        {error && <p className="error-text">{error}</p>}

        {loading ? (
          <p className="empty">Loading tasks...</p>
        ) : (
          <div className="task-list">
            {tasks.length === 0 ? (
              <p className="empty">No tasks yet</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="left">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggle(task)}
                    />
                    <div>
                      <p className={task.completed ? "title done" : "title"}>
                        {task.title}
                      </p>
                      <p className="id">ID: {task.id}</p>
                    </div>
                  </div>

                  <div className="right">
                    <span
                      className={
                        task.completed ? "status done" : "status pending"
                      }
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </span>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}