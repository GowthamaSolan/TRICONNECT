import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

export const SignIn = () => {
  const [credentials, setCredentials] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(credentials);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
          callback: handleGoogleSuccess,
        });
        const element = document.getElementById('googleSignInButton');
        if (element) {
          window.google.accounts.id.renderButton(
            element,
            { theme: 'outline', size: 'large', width: '100%' }
          );
        }
      }
    };

    return () => {
      if (script.parentNode) document.head.removeChild(script);
    };
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);

      await googleLogin({
        googleId: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      });
      navigate('/dashboard');
    } catch (err) {
      // optionally show error to user
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>TriConnect</h1>
        <h2>Sign In</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email or Username</label>
            <input
              type="text"
              name="emailOrUsername"
              value={credentials.emailOrUsername}
              onChange={handleChange}
              required
              placeholder="Enter email or username"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>

        <div className="divider">OR</div>

        <div id="googleSignInButton" style={{ marginTop: '1rem', textAlign: 'center' }}></div>
      </div>
    </div>
  );
};

export default SignIn;
