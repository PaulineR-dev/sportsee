import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Profile() {
  const { token, userId } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    if (id !== userId) {
      navigate(`/user/${userId}`);
      return;
    }

    async function fetchProfile() {
      const response = await fetch(`http://localhost:8000/api/user/${userId}/profile`);
      const data = await response.json();
      setProfileData(data);
    }

    fetchProfile();
  }, [token, id, userId, navigate]);

  if (!profileData) return <p>Chargement du profil...</p>;

  const { profile, statistics } = profileData;

  const hours = Math.floor(statistics.totalDuration / 60);
  const minutes = statistics.totalDuration % 60;

  return (
    <section>
      <div>
        <h1>{profile.firstName} {profile.lastName}</h1>
        <p>Membre depuis le {profile.createdAt}</p>
      </div>

      <div>
        <h2>Votre profil</h2>
        <p>Âge : {profile.age}</p>
        <p>Genre : {profile.gender}</p>
        <p>Taille : {profile.height} cm</p>
        <p>Poids : {profile.weight} kg</p>
      </div>

      <div>
        <h2>Vos statistiques</h2>
        <p>Depuis le {profile.createdAt}</p>
        <ul>
          <li>Temps total couru : {hours}h {minutes}min</li>
          <li>Calories brûlées : {statistics.totalCalories} cal</li>
          <li>Distance totale parcourue : {statistics.totalDistance} km</li>
          <li>Nombre de jours de repos : {statistics.restDays} jours</li>
          <li>Nombre de sessions : {statistics.totalSessions} sessions</li>
        </ul>
      </div>
    </section>
  );
}
