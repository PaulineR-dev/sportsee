import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  // Token + userId stockés en mémoire + localStorage
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  // Connexion : sauvegarde token + userId
  const login = (token, userId) => {
    setToken(token);
    setUserId(userId);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
  };

  // Déconnexion : supprime token + userId
  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
