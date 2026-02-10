const twilio = require('twilio');

// Initialize Twilio client only if valid credentials are provided
let client = null;
const isSmsConfigure = () => {
  return (
    process.env.TWILIO_ACCOUNT_SID && 
    process.env.TWILIO_ACCOUNT_SID.startsWith('AC') &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  );
};

if (isSmsConfigure()) {
  try {
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log('✓ Twilio SMS service initialized successfully');
  } catch (error) {
    console.warn('⚠ Twilio SMS service initialization failed:', error.message);
    client = null;
  }
} else {
  console.warn('⚠ Twilio SMS service not configured. SMS functionality will be disabled.');
  console.warn('  To enable SMS, set valid TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env');
}

const sendSMS = async (toPhoneNumber, message) => {
  // If Twilio is not configured, return a mock success response
  if (!client) {
    console.warn(`⚠ SMS not sent (service not configured): ${toPhoneNumber}`);
    return { success: false, error: 'SMS service not configured', mock: true };
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toPhoneNumber,
    });
    console.log('SMS sent:', result.sid);
    return { success: true, messageSid: result.sid };
  } catch (error) {
    console.error('SMS sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

const sendEventRegistrationSMS = async (phone, eventTitle) => {
  const message = `Hi! You've successfully registered for ${eventTitle}. You'll receive a reminder before the event. Check TriConnect for more details!`;
  return sendSMS(phone, message);
};

const sendEventReminderSMS = async (phone, eventTitle, eventDate) => {
  const dateStr = new Date(eventDate).toLocaleDateString();
  const message = `Reminder: ${eventTitle} is happening on ${dateStr}. Don't miss it! Check the app for more details.`;
  return sendSMS(phone, message);
};

module.exports = {
  sendSMS,
  sendEventRegistrationSMS,
  sendEventReminderSMS,
};
