/**
 * Image URL utility functions
 * Constructs proper image URLs based on the API base URL
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const SERVER_BASE_URL = API_BASE_URL.replace('/api', '');

/**
 * Constructs the full image URL
 * If posterUrl is already a full URL (starts with http), returns as is
 * Otherwise appends to server base URL
 * @param {string} posterUrl - The poster URL from database
 * @returns {string} - Full image URL
 */
export const getImageUrl = (posterUrl) => {
  if (!posterUrl) return '';
  
  // If it's already a full URL, return as is
  if (posterUrl.startsWith('http://') || posterUrl.startsWith('https://')) {
    return posterUrl;
  }
  
  // If it's a relative path, construct the full URL
  if (posterUrl.startsWith('/')) {
    return `${SERVER_BASE_URL}${posterUrl}`;
  }
  
  // Otherwise prepend the server base URL
  return `${SERVER_BASE_URL}/${posterUrl}`;
};

/**
 * Handles image load errors
 * @param {Event} e - The error event
 */
export const handleImageError = (e) => {
  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23f0f0f0" width="200" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="14">Image Not Found</text></svg>';
};

const imageUtils = { getImageUrl, handleImageError };

export default imageUtils;
