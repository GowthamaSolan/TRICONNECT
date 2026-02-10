import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import AdminSignUp from './components/AdminSignUp';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EventDetail from './pages/EventDetail';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import Navigation from './components/Navigation';
import './App.css';

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { isAuthenticated, isAdmin: userIsAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  if (isAdmin && !userIsAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  // Initialize dark mode on app load
  useEffect(() => {
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    if (darkModeEnabled) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className={isAuthenticated ? 'user-background' : ''}>
        {isAuthenticated && <Navigation />}
        <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/admin/signup" element={<AdminSignUp />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/event/:id"
          element={
            <ProtectedRoute>
              <EventDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/panel"
          element={
            <ProtectedRoute isAdmin={true}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
