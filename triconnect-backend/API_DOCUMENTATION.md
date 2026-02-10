# TriConnect Backend API Documentation

Complete REST API for the TriConnect Event Aggregator Platform.

## Quick Start

```bash
cd triconnect-backend
npm install
cp .env.example .env
# Configure .env with your settings
npm run dev
```

Server runs on `http://localhost:5000`

## Environment Configuration

Create `.env` file with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/triconnect
DB_NAME=triconnect

# Server
PORT=5000
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=7d

# Email Notifications (Gmail SMTP)
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_app_password_not_regular_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# SMS Notifications (Twilio)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Google Calendar API
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# Firebase (Optional)
FIREBASE_PROJECT_ID=your_project
FIREBASE_PRIVATE_KEY=your_key
FIREBASE_CLIENT_EMAIL=your_email

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Authentication Routes `/api/auth`

#### User Signup
- **POST** `/api/auth/user/signup`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "password": "securepass123",
    "confirmPassword": "securepass123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully",
    "token": "eyJhbGc...",
    "user": { /* user object */ }
  }
  ```

#### User Signin
- **POST** `/api/auth/user/signin`
- **Body:**
  ```json
  {
    "emailOrUsername": "john@example.com",
    "password": "securepass123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Sign in successful",
    "token": "eyJhbGc...",
    "user": { /* user object */ }
  }
  ```

#### Google Login
- **POST** `/api/auth/google-login`
- **Body:**
  ```json
  {
    "googleId": "google_id_token",
    "email": "user@gmail.com",
    "name": "User Name"
  }
  ```

#### Admin Signup
- **POST** `/api/auth/admin/signup`
- **Body:**
  ```json
  {
    "name": "Admin Name",
    "email": "admin@example.com",
    "phone": "+919876543210",
    "password": "securepass123",
    "confirmPassword": "securepass123",
    "sector": "college", // or "industry", "government"
    "organizationName": "XYZ College"
  }
  ```

#### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "user": { /* authenticated user object */ }
  }
  ```

---

### Event Routes `/api/events`

#### Get All Events (with filtering)
- **GET** `/api/events?sector=college&category=fest&search=tech&page=1&limit=10`
- **Query Parameters:**
  - `sector`: college | industry | government
  - `category`: fest, symposium, workshop, recruitment, tech-summit, seminar
  - `search`: Search in title and description
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 10)
- **Response:**
  ```json
  {
    "events": [ /* array of events */ ],
    "pagination": {
      "total": 25,
      "pages": 3,
      "currentPage": 1
    }
  }
  ```

#### Get Event by ID
- **GET** `/api/events/:id`
- **Response:**
  ```json
  {
    "event": {
      "_id": "607f1f77bcf86cd799439011",
      "title": "Tech Fest 2024",
      "description": "Annual technology festival",
      "sector": "college",
      "eventDate": "2024-03-15",
      "eventTime": "10:00 AM",
      "location": {
        "address": "Campus Main Auditorium",
        "city": "Bangalore",
        "state": "Karnataka"
      },
      "registeredUsers": [ /* array of user ids */ ],
      /* ... other fields ... */
    }
  }
  ```

#### Get Events by Category/Sector
- **GET** `/api/events/category?sector=college&category=fest`
- **Response:** Events matching the category

#### Create Event (Admin Only)
- **POST** `/api/events`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "title": "Summer Internship Drive",
    "description": "TCS is recruiting 500+ interns...",
    "sector": "industry",
    "posterUrl": "https://example.com/poster.jpg",
    "eventDate": "2024-04-20",
    "eventTime": "09:00 AM",
    "location": {
      "address": "Tech Park Building A",
      "city": "Hyderabad",
      "state": "Telangana",
      "zipCode": "500081"
    },
    "organizerDetails": {
      "name": "HR Manager",
      "email": "hr@tcs.com",
      "phone": "+919876543210",
      "organization": "Tata Consultancy Services"
    },
    "registrationLink": "https://tcs.careers.com/register",
    "category": "recruitment",
    "capacity": 500
  }
  ```
- **Response:**
  ```json
  {
    "message": "Event created successfully",
    "event": { /* created event object */ }
  }
  ```

#### Update Event (Admin Only)
- **PUT** `/api/events/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** (same as create, partial updates allowed)
- **Response:**
  ```json
  {
    "message": "Event updated successfully",
    "event": { /* updated event */ }
  }
  ```

#### Delete Event (Admin Only)
- **DELETE** `/api/events/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "message": "Event deleted successfully"
  }
  ```

#### Register for Event
- **POST** `/api/events/register`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "eventId": "607f1f77bcf86cd799439011"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Successfully registered for event",
    "registration": {
      "_id": "...",
      "userId": "...",
      "eventId": "...",
      "registrationDate": "2024-03-10T10:30:00Z",
      "status": "registered"
    }
  }
  ```
- **Auto Actions:**
  - Email confirmation sent
  - SMS confirmation sent
  - Event added to Google Calendar (if enabled)

#### Get User's Registered Events
- **GET** `/api/events/user/registered`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "events": [ /* array of registered events */ ]
  }
  ```

---

### Notification Routes `/api/notifications`

#### Get User Notifications
- **GET** `/api/notifications`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "notifications": [
      {
        "_id": "...",
        "userId": "...",
        "eventId": "...",
        "notificationType": "registration", // or "new_event", "event_reminder"
        "deliveryMethod": "email", // or "sms", "calendar"
        "subject": "Event Registration Confirmation",
        "message": "You have registered for...",
        "status": "sent", // or "pending", "failed"
        "isRead": false,
        "createdAt": "2024-03-10T10:30:00Z"
      }
    ]
  }
  ```

#### Mark Notification as Read
- **PUT** `/api/notifications/:notificationId/read`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "notification": { /* updated notification */ }
  }
  ```

#### Get Unread Count
- **GET** `/api/notifications/unread/count`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "unreadCount": 5
  }
  ```

---

## Notification System

### Automated Email Notifications

Sent via Nodemailer (Gmail SMTP):

1. **Registration Confirmation**
   - Sent immediately after event registration
   - Includes event details and reminder

2. **Event Reminder**
   - Sent 24 hours before event
   - Sent automatically by reminder service
   - Includes registration link

3. **New Event Notification**
   - Sent when new event matches user's interests
   - Triggered when admin creates event

### SMS Notifications (Twilio)

1. **Registration Alert**
   - Sent immediately after registration
   - Concise message with event name

2. **Event Reminder**
   - Sent 24 hours before event
   - Short reminder message

### Google Calendar Integration

- Event automatically added to user's Google Calendar
- Calendar reminders: 24 hours email + 30 min pop-up
- User can snooze/dismiss from calendar

---

## Automatic Reminder Service

The backend includes a cron job that runs every hour:

```javascript
// Runs at minute 0 of every hour
0 * * * *

// Checks for events in next 24 hours
// Sends reminders to registered users
// Prevents duplicate reminders
```

Configure in `.env`:
```env
ENABLE_REMINDERS=true
REMINDER_INTERVAL=3600000 # milliseconds
```

---

## Authentication & Security

### JWT Token
- Generated on login/signup
- Expires after 7 days (configurable)
- Sent in `Authorization: Bearer <token>` header
- Verified on protected routes

### Password Security
- Hashed with bcryptjs (salt rounds: 10)
- Minimum 6 characters
- Never returned in API responses

### Request Validation
- Input validation on all routes
- CORS enabled for frontend origin
- Rate limiting recommended for production

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation failed or missing fields"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided" or "Invalid token"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Admin role required."
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Error details"
}
```

---

## Testing with cURL

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "password": "test1234",
    "confirmPassword": "test1234"
  }'
```

### Get Events
```bash
curl http://localhost:5000/api/events?sector=college
```

### Register for Event (with token)
```bash
curl -X POST http://localhost:5000/api/events/register \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"eventId": "EVENT_ID_HERE"}'
```

---

## Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (min 32 chars)
- [ ] Configure MongoDB Atlas
- [ ] Set up real email provider
- [ ] Configure Twilio in production
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Enable CORS for production domain
- [ ] Set up error logging
- [ ] Configure database backups
- [ ] Add environment-specific configs

---

## Support & Issues

For API issues, check:
1. MongoDB connection
2. Environment variables
3. Network/firewall settings
4. API token expiration
5. CORS configuration
6. Request body format

See main README.md for more info.
