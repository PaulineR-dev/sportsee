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

import outline from "../assets/outline.png";

import "../styles/Dashboard.css";

// Format date FR
function formatDateFR(date) {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

// Format date pour le header
function formatMemberDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// Distance totale depuis inscription
function computeTotalDistanceFromSessions(sessions) {
  if (!sessions || sessions.length === 0) return 0;
  return sessions.reduce((sum, s) => sum + (s.distance || 0), 0);
}

// Bornage de la semaine actuelle
function getCurrentWeekBounds() {
  const today = new Date();
  const dayNum = (today.getDay() + 6) % 7; // lundi = 0

  const monday = new Date(today);
  monday.setDate(today.getDate() - dayNum);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { monday, sunday };
}

export default function Dashboard() {
  // Auth
  const { token, userId } = useContext(AuthContext);

  // URL
  const { id } = useParams();

  // Navigation
  const navigate = useNavigate();

  // États
  const [profile, setProfile] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [sessions, setSessions] = useState(null);

  const [weeklyDistance, setWeeklyDistance] = useState(null);
  const [heartRate, setHeartRate] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);

  const [totalDistanceFromStart, setTotalDistanceFromStart] = useState(0);

  const [loading, setLoading] = useState(true);

  const { monday, sunday } = getCurrentWeekBounds();

  useEffect(() => {

    // Pas de token : retour login
    if (!token) {
      navigate("/");
      return;
    }

    // Mauvais ID : redirection vers son dashboard
    if (id !== userId) {
      navigate(`/user/${userId}/dashboard`);
      return;
    }

    // Chargement du dashboard
    async function fetchDashboard() {
      try {
        // Infos user
        const userInfo = await getUserInfo(token);

        setProfile(userInfo.profile);
        setStatistics(userInfo.statistics);

        // Activité depuis inscription jusqu'à aujourd’hui
        const startDate = userInfo.profile.createdAt;
        const endDate = new Date().toISOString().split("T")[0];

        const activityData = await getUserActivity(token, startDate, endDate);
        setSessions(activityData);

        // Graphique distance
        const dist = buildWeeklyDistance(activityData);
        setWeeklyDistance(dist);

        // Graphique fréquence cardiaque
        const hr = buildHeartRate(activityData);
        setHeartRate(hr);

        // Objectif hebdomadaire
        const resolvedGoal = userInfo.weeklyGoal ?? 0;

        // Statistiques hebdomadaires
        const stats = buildWeeklyStats(
          { weeklyGoal: resolvedGoal },
          activityData
        );

        setWeeklyStats(stats);

        // Distance totale depuis inscription
        const totalDistance = computeTotalDistanceFromSessions(activityData);
        setTotalDistanceFromStart(totalDistance);

      } catch (error) {
        console.log("Erreur lors du chargement du dashboard :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [token, id, userId, navigate]);

  // États de chargement/erreur
  if (loading) return <p>Chargement du dashboard...</p>;
  if (!profile || !statistics || !sessions) {
    return <p>Impossible de charger les données.</p>;
  }

  return (
    <>
      <Header /> 

      <section className="dashboard">

        {/* Haut du dashboard */}
        <div className="dashboard-top">

          {/* Profil */}
          <div className="dashboard-top-left">
            <div className="dashboard-profile-pic">
              <img
                src={profile.profilePicture || "/default-profile.png"}
                alt="Photo de profil"
              />
            </div>

            <div className="dashboard-user-info">
              <h2>{profile.firstName} {profile.lastName}</h2>
              <p>Membre depuis le {formatMemberDate(profile.createdAt)}</p>
            </div>
          </div>

          {/* Distance totale */}
          <div className="dashboard-top-right">
            <span className="dashboard-top-right-label">
              Distance totale parcourue
            </span>

            <div className="dashboard-top-right-box">
              <img src={outline} alt="" className="dashboard-outline-icon" /> 
              <p className="dashboard-total-km">{Math.round(totalDistanceFromStart)} km</p>
            </div>
          </div>

        </div>

        {/* Performances */}
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

        {/* Résumé semaine */}
        <div className="week-summary">

          <h2 className="week-summary-title">Cette semaine</h2>

          <p className="week-summary-dates">
            Du {formatDateFR(monday)} au {formatDateFR(sunday)}
          </p>

          <div className="week-summary-content">

            {/* Objectif hebdomadaire */}
            <div className="week-summary-left">
              <WeeklyGoalChart weeklyStats={weeklyStats} />
            </div>

            {/* Statistiques semaine */}
            <div className="week-summary-right">

              <div className="week-box">
                <p className="week-box-label">Durée d'activité</p>
                <p className="week-box-value">{weeklyStats.totalDuration}<span className="week-box-unit-blue"> minutes</span></p>
              </div>

              <div className="week-box">
                <p className="week-box-label">Distance</p>
                <p className="week-box-value">{weeklyStats.totalDistance.toFixed(1)}<span className="week-box-unit-red"> kilomètres</span></p>
              </div>

            </div>

          </div>
        </div>

      </section>

      <Footer />
    </>
  );
}
