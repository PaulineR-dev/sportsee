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

import {
  buildWeeklyDistance,
  buildHeartRate,
  buildWeeklyStats
} from "../utils/transformData.js";

import "../styles/Dashboard.css";

// Détermine l'objectif hebdomadaire selon l'utilisateur : TEMPORAIRE A REVOIR
function resolveWeeklyGoal(userId) {
  switch (userId) {
    case "user123":
      return 2;
    case "user789":
      return 3;
    case "user456":
      return 2;
    default:
      return 0;
  }
}

// Formatage des dates en français
function formatDateFR(date) {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

// Calcule le lundi et le dimanche de la semaine courante
function getCurrentWeekBounds() {
  const today = new Date();
  const dayNum = (today.getDay() + 6) % 7; // 0 = lundi

  const monday = new Date(today);
  monday.setDate(today.getDate() - dayNum);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { monday, sunday };
}

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

  // Dates calculées localement pour la semaine courante
  const { monday, sunday } = getCurrentWeekBounds();

  useEffect(() => {

    // Vérifie l'authentification
    if (!token) {
      navigate("/");
      return;
    }

    // Empêche l'accès à un autre dashboard
    if (id !== userId) {
      navigate(`/user/${userId}/dashboard`);
      return;
    }

    // Charge les données du dashboard
    async function fetchDashboard() {
      try {
        const userInfo = await getUserInfo(token);

        setProfile(userInfo.profile);
        setStatistics(userInfo.statistics);

        const startDate = "2025-01-01";
        const endDate = new Date().toISOString().split("T")[0];

        const activityData = await getUserActivity(token, startDate, endDate);

        setSessions(activityData);

        const dist = buildWeeklyDistance(activityData);
        setWeeklyDistance(dist);

        const hr = buildHeartRate(activityData);
        setHeartRate(hr);

        const stats = buildWeeklyStats(
          { weeklyGoal: resolveWeeklyGoal(userId) },
          activityData
        );

        setWeeklyStats(stats);

      } catch (error) {
        console.log("Erreur lors du chargement du dashboard :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [token, id, userId, navigate]);

  if (loading) return <p>Chargement du dashboard...</p>;
  if (!profile || !statistics || !sessions) {
    return <p>Impossible de charger les données.</p>;
  }

  return (
    <>
      <Header /> 

      <section className="dashboard">

        <div className="dashboard-top">

          <div className="dashboard-top-left">
            <img
              src={profile.profilePicture || "/default-profile.png"}
              alt="Photo de profil"
              className="dashboard-profile-pic"
            />

            <div className="dashboard-user-info">
              <h2>{profile.firstName} {profile.lastName}</h2>
              <p>Membre depuis le {profile.createdAt}</p>
            </div>
          </div>

          <div className="dashboard-top-right">
            <span className="dashboard-top-right-label">
              Distance totale parcourue
            </span>

            <div className="dashboard-top-right-box">
              {statistics.totalDistance} km
            </div>
          </div>

        </div>

        <div className="dashboard-perf">

          <h2 className="dashboard-perf-title">Vos dernières performances</h2>

          <div className="dashboard-perf-charts">
            <div className="dashboard-perf-block-1">
              <WeeklyDistanceChart data={weeklyDistance} />
            </div>

            <div className="dashboard-perf-block-2">
              <HeartRateChart data={heartRate} />
            </div>
          </div>

        </div>

        <div className="week-summary">

          <h2 className="week-summary-title">Cette semaine</h2>

          {/* Dates calculées localement */}
          <p className="week-summary-dates">
            Du {formatDateFR(monday)} au {formatDateFR(sunday)}
          </p>

          <div className="week-summary-content">

            <div className="week-summary-left">
              <WeeklyGoalChart weeklyStats={weeklyStats} />
            </div>

            <div className="week-summary-right">

              <div className="week-box">
                <p className="week-box-label">Durée d'activité</p>
                <p className="week-box-value">
                  {weeklyStats.totalDuration}
                  <span className="week-box-unit-blue">minutes</span>
                </p>
              </div>

              <div className="week-box">
                <p className="week-box-label">Distance</p>
                <p className="week-box-value">
                  {weeklyStats.totalDistance.toFixed(1)}
                  <span className="week-box-unit-red">kilomètres</span>
                </p>
              </div>

            </div>

          </div>
        </div>

        <button onClick={() => navigate(`/user/${userId}`)}>
          Voir le profil
        </button>
      </section>

      <Footer />
    </>
  );
}
