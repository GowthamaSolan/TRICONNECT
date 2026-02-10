import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventAPI } from '../services/api';
// removed unused useAuth import to fix lint warning
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import '../styles/EventDetail.css';

export const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // isAuthenticated not used in this component
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(false);

  const fetchEvent = async () => {
    try {
      const response = await eventAPI.getEventById(id);
      setEvent(response.data.event);
    } catch (err) {
      setError('Event not found');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleCalendarSync = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please login first to add events to your Google Calendar!');
      return;
    }

    try {
      setSyncing(true);
      console.log("Syncing event ID:", event._id);

      const response = await eventAPI.registerForEvent(event._id);
      
      console.log("Backend Response:", response.data);
      alert(`✅ Success! "${event.title}" unga Google Calendar-la add aagiduchu!`);
    } catch (err) {
      console.error('Calendar sync error:', err);
      
      // Handle specific error messages
      if (err.response?.status === 400) {
        if (err.response?.data?.message?.includes('Already registered')) {
          alert(`This event is already added to your calendar!\n\n${event.title}`);
        } else {
          alert(`Error: ${err.response?.data?.message || 'Bad request'}`);
        }
      } else if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
      } else if (err.response?.status === 404) {
        alert(`Event not found or no longer available.\n\n${err.response?.data?.message}`);
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
        alert(`Failed to sync event!\n\nError: ${errorMessage}\n\nPlease check your connection and try again.`);
      }
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <div className="loading">Loading event details...</div>;
  if (!event) return <div className="error-message">Event not found</div>;

  return (
    <div className="event-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="event-detail-container">
        {event.posterUrl && (
          <div className="event-poster-large">
            <img
              src={getImageUrl(event.posterUrl)}
              alt={event.title}
              onError={handleImageError}
            />
          </div>
        )}

        <div className="event-info">
          <span className={`event-sector-badge sector-${event.sector}`}>
            {event.sector.toUpperCase()}
          </span>

          <h1>{event.title}</h1>

          <div className="event-meta">
            <div className="meta-item">
              <strong>Date:</strong>
              <p>{new Date(event.eventDate).toLocaleDateString()}</p>
            </div>
            <div className="meta-item">
              <strong>Time:</strong>
              <p>{event.eventTime || 'TBD'}</p>
            </div>
            <div className="meta-item">
              <strong>Location:</strong>
              <p>
                {event.location?.address}, {event.location?.city}, {event.location?.state}
              </p>
            </div>
          </div>

          <div className="event-description">
            <h3>Event Details</h3>
            <p>{event.description}</p>
          </div>

          <div className="registration-section" style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link-btn"
            >
              {event.sector === 'industry' ? 'Visit Career Page' : 'Official Link'}
            </a>
            
            {/* Add to Calendar Button Styled */}
            <button 
              onClick={handleCalendarSync} 
              className="sync-calendar-btn"
              disabled={syncing}
              style={{ 
                backgroundColor: '#4285F4', color: 'white', border: 'none', 
                padding: '12px 24px', borderRadius: '8px', cursor: 'pointer',
                fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              📅 {syncing ? 'Syncing...' : 'Add to Calendar'}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;