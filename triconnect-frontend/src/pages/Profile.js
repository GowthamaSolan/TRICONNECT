import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/Profile.css';

const Profile = () => {
  const { user, logout, refreshUser, toggleDarkMode, darkMode } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(user?.profileImage || '');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setProfilePreview(user.profileImage || '');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      if (profileFile) data.append('profileImage', profileFile);
      // include theme if present
      data.append('theme', darkMode ? 'dark' : 'light');

      await authAPI.updateProfile(data);
      // Refresh auth context user and update preview
      const updated = await refreshUser();
      if (updated) setProfilePreview(updated.profileImage || '');
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditMode(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      setMessage({ type: 'error', text: 'Only JPEG/PNG allowed' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Max file size 5MB' });
      return;
    }
    setProfileFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setProfilePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleToggleDarkMode = async (e) => {
    const enabled = e.target.checked;
    await toggleDarkMode(enabled);
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-banner"></div>
        <div className="profile-content">
          <div className="profile-avatar">
            {profilePreview ? (
              <img
                src={profilePreview.startsWith('data:') ? profilePreview : getImageUrl(profilePreview)}
                alt="Profile"
                onError={handleImageError}
                className="avatar-img"
              />
            ) : (
              <span className="avatar-icon">👤</span>
            )}
          </div>
          <div className="profile-info">
            <h1>{user?.name}</h1>
            <p className="profile-role">
              {user?.role === 'admin' ? '🔑 Event Organizer' : '👥 User'}
            </p>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          📝 Edit Profile
        </button>
        <button
          className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          ℹ️ About
        </button>
        <button
          className={`tab-button ${activeTab === 'help' ? 'active' : ''}`}
          onClick={() => setActiveTab('help')}
        >
          ❓ Help
        </button>
        <button
          className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          ⚙️ Preferences
        </button>
      </div>

      <div className="profile-main">
        {/* Edit Profile Tab */}
        {activeTab === 'profile' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Edit Profile</h2>
              <button
                className="edit-toggle-btn"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? '✕ Cancel' : '✎ Edit'}
              </button>
            </div>

            {message.text && (
              <div className={`message-box ${message.type}`}>
                {message.text}
              </div>
            )}

            {editMode ? (
              <form onSubmit={handleSaveProfile} className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Profile Photo</label>
                  <div className="profile-photo-input">
                    {profilePreview && (
                      <img
                        src={profilePreview.startsWith('data:') ? profilePreview : getImageUrl(profilePreview)}
                        alt="Preview"
                        className="preview-img"
                        onError={handleImageError}
                      />
                    )}
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                  </div>
                </div>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div className="profile-details">
                <div className="detail-item">
                  <span className="detail-label">Full Name:</span>
                  <span className="detail-value">{formData.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{formData.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">
                    {formData.phone || 'Not provided'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Account Type:</span>
                  <span className="detail-value">
                    {user?.role === 'admin' ? 'Event Organizer' : 'Regular User'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="tab-content">
            <h2>About TriConnect</h2>
            <div className="about-section">
              <div className="about-card">
                <h3>🌟 What is TriConnect?</h3>
                <p>
                  TriConnect is a comprehensive event aggregator platform designed to
                  connect users with exciting events happening around them. Whether
                  you're looking for college events, industry conferences, or government
                  initiatives, TriConnect brings everything together in one place.
                </p>
              </div>

              <div className="about-card">
                <h3>🎯 Our Mission</h3>
                <p>
                  To simplify event discovery and registration by creating a unified
                  platform where colleges, industries, and government organizations
                  can share their events with a broader audience.
                </p>
              </div>

              <div className="about-card">
                <h3>📱 Features</h3>
                <ul>
                  <li>✨ Browse events from multiple sectors</li>
                  <li>🔍 Search and filter events by category</li>
                  <li>📧 Get event reminders and notifications</li>
                  <li>✅ Register and track your event attendance</li>
                  <li>📊 Manage events (for organizers)</li>
                  <li>🌐 Seamless event posting and updates</li>
                </ul>
              </div>

              <div className="about-card">
                <h3>👥 Community</h3>
                <p>
                  TriConnect is built for the community. Whether you're an organizer
                  looking to reach more people or a user seeking exciting events, you're
                  in the right place. Join thousands of users and make the most of your
                  event discovery journey.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Help Tab */}
        {activeTab === 'help' && (
          <div className="tab-content">
            <h2>Help & Support</h2>
            <div className="help-section">
              <div className="faq-item">
                <h3>❓ How do I register for an event?</h3>
                <p>
                  Click on any event that interests you, review the details, and click
                  the "Register" button. You'll receive a confirmation email with event
                  details.
                </p>
              </div>

              <div className="faq-item">
                <h3>❓ How can I post an event?</h3>
                <p>
                  If you're an event organizer, navigate to the "Post Event" section
                  using your admin dashboard. Fill in the event details, upload a poster,
                  and publish your event.
                </p>
              </div>

              <div className="faq-item">
                <h3>❓ How do I manage my posted events?</h3>
                <p>
                  Go to your Admin Dashboard to view all events you've posted. You can
                  edit, delete, or view registrations for each event.
                </p>
              </div>

              <div className="faq-item">
                <h3>❓ Can I get event reminders?</h3>
                <p>
                  Yes! TriConnect automatically sends you reminders before events you're
                  registered for. Make sure notifications are enabled in your preferences.
                </p>
              </div>

              <div className="faq-item">
                <h3>❓ How do I contact support?</h3>
                <p>
                  For support, please email us at support@triconnect.com or use the
                  contact form on our website. We aim to respond within 24 hours.
                </p>
              </div>

              <div className="faq-item">
                <h3>❓ What file formats are supported for event posters?</h3>
                <p>
                  We support JPEG and PNG image formats with a maximum file size of 5MB.
                  Make sure your poster is clear and has appropriate dimensions.
                </p>
              </div>

              <div className="help-contact">
                <h3>📞 Contact Us</h3>
                <p>
                  <strong>Email:</strong> support@triconnect.com
                </p>
                <p>
                  <strong>Phone:</strong> +1 (800) 123-4567
                </p>
                <p>
                  <strong>Website:</strong> www.triconnect.com
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="tab-content">
            <h2>Preferences & Settings</h2>
            <div className="preferences-section">
              <div className="preference-item">
                <div className="preference-label">
                  <h3>📧 Email Notifications</h3>
                  <p>Receive event reminders and updates</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle-switch" />
              </div>

              <div className="preference-item">
                <div className="preference-label">
                  <h3>🔔 Push Notifications</h3>
                  <p>Get instant notifications for new events</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle-switch" />
              </div>

              <div className="preference-item">
                <div className="preference-label">
                  <h3>🌙 Dark Mode</h3>
                  <p>Enable dark theme for easier viewing</p>
                </div>
                <input type="checkbox" className="toggle-switch" checked={darkMode} onChange={handleToggleDarkMode} />
              </div>

              <div className="preference-item">
                <div className="preference-label">
                  <h3>📍 Location-based Events</h3>
                  <p>Show events near your location</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle-switch" />
              </div>

              <div className="preference-item">
                <div className="preference-label">
                  <h3>📋 Event Categories</h3>
                  <p>Select your preferred event categories</p>
                </div>
                <div className="category-select">
                  <label>
                    <input type="checkbox" defaultChecked /> College Events
                  </label>
                  <label>
                    <input type="checkbox" defaultChecked /> Industry Events
                  </label>
                  <label>
                    <input type="checkbox" defaultChecked /> Government Events
                  </label>
                </div>
              </div>

              <div className="danger-zone">
                <h3>⚠️ Danger Zone</h3>
                <button className="logout-button" onClick={handleLogout}>
                  🚪 Logout
                </button>
                <p className="small-text">
                  You can always log back in anytime.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
