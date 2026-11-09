const prisma = require('../utils/prisma');

exports.submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please complete all required fields.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : null,
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been received. Our concierge team will respond within 24 hours.',
      contact,
    });
  } catch (error) {
    console.error('Contact Submission Error:', error);
    return res.status(500).json({ success: false, message: 'Unable to submit your message at this time.' });
  }
};

exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please enter your email address.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.toLowerCase().trim();

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return res.json({
        success: true,
        message: 'You are already a valued subscriber to our grooming journal.',
      });
    }

    await prisma.newsletterSubscriber.create({
      data: { email: cleanEmail, source: 'footer_newsletter' },
    });

    return res.status(201).json({
      success: true,
      message: 'Welcome to PetBloom. Check your inbox for your 10% welcome invitation: BLOOM10',
    });
  } catch (error) {
    console.error('Newsletter Error:', error);
    return res.status(500).json({ success: false, message: 'Subscription request failed.' });
  }
};
