import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { loginUser } from "../services/api.js";
import "../styles/login.css";
import heroImage from "../assets/login-hero.png";
import logo from "../assets/logo.png";

export default function Login() {
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await loginUser(usernameInput, password);

      login(data.token, data.userId);
      navigate(`/user/${data.userId}/dashboard`);

    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="logo">
          <img src={logo} alt="Sportsee logo" />
        </div>

        <div className="login-card">
          <p className="login-tagline">
            Transformez<br />vos stats en résultats
          </p>

          <h2 className="login-title">Se connecter</h2>

          <form onSubmit={handleSubmit} className="login-form">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
            />

            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="Mot de passe"
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

      <div className="login-right">
        <img src={heroImage} alt="Sport runners" />

        <div className="login-bottom-box">
          Analysez vos performances en un clin d’œil,<br />
          suivez vos progrès et atteignez vos objectifs.
        </div>
      </div>
    </div>
  );
}
