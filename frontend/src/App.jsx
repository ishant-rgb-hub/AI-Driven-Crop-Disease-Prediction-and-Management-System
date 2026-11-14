import React from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./components/AppShell";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Detect from "./pages/Detect";
import Diseases from "./pages/Diseases";
import History from "./pages/History";
import Profile from "./pages/Profile";

function NotFound() {
  return <div className="screen-center"><div><p className="eyebrow">404</p><h1>Page not found</h1><Link className="button primary" to="/">Return home</Link></div></div>;
}

export default function App() {
  const { user } = useAuth();
  return <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={user ? <Navigate to="/app" replace /> : <Login />} />
    <Route path="/register" element={user ? <Navigate to="/app" replace /> : <Register />} />
    <Route element={<ProtectedRoute />}><Route path="/app" element={<AppShell />}><Route index element={<Dashboard />} /><Route path="detect" element={<Detect />} /><Route path="diseases" element={<Diseases />} /><Route path="history" element={<History />} /><Route path="profile" element={<Profile />} /></Route></Route>
    <Route path="*" element={<NotFound />} />
  </Routes>;
}
