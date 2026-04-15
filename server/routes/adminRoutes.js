import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
    createComplex,
    updateComplex,
    deleteComplex
} from '../controllers/residentialComplexController.js';
import {
    createProperty,
    updateProperty,
    deleteProperty
} from '../controllers/propertyController.js';
import ContactMessage from '../models/ContactMessage.js';
import { authenticateAdmin } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';
        if (req.url.includes('complex')) {
            uploadPath += 'complexes/';
        } else if (req.url.includes('property')) {
            uploadPath += 'properties/';
        }

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
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

// Admin login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign(
            { email, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            admin: { email }
        });
    } else {
        res.status(401).json({ error: 'Неверный email или пароль' });
    }
});

// CRUD для Жилых Комплексов
router.post('/complexes', authenticateAdmin, upload.array('images', 10), createComplex);
router.put('/complexes/:id', authenticateAdmin, upload.array('images', 10), updateComplex);
router.delete('/complexes/:id', authenticateAdmin, deleteComplex);

// CRUD для Недвижимости
router.post('/properties', authenticateAdmin, upload.array('images', 10), createProperty);
router.put('/properties/:id', authenticateAdmin, upload.array('images', 10), updateProperty);
router.delete('/properties/:id', authenticateAdmin, deleteProperty);

// Получение сообщений
router.get('/contacts', authenticateAdmin, async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;