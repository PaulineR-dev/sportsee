import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

import { 
  getUserInfo,
  getUserActivity
} from "../services/api.js";

import WeeklyDistanceChart from "../components/WeeklyDistanceChart.jsx";
import HeartRateChart from "../components/HeartRateChart.jsx";
import WeeklyGoalChart from "../components/WeeklyGoalChart.jsx";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";

// IMPORT DES TRANSFORMATIONS
import {
  buildWeeklyDistance,
  buildHeartRate,
  buildWeeklyStats
} from "../utils/transformData.js";

export default function Dashboard() {
  const { token, userId } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [sessions, setSessions] = useState(null);

  const [weeklyDistance, setWeeklyDistance] = useState(null);
  const [heartRate, setHeartRate] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    if (id !== userId) {
      navigate(`/user/${userId}/dashboard`);
      return;
    }

    async function fetchDashboard() {
      try {
        const userInfo = await getUserInfo(token);
        setProfile(userInfo.profile);
        setStatistics(userInfo.statistics);

        const activityData = await getUserActivity(
          token,
          "2025-01-01",
          "2025-12-31"
        );
        setSessions(activityData);

        // Transformations pour les graphiques
        setWeeklyDistance(buildWeeklyDistance(activityData));
        setHeartRate(buildHeartRate(activityData));
        setWeeklyStats(buildWeeklyStats(userInfo.statistics, activityData));

      } catch (error) {
        console.error("Erreur dashboard :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [token, id, userId, navigate]);

  if (loading) return <p>Chargement du dashboard...</p>;
  if (!profile || !statistics || !sessions) return <p>Impossible de charger les données.</p>;

  return (
    <>
      <Header /> 

      <section>
        <h1>
          Dashboard de {profile.firstName} {profile.lastName}
        </h1>

        <p>Membre depuis le {profile.createdAt}</p>
        <p>Distance totale parcourue : {statistics.totalDistance} km</p>
        <p>Nombre de sessions : {statistics.totalSessions}</p>
        <p>Durée totale : {statistics.totalDuration} min</p>

        {/* --- GRAPHIQUES --- */}
        <section style={{ display: "flex", gap: "40px", marginTop: "40px" }}>
          <WeeklyDistanceChart data={weeklyDistance} />
          <HeartRateChart data={heartRate} />
          <WeeklyGoalChart weeklyStats={weeklyStats} />
        </section>

        <button onClick={() => navigate(`/user/${userId}`)}>
          Voir le profil
        </button>
      </section>

      <Footer />
    </>
  );
}
