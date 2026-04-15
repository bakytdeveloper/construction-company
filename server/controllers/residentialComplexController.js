import ResidentialComplex from '../models/ResidentialComplex.js';
import Property from '../models/Property.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Получить все ЖК
export const getAllComplexes = async (req, res) => {
    try {
        const complexes = await ResidentialComplex.find({ isActive: true }).sort({ createdAt: -1 });
        res.json({
            success: true,
            data: complexes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Получить ЖК по ID с его недвижимостью
export const getComplexById = async (req, res) => {
    try {
        const complex = await ResidentialComplex.findById(req.params.id);
        if (!complex) {
            return res.status(404).json({ error: 'Жилой комплекс не найден' });
        }

        const properties = await Property.find({
            residentialComplex: req.params.id,
            isActive: true
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { complex, properties }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Создать ЖК (только для админа)
export const createComplex = async (req, res) => {
    try {
        const complexData = JSON.parse(req.body.data);

        if (req.files && req.files.length > 0) {
            const imagePaths = req.files.map(file => `/uploads/complexes/${file.filename}`);
            complexData.images = imagePaths;
            complexData.mainImage = imagePaths[0] || '';
        }

        const complex = new ResidentialComplex(complexData);
        await complex.save();

        res.status(201).json({
            success: true,
            data: complex
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Обновить ЖК
export const updateComplex = async (req, res) => {
    try {
        const complex = await ResidentialComplex.findById(req.params.id);
        if (!complex) {
            return res.status(404).json({ error: 'Жилой комплекс не найден' });
        }

        const updateData = JSON.parse(req.body.data);

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/complexes/${file.filename}`);
            updateData.images = [...complex.images, ...newImages];
            if (!updateData.mainImage) {
                updateData.mainImage = updateData.images[0];
            }
        }

        Object.assign(complex, updateData);
        await complex.save();

        res.json({
            success: true,
            data: complex
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Удалить ЖК
export const deleteComplex = async (req, res) => {
    try {
        const complex = await ResidentialComplex.findById(req.params.id);
        if (!complex) {
            return res.status(404).json({ error: 'Жилой комплекс не найден' });
        }

        // Удаляем все связанные объекты недвижимости
        await Property.updateMany(
            { residentialComplex: req.params.id },
            { $set: { residentialComplex: null } }
        );

        await complex.deleteOne();

        res.json({
            success: true,
            message: 'Жилой комплекс удален'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};