// routes/heroRoutes.js
import express from 'express';
import {
    getHeroContent,
    getAdminHeroContent,
    updateHeroContent,
    uploadSlideImage,
    deleteSlideImage
} from '../controllers/heroController.js';
import { authenticateAdmin } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/hero/';
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

// ============ Публичные маршруты ============
router.get('/content', getHeroContent);

// ============ Админские маршруты ============
router.get('/admin/content', authenticateAdmin, getAdminHeroContent);
router.put('/content', authenticateAdmin, updateHeroContent);
router.post('/slides/:slideIndex/image', authenticateAdmin, upload.single('image'), uploadSlideImage);
router.delete('/slides/:slideIndex/image', authenticateAdmin, deleteSlideImage);

// Для отладки - вывести все зарегистрированные маршруты
console.log('✅ Hero routes registered:');
console.log('  - GET /api/hero/content');
console.log('  - GET /api/hero/admin/content');
console.log('  - PUT /api/hero/content');
console.log('  - POST /api/hero/slides/:slideIndex/image');
console.log('  - DELETE /api/hero/slides/:slideIndex/image');

export default router;