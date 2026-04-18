// routes/testimonialRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
    getAllTestimonials,
    getAdminTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    createDefaultTestimonials,
    getTestimonialSettings,
    updateTestimonialSettings,
    resetTestimonialSettings,
    reorderTestimonial
} from '../controllers/testimonialController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/testimonials/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + path.extname(file.originalname);
        cb(null, filename);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Только изображения!'));
    }
});

// Публичные маршруты
router.get('/', getAllTestimonials);

// Админские маршруты для настроек секции
router.get('/settings', authenticateAdmin, getTestimonialSettings);
router.put('/settings', authenticateAdmin, updateTestimonialSettings);
router.post('/settings/reset', authenticateAdmin, resetTestimonialSettings);

// Админские маршруты для отзывов
router.get('/admin', authenticateAdmin, getAdminTestimonials);
router.post('/', authenticateAdmin, upload.single('image'), createTestimonial);
router.post('/default/create', authenticateAdmin, createDefaultTestimonials);
router.put('/:id', authenticateAdmin, upload.single('image'), updateTestimonial);
router.delete('/:id', authenticateAdmin, deleteTestimonial);
router.post('/:id/reorder/:direction', authenticateAdmin, reorderTestimonial);

export default router;