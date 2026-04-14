const Contact = require('../models/ContactMessage');
const { sendEmailToAdmin } = require('../utils/emailService');
const { validationResult } = require('express-validator');

exports.submitContactForm = async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, phone, email, message, service } = req.body;

        // Save to database
        const contact = new Contact({
            name,
            phone,
            email,
            message,
            service: service || 'general'
        });

        await contact.save();

        // Send email notifications
        try {
            await sendEmailToAdmin({ name, phone, email, message, service: service || 'general' });
        } catch (emailError) {
            console.error('Email error but contact saved:', emailError);
            // Still return success because contact was saved
        }

        res.status(200).json({
            success: true,
            message: 'Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.'
        });
    }
};

exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching contacts'
        });
    }
};