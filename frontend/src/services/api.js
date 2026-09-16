const API_URL = "http://localhost:8000/api";

// --- LOGIN ---
// Envoie le username + password au backend pour obtenir un token.
// Si les identifiants sont mauvais : erreur.
// Si OK : renvoie le JSON contenant le token.
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
// Récupère les infos du user (profil, statistiques, objectif hebdomadaire).
// Nécessite le token dans le header Authorization.
// Si le backend renvoie une erreur : throw.
// Sinon : renvoie un objet propre avec les 3 blocs utiles.
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
// Récupère l’activité du user sur une période (startWeek → endWeek).
// Le token est obligatoire.
// Si erreur : throw.
// Sinon : renvoie la liste des activités (sessions).
export async function getUserActivity(token, startWeek, endWeek) {
  const response = await fetch(
    `${API_URL}/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) throw new Error("Impossible de charger l'activité");
  return response.json();
}
