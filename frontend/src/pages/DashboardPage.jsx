import "./DashboardPage.css";
import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function DashboardPage() {
  const [user, setUser] = useState({
    id: "",
    email: "",
    name: "",
  });

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("No token found. Please login again.");
          setLoading(false);
          return;
        }

        // 1. 抓目前登入者
        const userRes = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userRes.ok) {
          throw new Error("Failed to fetch user info");
        }

        const userData = await userRes.json();

        setUser({
          id: userData.id ?? "",
          email: userData.email ?? "",
          name: userData.name ?? userData.username ?? "User",
        });

        // 2. 抓 tasks
        const tasksRes = await fetch(`${API_BASE}/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!tasksRes.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const tasksData = await tasksRes.json();
        setTasks(tasksData);

        const total = tasksData.length;
        const completed = tasksData.filter((task) => task.completed).length;
        const pending = total - completed;

        setStats({
          total,
          completed,
          pending,
        });
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <p className="dashboard-badge">Cloud SaaS System</p>
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back. Here is an overview of your task management system.
          </p>
        </div>

        {error && (
          <div className="panel-card" style={{ marginBottom: "20px", color: "red" }}>
            {error}
          </div>
        )}

        <div className="welcome-card">
          <div className="welcome-left">
            <h2>Hi, {user.name || "User"} 👋</h2>
            <p>
              Manage your tasks, monitor progress, and keep everything organized.
            </p>
          </div>

          <div className="user-info-card">
            <p className="label">User ID</p>
            <p className="value">{user.id}</p>

            <p className="label">Email</p>
            <p className="value email">{user.email}</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total Tasks</p>
            <h3>{stats.total}</h3>
            <p className="stat-desc">Total number of tasks in the system</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Completed</p>
            <h3 className="success">{stats.completed}</h3>
            <p className="stat-desc">Tasks finished successfully</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Pending</p>
            <h3 className="warning">{stats.pending}</h3>
            <p className="stat-desc">Tasks waiting to be completed</p>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="panel-card">
            <h3>Quick Overview</h3>
            <ul>
              <li>Authentication system is connected.</li>
              <li>Dashboard is using real API data.</li>
              <li>Tasks statistics are calculated dynamically.</li>
            </ul>
          </div>

          <div className="panel-card">
            <h3>Recent Tasks</h3>

            {tasks.length === 0 ? (
              <p className="empty-text">No tasks yet.</p>
            ) : (
              <div className="task-list">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="task-item">
                    <div>
                      <p className="task-title">{task.title}</p>
                      <p className="task-id">Task ID: {task.id}</p>
                    </div>

                    <span
                      className={
                        task.completed ? "status completed" : "status pending"
                      }
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}