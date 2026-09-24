import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Profile from "../pages/Profile.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";
import PrivateRoute from "./PrivateRoute.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Page de connexion (publique) */}
        <Route path="/" element={<Login />} />

        {/* Profil (protégé) */}
        <Route
          path="/user/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Dashboard (protégé) */}
        <Route
          path="/user/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Page 404 */}
        <Route path="*" element={<ErrorPage />} />

      </Routes>
    </BrowserRouter>
  );
}
