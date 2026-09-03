import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { getUserInfo } from "../services/api.js";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default function Profile() {
  const { token, userId } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

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
      try {
        const data = await getUserInfo(token);
        setProfile(data.profile);
        setStatistics(data.statistics);
      } catch (error) {
        console.error("Erreur profil :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [token, id, userId, navigate]);

  if (loading) return <p>Chargement du profil...</p>;
  if (!profile || !statistics) return <p>Impossible de charger le profil.</p>;

  const hours = Math.floor(statistics.totalDuration / 60);
  const minutes = statistics.totalDuration % 60;

  return (
    <>
      <Header />

      <section style={{ padding: "40px" }}>
        <div>
          <h1>{profile.firstName} {profile.lastName}</h1>
          <p>Membre depuis le {profile.createdAt}</p>
        </div>

        <div style={{ marginTop: "30px" }}>
          <h2>Votre profil</h2>
          <p>Âge : {profile.age}</p>
          <p>Taille : {profile.height} cm</p>
          <p>Poids : {profile.weight} kg</p>
        </div>

        <div style={{ marginTop: "30px" }}>
          <h2>Vos statistiques</h2>
          <p>Depuis le {profile.createdAt}</p>
          <ul>
            <li>Temps total couru : {hours}h {minutes}min</li>
            <li>Distance totale parcourue : {statistics.totalDistance} km</li>
            <li>Nombre de sessions : {statistics.totalSessions}</li>
          </ul>
        </div>
      </section>

      <Footer />
    </>
  );
}
