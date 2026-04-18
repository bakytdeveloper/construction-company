// routes/serviceRoutes.js
import express from 'express';
import {
    getAllServices,
    getAdminServices,
    createService,
    updateService,
    deleteService,
    createDefaultServices,
    getServiceSettings,
    updateServiceSettings,
    resetServiceSettings
} from '../controllers/serviceController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// ============ Публичные маршруты ============
router.get('/', getAllServices);

// ============ Админские маршруты для настроек секции ============
// ВАЖНО: эти маршруты должны быть ДО маршрутов с параметром :id
router.get('/settings', authenticateAdmin, getServiceSettings);
router.put('/settings', authenticateAdmin, updateServiceSettings);
router.post('/settings/reset', authenticateAdmin, resetServiceSettings);

// ============ Админские маршруты для услуг ============
router.get('/admin', authenticateAdmin, getAdminServices);
router.post('/', authenticateAdmin, createService);
router.post('/default/create', authenticateAdmin, createDefaultServices);
router.put('/:id', authenticateAdmin, updateService);
router.delete('/:id', authenticateAdmin, deleteService);

export default router;