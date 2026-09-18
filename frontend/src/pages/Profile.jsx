import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { getUserInfo, getUserActivity } from "../services/api.js";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import "../styles/Profile.css";

// Formatage de la date "membre depuis"
function formatMemberDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// Formatage de la taille
function formatHeight(heightCm) {
  if (!heightCm || heightCm < 100) return `${heightCm} cm`;
  const meters = Math.floor(heightCm / 100);
  const centimeters = heightCm % 100;
  return `${meters}m${centimeters}`;
}

// Formatage du genre
function formatGender(gender) {
  if (gender === "female") return "Femme";
  if (gender === "male") return "Homme";
  return gender;
}

export default function Profile() {
  // Récupération du token
  const { token } = useContext(AuthContext);

  // Navigation
  const navigate = useNavigate();

  // États du profil + statistiques
  const [profile, setProfile] = useState(null);
  const [statistics, setStatistics] = useState(null);

  // Chargement
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si pas de token : retour accueil
    if (!token) {
      navigate("/");
      return;
    }

    // Chargement du profil + activité
    async function fetchProfile() {
      try {
        const data = await getUserInfo(token);

        const userProfile = data.profile;

        // Période : depuis inscription jusqu'à aujourd’hui
        const startDate = userProfile.createdAt;
        const endDate = new Date().toISOString().split("T")[0];

        // Activité filtrée
        const activityData = await getUserActivity(token, startDate, endDate);

        // Calculs des statistiques globales
        const totalDuration = activityData.reduce((sum, s) => sum + (s.duration || 0), 0);
        const totalDistance = activityData.reduce((sum, s) => sum + (s.distance || 0), 0);
        const totalCalories = activityData.reduce((sum, s) => sum + (s.caloriesBurned || 0), 0);

        // Nombre de jours où il y a eu au moins une session
        const uniqueRunDays = new Set(activityData.map(s => s.date)).size;

        // Objectif hebdomadaire
        const weeklyGoal =
          data.statistics?.weeklyGoal ??
          data.weeklyGoal ??
          0;

        // Mise à jour des états
        setProfile(userProfile);

        setStatistics({
          totalDuration,
          totalDistance,
          totalCalories,
          totalSessions: activityData.length,
          uniqueRunDays,
          weeklyGoal
        });

      } catch (error) {
        console.error("Erreur profil :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [token, navigate]);

  // États de chargement/erreur
  if (loading) return <p>Chargement du profil...</p>;
  if (!profile || !statistics) return <p>Impossible de charger le profil.</p>;

  // Calculs durée
  const totalDuration = statistics.totalDuration ?? 0;
  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;

  // Autres statistiques
  const totalCalories = statistics.totalCalories ?? 0;
  const totalKm = statistics.totalDistance ?? 0;
  const totalSessions = statistics.totalSessions ?? 0;

  // Calcul des jours depuis inscription
  const createdAtDate = new Date(profile.createdAt);
  const today = new Date();
  const totalDays = Math.floor((today - createdAtDate) / (1000 * 60 * 60 * 24));

  // Jours de repos = jours totaux - jours où il y a eu une session
  const restDays = totalDays - (statistics.uniqueRunDays ?? 0);

  return (
    <>
      <Header />

      <section className="profile-container">

        {/* Colonne gauche */}
        <div className="profile-left">

          {/* Avatar + nom */}
          <div className="profile-header">
            <div className="profile-avatar">
              <img
                src={profile.profilePicture || "/default-profile.png"}
                alt="Photo de profil"
              />
            </div>

            <div>
              <h1>{profile.firstName} {profile.lastName}</h1>
              <p className="member-date">
                Membre depuis le {formatMemberDate(profile.createdAt)}
              </p>
            </div>
          </div>

          {/* Infos personnelles */}
          <div className="profile-info">
            <h2>Votre profil</h2>
            <div className="profile-info-divider"></div>

            <ul>
              <li>Âge : {profile.age}</li>
              <li>Genre : {formatGender(profile.gender)}</li>
              <li>Taille : {formatHeight(profile.height)}</li>
              <li>Poids : {profile.weight} kg</li>
            </ul>
          </div>
        </div>

        {/* Colonne droite : statistiques */}
        <div className="profile-right">
          <h2>Vos statistiques</h2>

          <p className="stats-since">
            depuis le {formatMemberDate(profile.createdAt)}
          </p>

          <div className="stats-grid-blue">

            {/* Temps total */}
            <div className="blue-card">
              <span className="blue-label">Temps total couru</span>
              <span className="blue-value">
                {hours}
                <span className="blue-value">h</span>
                {" "}
                <span className="blue-unit">{minutes}</span>
                <span className="blue-unit">min</span>
              </span>
            </div>

            {/* Calories */}
            <div className="blue-card">
              <span className="blue-label">Calories brûlées</span>
              <span className="blue-value">
                {totalCalories}
                <span className="blue-unit"> cal</span>
              </span>
            </div>

            {/* Distance */}
            <div className="blue-card">
              <span className="blue-label">Distance totale parcourue</span>
              <span className="blue-value">
                {Math.round(totalKm)}
                <span className="blue-unit"> km</span>
              </span>
            </div>

            {/* Jours de repos */}
            <div className="blue-card">
              <span className="blue-label">Jours de repos</span>
              <span className="blue-value">
                {restDays}
                <span className="blue-unit"> jours</span>
              </span>
            </div>

            {/* Sessions */}
            <div className="blue-card">
              <span className="blue-label">Nombre de sessions</span>
              <span className="blue-value">
                {totalSessions}
                <span className="blue-unit"> sessions</span>
              </span>
            </div>

          </div>
        </div>

      </section>

      <Footer />
    </>
  );
}
