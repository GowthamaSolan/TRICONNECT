const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const addEventToGoogleCalendar = async (accessToken, eventData) => {
  try {
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: eventData.title,
      description: eventData.description,
      start: {
        dateTime: new Date(eventData.eventDate).toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: new Date(
          new Date(eventData.eventDate).getTime() + 60 * 60 * 1000
        ).toISOString(),
        timeZone: 'UTC',
      },
      location: `${eventData.location.address}, ${eventData.location.city}`,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 }, // 30 mins before
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    console.log('Event added to Google Calendar:', response.data.id);
    return { success: true, calendarEventId: response.data.id };
  } catch (error) {
    console.error('Google Calendar integration failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  oauth2Client,
  addEventToGoogleCalendar,
};
