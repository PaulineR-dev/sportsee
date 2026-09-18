// -------------------------------------------------------------
// Distance hebdomadaire (pour le graphique)
// -------------------------------------------------------------
export function buildWeeklyDistance(sessions) {
  if (!sessions) return [];

  // Normalisation tableau
  const sessionArray = Array.isArray(sessions)
    ? sessions
    : Object.values(sessions);

  if (sessionArray.length === 0) return [];

  const weeks = {};

  // Regroupe les sessions par semaine ISO
  sessionArray.forEach((s) => {
    const d = new Date(s.date);

    const dayNum = (d.getDay() + 6) % 7; // Trouver le lundi
    d.setDate(d.getDate() - dayNum + 3);

    const weekYear = d.getFullYear();
    const week1 = new Date(weekYear, 0, 4);

    // Numéro de semaine ISO
    const week =
      1 +
      Math.round(
        ((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
      );

    const key = `${weekYear}-W${week}`;

    // Initialise la semaine si absente
    if (!weeks[key]) {
      weeks[key] = {
        isoWeek: key,
        km: 0,
        dates: []
      };
    }

    // Ajoute distance + date
    weeks[key].km += s.distance;
    weeks[key].dates.push(s.date);
  });

  const today = new Date();
  const isoToday = new Date(today);

  const dayNumToday = (isoToday.getDay() + 6) % 7;
  isoToday.setDate(isoToday.getDate() - dayNumToday + 3);

  const currentYear = isoToday.getFullYear();
  const week1Current = new Date(currentYear, 0, 4);

  const currentWeek =
    1 +
    Math.round(
      ((isoToday - week1Current) / 86400000 - 3 + ((week1Current.getDay() + 6) % 7)) / 7
    );

  const currentKey = `${currentYear}-W${currentWeek}`;

  if (!weeks[currentKey]) {
    weeks[currentKey] = {
      isoWeek: currentKey,
      km: 0,
      dates: [today.toISOString().split("T")[0]] 
    };
  }

  // Trie les semaines par date
  const weeklyArray = Object.values(weeks).sort(
    (a, b) => new Date(a.dates[0]) - new Date(b.dates[0])
  );

  // Arrondir km pour l'affichage (tooltip + graphique)
  return weeklyArray.map((w, index) => ({
    week: `S${index + 1}`,
    km: Math.round(w.km),
    date: w.dates[0],
    isoWeek: w.isoWeek
  }));
}


// -------------------------------------------------------------
// Fréquence cardiaque (pour le graphique)
// -------------------------------------------------------------
export function buildHeartRate(sessions) {
  if (!sessions) return [];

  // Transforme chaque session en min/max/moyenne
  return sessions.map((session) => ({
    day: session.date,
    min: session.heartRate.min,
    max: session.heartRate.max,
    avg: session.heartRate.average
  }));
}


// -------------------------------------------------------------
// Statistiques de la semaine actuelle
// -------------------------------------------------------------
export function buildWeeklyStats(statistics, sessions) {
  // Si pas de statistiques
  if (!statistics) {
    return {
      weeklyGoal: null,
      runsCompleted: 0,
      totalDistance: 0,
      totalDuration: 0,
      startDate: "",
      endDate: ""
    };
  }

  // Si pas de sessions
  if (!sessions || sessions.length === 0) {
    return {
      weeklyGoal: statistics.weeklyGoal ?? null,
      runsCompleted: 0,
      totalDistance: 0,
      totalDuration: 0,
      startDate: "",
      endDate: ""
    };
  }

  // Lundi de la semaine
  const today = new Date();
  const dayNum = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() - dayNum);

  // Fin de journée
  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);

  // Sessions de la semaine
  const weekSessions = sessions.filter((s) => {
    const d = new Date(s.date);
    return d >= monday && d <= endOfToday;
  });

  // Calculs
  const runsCompleted = weekSessions.length;
  const totalDistance = weekSessions.reduce((sum, s) => sum + s.distance, 0);
  const totalDuration = weekSessions.reduce((sum, s) => sum + s.duration, 0);

  // Retour formaté
  return {
    weeklyGoal: statistics.weeklyGoal ?? null,
    runsCompleted,
    totalDistance,
    totalDuration,
    startDate: monday.toISOString().split("T")[0],
    endDate: today.toISOString().split("T")[0]
  };
}
