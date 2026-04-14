import express from 'express';
import Project from '../models/Project.js';

const router = express.Router();

// Get all active projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get project by ID
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Проект не найден' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get projects by category
router.get('/category/:category', async (req, res) => {
    try {
        const projects = await Project.find({ category: req.params.category, isActive: true });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;