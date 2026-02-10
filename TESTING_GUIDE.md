# Quick Start Guide - New Features Testing

## 🚀 Before You Start

Make sure both servers are running:

### Terminal 1 (Backend):
```bash
cd triconnect-backend
npm install  # If multer not installed
npm run dev
```

### Terminal 2 (Frontend):
```bash
cd triconnect-frontend
npm start
```

Both should be running without errors!

---

## 📋 Testing Checklist

### Test 1: Separate Dashboards ✅

#### User Dashboard:
1. Sign up as regular user (or use email: test@example.com)
2. You should land on `/dashboard` (User Dashboard)
3. You should see 4 sections:
   - 🆕 Recently Posted
   - 🎓 College Events
   - 🏢 Industry Events
   - 🏛️ Government Events
4. ✅ No "Post Event" button should be visible
5. ✅ Navigation shows "Browse Events" option

#### Admin Dashboard:
1. Sign up as admin (choose sector: College/Industry/Government)
2. You should land on `/admin/dashboard` (Admin Dashboard)
3. You should see a table with columns:
   - Event Title
   - Sector
   - Date
   - Location
   - Status
   - Actions (Edit, Delete)
4. ✅ "Create New Event" button visible
5. ✅ Navigation shows "Post Event" and "My Events"

---

### Test 2: Search & Filter ✅

#### In User Dashboard:

**Search Feature:**
1. Go to any event section
2. Find the search bar above the events
3. Type event title (e.g., "fest", "workshop")
4. Events should filter in real-time ✅
5. Clear search to see all again

**Category Filter:**
1. Below the search bar, find the dropdown
2. Select a category (e.g., "Symposium")
3. Only events of that category should show ✅
4. Select "All Categories" to reset

**Try in all 4 sections:**
- Recently Posted (has: all categories)
- College Events (categories: Fest, Symposium, Workshop, Seminar)
- Industry Events (categories: Recruitment, Tech Summit, Workshop, Seminar)
- Government Events (categories: Seminar, Workshop, Symposium, Fest)

---

### Test 3: Modern Styling ✅

#### Visual Checks:

**Colors & Gradients:**
- [ ] Purple/Blue gradient in hero section
- [ ] Event cards have smooth shadows
- [ ] Purple badges for College events
- [ ] Red badges for Industry events
- [ ] Green badges for Government events
- [ ] Smooth hover animations (cards lift up)

**Animations:**
- [ ] Buttons highlight on hover
- [ ] Cards slide up when you hover over them
- [ ] Smooth color transitions
- [ ] Spinning category badge animations

**Responsive Design:**
- [ ] Desktop: All elements visible side by side
- [ ] Tablet (iPad): Grid adjusts, single column where needed
- [ ] Mobile (Phone): Single column layout, hamburger menu works

**Dark/Light Contrast:**
- [ ] Text is readable on all backgrounds
- [ ] Buttons have good contrast
- [ ] Badges are clearly visible

---

### Test 4: Google OAuth ✅

#### Sign Up with Google (User):
1. Go to `/signup`
2. Look for "OR" divider
3. Below it, you should see Google button
4. Click Google button
5. Select your Google account
6. ✅ You should be logged in and on dashboard

#### Sign Up with Google (Admin):
1. Go to `/admin/signup`
2. Look for "OR" divider
3. Click Google button
4. Complete signup
5. ✅ You should see admin dashboard

**Note:** If Google button doesn't show:
- Check if `REACT_APP_GOOGLE_CLIENT_ID` is in `.env`
- Check browser console (F12) for errors
- Restart frontend server

---

### Test 5: Image File Upload ✅

#### Upload Poster Image:
1. Go to `/admin/panel` (or Admin Dashboard → Create New Event)
2. Scroll down to find "Event Poster Image" field
3. ✅ You should see a file upload area (NOT a URL field)
4. Click to select file or drag-drop image
5. Select a JPEG or PNG file from your computer
6. ✅ Image preview should appear below
7. Fill other event details
8. Click "Post Event"
9. ✅ Event should be created with image

#### Test File Validation:
1. Try uploading a PDF or text file
   - ✅ Should reject with "Only JPEG and PNG allowed"
2. Try uploading an image > 5MB
   - ✅ Should reject with "File too large"
3. Upload valid image
   - ✅ Should work perfectly

#### Verify Image Upload:
1. Create event with image
2. Go back to dashboard
3. View the event
4. ✅ Event card should show the uploaded poster image

---

## 🎯 Complete User Journey Test

### Follow this flow to test everything together:

**1. User Experience:**
```
Sign Up (email) → User Dashboard → 
Browse Events → Search for event → 
Filter by category → View event details → 
Register for event → Success! ✅
```

**2. Google User Experience:**
```
Sign Up (Google) → User Dashboard → 
Same as above but via Google OAuth ✅
```

**3. Admin Experience:**
```
Sign Up Admin (email) → Admin Dashboard → 
Create New Event → Upload Poster Image → 
Post Event → See in Admin Dashboard → 
Edit Event → Delete Event ✅
```

**4. Google Admin Experience:**
```
Sign Up Admin (Google) → Admin Dashboard → 
Same as above but via Google OAuth ✅
```

---

## 🔍 What to Look For

### Positive Signs ✅
- Separate dashboards for users and admins
- Search works smoothly without page reload
- Filters update instantly
- Beautiful animations and gradients
- Google buttons appear and work
- Image preview shows after selection
- Images appear in event cards

### Red Flags ⚠️
- Same dashboard for users and admins
- Search doesn't filter
- No visual changes on hover
- No Google button visible
- File upload shows URL field instead
- Images don't display in events

---

## 📱 Testing on Different Devices

### Desktop (1920x1080):
- Full layout visible
- All 4 event sections visible
- Search and filter side by side
- Table in admin dashboard full width

### Tablet (768x1024):
- Grid adjusts to 2 columns
- Search and filter may stack
- Layout responsive

### Mobile (360x800):
- Single column layout
- Hamburger menu works
- Buttons fully responsive
- Touch-friendly sizes

---

## 🛠️ Troubleshooting

### Issue: Google button not showing
**Solution:**
1. Check `.env` file has `REACT_APP_GOOGLE_CLIENT_ID`
2. Restart frontend: `npm start`
3. Hard refresh browser: Ctrl+Shift+R
4. Check console (F12) for errors

### Issue: Image upload fails
**Solution:**
1. Check file is JPEG or PNG
2. Check file size < 5MB
3. Check backend is running
4. Check `/uploads` folder exists
5. Check terminal for error messages

### Issue: Styles don't look right
**Solution:**
1. Clear cache: Ctrl+Shift+Delete
2. Hard refresh: Ctrl+Shift+R
3. Restart frontend server
4. Check CSS files are imported

### Issue: Admin dashboard shows empty table
**Solution:**
1. Create an event from `/admin/panel`
2. Event should appear in table
3. If not, check browser console for errors
4. Check backend logs for errors

---

## 📞 Quick Reference

| Feature | URL | User Type | Status |
|---------|-----|-----------|--------|
| Sign Up | /signup | Everyone | ✅ |
| Admin Sign Up | /admin/signup | Admin | ✅ |
| User Dashboard | /dashboard | User | ✅ |
| Admin Dashboard | /admin/dashboard | Admin | ✅ |
| Post Event | /admin/panel | Admin | ✅ |
| Event Detail | /event/:id | Everyone | ✅ |

---

## 🎉 Success Criteria

Your implementation is successful when:

- ✅ User and admin see different dashboards
- ✅ Search filters events in real-time
- ✅ Category filter works smoothly
- ✅ Beautiful animations and colors
- ✅ Google OAuth buttons appear and work
- ✅ Image upload works with preview
- ✅ Images display in event cards
- ✅ Everything works on mobile and desktop

---

## 📸 Expected Screenshots

### User Dashboard
- Hero section with gradient
- 4 event sections with search/filter
- Event cards with smooth hover effects
- Modern color scheme

### Admin Dashboard  
- Admin header with "Create New Event" button
- Table with all admin's events
- Edit/Delete buttons for each event
- Professional styling

### Image Upload
- File upload area (not URL field)
- Image preview after selection
- Success message on upload

---

## 🚀 Final Step

Once all tests pass:
1. Commit your changes
2. Push to GitHub
3. Deploy using DEPLOYMENT_GUIDE.md
4. Share with friends!

**Congratulations! Your TriConnect app is now fully functional and beautiful!** 🎊
