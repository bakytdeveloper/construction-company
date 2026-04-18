// routes/advantageRoutes.js
import express from 'express';
import {
    getAllAdvantages,
    getAdminAdvantages,
    createAdvantage,
    updateAdvantage,
    deleteAdvantage,
    createDefaultAdvantages,
    getAdvantageSettings,
    updateAdvantageSettings,
    resetAdvantageSettings
} from '../controllers/advantageController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// ============ Публичные маршруты ============
router.get('/', getAllAdvantages);

// ============ Админские маршруты для настроек секции ============
router.get('/settings', authenticateAdmin, getAdvantageSettings);
router.put('/settings', authenticateAdmin, updateAdvantageSettings);
router.post('/settings/reset', authenticateAdmin, resetAdvantageSettings);

// ============ Админские маршруты для преимуществ ============
router.get('/admin', authenticateAdmin, getAdminAdvantages);
router.post('/', authenticateAdmin, createAdvantage);
router.post('/default/create', authenticateAdmin, createDefaultAdvantages);
router.put('/:id', authenticateAdmin, updateAdvantage);
router.delete('/:id', authenticateAdmin, deleteAdvantage);

export default router;