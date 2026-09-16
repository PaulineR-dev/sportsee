import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {

  // Récupère le token du contexte
  const { token } = useContext(AuthContext);

  // Si pas connecté : redirection login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Sinon affiche la page protégée
  return children;
}
