import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { loginUser } from "../services/api.js";
import "../styles/login.css";
import heroImage from "../assets/login-hero.png";
import logo from "../assets/logo.png";

export default function Login() {

  // Champs du formulaire
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");

  // Navigation
  const navigate = useNavigate();

  // Fonction login du contexte
  const { login } = useContext(AuthContext);

  // Soumission du formulaire
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // Appel API login
      const data = await loginUser(usernameInput, password);

      // Stocke token + userId dans le contexte
      login(data.token, data.userId);

      // Redirection vers dashboard
      navigate(`/user/${data.userId}/dashboard`);

    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="login-page">

      {/* Colonne gauche */}
      <div className="login-left">

        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="Sportsee logo" />
        </div>

        {/* Carte de login */}
        <div className="login-card">

          <p className="login-tagline">
            Transformez<br />vos stats en résultats
          </p>

          <h2 className="login-title">Se connecter</h2>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="login-form">

            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
            />

            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="login-button">
              Se connecter
            </button>

            <p className="forgot-password">Mot de passe oublié ?</p>
          </form>
        </div>
      </div>

      {/* Colonne droite */}
      <div className="login-right">

        {/* Image */}
        <img src={heroImage} alt="Sport runners" />

        {/* Texte bas */}
        <div className="login-bottom-box">
          Analysez vos performances en un clin d’œil,<br />
          suivez vos progrès et atteignez vos objectifs.
        </div>
      </div>
    </div>
  );
}
