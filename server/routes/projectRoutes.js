import express from 'express';
import {
    getAllProperties,
    getPropertyById,
    getPropertiesByComplex
} from '../controllers/propertyController.js';

const router = express.Router();

// Публичные маршруты для недвижимости
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.get('/complex/:complexId', getPropertiesByComplex);

export default router;