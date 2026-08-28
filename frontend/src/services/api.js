// src/services/api.js

const API_URL = "http://localhost:8000/api";

// --- AUTHENTIFICATION ---
export async function loginUser(username, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Identifiants incorrects");
  }

  return response.json();
}

// --- PROFIL ---
export async function getUser(id, token) {
  const response = await fetch(`${API_URL}/user/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Impossible de charger l'utilisateur");
  }

  return response.json();
}

// --- ACTIVITÉS ---
export async function getActivity(id, token) {
  const response = await fetch(`${API_URL}/user/${id}/activity`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Impossible de charger l'activité");
  }

  return response.json();
}

// --- SESSIONS MOYENNES ---
export async function getAverageSessions(id, token) {
  const response = await fetch(`${API_URL}/user/${id}/average-sessions`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Impossible de charger les sessions moyennes");
  }

  return response.json();
}

// --- PERFORMANCES ---
export async function getPerformance(id, token) {
  const response = await fetch(`${API_URL}/user/${id}/performance`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Impossible de charger les performances");
  }

  return response.json();
}

// --- DASHBOARD COMPLET ---
export async function getDashboard(id, token) {
  const response = await fetch(`${API_URL}/user/${id}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Impossible de charger le dashboard");
  }

  return response.json();
}
