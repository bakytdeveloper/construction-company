// routes/statsRoutes.js
import express from 'express';
import {
    getAllStats,
    getAdminStats,
    createStat,
    updateStat,
    deleteStat,
    createDefaultStats,
    getStatsSettings,
    updateStatsSettings,
    resetStatsSettings,
    reorderStat
} from '../controllers/statsController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Публичные маршруты
router.get('/', getAllStats);

// Админские маршруты для настроек секции
router.get('/settings', authenticateAdmin, getStatsSettings);
router.put('/settings', authenticateAdmin, updateStatsSettings);
router.post('/settings/reset', authenticateAdmin, resetStatsSettings);

// Админские маршруты для статистики
router.get('/admin', authenticateAdmin, getAdminStats);
router.post('/', authenticateAdmin, createStat);
router.post('/default/create', authenticateAdmin, createDefaultStats);
router.put('/:id', authenticateAdmin, updateStat);
router.delete('/:id', authenticateAdmin, deleteStat);
router.post('/:id/reorder/:direction', authenticateAdmin, reorderStat);

export default router;