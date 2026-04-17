const API_BASE = "http://127.0.0.1:8000";

function getAuthHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function login(email, password) {
  const formData = new URLSearchParams();
  formData.append("username", email);   // 注意：後端要 username
  formData.append("password", password);

  const res = await fetch("http://127.0.0.1:8000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "登入失敗");
  }

  return data;
}

export async function getMe(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(token),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Fetch /auth/me failed: ${errorText}`);
  }

  return res.json();
}

export async function getTasks(token) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(token),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Fetch tasks failed: ${errorText}`);
  }

  return res.json();
}

export async function createTask(token, taskData) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(taskData),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Create task failed: ${errorText}`);
  }

  return res.json();
}

export async function deleteTask(token, taskId) {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(token),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Delete task failed: ${errorText}`);
  }

  return true;
}