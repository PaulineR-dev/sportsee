import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #eee",
      }}
    >
      {/* LOGO + NOM */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img
          src={logo}
          alt="Sportsee logo"
          style={{ width: "40px", height: "40px" }}
        />
      </div>

      {/* NAVIGATION */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          backgroundColor: "#fff",
          padding: "10px 25px",
          borderRadius: "40px",
          boxShadow: "0 0 10px rgba(0,0,0,0.05)",
          fontSize: "16px",
        }}
      >
        <button
          onClick={() => navigate(`/user/${userId}/dashboard`)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            color: "#000",
          }}
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate(`/user/${userId}`)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            color: "#000",
          }}
        >
          Mon profil
        </button>

        {/* Séparateur vertical */}
        <div
          style={{
            width: "1px",
            height: "20px",
            backgroundColor: "#ddd",
          }}
        ></div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            color: "#4E6AF3",
            fontWeight: "bold",
          }}
        >
          Se déconnecter
        </button>
      </nav>
    </header>
  );
}
