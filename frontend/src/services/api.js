const API_URL = "http://localhost:8000/api";

// --- LOGIN ---
export async function loginUser(username, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) throw new Error("Identifiants incorrects");
  return response.json(); // { token, userId }
}

// --- USER INFO ---
export async function getUserInfo(token) {
  const response = await fetch(`${API_URL}/user-info`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Impossible de charger les infos utilisateur");
  return response.json(); // { profile, statistics }
}

// --- USER ACTIVITY ---
export async function getUserActivity(token, startWeek, endWeek) {
  const response = await fetch(
    `${API_URL}/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) throw new Error("Impossible de charger l'activité");
  return response.json(); // array of sessions
}