// Transforme les sessions en données pour le graphique de distance hebdomadaire
export function buildWeeklyDistance(sessions) {
  return sessions.map((session, index) => ({
    week: `S${index + 1}`,     // Affichage court : S1, S2, S3...
    km: session.distance,      // Distance réelle fournie par le backend
    date: session.date         // Date réelle fournie par le backend
  }));
}

// Transforme les sessions en données pour le graphique de fréquence cardiaque
export function buildHeartRate(sessions) {
  return sessions.map((session) => ({
    day: session.date,               // Date réelle
    min: session.heartRate.min,      // BPM minimum réel
    max: session.heartRate.max,      // BPM maximum réel
    avg: session.heartRate.average   // BPM moyen réel
  }));
}

// Construit les statistiques hebdomadaires à partir des infos utilisateur + sessions
export function buildWeeklyStats(statistics, sessions) {
  return {
    goal: statistics.weeklyGoal || 6,           // Objectif hebdomadaire (si non fourni)
    runsCompleted: sessions.length,             // Nombre de sessions
    totalDistance: statistics.totalDistance,    // Distance totale réelle
    totalDuration: statistics.totalDuration,    // Durée totale réelle
    startDate: sessions[0]?.date || "",         // Première session
    endDate: sessions[sessions.length - 1]?.date || "" // Dernière session
  };
}
