# Google OAuth Setup Guide

## Step-by-Step Setup

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click on the project dropdown at the top
3. Click "NEW PROJECT"
4. Name it "TriConnect" and click Create

### 2. Enable Google+ API
1. In the Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click on it and press **ENABLE**

### 3. Create OAuth 2.0 Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS**
3. Select **OAuth client ID**
4. If prompted, configure the OAuth consent screen:
   - Select **External** for User Type
   - Fill in required fields (App name, User support email, Developer contact)
   - Click **SAVE AND CONTINUE** through all sections
5. Back to Create OAuth client ID:
   - Select **Web application**
   - Name: "TriConnect Local"
6. Add Authorized redirect URIs:
   - `http://localhost:3000`
   - `http://localhost:3001`
   - `http://127.0.0.1:3000`
   - `http://127.0.0.1:3001`
7. Click **CREATE**
8. Copy your **Client ID** (looks like: `xxxxx-xxxxx.apps.googleusercontent.com`)

### 4. Update Frontend .env
1. Open `triconnect-frontend/.env`
2. Replace the placeholder:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your_actual_client_id_here
   ```
3. Save the file

### 5. Update Backend .env
1. Open `triconnect-backend/.env`
2. Add or update:
   ```
   GOOGLE_CLIENT_ID=your_actual_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```
3. Save the file

### 6. Restart Your Apps
1. Stop the frontend dev server (Ctrl+C)
2. Run: `npm start` again
3. The Google sign-in should now work!

## Troubleshooting

**Still getting "Authorization Error"?**
- Ensure you added `http://localhost:3001` to Authorized redirect URIs in Google Console
- Clear browser cache and cookies
- Restart the frontend server

**"Client ID not found" error?**
- Make sure the `.env` file has the correct Client ID
- Check that the Client ID matches exactly (copy-paste from Google Console)
- Frontend needs to be restarted after .env changes
