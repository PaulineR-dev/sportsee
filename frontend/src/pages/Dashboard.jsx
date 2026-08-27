import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { token, userId } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);

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
        const response = await fetch(`http://localhost:8000/api/user/${userId}/dashboard`);
        if (!response.ok) {
          throw new Error("Erreur lors du chargement du dashboard");
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error(error);
      }
    }

    if (userId) {
      fetchDashboard();
    }
  }, [token, id, userId, navigate]);

  if (!dashboardData) {
    return <p>Chargement du dashboard...</p>;
  }

  return (
    <section>
      <h1>
        Dashboard de {dashboardData.profile.firstName} {dashboardData.profile.lastName}
      </h1>
      <p>Membre depuis le {dashboardData.profile.createdAt}</p>
      <p>Distance totale parcourue : {dashboardData.profile.totalDistance} km</p>

      <h2>Statistiques hebdomadaires</h2>
      <ul>
        <p>Du {dashboardData.weeklyStats.startDate} au {dashboardData.weeklyStats.endDate}</p>
        <li>Objectif : {dashboardData.weeklyStats.goal} courses</li>
        <li>Courses réalisées : {dashboardData.weeklyStats.runsCompleted}</li>
        <li>Durée totale : {dashboardData.weeklyStats.totalDuration} min</li>
        <li>Distance totale : {dashboardData.weeklyStats.totalDistance} km</li>
      </ul>

      <button onClick={() => navigate(`/user/${userId}`)}>
        Voir le profil
      </button>
    </section>
  );
}
