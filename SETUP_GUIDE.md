# TriConnect - Project Summary & Setup Instructions

## 📋 Project Overview

**TriConnect** is a comprehensive centralized event aggregator platform that connects students and the public directly with event organizers from three sectors:
- 🎓 **College Events** (Fests, Symposiums, Workshops)
- 🏢 **Industry Events** (Recruitment, Tech Summits)
- 🏛️ **Government Events** (Public Sector Initiatives)

The platform features an **intelligent notification system** that automatically sends users relevant event updates via email, SMS, and Google Calendar.

---

## 📂 What's Been Created

### Backend (Node.js + Express + MongoDB)
```
triconnect-backend/
├── models/                    # Database schemas
│   ├── User.js               # User/Admin model with auth
│   ├── Event.js              # Event data model
│   ├── Notification.js       # Notification tracking
│   ├── EventRegistration.js  # Registration tracking
│   └── Admin.js              # Admin credentials
│
├── controllers/              # Business logic
│   ├── authController.js     # Auth endpoints (signup, login, OAuth)
│   └── eventController.js    # Event CRUD & registration
│
├── routes/                   # API endpoints
│   ├── authRoutes.js         # /api/auth/*
│   ├── eventRoutes.js        # /api/events/*
│   └── notificationRoutes.js # /api/notifications/*
│
├── services/                 # External integrations
│   ├── emailService.js       # Nodemailer (Gmail SMTP)
│   ├── smsService.js         # Twilio SMS integration
│   ├── calendarService.js    # Google Calendar API
│   └── reminderService.js    # Automated cron job reminders
│
├── middleware/               # Authentication & validation
│   └── auth.js              # JWT verification, admin checks
│
├── config/                   # Configuration
│   └── database.js          # MongoDB connection
│
├── server.js                # Main application entry
├── package.json             # Dependencies
└── .env.example             # Environment template
```

**Total Files: 15+**

### Frontend (React + React Router)
```
triconnect-frontend/
├── src/
│   ├── components/          # React components
│   │   ├── SignUp.js       # User registration
│   │   ├── SignIn.js       # User login
│   │   ├── AdminSignUp.js  # Admin registration
│   │   └── Navigation.js   # Top navbar
│   │
│   ├── pages/              # Page components
│   │   ├── Dashboard.js    # Main event listing (4 sections)
│   │   ├── EventDetail.js  # Event detail view
│   │   └── AdminPanel.js   # Event creation form
│   │
│   ├── services/
│   │   └── api.js          # Axios HTTP client
│   │
│   ├── context/
│   │   └── AuthContext.js  # Authentication state management
│   │
│   ├── styles/             # CSS files
│   │   ├── Auth.css
│   │   ├── Dashboard.css
│   │   ├── EventDetail.css
│   │   ├── AdminPanel.css
│   │   └── Navigation.css
│   │
│   ├── App.js              # Main app with routing
│   ├── App.css
│   ├── index.js            # React entry point
│   └── index.css           # Global styles
│
├── public/
│   ├── index.html          # HTML template
│   └── manifest.json       # PWA config
│
├── package.json            # Dependencies
└── .env.example            # Environment template
```

**Total Files: 15+**

### Documentation
- ✅ README.md - Main project overview
- ✅ API_DOCUMENTATION.md - Complete API reference
- ✅ FRONTEND_GUIDE.md - React component guide
- ✅ DEPLOYMENT_GUIDE.md - Production deployment
- ✅ REMINDER_SERVICE.md - Automated reminders

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 14+ and npm
- MongoDB (local or MongoDB Atlas)
- Gmail account (for email notifications)
- Twilio account (for SMS)
- Google account (for OAuth & Calendar)

### Backend Setup (2 minutes)

```bash
# Navigate to backend
cd triconnect-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configurations
# (Add MongoDB URI, Gmail password, Twilio credentials, etc.)

# Start development server
npm run dev
```
Server runs on `http://localhost:5000`

### Frontend Setup (2 minutes)

```bash
# Navigate to frontend
cd triconnect-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with backend URL
# REACT_APP_API_URL=http://localhost:5000/api

# Start development server
npm start
```
App opens on `http://localhost:3000`

---

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  phone: String (unique),
  password: String (hashed with bcrypt),
  role: 'user' | 'admin',
  sector: 'college' | 'industry' | 'government' | null,
  googleId: String,
  registeredEvents: [EventId],
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
    address, city, state, zipCode,
    coordinates: { lat, lng }
  },
  organizerDetails: {
    name, email, phone, organization, logo
  },
  registrationLink: String,
  category: 'fest' | 'symposium' | 'workshop' | 'recruitment' | 'tech-summit' | 'seminar',
  capacity: Number,
  registeredUsers: [UserId],
  createdBy: AdminId,
  isActive: Boolean
}
```

### Notification Model
```javascript
{
  userId: UserId,
  eventId: EventId,
  notificationType: 'registration' | 'new_event' | 'event_reminder',
  deliveryMethod: 'email' | 'sms' | 'calendar' | 'in-app',
  subject: String,
  message: String,
  status: 'pending' | 'sent' | 'failed' | 'read',
  sentAt: Date,
  metadata: Object
}
```

---

## 🔑 Key Features Implemented

### 1️⃣ Authentication System
- ✅ User signup with email & password
- ✅ User login with email/username
- ✅ Google OAuth integration
- ✅ Admin registration (separate)
- ✅ JWT-based sessions (7 days)
- ✅ Password hashing (bcryptjs)
- ✅ Protected routes

### 2️⃣ Dashboard (4 Sections)
- ✅ Recently Posted Events
- ✅ College Events (purple badge)
- ✅ Industry Events (red badge)
- ✅ Government Events (green badge)
- ✅ Responsive grid layout
- ✅ Event filtering
- ✅ Event search

### 3️⃣ Event Management
- ✅ View event details
- ✅ Event registration
- ✅ Admin event creation
- ✅ Event updates
- ✅ Event deletion
- ✅ Event categorization
- ✅ Location tracking

### 4️⃣ Notification System
- ✅ **Email Notifications**
  - Registration confirmation
  - 24-hour reminders
  - New event alerts
  - Via Nodemailer (Gmail SMTP)

- ✅ **SMS Notifications**
  - Registration alerts
  - Event reminders
  - Via Twilio

- ✅ **Google Calendar Integration**
  - Auto-add events to calendar
  - Email reminders (24 hrs)
  - Pop-up reminders (30 mins)

- ✅ **Automated Reminder Service**
  - Cron job runs hourly
  - Checks for upcoming events
  - Sends reminders 24 hrs before
  - Prevents duplicate sends

### 5️⃣ Admin Features
- ✅ Event creation form
- ✅ Event poster upload
- ✅ Full event details management
- ✅ Sector selection
- ✅ Category selection
- ✅ Organizer information
- ✅ Registration link management
- ✅ Automatic user notifications

---

## 📝 API Endpoints

### Authentication
```
POST   /api/auth/user/signup
POST   /api/auth/user/signin
POST   /api/auth/admin/signup
POST   /api/auth/google-login
GET    /api/auth/me (protected)
```

### Events
```
GET    /api/events (with filters)
GET    /api/events/:id
GET    /api/events/category
POST   /api/events (admin only)
PUT    /api/events/:id (admin only)
DELETE /api/events/:id (admin only)
POST   /api/events/register (protected)
GET    /api/events/user/registered (protected)
```

### Notifications
```
GET    /api/notifications (protected)
PUT    /api/notifications/:id/read (protected)
GET    /api/notifications/unread/count (protected)
```

---

## 🎨 UI/UX Features

- **Color Coded Sectors**
  - College: Purple (#9b59b6)
  - Industry: Red (#e74c3c)
  - Government: Green (#27ae60)

- **Responsive Design**
  - Mobile-first approach
  - Works on all devices
  - Hamburger menu on mobile

- **User-Friendly Forms**
  - Validation messages
  - Clear error handling
  - Loading states
  - Disabled buttons during submission

- **Navigation**
  - Top sticky navbar
  - User profile menu
  - Logout button
  - Mobile responsive

---

## 🔐 Security Features

- ✅ Password hashing (bcryptjs)
- ✅ JWT authentication
- ✅ Protected routes
- ✅ Admin authorization checks
- ✅ Input validation (express-validator)
- ✅ CORS configuration
- ✅ Environment variables
- ✅ No secrets in code

---

## 📦 Dependencies

### Backend
- express (4.18.2)
- mongoose (7.0.0)
- jsonwebtoken (9.0.0)
- bcryptjs (2.4.3)
- nodemailer (6.9.1)
- twilio (3.77.0)
- node-cron (3.0.2)
- googleapis (118.0.0)

### Frontend
- react (18.2.0)
- react-dom (18.2.0)
- react-router-dom (6.8.0)
- axios (1.3.4)

---

## 🧪 Testing

### User Flow Testing
1. Sign up as user
2. Browse events on dashboard
3. Click on event details
4. Register for event
5. Check email & SMS notifications
6. Verify Google Calendar

### Admin Flow Testing
1. Sign up as admin
2. Navigate to event creation form
3. Fill event details
4. Post event
5. Verify users receive notifications
6. Check event appears on dashboard

### API Testing (cURL)
```bash
# Get all events
curl http://localhost:5000/api/events

# Get with filters
curl http://localhost:5000/api/events?sector=college&limit=5

# With authentication
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/events/user/registered
```

---

## 📚 Documentation Files

1. **README.md** - Main project overview
2. **API_DOCUMENTATION.md** - Complete API reference with examples
3. **FRONTEND_GUIDE.md** - React components & state management
4. **DEPLOYMENT_GUIDE.md** - Production deployment guide
5. **REMINDER_SERVICE.md** - Automated reminder configuration

---

## 🚢 Deployment Options

### Backend
- Heroku (easiest)
- AWS EC2
- DigitalOcean
- Railway
- Render

### Frontend
- Netlify (recommended)
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

See DEPLOYMENT_GUIDE.md for detailed instructions.

---

## 🔄 Workflow Diagram

```
User Browser
    ↓
React Frontend (3000)
    ↓
Axios API Client
    ↓
Express Backend (5000)
    ↓
MongoDB Database
    ↓
Email Service (Nodemailer)
SMS Service (Twilio)
Calendar Service (Google)
```

---

## 📱 Pages & Routes

### Public Routes
- `/signup` - User registration
- `/signin` - User login
- `/admin/signup` - Admin registration

### Protected Routes (User)
- `/dashboard` - Main event dashboard
- `/event/:id` - Event details

### Protected Routes (Admin)
- `/admin/panel` - Event creation form

---

## ⚠️ Important Configuration Steps

### Step 1: Gmail Setup
1. Enable 2FA on Gmail
2. Generate App Password (not regular password)
3. Add to `EMAIL_PASSWORD` in .env

### Step 2: Twilio Setup
1. Create Twilio account
2. Get Account SID & Auth Token
3. Purchase phone number
4. Add to .env

### Step 3: Google OAuth
1. Go to Google Cloud Console
2. Create project
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add to .env

### Step 4: MongoDB
1. Local: Install MongoDB
2. Or: Create MongoDB Atlas cluster
3. Add connection string to .env

---

## 🐛 Troubleshooting

### Backend Won't Start
- Check Node.js installation
- Verify .env file exists
- Check MongoDB connection
- Check port 5000 availability

### Frontend Won't Connect
- Verify API_URL in .env
- Check backend is running
- Check CORS configuration
- Clear browser cache

### Notifications Not Working
- Verify email credentials
- Check Twilio credentials
- Verify phone numbers are valid
- Check notification preferences in user settings

### Database Issues
- Verify MongoDB is running
- Check connection string
- Verify credentials
- Check whitelist IPs (if MongoDB Atlas)

---

## 📞 Support & Resources

### Key Files to Know
- Backend entry: `triconnect-backend/server.js`
- Frontend entry: `triconnect-frontend/src/App.js`
- API routes: `triconnect-backend/routes/`
- Components: `triconnect-frontend/src/components/`

### Learning Resources
- Express.js: https://expressjs.com
- React: https://react.dev
- MongoDB: https://docs.mongodb.com
- Mongoose: https://mongoosejs.com

---

## ✅ Checklist for First Run

- [ ] Install Node.js & npm
- [ ] Clone/extract project
- [ ] Navigate to backend folder
- [ ] Run `npm install`
- [ ] Create `.env` file
- [ ] Add MongoDB connection string
- [ ] Add Gmail credentials
- [ ] Run `npm run dev` (backend)
- [ ] Navigate to frontend folder
- [ ] Run `npm install`
- [ ] Create `.env` file
- [ ] Add API URL
- [ ] Run `npm start` (frontend)
- [ ] Test sign up
- [ ] Test event browsing
- [ ] Test event registration

---

## 🎓 Learning Outcomes

By studying this codebase, you'll learn:
- Full-stack web development
- React patterns & hooks
- Express.js routing & middleware
- MongoDB schema design
- REST API design
- JWT authentication
- Async/await patterns
- Email & SMS integration
- Third-party API integration
- Production deployment
- Error handling
- Form validation

---

## 📄 License

This project is open source and available for educational purposes.

---

**Your TriConnect platform is now ready to develop and deploy!** 🎉

Next steps:
1. Review the code structure
2. Read API_DOCUMENTATION.md
3. Run backend and frontend locally
4. Test all features
5. Deploy to production when ready

Good luck with your final year project! 🚀
