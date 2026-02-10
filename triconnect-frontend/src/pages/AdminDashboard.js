import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminDashboard.css';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchAdminEvents();
  }, []);

  const fetchAdminEvents = async () => {
    try {
      setLoading(true);
      // Get all events and filter by current admin (createdBy)
      const response = await eventAPI.getEvents({ limit: 100 });
      const adminEvents = response.data.events.filter(
        (event) => event.createdBy?._id === user?._id
      );
      setEvents(adminEvents);
    } catch (err) {
      setError('Failed to fetch events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/admin/panel');
  };

  const handleEdit = (eventId) => {
    navigate(`/admin/edit/${eventId}`);
  };

  const handleDeleteClick = (eventId) => {
    setDeleteConfirm(eventId);
  };

  const handleConfirmDelete = async (eventId) => {
    try {
      await eventAPI.deleteEvent(eventId);
      setEvents(events.filter((event) => event._id !== eventId));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete event');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) return <div className="loading-spinner">Loading your events...</div>;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Manage your events</p>
        </div>
        <button className="create-btn" onClick={handleCreateNew}>
          ➕ Create New Event
        </button>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {events.length > 0 ? (
        <div className="events-table-container">
          <table className="events-table">
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Sector</th>
                <th>Date</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="event-row">
                  <td className="event-title-cell">
                    <span className="event-title">{event.title}</span>
                  </td>
                  <td>
                    <span className={`sector-badge ${event.sector}`}>
                      {event.sector}
                    </span>
                  </td>
                  <td>{formatDate(event.eventDate)}</td>
                  <td>{event.location?.city}, {event.location?.state}</td>
                  <td>
                    <span className={`status-badge ${event.isActive ? 'active' : 'inactive'}`}>
                      {event.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="action-cell">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(event._id)}
                      title="Edit event"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteClick(event._id)}
                      title="Delete event"
                    >
                      🗑️ Delete
                    </button>

                    {deleteConfirm === event._id && (
                      <div className="delete-confirmation">
                        <p>Are you sure you want to delete this event?</p>
                        <div className="confirmation-buttons">
                          <button
                            className="confirm-btn"
                            onClick={() => handleConfirmDelete(event._id)}
                          >
                            Yes, Delete
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-events-container">
          <div className="no-events-content">
            <h2>No Events Yet</h2>
            <p>You haven't created any events. Get started by creating your first event!</p>
            <button className="create-btn large" onClick={handleCreateNew}>
              Create First Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
