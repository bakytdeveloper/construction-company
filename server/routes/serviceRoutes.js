// routes/serviceRoutes.js
import express from 'express';
import {
    getAllServices,
    getAdminServices,
    createService,
    updateService,
    deleteService,
    createDefaultServices,
    // ensureDefaultServices
} from '../controllers/serviceController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Публичные маршруты
router.get('/', getAllServices);

// Админские маршруты
router.get('/admin', authenticateAdmin, getAdminServices);
router.post('/', authenticateAdmin, createService);
router.put('/:id', authenticateAdmin, updateService);
router.delete('/:id', authenticateAdmin, deleteService);
router.post('/default/create', authenticateAdmin, createDefaultServices);
// router.get('/ensure-default', authenticateAdmin, ensureDefaultServices);

export default router;