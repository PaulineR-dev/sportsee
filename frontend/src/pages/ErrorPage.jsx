import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <>
      <section style={{ padding: "40px", textAlign: "center" }}>
        <h1>Erreur 404</h1>
        <p>Cette page n'existe pas.</p>

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#4E6AF3",
            color: "#fff",
          }}
        >
          Retour à la connexion
        </button>
      </section>

      <Footer />
    </>
  );
}
