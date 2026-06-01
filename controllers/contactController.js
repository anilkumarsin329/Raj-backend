import Contact from '../models/Contact.js';

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: "Name must be at least 2 characters long" });
    }
    
    if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address" });
    }
    
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "Please provide a valid 10-digit phone number" });
    }
    
    if (!subject || !['wedding', 'corporate', 'birthday', 'quote', 'general'].includes(subject)) {
      return res.status(400).json({ success: false, message: "Please select a valid subject" });
    }
    
    if (!message || message.trim().length < 10) {
      return res.status(400).json({ success: false, message: "Message must be at least 10 characters long" });
    }
    
    const contact = await Contact.create({ name, email, phone, subject, message });
    
    res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We will get back to you within 24 hours.",
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt
      }
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({ success: false, message: "Failed to submit contact form. Please try again." });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Contact.countDocuments(filter);
    
    res.json({
      success: true,
      data: contacts,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch contacts" });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status, adminNotes },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    
    res.json({
      success: true,
      message: "Contact updated successfully",
      data: contact
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update contact" });
  }
};