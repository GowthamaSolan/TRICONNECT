import React, { useState, useEffect } from 'react';
import { eventAPI } from '../services/api';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import '../styles/Dashboard.css';

export const Dashboard = () => {
  const [events, setEvents] = useState({
    recent: [],
    college: [],
    industry: [],
    government: [],
    nearby: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const [recentRes, collegeRes, industryRes, govRes] = await Promise.all([
        eventAPI.getEvents({ limit: 5 }),
        eventAPI.getEventsByCategory({ sector: 'college' }),
        eventAPI.getEventsByCategory({ sector: 'industry' }),
        eventAPI.getEventsByCategory({ sector: 'government' }),
      ]);

      setEvents({
        recent: recentRes.data.events,
        college: collegeRes.data.events,
        industry: industryRes.data.events,
        government: govRes.data.events,
        nearby: [],
      });
    } catch (err) {
      setError('Failed to fetch events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = async () => {
    setLocationError('');
    setLocationLoading(true);

    // Check if geolocation API is available
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocationLoading(false);
      return;
    }

    // Request user's location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log(`📍 User location: ${latitude}, ${longitude}`);

          // Call backend API to get nearby events
          const response = await eventAPI. getEventsByLocation(latitude, longitude, 50); // 50km radius

          setEvents((prev) => ({
            ...prev,
            nearby: response.data.events,
          }));

          // Scroll to nearby events section
          setTimeout(() => {
            const nearbySection = document.getElementById('nearby-section');
            if (nearbySection) {
              nearbySection.scrollIntoView({ behavior: 'smooth' });
            }
          }, 300);
        } catch (err) {
          console.error('Error fetching nearby events:', err);
          setLocationError(
            err.response?.data?.message || 'Failed to fetch nearby events. Please try again.'
          );
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);
        // Handle different geolocation error codes
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('📍 Please allow location access to see nearby events');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationError('Location information is unavailable. Please check your settings.');
        } else if (error.code === error.TIMEOUT) {
          setLocationError('Location request timed out. Please try again.');
        } else {
          setLocationError('Error getting location. Please try again.');
        }
        console.error('Geolocation error:', error);
      }
    );
  };

  if (loading) return <div className="loading">Loading events...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-overlay">
        <header className="dashboard-header">
          <h1>Welcome to TriConnect</h1>
          <p>Discover and Sync Events to your Google Calendar</p>
        </header>
        
        {error && <div className="error-message">{error}</div>}

        {/* Nearby Events Section */}
        {events.nearby && events.nearby.length > 0 && (
          <section className="events-section nearby-section" id="nearby-section">
            <h2 className="section-title">📍 Events Near You</h2>
            <p className="section-subtitle">Events within 50km of your location</p>
            <div className="events-grid">
              {events.nearby.map((event) => (
                <EventCard key={event._id} event={event} sector={event.sector} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Posted Section */}
        <section className="events-section">
          <div className="section-header">
            <h2 className="section-title">Recently Posted Events</h2>
            <button 
              onClick={handleLocationSearch} 
              disabled={locationLoading}
              className="near-me-btn"
              title="Find events near your location"
            >
              📍 {locationLoading ? 'Getting location...' : 'Near Me'}
            </button>
          </div>
          {locationError && (
            <div className="location-error-message">{locationError}</div>
          )}
          <div className="events-grid">
            {events.recent.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </section>

        {/* College Events Section */}
        <section className="events-section college-section">
          <h2 className="section-title">College Events</h2>
          <div className="events-grid">
            {events.college.slice(0, 4).map((event) => (
              <EventCard key={event._id} event={event} sector="college" />
            ))}
          </div>
        </section>

        {/* Industry Events Section */}
        <section className="events-section industry-section">
          <h2 className="section-title">Industry Events</h2>
          <div className="events-grid">
            {events.industry.slice(0, 4).map((event) => (
              <EventCard key={event._id} event={event} sector="industry" />
            ))}
          </div>
        </section>

        {/* Government Events Section */}
        <section className="events-section government-section">
          <h2 className="section-title">Government Events</h2>
          <div className="events-grid">
            {events.government.slice(0, 4).map((event) => (
              <EventCard key={event._id} event={event} sector="government" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const EventCard = ({ event, sector }) => {
  const handleSync = async () => {
    // Normal login token irukka nu check pandrom
    const token = localStorage.getItem('token'); 
    
    if (!token) {
      alert("Please login first!");
      return;
    }

    try {
      // Backend api-la 'registerForEvent' call panni Google Calendar-ai trigger pandrom
      await eventAPI.registerForEvent(event._id); 
      alert(`Success! "${event.title}" is now on your Google Calendar. 📅`);
    } catch (err) {
      console.error("Calendar sync failed:", err);
      // Backend terminal-la permission error vandha idhu thaan alert aagum
      alert("Sync failed! Unga Google account link aagi irukkannu check pannunga.");
    }
  };

  return (
    <div className={`event-card sector-${sector || event.sector}`}>
      {event.posterUrl && (
        <div className="event-poster">
          <img src={getImageUrl(event.posterUrl)} alt={event.title} onError={handleImageError} />
        </div>
      )}
      <div className="event-content">
        <h3>{event.title}</h3>
        <p className="event-location">{event.location?.city || 'Virtual'}</p>
        <p className="event-date">{new Date(event.eventDate).toLocaleDateString()}</p>
        
        <div className="card-actions">
          <a href={`/event/${event._id}`} className="view-btn">View Details</a>
          {/* Calendar Sync Button */}
          <button onClick={handleSync} className="sync-btn">
            📅 Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;