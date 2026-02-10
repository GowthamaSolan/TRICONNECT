import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => navigate('/dashboard')}>
          <span className="logo-icon">⚡</span>
          TriConnect
        </div>

        <div className="nav-links">
          {!isAdmin ? (
            <>
              <a
                href="/dashboard"
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                Dashboard
              </a>
              
            </>
          ) : (
            <>
              <a
                href="/admin/panel"
                className={`nav-link ${location.pathname === '/admin/panel' ? 'active' : ''}`}
              >
                Post Event
              </a>
              <a href="/admin/dashboard" className="nav-link">
                My Events
              </a>
            </>
          )}
        </div>

        <div className="nav-user">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className={`user-role ${user?.role}`}>{user?.role.toUpperCase()}</span>
          </div>
          <button className="profile-btn" onClick={() => navigate('/profile')} title="View Profile">
            👤
          </button>
        </div>

        <div className="hamburger" onClick={() => setShowMenu(!showMenu)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {showMenu && (
        <div className="mobile-menu">
          {!isAdmin ? (
            <>
              <a href="/dashboard">Dashboard</a>
              
            </>
          ) : (
            <>
              <a href="/admin/panel">Post Event</a>
              <a href="/admin/dashboard">My Events</a>
            </>
          )}
          <a href="/profile">👤 Profile</a>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

