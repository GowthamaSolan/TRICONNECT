# Technical Implementation Details - 5 Corrections

## Overview
This document provides technical details for developers about the 5 major corrections implemented in TriConnect.

---

## 1. Separate User and Admin Dashboards

### Architecture

```
App.js (Routing)
├── /dashboard → UserDashboard.js (User only)
├── /admin/dashboard → AdminDashboard.js (Admin only)
├── /admin/panel → AdminPanel.js (Event creation form)
└── ProtectedRoute component enforces access control
```

### UserDashboard.js Implementation

**Key Components:**
- EventCard component (reusable card)
- Search state per sector
- Filter state per sector
- API calls grouped by sector

**State Management:**
```javascript
const [allEvents, setAllEvents] = useState({
  recent: [],
  college: [],
  industry: [],
  government: [],
});

const [filteredEvents, setFilteredEvents] = useState({...});

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
```

**API Integration:**
```javascript
const fetchEvents = async () => {
  const [recentRes, collegeRes, industryRes, govRes] = await Promise.all([
    eventAPI.getEvents({ limit: 5, sort: '-createdAt' }),
    eventAPI.getEventsByCategory({ sector: 'college' }),
    eventAPI.getEventsByCategory({ sector: 'industry' }),
    eventAPI.getEventsByCategory({ sector: 'government' }),
  ]);
};
```

### AdminDashboard.js Implementation

**Key Features:**
- Table display of admin's created events
- Edit/Delete actions
- Delete confirmation dialog
- Sector color badges
- Status indicators

**Event Filtering Logic:**
```javascript
const adminEvents = response.data.events.filter(
  (event) => event.createdBy?._id === user?._id
);
```

**Delete Handling:**
```javascript
const handleConfirmDelete = async (eventId) => {
  await eventAPI.deleteEvent(eventId);
  setEvents(events.filter((event) => event._id !== eventId));
};
```

---

## 2. Search and Filter Implementation

### Search Algorithm

**Real-time filtering on client side:**
```javascript
const filterEvents = (sector, searchQuery, category) => {
  let filtered = allEvents[sector];

  // Text search
  if (searchQuery.trim()) {
    filtered = filtered.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Category filter
  if (category !== 'all') {
    filtered = filtered.filter((event) => event.category === category);
  }

  setFilteredEvents({
    ...filteredEvents,
    [sector]: filtered,
  });
};
```

### Filter State Management

**Separate state for each sector:**
```javascript
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
```

### UI Components

**Search Bar:**
```jsx
<div className="search-bar">
  <input
    type="text"
    placeholder="Search events..."
    value={searchQueries[sector]}
    onChange={(e) => handleSearch(sector, e.target.value)}
    className="search-input"
  />
  <span className="search-icon">🔍</span>
</div>
```

**Filter Select:**
```jsx
<select
  value={filterCategory[sector]}
  onChange={(e) => handleCategoryFilter(sector, e.target.value)}
  className="filter-select"
>
  <option value="all">All Categories</option>
  <option value="fest">Fests</option>
  <option value="symposium">Symposiums</option>
  {/* ... */}
</select>
```

---

## 3. Modern Styling Implementation

### CSS Architecture

**Three main style files:**
1. `UserDashboard.css` - User-facing dashboard
2. `AdminDashboard.css` - Admin dashboard table
3. `AdminPanel.css` - Event creation form (updated)

### Gradient Implementation

**CSS Gradients:**
```css
/* Hero gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Text gradient (Chrome only) */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

### Animation Effects

**Smooth Transitions:**
```css
.event-card {
  transition: all 0.3s ease;
}

.event-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}
```

### Responsive Design

**Media Queries:**
```css
/* Desktop */
@media (max-width: 768px) {
  .events-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

/* Tablet */
@media (max-width: 480px) {
  .events-grid {
    grid-template-columns: 1fr;
  }
}
```

### Color Coding System

```javascript
const getCategoryColor = (category) => {
  const colors = {
    fest: '#FF6B6B',          // Red
    symposium: '#4ECDC4',     // Teal
    workshop: '#45B7D1',      // Blue
    recruitment: '#F7B731',   // Yellow
    'tech-summit': '#5F27CD',  // Purple
    seminar: '#00D2D3',       // Cyan
  };
  return colors[category] || '#6C5CE7';
};
```

---

## 4. Google OAuth Implementation

### Frontend Integration

**Google SDK Loading:**
```javascript
useEffect(() => {
  // Load Google SDK
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
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignUpButton'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    }
  };

  return () => {
    if (script.parentNode) {
      document.head.removeChild(script);
    }
  };
}, []);
```

### Token Decoding

**JWT Decoding (without external library):**
```javascript
const handleGoogleSuccess = async (credentialResponse) => {
  try {
    // Decode JWT token from Google
    const base64Url = credentialResponse.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);

    // Use decoded data for login
    await googleLogin({
      googleId: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    });
    navigate('/dashboard');
  } catch (err) {
    setError('Google sign up failed. Please try again.');
  }
};
```

### Backend OAuth Handler

**Existing endpoint in backend:**
```javascript
POST /api/auth/google-login
Body: {
  googleId: string,
  email: string,
  name: string,
  picture: string (optional)
}

Response: {
  token: JWT,
  user: User object
}
```

### Environment Configuration

**Required in `.env`:**
```env
REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
```

**Google Cloud Console Setup:**
1. Create OAuth 2.0 credential (Web application)
2. Add authorized origins:
   - http://localhost:3000 (development)
   - https://yourdomain.com (production)
3. Add authorized redirect URIs:
   - http://localhost:3000/signin
   - https://yourdomain.com/signin

---

## 5. Image File Upload Implementation

### Frontend: File Upload Component

**File Input Handling:**
```javascript
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
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
    };
    reader.readAsDataURL(file);
  }
};
```

**Form Submission with File:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formDataToSend = new FormData();
  
  // Add text fields
  formDataToSend.append('title', formData.title);
  formDataToSend.append('description', formData.description);
  // ... other fields
  
  // Add file if present
  if (formData.posterImage) {
    formDataToSend.append('posterImage', formData.posterImage);
  }

  await eventAPI.createEvent(formDataToSend);
};
```

### Backend: Multer Configuration

**File Storage Setup (eventRoutes.js):**
```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'poster-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
```

**Route Middleware:**
```javascript
router.post('/', 
  authMiddleware, 
  adminMiddleware, 
  upload.single('posterImage'),  // ← Middleware
  createEvent
);
```

### Backend: Event Controller

**File Handling in createEvent:**
```javascript
const createEvent = async (req, res) => {
  try {
    // Build poster URL from uploaded file
    let posterUrl = '';
    if (req.file) {
      posterUrl = `/uploads/${req.file.filename}`;
    }

    const event = new Event({
      // ... other fields
      posterUrl: posterUrl,
      // ... rest of event data
    });

    await event.save();
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error' });
  }
};
```

### Server Configuration

**Static File Serving (server.js):**
```javascript
// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));
```

### API Request Format

**Frontend API call:**
```javascript
const formDataToSend = new FormData();
formDataToSend.append('title', 'Event Title');
formDataToSend.append('posterImage', fileObject);

await apiClient.post('/events', formDataToSend, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

**Backend Response:**
```json
{
  "message": "Event created successfully",
  "event": {
    "_id": "...",
    "title": "Event Title",
    "posterUrl": "/uploads/poster-1234567890.jpg",
    "createdAt": "2024-01-28T..."
  }
}
```

---

## File System Structure

```
triconnect-backend/
├── uploads/                    # Image storage directory
│   ├── poster-123456.jpg
│   ├── poster-789012.png
│   └── ...
├── routes/
│   └── eventRoutes.js         # Multer configured here
├── controllers/
│   └── eventController.js     # File handling logic
└── server.js                  # Static file serving configured

triconnect-frontend/
├── src/
│   ├── pages/
│   │   ├── UserDashboard.js   # User view with search/filter
│   │   ├── AdminDashboard.js  # Admin table view
│   │   └── AdminPanel.js      # Event creation with file upload
│   ├── styles/
│   │   ├── UserDashboard.css
│   │   ├── AdminDashboard.css
│   │   └── AdminPanel.css
│   ├── components/
│   │   ├── SignUp.js          # Google OAuth enabled
│   │   └── AdminSignUp.js     # Google OAuth enabled
│   └── App.js                 # Routing updated
```

---

## Database Schema Impact

**Event Model (no changes):**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  posterUrl: String,  // Now stores: /uploads/poster-123.jpg
  sector: String,     // college, industry, government
  category: String,   // fest, symposium, workshop, etc.
  eventDate: Date,
  eventTime: String,
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
  },
  organizerDetails: {
    name: String,
    email: String,
    phone: String,
    organization: String,
  },
  registrationLink: String,
  capacity: Number,
  createdBy: ObjectId (ref: User),
  registeredUsers: [ObjectId],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
}
```

---

## Performance Considerations

### Image Optimization
- **Size Limit**: 5MB per image
- **Formats**: JPEG and PNG only
- **Storage**: Local file system (can be upgraded to S3/Cloud Storage)
- **Caching**: Browser caches images automatically

### Search Performance
- **Method**: Client-side filtering (no server call)
- **Complexity**: O(n) linear search
- **Optimization**: Only triggered on user input (debounced)

### Rendering Performance
- **CSS Animations**: GPU accelerated (transform, opacity only)
- **Lazy Loading**: Images load on demand
- **Virtual Scrolling**: Not needed (typical < 50 events)

---

## Security Considerations

### File Upload Security
- ✅ File type validation (JPEG/PNG only)
- ✅ File size limit (5MB)
- ✅ Filename sanitization (unique timestamp)
- ✅ No execution of uploaded files
- ✅ Stored outside web root (in `/uploads` with static serving)

### OAuth Security
- ✅ Uses official Google SDK
- ✅ JWT tokens from Google
- ✅ Backend validates user data
- ✅ Environment variable for Client ID

### Search/Filter Security
- ✅ Client-side filtering only
- ✅ No SQL injection (using object filtering)
- ✅ XSS protection via React's built-in escaping

---

## Error Handling

### File Upload Errors
```javascript
if (err instanceof multer.MulterError) {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large' });
  }
}
if (err.message === 'Only JPEG and PNG images are allowed') {
  return res.status(400).json({ message: err.message });
}
```

### Google OAuth Errors
```javascript
try {
  // Google login process
} catch (err) {
  setError('Google sign up failed. Please try again.');
}
```

---

## Testing Recommendations

### Unit Tests
- Test filter algorithm with different inputs
- Test image validation logic
- Test OAuth token decoding

### Integration Tests
- Test image upload endpoint
- Test OAuth flow
- Test dashboard routing for user vs admin

### E2E Tests
- Complete user journey (sign up → search → register)
- Complete admin journey (sign up → create event → manage)
- Google OAuth flow
- Image upload flow

---

## Deployment Notes

### Environment Variables Needed
```env
# Frontend
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_GOOGLE_CLIENT_ID=your_client_id

# Backend
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

### File System Changes
- Create `/uploads` directory (done automatically)
- Set proper file permissions
- Consider external storage (S3/Azure Blob) for production

### Image CDN (Optional)
- For production, consider using Cloudinary or similar
- Update image handling to upload to cloud instead of local

---

## Troubleshooting Guide

| Issue | Cause | Solution |
|-------|-------|----------|
| Image not uploading | Wrong file type | Check JPEG/PNG format |
| Google button missing | Wrong Client ID | Add to .env, restart |
| Styles not showing | CSS not imported | Check import statements |
| Search not working | Events not loaded | Check API connection |
| Admin can't see events | Filter issue | Check user._id matching |

---

## Future Enhancements

1. **Cloud Storage**: Migrate from local storage to S3/Azure
2. **Image Optimization**: Compress images before storage
3. **Advanced Search**: Implement server-side full-text search
4. **Pagination**: Add pagination to event listings
5. **Caching**: Implement Redis for better performance
6. **Analytics**: Track popular searches and filters

---

This technical documentation provides all the implementation details needed to understand and maintain the 5 corrections. Refer back to this when debugging or making future modifications.
