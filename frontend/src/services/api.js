const API_URL = "http://localhost:8000/api";

// --- LOGIN ---
// Envoie username + password → reçoit un token.
// Si mauvais identifiants → erreur.
export async function loginUser(username, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) throw new Error("Identifiants incorrects");
  return response.json();
}

// --- USER INFO ---
// Récupère profil + statistiques + objectif hebdo.
// Token obligatoire dans Authorization.
// Renvoie un objet propre avec les infos utiles.
export async function getUserInfo(token) {
  const response = await fetch(`${API_URL}/user-info`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Impossible de charger les infos utilisateur");

  const raw = await response.json();

  return {
    profile: raw.profile,
    statistics: raw.statistics,
    weeklyGoal: raw.weeklyGoal
  };
}

// --- USER ACTIVITY ---
// Récupère les sessions entre startWeek → endWeek.
// Token obligatoire.
// Renvoie la liste des activités.
export async function getUserActivity(token, startWeek, endWeek) {
  const response = await fetch(
    `${API_URL}/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) throw new Error("Impossible de charger l'activité");
  return response.json();
}
