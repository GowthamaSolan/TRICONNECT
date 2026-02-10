import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../services/api';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import '../styles/UserDashboard.css';

export const UserDashboard = () => {
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState({
    recent: [],
    college: [],
    industry: [],
    government: [],
    nearby: [],
  });

  const [filteredEvents, setFilteredEvents] = useState({
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
  const [searchQueries, setSearchQueries] = useState({
    recent: '',
    college: '',
    industry: '',
    government: '',
  });

  const [filterCategory, setFilterCategory] = useState({
    college: 'all',
    industry: 'all',
    government: 'all',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const [recentRes, collegeRes, industryRes, govRes] = await Promise.all([
        eventAPI.getEvents({ limit: 5, sort: '-createdAt' }),
        eventAPI.getEventsByCategory({ sector: 'college' }),
        eventAPI.getEventsByCategory({ sector: 'industry' }),
        eventAPI.getEventsByCategory({ sector: 'government' }),
      ]);

      const newEvents = {
        recent: recentRes.data.events || [],
        college: collegeRes.data.events || [],
        industry: industryRes.data.events || [],
        government: govRes.data.events || [],
      };

      setAllEvents(newEvents);
      setFilteredEvents(newEvents);
    } catch (err) {
      setError('Failed to fetch events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (sector, query) => {
    setSearchQueries({
      ...searchQueries,
      [sector]: query,
    });
    filterEvents(sector, query, filterCategory[sector]);
  };

  const handleCategoryFilter = (sector, category) => {
    setFilterCategory({
      ...filterCategory,
      [sector]: category,
    });
    filterEvents(sector, searchQueries[sector], category);
  };

  const filterEvents = (sector, searchQuery, category) => {
    let filtered = allEvents[sector];

    if (searchQuery.trim()) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (category !== 'all') {
      filtered = filtered.filter((event) => event.category === category);
    }

    setFilteredEvents({
      ...filteredEvents,
      [sector]: filtered,
    });
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  if (loading) return <div className="loading-spinner">Loading your events...</div>;

  return (
    <div className="user-dashboard">
      <header className="dashboard-hero">
        <div className="hero-content">
          <h1>Discover Amazing Events</h1>
          <p>Explore events from College, Industry, and Government sectors</p>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {/* Recently Posted Events Section */}
      <section className="events-section recent-section">
        <div className="section-header">
          <h2>🆕 Recently Posted</h2>
          <p>Latest events added to TriConnect</p>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search recent events..."
            value={searchQueries.recent}
            onChange={(e) => handleSearch('recent', e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        {filteredEvents.recent.length > 0 ? (
          <div className="events-grid">
            {filteredEvents.recent.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onClick={() => handleEventClick(event._id)}
              />
            ))}
          </div>
        ) : (
          <div className="no-events">No recent events found</div>
        )}
      </section>

      {/* College Events Section */}
      <section className="events-section college-section">
        <div className="section-header">
          <h2>🎓 College Events</h2>
          <p>Fests, Webinars & Workshops</p>
        </div>

        <div className="filter-search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search college events..."
              value={searchQueries.college}
              onChange={(e) => handleSearch('college', e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <select
            value={filterCategory.college}
            onChange={(e) => handleCategoryFilter('college', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="fest">Fests</option>
            <option value="symposium">Symposiums</option>
            <option value="webinar">Webinars</option>
            <option value="workshop">Workshops</option>
            <option value="seminar">Seminars</option>
          </select>
        </div>

        {filteredEvents.college.length > 0 ? (
          <div className="events-grid">
            {filteredEvents.college.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                sector="college"
                onClick={() => handleEventClick(event._id)}
              />
            ))}
          </div>
        ) : (
          <div className="no-events">No college events found</div>
        )}
      </section>

      {/* Industry Events Section */}
      <section className="events-section industry-section">
        <div className="section-header">
          <h2>🏢 Industry Events</h2>
          <p>Recruitment, Tech Summits & Conferences</p>
        </div>

        <div className="filter-search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search industry events..."
              value={searchQueries.industry}
              onChange={(e) => handleSearch('industry', e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <select
            value={filterCategory.industry}
            onChange={(e) => handleCategoryFilter('industry', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="recruitment">Recruitment</option>
            <option value="tech-summit">Tech Summit</option>
            <option value="workshop">Workshops</option>
            <option value="seminar">Seminars</option>
          </select>
        </div>

        {filteredEvents.industry.length > 0 ? (
          <div className="events-grid">
            {filteredEvents.industry.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                sector="industry"
                onClick={() => handleEventClick(event._id)}
              />
            ))}
          </div>
        ) : (
          <div className="no-events">No industry events found</div>
        )}
      </section>

      {/* Government Events Section */}
      <section className="events-section government-section">
        <div className="section-header">
          <h2>🏛️ Government Events</h2>
          <p>Public Events & Initiatives</p>
        </div>

        <div className="filter-search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search government events..."
              value={searchQueries.government}
              onChange={(e) => handleSearch('government', e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <select
            value={filterCategory.government}
            onChange={(e) => handleCategoryFilter('government', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="seminar">Seminars</option>
            <option value="workshop">Workshops</option>
            {/* Symposium removed for Government sector per update */}
            <option value="fest">Public Events</option>
          </select>
        </div>

        {filteredEvents.government.length > 0 ? (
          <div className="events-grid">
            {filteredEvents.government.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                sector="government"
                onClick={() => handleEventClick(event._id)}
              />
            ))}
          </div>
        ) : (
          <div className="no-events">No government events found</div>
        )}
      </section>
    </div>
  );
};

const EventCard = ({ event, sector, onClick }) => {
  const getCategoryColor = (category) => {
    const colors = {
      fest: '#FF6B6B',
      symposium: '#4ECDC4',
      webinar: '#9B59B6',
      workshop: '#45B7D1',
      recruitment: '#F7B731',
      'tech-summit': '#5F27CD',
      seminar: '#00D2D3',
    };
    return colors[category] || '#6C5CE7';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="event-card" onClick={onClick}>
      <div className="event-image">
        {event.posterUrl ? (
          <img
            src={getImageUrl(event.posterUrl)}
            alt={event.title}
            onError={handleImageError}
          />
        ) : (
          <div className="placeholder-image">📷</div>
        )}
        <div
          className="category-badge"
          style={{ backgroundColor: getCategoryColor(event.category) }}
        >
          {event.category}
        </div>
      </div>

      <div className="event-content">
        <h3>{event.title}</h3>
        <p className="event-description">{event.description.substring(0, 80)}...</p>

        <div className="event-meta">
          <span className="event-date">📅 {formatDate(event.eventDate)}</span>
          {event.eventTime && <span className="event-time">⏰ {event.eventTime}</span>}
        </div>

        <div className="event-location">
          📍 {event.location?.city}, {event.location?.state}
        </div>

        <button className="view-details-btn">View Details →</button>
      </div>
    </div>
  );
};

export default UserDashboard;
