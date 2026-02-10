const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEventRegistrationEmail, sendEventReminderEmail, sendNewEventNotificationEmail } = require('../services/emailService');
const { sendEventRegistrationSMS, sendEventReminderSMS } = require('../services/smsService');

// Get all events with filters
const getEvents = async (req, res) => {
  try {
    const { sector, category, search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = { isActive: true };

    if (sector) {
      filter.sector = sector;
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const events = await Event.find(filter)
      .populate('createdBy', 'name email')
      .sort({ eventDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(filter);

    res.status(200).json({
      events,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email phone').populate('registeredUsers', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ event });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create event (Admin only)
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      sector,
      eventDate,
      eventTime,
      location,
      organizerDetails,
      registrationLink,
      category,
      capacity,
    } = req.body;

    if (!title || !description || !sector || !eventDate || !registrationLink) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        const fs = require('fs');
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Build poster URL from uploaded file or use fallback
    let posterUrl = '';
    if (req.file) {
      posterUrl = `/uploads/${req.file.filename}`;
    }

    const event = new Event({
      title,
      description,
      sector,
      posterUrl: posterUrl,
      eventDate,
      eventTime,
      location,
      organizerDetails: {
        ...organizerDetails,
        name: organizerDetails.name || (await User.findById(req.userId)).name,
      },
      registrationLink,
      category,
      capacity: capacity || null,
      createdBy: req.userId,
    });

    await event.save();

    // Notify users interested in this sector
    const interestedUsers = await User.find({
      role: 'user',
      [`interests.${sector}`]: true,
    });

    // Send email notifications asynchronously (non-blocking, in background)
    // This doesn't slow down the API response
    sendEmailNotificationsAsync(interestedUsers, event, title, description, sector)
      .catch((asyncErr) => {
        // Log errors but don't fail the event creation
        console.error('Background email sending error:', asyncErr);
      });

    res.status(201).json({
      message: 'Event created successfully',
      event,
    });
  } catch (error) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
    }
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update event (Admin only)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      // Clean up uploaded file if event not found
      if (req.file) {
        const fs = require('fs');
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.createdBy.toString() !== req.userId && req.userRole !== 'admin') {
      // Clean up uploaded file if not authorized
      if (req.file) {
        const fs = require('fs');
        fs.unlinkSync(req.file.path);
      }
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    const { title, description, eventDate, location, registrationLink, isActive } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (eventDate) event.eventDate = eventDate;
    if (location) event.location = { ...event.location, ...location };
    if (registrationLink) event.registrationLink = registrationLink;
    if (isActive !== undefined) event.isActive = isActive;

    // Update poster if new file uploaded
    if (req.file) {
      // Delete old poster if exists
      if (event.posterUrl && event.posterUrl.startsWith('/uploads/')) {
        const fs = require('fs');
        const oldFilePath = require('path').join(__dirname, '../' + event.posterUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      event.posterUrl = `/uploads/${req.file.filename}`;
    }

    await event.save();

    res.status(200).json({
      message: 'Event updated successfully',
      event,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete event (Admin only)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.createdBy.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Register for event
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already registered
    const existingRegistration = await EventRegistration.findOne({
      userId: req.userId,
      eventId,
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Create registration
    const registration = new EventRegistration({
      userId: req.userId,
      eventId,
      status: 'registered',
    });

    await registration.save();

    // Add to user's registered events
    user.registeredEvents.push(eventId);
    await user.save();

    // Add to event's registered users
    event.registeredUsers.push(req.userId);
    await event.save();

    // Send notifications
    if (user.notificationPreferences.email) {
      await sendEventRegistrationEmail(user.email, user.name, event.title, event.eventDate);
    }

    if (user.notificationPreferences.sms) {
      await sendEventRegistrationSMS(user.phone, event.title);
    }

    // Create notification record
    await Notification.create({
      userId: req.userId,
      eventId,
      notificationType: 'registration',
      deliveryMethod: 'email',
      subject: `Registration confirmed for ${event.title}`,
      message: `You have successfully registered for ${event.title}`,
      status: 'sent',
    });

    res.status(201).json({
      message: 'Successfully registered for event',
      registration,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's registered events
const getUserRegisteredEvents = async (req, res) => {
  try {
    const events = await Event.find({ registeredUsers: req.userId }).populate('createdBy', 'name email');

    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get events by sector
const getEventsByCategory = async (req, res) => {
  try {
    const { sector, category } = req.query;

    const filter = { isActive: true };
    if (sector) filter.sector = sector;
    if (category) filter.category = category;

    const events = await Event.find(filter)
      .populate('createdBy', 'name email')
      .sort({ eventDate: -1 });

    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get events nearby user's location (geospatial query)
const getNearbyEvents = async (req, res) => {
  try {
    const { lat, lng, radius = 50 } = req.query;

    // Validate coordinates
    if (!lat || !lng) {
      return res.status(400).json({ 
        message: 'Latitude and longitude are required',
        code: 'MISSING_COORDINATES'
      });
    }

    // Convert to numbers and validate
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusInKm = parseFloat(radius);

    if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({ 
        message: 'Invalid latitude or longitude values',
        code: 'INVALID_COORDINATES'
      });
    }

    if (isNaN(radiusInKm) || radiusInKm < 0) {
      return res.status(400).json({ 
        message: 'Radius must be a positive number',
        code: 'INVALID_RADIUS'
      });
    }

    // MongoDB geospatial query to find events within radius
    // radius is in kilometers, convert to meters for $near operator
    const radiusInMeters = radiusInKm * 1000;

    const nearbyEvents = await Event.find({
      isActive: true,
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude], // Note: MongoDB expects [lng, lat]
          },
          $maxDistance: radiusInMeters,
        },
      },
    })
      .populate('createdBy', 'name email')
      .select('+location'); // Ensure location is included in response

    res.status(200).json({
      events: nearbyEvents,
      userLocation: {
        latitude,
        longitude,
      },
      searchRadius: {
        value: radiusInKm,
        unit: 'km',
      },
      count: nearbyEvents.length,
    });
  } catch (error) {
    console.error('Nearby events search error:', error);
    res.status(500).json({ 
      message: 'Error searching nearby events',
      error: error.message,
      code: 'SEARCH_ERROR'
    });
  }
};

// Helper function to send email notifications asynchronously without blocking API response
const sendEmailNotificationsAsync = async (users, event, title, description, sector) => {
  try {
    // Create notification records and send emails in parallel for all users
    const emailPromises = users.map(async (user) => {
      try {
        // Create notification record in the database
        await Notification.create({
          userId: user._id,
          eventId: event._id,
          notificationType: 'new_event',
          deliveryMethod: 'email',
          subject: `New Event Alert: ${title}`,
          message: description.substring(0, 200),
          status: 'pending',
        });

        // Send email if user has enabled email notifications (respects user preferences)
        if (user.notificationPreferences?.email) {
          await sendNewEventNotificationEmail(
            user.email, 
            user.name, 
            title, 
            description, 
            event.eventDate,
            sector
          );
          
          console.log(`✅ Email sent successfully to ${user.email} for event: ${title}`);
        }
      } catch (userError) {
        // Log individual user email failures but continue with other users
        console.error(`❌ Failed to send email to ${user.email}:`, userError.message);
      }
    });

    // Execute all email operations in parallel
    await Promise.all(emailPromises);
    console.log(`📧 Email notification process completed for ${users.length} interested users`);
  } catch (error) {
    console.error('Error in background email notification process:', error.message);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getUserRegisteredEvents,
  getEventsByCategory,
  getNearbyEvents,
};
