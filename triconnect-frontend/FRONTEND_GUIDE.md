# TriConnect Frontend - React Application

Modern, responsive React frontend for the TriConnect Event Aggregator Platform.

## Quick Start

```bash
cd triconnect-frontend
npm install
cp .env.example .env
# Configure .env with backend URL
npm start
```

App runs on `http://localhost:3000`

## Project Structure

```
src/
├── components/           # Reusable React components
│   ├── SignUp.js
│   ├── SignIn.js
│   ├── AdminSignUp.js
│   ├── Navigation.js
│   └── Navigation.css
├── pages/               # Page components (full page views)
│   ├── Dashboard.js
│   ├── EventDetail.js
│   └── AdminPanel.js
├── services/            # API integration
│   └── api.js
├── context/             # React Context for state management
│   └── AuthContext.js
├── styles/              # Global and component styles
│   ├── Auth.css
│   ├── Dashboard.css
│   ├── EventDetail.css
│   └── AdminPanel.css
├── App.js               # Main app component with routing
├── App.css
├── index.js
├── index.css
public/
├── index.html
├── manifest.json
└── favicon.ico
package.json
.env.example
```

## Components

### Authentication Components

#### `SignUp.js`
User registration form
- Name, email, phone, password fields
- Password confirmation validation
- Google Sign Up button
- Error handling and loading states

```jsx
<SignUp />
```

#### `SignIn.js`
User login form
- Email/username and password fields
- Remember me option
- Google Sign In button
- Error handling

```jsx
<SignIn />
```

#### `AdminSignUp.js`
Admin registration form
- Organization type selection (College/Industry/Government)
- Organization name field
- Same fields as user signup
- Separate registration for admins

```jsx
<AdminSignUp />
```

#### `Navigation.js`
Top navigation bar
- Logo and branding
- Navigation links (Dashboard/Events/Admin Panel)
- User profile menu
- Logout button
- Mobile responsive hamburger menu

```jsx
<Navigation />
```

### Page Components

#### `Dashboard.js`
Main user dashboard
- Recently posted events (5 events)
- College events section (colored by sector)
- Industry events section
- Government events section
- Event cards with quick info
- Responsive grid layout

Features:
- Real-time event fetching
- Sector-based color coding
- Event registration links
- Event date and location display

```jsx
<Dashboard />
```

#### `EventDetail.js`
Detailed event view
- Full event poster image
- Event title and description
- Organizer information with logo
- Location details
- Event date and time
- Registration button
- External link to company portal/government site
- Already registered indicator

Features:
- Protected route (requires authentication)
- Event registration with confirmations
- Mobile responsive layout

```jsx
<EventDetail />
```

#### `AdminPanel.js`
Event creation form for admins
- Event title and description
- Sector selection (College/Industry/Government)
- Category selection (Fest/Symposium/Workshop/etc)
- Event date and time picker
- Poster URL input
- Location details (address, city, state, zip)
- Organizer information fields
- Registration link input
- Event capacity field
- Form validation
- Success/error messages

Features:
- Protected route (admin only)
- Multi-section form
- Automatic user notification on event creation
- Form reset on successful submission

```jsx
<AdminPanel />
```

## Services

### `api.js` - API Client
Axios-based HTTP client for backend communication

```javascript
import { authAPI, eventAPI, notificationAPI } from '../services/api';

// Authentication
authAPI.userSignUp(data)
authAPI.userSignIn(data)
authAPI.adminSignUp(data)
authAPI.googleLogin(data)
authAPI.getCurrentUser()

// Events
eventAPI.getEvents(params)
eventAPI.getEventById(id)
eventAPI.getEventsByCategory(params)
eventAPI.createEvent(data)
eventAPI.updateEvent(id, data)
eventAPI.deleteEvent(id)
eventAPI.registerForEvent(eventId)
eventAPI.getUserRegisteredEvents()

// Notifications
notificationAPI.getNotifications()
notificationAPI.markAsRead(notificationId)
notificationAPI.getUnreadCount()
```

Features:
- Automatic JWT token injection
- Request/response interceptors
- Centralized error handling
- Base URL configuration from .env

## Context & State Management

### `AuthContext.js` - Authentication Context

Manages user authentication state globally

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const {
    user,           // Current user object
    token,          // JWT token
    loading,        // Auth loading state
    signUp,         // User signup function
    signIn,         // User login function
    adminSignUp,    // Admin signup function
    googleLogin,    // Google OAuth function
    logout,         // Logout function
    isAuthenticated, // Boolean: user logged in
    isAdmin         // Boolean: user is admin
  } = useAuth();

  return (
    // Component JSX
  );
}
```

**Provider Setup:**
Wrap app in `<AuthProvider>`

```jsx
<AuthProvider>
  <App />
</AuthProvider>
```

## Styling

### Color Scheme
```css
--primary-color: #3498db (Blue)
--secondary-color: #2c3e50 (Dark)
--college-color: #9b59b6 (Purple)
--industry-color: #e74c3c (Red)
--government-color: #27ae60 (Green)
```

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px, 1024px, 1200px
- Flexible grid layouts
- Touch-friendly buttons

## Routing

Using React Router v6:

```
/                          → Redirect to /signin or /dashboard
/signup                    → User registration
/signin                    → User login
/admin/signup              → Admin registration
/dashboard                 → Main dashboard (protected)
/event/:id                 → Event details (protected)
/admin/panel               → Event posting form (admin only)
```

Protected routes redirect unauthenticated users to login.
Admin routes redirect non-admin users to dashboard.

## Environment Configuration

Create `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_ENV=development
```

## User Flows

### User Registration & Login Flow
1. User opens `/signup`
2. Fills registration form
3. Clicks "Sign Up"
4. Token saved to localStorage
5. Redirected to `/dashboard`
6. Navigation shows user profile

### Event Browsing Flow
1. User at `/dashboard`
2. Sees events from all sectors
3. Clicks "View Details" on event
4. Redirected to `/event/:id`
5. Views full event information

### Event Registration Flow
1. At event detail page
2. Clicks "Register for Event"
3. Backend sends:
   - Email confirmation
   - SMS notification
   - Google Calendar invite
4. Shows "You are registered" badge
5. User receives notifications

### Admin Event Posting Flow
1. Admin navigates to `/admin/panel`
2. Fills event creation form
3. Selects sector and category
4. Uploads poster and details
5. Clicks "Post Event"
6. All interested users notified
7. Event appears on dashboards

## Component Communication

### Parent to Child
Props drilling for data passing

```jsx
<EventCard event={event} sector="college" />
```

### Child to Parent
Callback functions

```jsx
handleRegister={() => registerEvent(eventId)}
```

### Global State
AuthContext for authentication state

```jsx
const { user, isAuthenticated } = useAuth();
```

## Form Handling

Forms use React state hooks:

```jsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  // ...
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

const handleSubmit = (e) => {
  e.preventDefault();
  // API call
};
```

## Error Handling

Error messages displayed to users:
- Validation errors
- API errors
- Network errors
- Authentication errors

```jsx
{error && <div className="error-message">{error}</div>}
```

## Loading States

- Buttons show loading text
- Forms disable during submission
- Pages show loading spinner
- API calls show loading indicators

```jsx
<button disabled={loading}>
  {loading ? 'Loading...' : 'Submit'}
</button>
```

## Performance Optimization

- Component lazy loading with React.lazy (optional)
- Memoization with React.memo (for list items)
- Event handler optimization
- CSS optimizations

## Best Practices

1. **Separation of Concerns**
   - Components only render UI
   - Services handle API calls
   - Context manages global state

2. **Reusability**
   - DRY principle
   - Reusable components
   - Shared utilities

3. **Error Handling**
   - Try-catch in async functions
   - User-friendly error messages
   - Graceful degradation

4. **Accessibility**
   - Semantic HTML
   - ARIA labels
   - Keyboard navigation

5. **Code Organization**
   - Logical folder structure
   - Clear naming conventions
   - Comments for complex logic

## Testing

Recommended testing setup:
- Jest for unit tests
- React Testing Library for component tests
- Mock API responses

```bash
npm test
```

## Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` folder.

## Deployment

### Using GitHub Pages
```bash
npm run build
# Deploy build/ folder to gh-pages
```

### Using Netlify
```bash
npm run build
# Connect GitHub repo to Netlify
```

### Using Vercel
```bash
# Connect GitHub repo to Vercel
# Auto-deploys on every push
```

## Troubleshooting

### API Connection Issues
- Check backend running on port 5000
- Verify REACT_APP_API_URL in .env
- Check CORS configuration

### Authentication Issues
- Clear localStorage and reload
- Verify JWT token format
- Check token expiration

### Styling Issues
- Check CSS file imports
- Verify color variables
- Check media query breakpoints

## Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "axios": "^1.3.4",
  "jwt-decode": "^3.1.2"
}
```

## Scripts

```bash
npm start              # Start development server
npm run build          # Build for production
npm test               # Run tests
npm run eject          # Eject from Create React App (irreversible)
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Create pull request

## License

MIT License - See main README.md

## Support

For questions or issues, refer to the main project README.md
