Background image and Google OAuth setup notes

- Place the provided background image at: `triconnect-frontend/public/images/user-bg.jpg`
  - Create the folders if they don't exist
  - File name must be `user-bg.jpg` (or update `index.css` accordingly)

- Google OAuth: frontend uses Google One Tap / GSI client for sign up/sign in
  - Ensure `REACT_APP_GOOGLE_CLIENT_ID` is set in `.env.local` (frontend) and in Render (backend)
  - Authorized Origins in Google Cloud should include:
    - https://triconnect-frontend.vercel.app
    - http://localhost:3000
  - For Redirects (if backend flow used), ensure backend URL is set in Google Cloud

- If Google sign-in doesn't render, open console and check `window.google` availability and that `REACT_APP_GOOGLE_CLIENT_ID` is correct.
