import express from 'express';
import {
    getAllComplexes,
    getComplexById
} from '../controllers/residentialComplexController.js';

const router = express.Router();

// Публичные маршруты для ЖК
router.get('/', getAllComplexes);
router.get('/:id', getComplexById);

export default router;