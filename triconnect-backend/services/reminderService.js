const cron = require('node-cron');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendEventReminderEmail } = require('./emailService');
const { sendEventReminderSMS } = require('./smsService');

/**
 * Event Reminder Service
 * Sends reminders to users 24 hours and 1 hour before event
 */

const initializeReminderService = () => {
  // Run every hour to check for upcoming events
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('Running event reminder service...');
      await sendEventReminders();
    } catch (error) {
      console.error('Error in reminder service:', error);
    }
  });
};

const sendEventReminders = async () => {
  const now = new Date();

  // Find events happening in the next 24 hours and 1 hour
  const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  try {
    // Get events within the reminder window
    const upcomingEvents = await Event.find({
      eventDate: {
        $gte: now,
        $lte: twentyFourHoursLater,
      },
      isActive: true,
    });

    for (const event of upcomingEvents) {
      // Get users registered for this event
      const registrations = await EventRegistration.find({
        eventId: event._id,
        status: 'registered',
      });

      for (const registration of registrations) {
        const user = await User.findById(registration.userId);

        if (!user) continue;

        // Check if we already sent a reminder
        const existingReminder = await Notification.findOne({
          userId: user._id,
          eventId: event._id,
          notificationType: 'event_reminder',
          status: 'sent',
        });

        if (existingReminder) continue;

        // Send email reminder
        if (user.notificationPreferences.email) {
          await sendEventReminderEmail(
            user.email,
            user.name,
            event.title,
            event.eventDate,
            event.registrationLink
          );

          // Create notification record
          await Notification.create({
            userId: user._id,
            eventId: event._id,
            notificationType: 'event_reminder',
            deliveryMethod: 'email',
            subject: `Reminder: ${event.title} is coming up!`,
            message: `Don't forget! ${event.title} is happening soon.`,
            status: 'sent',
            sentAt: new Date(),
          });
        }

        // Send SMS reminder
        if (user.notificationPreferences.sms) {
          await sendEventReminderSMS(user.phone, event.title, event.eventDate);

          // Create SMS notification record
          await Notification.create({
            userId: user._id,
            eventId: event._id,
            notificationType: 'event_reminder',
            deliveryMethod: 'sms',
            subject: `Reminder: ${event.title}`,
            message: `SMS reminder for ${event.title}`,
            status: 'sent',
            sentAt: new Date(),
          });
        }
      }
    }
  } catch (error) {
    console.error('Error sending reminders:', error);
  }
};

module.exports = {
  initializeReminderService,
  sendEventReminders,
};
