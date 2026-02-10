# TriConnect - Event Aggregator & Notification Platform

**TriConnect** is a centralized event aggregator platform that connects Users (Students/Public) directly with event organizers from Colleges, Industries, and Government sectors. Once users log in, they receive automated notifications for relevant events.

## Project Structure

```
triconnect-backend/
├── config/              # Database configuration
├── models/              # Mongoose schemas (User, Event, Notification, etc.)
├── controllers/         # Business logic for routes
├── routes/              # API endpoints
├── middleware/          # Authentication & authorization
├── services/            # External service integrations (Email, SMS, Calendar)
├── utils/               # Helper functions (Token utilities, etc.)
├── server.js            # Main server file
├── package.json         # Dependencies
└── .env.example         # Environment variables template

triconnect-frontend/
├── src/
│   ├── components/      # React components (SignUp, SignIn, Navigation, etc.)
│   ├── pages/           # Page components (Dashboard, EventDetail, AdminPanel)
│   ├── services/        # API service calls
│   ├── context/         # React Context (AuthContext)
│   ├── styles/          # CSS files
│   ├── App.js           # Main App component
│   └── index.js         # React entry point
├── public/              # Static files (HTML, manifest)
└── package.json         # Dependencies
```

## Tech Stack

### Backend
- **Framework:** Express.js (Node.js)
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Email Service:** Nodemailer
- **SMS Service:** Twilio
- **Calendar API:** Google Calendar API
- **File Upload:** Multer
- **Validation:** Express Validator

### Frontend
- **Framework:** React.js
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Styling:** CSS3

## Key Features

### 1. **Dual Authentication System**
- User Login (Student/Public)
- Admin Login (College/Industry/Government representatives)
- Google OAuth 2.0 integration
- JWT-based session management

### 2. **User Dashboard**
- Recently Posted Events section
- College Events showcase
- Industry Events (Recruitment, Tech Summits)
- Government Events
- Event filtering by sector and category

### 3. **Event Management**
- Full CRUD operations for admins
- Event details: poster, description, organizer info, location, registration link
- Event categorization (fest, symposium, workshop, recruitment, etc.)
- Event capacity tracking

### 4. **Notification System**
- **Email Notifications** via Nodemailer
  - Registration confirmations
  - Event reminders (24 hours before)
  - New event notifications matching interests
- **SMS Notifications** via Twilio
  - Registration alerts
  - Event reminders
- **Google Calendar Integration**
  - Automatic event addition to user's calendar
  - Calendar reminders (email + pop-up)

### 5. **User Interests**
- Preference settings for College, Industry, Government events
- Personalized event recommendations
- Notification preference management

## Installation & Setup

### Backend Setup

1. **Install Dependencies:**
   ```bash
   cd triconnect-backend
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure Environment Variables:**
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/triconnect
   
   # Server
   PORT=5000
   
   # JWT
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=7d
   
   # Email (Gmail SMTP)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   
   # SMS (Twilio)
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=+1234567890
   
   # Google Calendar API
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
   
   # Frontend
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB:**
   ```bash
   # Windows
   mongod
   
   # macOS/Linux
   mongod --dbpath /usr/local/var/mongodb
   ```

5. **Run Backend:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install Dependencies:**
   ```bash
   cd triconnect-frontend
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure Environment Variables:**
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   REACT_APP_ENV=development
   ```

4. **Run Frontend:**
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/user/signup` - User registration
- `POST /api/auth/user/signin` - User login
- `POST /api/auth/admin/signup` - Admin registration
- `POST /api/auth/google-login` - Google OAuth login
- `GET /api/auth/me` - Get current user (Protected)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `GET /api/events/category?sector=college` - Filter by sector
- `POST /api/events` - Create event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)
- `POST /api/events/register` - Register for event (Protected)
- `GET /api/events/user/registered` - Get user's registered events (Protected)

### Notifications
- `GET /api/notifications` - Get user notifications (Protected)
- `PUT /api/notifications/:notificationId/read` - Mark as read (Protected)
- `GET /api/notifications/unread/count` - Unread count (Protected)

## Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  role: 'user' | 'admin',
  sector: 'college' | 'industry' | 'government' | null,
  googleId: String,
  registeredEvents: [ObjectId],
  notificationPreferences: {
    email: Boolean,
    sms: Boolean,
    calendar: Boolean
  },
  interests: {
    college: Boolean,
    industry: Boolean,
    government: Boolean
  }
}
```

### Event Model
```javascript
{
  title: String,
  description: String,
  sector: 'college' | 'industry' | 'government',
  posterUrl: String,
  eventDate: Date,
  eventTime: String,
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: { lat: Number, lng: Number }
  },
  organizerDetails: {
    name: String,
    email: String,
    phone: String,
    organization: String,
    logo: String
  },
  registrationLink: String,
  category: String,
  capacity: Number,
  registeredUsers: [ObjectId],
  createdBy: ObjectId,
  isActive: Boolean
}
```

### Notification Model
```javascript
{
  userId: ObjectId,
  eventId: ObjectId,
  notificationType: 'registration' | 'new_event' | 'event_reminder' | 'event_update',
  deliveryMethod: 'email' | 'sms' | 'calendar' | 'in-app',
  subject: String,
  message: String,
  status: 'pending' | 'sent' | 'failed' | 'read',
  sentAt: Date,
  metadata: Object
}
```

## Usage Examples

### User Registration & Login
1. Visit `http://localhost:3000/signup`
2. Enter name, email, phone, and password
3. Or sign up with Google
4. Dashboard appears with events from all sectors

### Admin Event Posting
1. Sign up as admin: `http://localhost:3000/admin/signup`
2. Select sector (College/Industry/Government)
3. Navigate to `/admin/panel`
4. Fill event form and post
5. Notifications sent to interested users

### Event Registration
1. Browse events on dashboard
2. Click "View Details" on any event
3. Click "Register for Event"
4. Receive email confirmation + SMS + Calendar invitation

## Configuration Guide

### Setting Up Email (Gmail)
1. Enable 2-factor authentication on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `.env` as `EMAIL_PASSWORD`

### Setting Up Twilio SMS
1. Create account at https://www.twilio.com
2. Get Account SID and Auth Token
3. Purchase a phone number
4. Configure in `.env`

### Setting Up Google Calendar API
1. Create project at Google Cloud Console
2. Enable Google Calendar API
3. Create OAuth 2.0 credentials
4. Configure in `.env`

## Frontend Pages

### Public Pages
- `/signup` - User registration
- `/signin` - User login
- `/admin/signup` - Admin registration

### Protected Pages (User)
- `/dashboard` - Main dashboard with event listings
- `/event/:id` - Event details and registration

### Protected Pages (Admin)
- `/admin/panel` - Post new events form
- `/admin/dashboard` - View and manage posted events

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected routes with middleware
- Input validation with express-validator
- CORS configuration
- Environment variables for sensitive data

## Future Enhancements

1. **Advanced Filtering**
   - Search by event name, location, date range
   - Filter by popularity, ratings

2. **User Profiles**
   - Profile customization
   - Event history and saved events

3. **Analytics**
   - Event attendance tracking
   - Admin dashboard with statistics

4. **Reviews & Ratings**
   - User reviews on events
   - Rating system

5. **Payment Integration**
   - Paid event registration
   - Payment gateway integration

6. **Mobile App**
   - React Native version

7. **Real-time Features**
   - WebSocket for live event updates
   - In-app chat

## Error Handling

The API includes comprehensive error handling:
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Create pull request

## License

This project is open source and available under MIT License.

## Support

For issues, questions, or suggestions, please contact the development team.

---

**TriConnect** - Connecting College, Industry, and Government with Students & Public
