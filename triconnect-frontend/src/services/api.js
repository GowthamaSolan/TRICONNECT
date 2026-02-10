import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  userSignUp: (data) => apiClient.post('/auth/user/signup', data),
  userSignIn: (data) => apiClient.post('/auth/user/signin', data),
  adminSignUp: (data) => apiClient.post('/auth/admin/signup', data),
  googleLogin: (data) => apiClient.post('/auth/google-login', data),
  getCurrentUser: () => apiClient.get('/auth/me'),
  updateProfile: (formData) => apiClient.put('/auth/me', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// Event API calls
export const eventAPI = {
  // Ellathaiyum 'apiClient' nu mathiyacha! Ippo error varadhu.
  getEvents: (params) => apiClient.get('/events', { params }),
  getEventById: (id) => apiClient.get(`/events/${id}`),
  getEventsByCategory: (params) => apiClient.get('/events/category', { params }),
  getEventsByLocation: (lat, lng, radius = 50) => apiClient.get('/events/nearby', { params: { lat, lng, radius } }),
  createEvent: (data) => apiClient.post('/events', data),
  updateEvent: (id, data) => apiClient.put(`/events/${id}`, data),
  deleteEvent: (id) => apiClient.delete(`/events/${id}`),
  // Intha registerForEvent thaan Google Calendar sync-ku mukhkiyam!
  registerForEvent: (eventId) => apiClient.post('/events/register', { eventId }),
  getUserRegisteredEvents: () => apiClient.get('/events/user/registered'),
};

// Notification API calls
export const notificationAPI = {
  getNotifications: () => apiClient.get('/notifications'),
  markAsRead: (notificationId) => apiClient.put(`/notifications/${notificationId}/read`),
  getUnreadCount: () => apiClient.get('/notifications/unread/count'),
};

export default apiClient;