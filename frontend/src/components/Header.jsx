import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/header.css";

export default function Header() {

  // Pour naviguer entre les pages
  const navigate = useNavigate();

  // Récupération du userId
  const userId = localStorage.getItem("userId");

  return (
    <header className="header">

      {/* Logo */}
      <div className="header-left">
        <img
          src={logo}
          alt="Sportsee logo"
          className="header-logo"
        />
      </div>

      {/* Navigation */}
      <nav className="header-nav">

        {/* Lien dashboard */}
        <button onClick={() => navigate(`/user/dashboard`)}>
          Dashboard
        </button>

        {/* Lien profil */}
        <button onClick={() => navigate(`/user/${userId}`)}>
          Mon profil
        </button>

        {/* Séparateur */}
        <div className="header-separator"></div>

        {/* Déconnexion */}
        <button
          id="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          Se déconnecter
        </button>
      </nav>
    </header>
  );
}
