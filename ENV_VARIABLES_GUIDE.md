# Environment Variables Configuration Guide

## Backend Environment Variables

### Production (.env for Render)

```env
# ====================
# DATABASE
# ====================
MONGO_URI=mongodb+srv://triconnect_user:YOUR_PASSWORD@triconnect-cluster.xxxxx.mongodb.net/triconnect?retryWrites=true&w=majority

# ====================
# SERVER
# ====================
NODE_ENV=production
PORT=5000

# ====================
# SECURITY
# ====================
JWT_SECRET=your_very_long_secret_key_minimum_32_characters_long_should_be_random_and_secure

# ====================
# GOOGLE OAUTH
# ====================
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here

# ====================
# TWILIO (Optional)
# ====================
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# ====================
# CORS
# ====================
FRONTEND_URL=https://triconnect-frontend.vercel.app

# ====================
# SMTP (Email) - Optional
# ====================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### Local Development (.env for local)

```env
MONGO_URI=mongodb://localhost:27017/triconnect
NODE_ENV=development
PORT=5000
JWT_SECRET=dev_secret_key_not_secure
GOOGLE_CLIENT_ID=your_local_client_id
GOOGLE_CLIENT_SECRET=your_local_client_secret
FRONTEND_URL=http://localhost:3000
```

---

## Frontend Environment Variables

### Production (.env.local for Vercel)

```env
REACT_APP_API_URL=https://triconnect-backend.onrender.com/api
REACT_APP_GOOGLE_CLIENT_ID=your_client_id (if needed)
```

### Local Development (.env.local)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## How to Set Environment Variables

### On Render (Backend)

1. Go to your `triconnect-backend` service
2. Click **Environment** tab
3. Click **Add Environment Variable**
4. Enter Key and Value
5. Click **Save Changes**
6. Service auto-redeploys

### On Vercel (Frontend)

1. Go to your project **Settings**
2. Select **Environment Variables**
3. Enter Variable name and Value
4. Select environments: Production, Preview, Development
5. Click **Save**
6. Go to **Deployments** → Click latest → **Redeploy**

### Locally

1. Create `.env` file in project root
2. Add variables
3. Restart dev server: `npm start`

---

## Getting Each Value

### MONGO_URI
```
From MongoDB Atlas:
1. Cluster → Connect → Drivers → Node.js
2. Copy connection string
3. Replace <password> with your database user password
4. Add database name: triconnect
5. Final: mongodb+srv://triconnect_user:password@cluster.xxxxx.mongodb.net/triconnect?retryWrites=true&w=majority
```

### JWT_SECRET
```
Generate random string:
Node.js console: require('crypto').randomBytes(32).toString('hex')
Or use: https://generate-random.org/
Minimum 32 characters
```

### GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET
```
From Google Cloud Console:
1. APIs & Services → Credentials
2. Find OAuth 2.0 Client ID
3. Click to view
4. Copy Client ID and Client Secret
```

### FRONTEND_URL
```
After Vercel deployment:
https://triconnect-frontend.vercel.app
```

---

## Secrets to Never Share

❌ Never put these in code or commit to Git:
- JWT_SECRET
- MONGO_URI (has password)
- GOOGLE_CLIENT_SECRET
- Database passwords
- API keys
- Access tokens

✅ Always use environment variables for secrets

---

## Updating Variables in Production

### Quick Steps:

**Backend (Render)**:
1. Render Dashboard → Service → Environment
2. Find variable → Click Edit
3. Update value
4. Click Save

**Frontend (Vercel)**:
1. Project Settings → Environment Variables
2. Find variable → Click Edit
3. Update value
4. Go to Deployments → Click latest → Redeploy

---

## Common Issues

### "Undefined is not a function" or "Variable not found"
→ Environment variable not set or wrong name

### "MongoDB connection refused"
→ Check MONGO_URI, IP whitelist, database user password

### "API returns 400 Bad Request"
→ Check GOOGLE_CLIENT_ID/SECRET or JWT_SECRET

### "Image upload fails"
→ Check FRONTEND_URL in CORS configuration

---

## Checklist

- [ ] All variables set on Render
- [ ] All variables set on Vercel
- [ ] No secrets in code
- [ ] No .env files committed to Git
- [ ] Variables tested locally
- [ ] App works after deployment
