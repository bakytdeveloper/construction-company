// routes/aboutRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
    getAboutSettings,
    updateAboutSettings,
    resetAboutSettings,
    uploadMissionImage,
    uploadTeamMemberImage,
    uploadHeroBgImage,
    deleteTeamMemberImage,
    reorderValueCard,
    reorderTeamMember
} from '../controllers/aboutController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/about/';
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
router.get('/', getAboutSettings);

// Админские маршруты для настроек
router.put('/', authenticateAdmin, updateAboutSettings);
router.post('/reset', authenticateAdmin, resetAboutSettings);

// Админские маршруты для загрузки изображений
router.post('/upload/hero-bg', authenticateAdmin, upload.single('image'), uploadHeroBgImage);
router.post('/upload/mission-image', authenticateAdmin, upload.single('image'), uploadMissionImage);
router.post('/upload/team-member/:memberIndex', authenticateAdmin, upload.single('image'), uploadTeamMemberImage);
router.delete('/team-member/:memberIndex/image', authenticateAdmin, deleteTeamMemberImage);

// Админские маршруты для переупорядочивания
router.post('/reorder/value-card/:id/:direction', authenticateAdmin, reorderValueCard);
router.post('/reorder/team-member/:id/:direction', authenticateAdmin, reorderTeamMember);

export default router;