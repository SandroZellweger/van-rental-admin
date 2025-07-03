# Google Calendar Integration Setup Guide

## 🚀 What You Need to Connect Real Google Calendars

To connect your van rental website to real Google Calendars, you'll need to:

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

### 2. Enable Google Calendar API
1. In Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Calendar API"
3. Click on it and press "Enable"

### 3. Create API Credentials

#### API Key (for public calendar access):
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Restrict the key to Google Calendar API
4. Copy the API key

#### OAuth 2.0 Client ID (for authenticated access):
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Add authorized origins: `http://localhost:8000`, `https://yourdomain.com`
5. Copy the Client ID

### 4. Create Van Calendars
You have two options:

#### Option A: Separate Google Accounts
- Create 9 separate Google accounts (one for each van)
- Share calendar access with your main account
- Use each calendar's email as the calendar ID

#### Option B: Multiple Calendars on One Account
- Create 9 calendars in your main Google account
- Get each calendar's ID from calendar settings
- Use the calendar IDs in the mapping

### 5. Update the Code

Replace these values in `google-calendar-integration.js`:

```javascript
this.clientId = 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com';
this.apiKey = 'YOUR_ACTUAL_API_KEY';

// Calendar mapping - use your actual calendar IDs
this.calendars = {
    '1': 'compact-van-1@gmail.com', // or calendar ID
    '2': 'compact-van-2@gmail.com',
    '3': 'standard-van-1@gmail.com',
    // ... etc for all 9 vans
};
```

### 6. Test the Integration
1. Start the local server: `python -m http.server 8000`
2. Open the website
3. Select a van
4. Click "Sign in with Google"
5. Test creating a booking

## 📋 Calendar ID Examples

### For separate accounts:
- `compact-van-1@gmail.com`
- `standard-van-2@gmail.com`

### For calendars on one account:
- `abc123def456@group.calendar.google.com`
- `xyz789uvw012@group.calendar.google.com`

To find calendar IDs:
1. Go to Google Calendar
2. Click the three dots next to a calendar
3. Select "Settings and sharing"
4. Find "Calendar ID" in the "Integrate calendar" section

## 🔒 Security Notes
- Keep your API key and Client ID secure
- Use environment variables in production
- Restrict API key to your domain
- Set up proper OAuth consent screen

## 🎯 Next Steps
Once you have the credentials, I can help you:
1. Update the configuration
2. Test the real calendar connection
3. Set up production deployment
4. Add advanced calendar features

Let me know when you have the Google Cloud credentials ready!
