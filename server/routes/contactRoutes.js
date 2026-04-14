import express from 'express';
import ContactMessage from '../models/ContactMessage.js';
import { sendContactNotification } from '../utils/emailService.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Submit contact form
router.post('/submit', [
    body('name').trim().notEmpty().withMessage('Имя обязательно'),
    body('phone').trim().notEmpty().withMessage('Телефон обязателен'),
    body('email').isEmail().withMessage('Неверный формат email'),
    body('message').trim().notEmpty().withMessage('Сообщение обязательно')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const contactMessage = new ContactMessage(req.body);
        await contactMessage.save();

        // Send email notification
        await sendContactNotification(req.body);

        res.status(201).json({
            success: true,
            message: 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.'
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Ошибка при отправке сообщения. Пожалуйста, попробуйте позже.' });
    }
});

// Get all messages (protected)
router.get('/messages', async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;