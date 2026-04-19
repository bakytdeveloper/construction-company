// routes/contactRoutes.js
import express from 'express';
import {
    submitContactForm,
    getContactSettings,
    updateContactSettings,
    resetContactSettings,
    getAllMessages,
    markMessageAsRead,
    deleteMessage
} from '../controllers/contactController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Публичные маршруты
router.post('/submit', submitContactForm);
router.get('/settings', getContactSettings);

// Админские маршруты для настроек
router.put('/settings', authenticateAdmin, updateContactSettings);
router.post('/settings/reset', authenticateAdmin, resetContactSettings);

// Админские маршруты для сообщений
router.get('/messages', authenticateAdmin, getAllMessages);
router.put('/messages/:id/read', authenticateAdmin, markMessageAsRead);
router.delete('/messages/:id', authenticateAdmin, deleteMessage);

export default router;