// Add node-cron to package.json for the reminder service
// npm install node-cron

// Then in server.js, add:
// const { initializeReminderService } = require('./services/reminderService');
// initializeReminderService();

// This will automatically send event reminders:
// - 24 hours before event (email + SMS)
// - Reminders stored in Notification collection
// - Prevents duplicate reminders from being sent
