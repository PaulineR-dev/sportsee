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
        {/* Route publique */}
        <Route path="/" element={<Login />} />

        {/* Routes protégées */}
        <Route
          path="/user/:id"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/user/:id/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}
