const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT, 
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false 
  }
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};


const sendWelcomeEmail = async (userEmail, userName) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
      <h2 style="color: #3498db;">Welcome to TriConnect!</h2>
      <p>Dear ${userName},</p>
      <p>Thank you for joining our community. We are excited to have you on board!</p>
      <p>Explore upcoming events and manage your registrations all in one place.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}" style="background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
      </div>
      <p>Best regards,<br>TriConnect Team</p>
    </div>
  `;

  return sendEmail(userEmail, 'Welcome to TriConnect!', htmlContent);
};

const sendEventRegistrationEmail = async (userEmail, userName, eventTitle, eventDate) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Event Registration Confirmed!</h2>
      <p>Dear ${userName},</p>
      <p>Thank you for registering for the following event:</p>
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>${eventTitle}</h3>
        <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
      </div>
      <p>Best regards,<br>TriConnect Team</p>
    </div>
  `;
  return sendEmail(userEmail, `Event Registration Confirmation: ${eventTitle}`, htmlContent);
};

const sendEventReminderEmail = async (userEmail, userName, eventTitle, eventDate, registrationLink) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Event Reminder</h2>
      <p>Dear ${userName},</p>
      <p>This is a reminder about your registered event: <strong>${eventTitle}</strong></p>
      <p>Date: ${new Date(eventDate).toLocaleDateString()}</p>
      <p>Best regards,<br>TriConnect Team</p>
    </div>
  `;
  return sendEmail(userEmail, `Reminder: ${eventTitle} is coming up!`, htmlContent);
};

const sendNewEventNotificationEmail = async (userEmail, userName, eventTitle, eventDescription, eventDate, eventSector) => {
  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const dashboardLink = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-bottom: 3px solid #667eea;">
        <h1 style="color: #667eea; margin: 0; font-size: 28px;">🚀 New Event Alert!</h1>
        <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">Discover a new opportunity on TriConnect</p>
      </div>
      
      <div style="padding: 30px; background-color: white;">
        <p style="color: #2c3e50; font-size: 16px; margin-bottom: 20px;">Hi <strong>${userName}</strong>,</p>
        
        <p style="color: #555; font-size: 15px; line-height: 1.6;">A new <strong style="color: #667eea;">${eventSector.toUpperCase()}</strong> event has been posted on TriConnect that matches your interests:</p>
        
        <div style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-left: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 5px;">
          <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 20px;">${eventTitle}</h2>
          <p style="color: #555; margin: 8px 0; font-size: 14px;"><strong>📅 When:</strong> ${formattedDate}</p>
          <p style="color: #555; margin: 8px 0; font-size: 14px;"><strong>📌 Category:</strong> ${eventSector}</p>
          <p style="color: #666; margin: 15px 0 0 0; font-size: 13px; line-height: 1.5;">${eventDescription.substring(0, 250)}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardLink}/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">View Event Details</a>
        </div>
        
        <p style="color: #888; font-size: 13px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
          You received this email because you have enabled event notifications and have interests in the <strong>${eventSector}</strong> sector.
        </p>
      </div>
      
      <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">© 2025 TriConnect. All rights reserved.</p>
        <p style="margin: 8px 0 0 0; color: #bbb;">Connecting Students with Opportunities</p>
      </div>
    </div>
  `;
  return sendEmail(userEmail, '🚀 New Event Alert! - ' + eventTitle, htmlContent);
};


module.exports = {
  sendEmail,
  sendWelcomeEmail, 
  sendEventRegistrationEmail,
  sendEventReminderEmail,
  sendNewEventNotificationEmail,
};