// routes/adminRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import ResidentialComplex from '../models/ResidentialComplex.js';
import Property from '../models/Property.js';

import {
    getAllComplexes,
    createComplex,
    updateComplex,
    deleteComplex,
    getComplexById
} from '../controllers/residentialComplexController.js';
import {
    getAllProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    getPropertyById
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

        if (req.originalUrl.includes('/admin/complexes')) {
            uploadPath += 'complexes/';
        } else if (req.originalUrl.includes('/admin/properties')) {
            uploadPath += 'properties/';
        } else if (req.url.includes('complex')) {
            uploadPath += 'complexes/';
        } else if (req.url.includes('property')) {
            uploadPath += 'properties/';
        } else {
            uploadPath += 'misc/';
        }

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        console.log(`📁 Сохранение файла в: ${uploadPath}`);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + path.extname(file.originalname);
        console.log(`📄 Имя файла: ${filename}`);
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

// ============ GET маршруты для админ-панели ============

// Получить все ЖК (для админ-панели)
router.get('/complexes', authenticateAdmin, async (req, res) => {
    try {
        const complexes = await ResidentialComplex.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: complexes
        });
    } catch (error) {
        console.error('Error fetching complexes:', error);
        res.status(500).json({ error: error.message });
    }
});

// Получить все объекты недвижимости (для админ-панели)
router.get('/properties', authenticateAdmin, async (req, res) => {
    try {
        const properties = await Property.find()
            .populate('residentialComplex', 'title location')
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            data: properties
        });
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: error.message });
    }
});

// Получить объект по ID
router.get('/properties/:id', authenticateAdmin, getPropertyById);

// Получить ЖК по ID
router.get('/complexes/:id', authenticateAdmin, getComplexById);

// ============ Удаление изображений (ВАЖНО: должны быть ДО маршрутов с :id) ============

// Удаление изображения для Недвижимости
router.delete('/properties/:id/images', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl } = req.body;

        console.log('🗑️ Удаление изображения недвижимости:', { id, imageUrl });

        if (!imageUrl) {
            return res.status(400).json({ error: 'Не указан URL изображения' });
        }

        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({ error: 'Объект не найден' });
        }

        // Удаляем изображение из массива images
        const imageIndex = property.images.findIndex(img => img === imageUrl);
        if (imageIndex !== -1) {
            property.images.splice(imageIndex, 1);
            console.log('✅ Изображение удалено из массива images');
        }

        // Если удаляемое изображение является главным, устанавливаем новое главное
        if (property.mainImage === imageUrl) {
            property.mainImage = property.images.length > 0 ? property.images[0] : '';
            console.log('✅ Обновлено главное изображение');
        }

        await property.save();

        // Удаляем файл с сервера
        if (imageUrl.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '..', imageUrl);
            console.log('📁 Путь к файлу:', filePath);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`🗑️ Файл удален: ${filePath}`);
            } else {
                console.log(`⚠️ Файл не найден: ${filePath}`);
            }
        }

        res.json({
            success: true,
            message: 'Изображение удалено',
            data: property
        });
    } catch (error) {
        console.error('❌ Ошибка при удалении изображения:', error);
        res.status(500).json({ error: error.message });
    }
});

// Удаление изображения для Жилого Комплекса
router.delete('/complexes/:id/images', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl } = req.body;

        console.log('🗑️ Удаление изображения ЖК:', { id, imageUrl });

        if (!imageUrl) {
            return res.status(400).json({ error: 'Не указан URL изображения' });
        }

        const complex = await ResidentialComplex.findById(id);
        if (!complex) {
            return res.status(404).json({ error: 'Жилой комплекс не найден' });
        }

        // Удаляем изображение из массива images
        const imageIndex = complex.images.findIndex(img => img === imageUrl);
        if (imageIndex !== -1) {
            complex.images.splice(imageIndex, 1);
            console.log('✅ Изображение удалено из массива images');
        }

        // Если удаляемое изображение является главным, устанавливаем новое главное
        if (complex.mainImage === imageUrl) {
            complex.mainImage = complex.images.length > 0 ? complex.images[0] : '';
            console.log('✅ Обновлено главное изображение');
        }

        await complex.save();

        // Удаляем файл с сервера
        if (imageUrl.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '..', imageUrl);
            console.log('📁 Путь к файлу:', filePath);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`🗑️ Файл удален: ${filePath}`);
            } else {
                console.log(`⚠️ Файл не найден: ${filePath}`);
            }
        }

        res.json({
            success: true,
            message: 'Изображение удалено',
            data: complex
        });
    } catch (error) {
        console.error('❌ Ошибка при удалении изображения ЖК:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============ CRUD для Жилых Комплексов ============
router.post('/complexes', authenticateAdmin, upload.array('images', 10), createComplex);
router.put('/complexes/:id', authenticateAdmin, upload.array('images', 10), updateComplex);
router.delete('/complexes/:id', authenticateAdmin, deleteComplex);

// ============ CRUD для Недвижимости ============
router.post('/properties', authenticateAdmin, upload.array('images', 10), createProperty);
router.put('/properties/:id', authenticateAdmin, upload.array('images', 10), updateProperty);
router.delete('/properties/:id', authenticateAdmin, deleteProperty);

// ============ Сообщения ============
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

router.put('/contacts/:id/read', authenticateAdmin, async (req, res) => {
    try {
        const message = await ContactMessage.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ error: 'Сообщение не найдено' });
        }

        message.isRead = true;
        await message.save();

        res.json({
            success: true,
            message: 'Сообщение отмечено как прочитанное'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/contacts/:id', authenticateAdmin, async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({ error: 'Сообщение не найдено' });
        }

        res.json({
            success: true,
            message: 'Сообщение удалено'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
