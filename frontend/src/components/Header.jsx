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

      <div className="header-left">
        <img
          src={logo}
          alt="Sportsee logo"
          className="header-logo"
        />
      </div>

      <nav className="header-nav">

        <button onClick={() => navigate(`/user/dashboard`)}>
          Dashboard
        </button>

        <button onClick={() => navigate(`/user/${userId}`)}>
          Mon profil
        </button>

        <div className="header-separator"></div>

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
