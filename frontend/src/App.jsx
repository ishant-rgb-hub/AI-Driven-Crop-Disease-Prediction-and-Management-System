import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import { ErrorState, LoadingPage } from "./components/UI.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";

function ProtectedRoute() {
  const { user, loading, authError, refreshUser, logout } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingPage />;
  if (authError) {
    return (
      <main className="auth-recovery">
        <ErrorState title="We couldn’t verify your session." message={authError} onRetry={refreshUser} />
        <button className="text-button" type="button" onClick={logout}>Sign out</button>
      </main>
    );
  }
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
