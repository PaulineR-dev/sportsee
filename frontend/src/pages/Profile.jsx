import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Profile() {
  const { token, userId } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    if (id !== userId) {
      navigate(`/user/${userId}`);
      return;
    }
  }, [token, id, userId, navigate]);

  return (
    <section>
      <h1>Profil de {userId}</h1>
      <p>Les statistiques seront affichées ici.</p>

      <button onClick={() => navigate(`/user/${userId}/dashboard`)}>
        Voir le dashboard
      </button>
    </section>
  );
}
