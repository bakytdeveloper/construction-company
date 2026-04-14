import express from 'express';
import jwt from 'jsonwebtoken';
import Project from '../models/Project.js';
import ContactMessage from '../models/ContactMessage.js';
import { authenticateAdmin } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
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

// Create project
router.post('/projects', authenticateAdmin, upload.array('images', 10), async (req, res) => {
    try {
        const projectData = JSON.parse(req.body.data);
        const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

        projectData.images = imagePaths;
        projectData.mainImage = imagePaths[0] || '';

        const project = new Project(projectData);
        await project.save();

        res.status(201).json({ success: true, project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update project
router.put('/projects/:id', authenticateAdmin, upload.array('images', 10), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Проект не найден' });
        }

        const updateData = JSON.parse(req.body.data);

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/${file.filename}`);
            updateData.images = [...project.images, ...newImages];
            if (!updateData.mainImage) {
                updateData.mainImage = updateData.images[0];
            }
        }

        Object.assign(project, updateData);
        await project.save();

        res.json({ success: true, project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete project
router.delete('/projects/:id', authenticateAdmin, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Проект не найден' });
        }
        res.json({ success: true, message: 'Проект удален' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all contact messages
router.get('/contacts', authenticateAdmin, async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark message as read
router.put('/contacts/:id/read', authenticateAdmin, async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            { isRead: true, status: 'read' },
            { new: true }
        );
        res.json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;