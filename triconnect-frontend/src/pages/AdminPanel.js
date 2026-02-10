import React, { useState } from 'react';
import { eventAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPanel.css';

export const AdminPanel = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sector: 'college',
    posterImage: null,
    posterPreview: '',
    eventDate: '',
    eventTime: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
    organizerDetails: {
      name: '',
      email: '',
      phone: '',
      organization: '',
    },
    registrationLink: '',
    category: 'fest',
    capacity: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG or PNG)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          posterImage: file,
          posterPreview: reader.result,
        });
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add all text fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('sector', formData.sector);
      formDataToSend.append('eventDate', formData.eventDate);
      formDataToSend.append('eventTime', formData.eventTime);
      formDataToSend.append('registrationLink', formData.registrationLink);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('capacity', formData.capacity);
      
      // Add location
      formDataToSend.append('location[address]', formData.location.address);
      formDataToSend.append('location[city]', formData.location.city);
      formDataToSend.append('location[state]', formData.location.state);
      formDataToSend.append('location[zipCode]', formData.location.zipCode);
      
      // Add organizer details
      formDataToSend.append('organizerDetails[name]', formData.organizerDetails.name);
      formDataToSend.append('organizerDetails[email]', formData.organizerDetails.email);
      formDataToSend.append('organizerDetails[phone]', formData.organizerDetails.phone);
      formDataToSend.append('organizerDetails[organization]', formData.organizerDetails.organization);
      
      // Add file if present
      if (formData.posterImage) {
        formDataToSend.append('posterImage', formData.posterImage);
      }

      await eventAPI.createEvent(formDataToSend);
      setSuccess('Event created successfully!');
      setFormData({
        title: '',
        description: '',
        sector: 'college',
        posterImage: null,
        posterPreview: '',
        eventDate: '',
        eventTime: '',
        location: {
          address: '',
          city: '',
          state: '',
          zipCode: '',
        },
        organizerDetails: {
          name: '',
          email: '',
          phone: '',
          organization: '',
        },
        registrationLink: '',
        category: 'fest',
        capacity: '',
      });
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Event creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Post New Event</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-section">
          <h2>Basic Information</h2>

          <div className="form-group">
            <label>Event Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter event title"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Sector *</label>
              <select name="sector" value={formData.sector} onChange={handleChange} required>
                <option value="college">College</option>
                <option value="industry">Industry</option>
                <option value="government">Government</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="fest">Fest</option>
                <option value="symposium">Symposium</option>
                <option value="webinar">Webinar</option>
                <option value="workshop">Workshop</option>
                <option value="recruitment">Recruitment</option>
                <option value="tech-summit">Tech Summit</option>
                <option value="seminar">Seminar</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Detailed event description"
              rows="5"
            />
          </div>

          <div className="form-group">
            <label>Event Poster Image (JPEG/PNG) *</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="posterFile"
                name="posterImage"
                onChange={handleFileChange}
                accept=".jpeg,.jpg,.png,image/jpeg,image/png"
                className="file-input"
              />
              <label htmlFor="posterFile" className="file-label">
                <span className="file-icon">📸</span>
                <span className="file-text">
                  {formData.posterImage ? 'Change Image' : 'Choose Poster Image'}
                </span>
              </label>
            </div>
            {formData.posterPreview && (
              <div className="image-preview">
                <img src={formData.posterPreview} alt="Poster Preview" />
                <span className="preview-label">Preview</span>
              </div>
            )}
            <p className="file-info">Supported: JPEG, PNG (Max 5MB)</p>
          </div>
        </div>

        <div className="form-section">
          <h2>Event Date & Time</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Event Date *</label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Event Time</label>
              <input
                type="time"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Capacity (Optional)</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Number of participants"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Location</h2>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              placeholder="Street address"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                placeholder="City"
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>

            <div className="form-group">
              <label>Zip Code</label>
              <input
                type="text"
                name="location.zipCode"
                value={formData.location.zipCode}
                onChange={handleChange}
                placeholder="Zip code"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Organizer Details</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Organization Name</label>
              <input
                type="text"
                name="organizerDetails.organization"
                value={formData.organizerDetails.organization}
                onChange={handleChange}
                placeholder="Organization/College/Company name"
              />
            </div>

            <div className="form-group">
              <label>Contact Name</label>
              <input
                type="text"
                name="organizerDetails.name"
                value={formData.organizerDetails.name}
                onChange={handleChange}
                placeholder="Contact person name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="organizerDetails.email"
                value={formData.organizerDetails.email}
                onChange={handleChange}
                placeholder="Contact email"
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="organizerDetails.phone"
                value={formData.organizerDetails.phone}
                onChange={handleChange}
                placeholder="Contact phone"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label>Registration Link *</label>
            <input
              type="url"
              name="registrationLink"
              value={formData.registrationLink}
              onChange={handleChange}
              required
              placeholder="https://example.com/register"
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating Event...' : 'Post Event'}
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
