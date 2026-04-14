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
        // Валидация
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, phone, email, message, projectType } = req.body;

        // Сохранение в базу данных
        const contactMessage = new ContactMessage({
            name,
            phone,
            email,
            message,
            projectType: projectType || 'other'
        });

        await contactMessage.save();
        console.log(`✅ Заявка сохранена в БД с ID: ${contactMessage._id}`);

        // Отправка email уведомлений
        await sendContactNotification({
            name,
            phone,
            email,
            message,
            projectType: projectType || 'other'
        });

        res.status(201).json({
            success: true,
            message: '✅ Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.',
            data: {
                id: contactMessage._id,
                name: contactMessage.name,
                createdAt: contactMessage.createdAt
            }
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            error: 'Ошибка при отправке сообщения. Пожалуйста, попробуйте позже.'
        });
    }
});

// Get all messages (protected - for admin)
router.get('/messages', async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;