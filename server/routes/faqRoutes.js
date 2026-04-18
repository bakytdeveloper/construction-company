// routes/faqRoutes.js
import express from 'express';
import {
    getAllFaqs,
    getAdminFaqs,
    createFaq,
    updateFaq,
    deleteFaq,
    createDefaultFaqs,
    getFaqSettings,
    updateFaqSettings,
    resetFaqSettings,
    reorderFaq
} from '../controllers/faqController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Публичные маршруты
router.get('/', getAllFaqs);

// Админские маршруты для настроек секции
router.get('/settings', authenticateAdmin, getFaqSettings);
router.put('/settings', authenticateAdmin, updateFaqSettings);
router.post('/settings/reset', authenticateAdmin, resetFaqSettings);

// Админские маршруты для вопросов
router.get('/admin', authenticateAdmin, getAdminFaqs);
router.post('/', authenticateAdmin, createFaq);
router.post('/default/create', authenticateAdmin, createDefaultFaqs);
router.put('/:id', authenticateAdmin, updateFaq);
router.delete('/:id', authenticateAdmin, deleteFaq);
router.post('/:id/reorder/:direction', authenticateAdmin, reorderFaq);

export default router;