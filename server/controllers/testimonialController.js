// controllers/testimonialController.js
import Testimonial from '../models/Testimonial.js';
import TestimonialSettings from '../models/TestimonialSettings.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Дефолтные данные
const getDefaultTestimonialsData = () => {
    return [
        {
            name: 'Аскар Нуржанов',
            position: 'Владелец дома, мкр. Нурсая',
            rating: 5,
            text: 'Огромное спасибо команде за профессионализм! Построили дом нашей мечты точно в срок. Отдельно хочу отметить внимание к деталям и качество материалов. Рекомендую!',
            image: 'https://randomuser.me/api/portraits/men/1.jpg',
            imageType: 'url',
            project: 'Коттедж 350 м²',
            order: 0,
            active: true
        },
        {
            name: 'Гульнара Садвакасова',
            position: 'Квартира в ЖК "Алмалы"',
            rating: 5,
            text: 'Приобрели квартиру в новостройке. Очень довольны качеством отделки и планировкой. Застройщик выполнил все обязательства в срок. Спасибо!',
            image: 'https://randomuser.me/api/portraits/women/2.jpg',
            imageType: 'url',
            project: 'Квартира 120 м²',
            order: 1,
            active: true
        },
        {
            name: 'Ерлан Мукашев',
            position: 'Директор компании',
            rating: 5,
            text: 'Заказывали строительство офисного здания. Работа выполнена на высшем уровне. Команда профессионалов, всегда на связи, решают все вопросы оперативно.',
            image: 'https://randomuser.me/api/portraits/men/3.jpg',
            imageType: 'url',
            project: 'Бизнес-центр',
            order: 2,
            active: true
        },
        {
            name: 'Айгуль Жумабаева',
            position: 'Семейная пара',
            rating: 5,
            text: 'Спасибо за наш уютный дом! Всё сделано с душой и вниманием к нашим пожеланиям. Даже соседи завидуют :) Обязательно будем рекомендовать вас друзьям!',
            image: 'https://randomuser.me/api/portraits/women/4.jpg',
            imageType: 'url',
            project: 'Таунхаус 180 м²',
            order: 3,
            active: true
        }
    ];
};

// Функция для удаления всех файлов изображений из папки testimonials
const deleteAllTestimonialImages = async () => {
    const testimonialsDir = path.join(__dirname, '..', 'uploads/testimonials');

    if (fs.existsSync(testimonialsDir)) {
        const files = fs.readdirSync(testimonialsDir);
        for (const file of files) {
            const filePath = path.join(testimonialsDir, file);
            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
                console.log(`🗑️ Удален файл: ${filePath}`);
            }
        }
    }
};

// Сохранение дефолтных данных в БД (с удалением старых файлов)
const saveDefaultTestimonials = async () => {
    // Удаляем все файлы изображений с сервера
    await deleteAllTestimonialImages();

    const defaultTestimonials = getDefaultTestimonialsData();
    await Testimonial.deleteMany({});
    await Testimonial.insertMany(defaultTestimonials);
    return await Testimonial.find().sort({ order: 1 });
};

// ============ Настройки секции ============

export const getTestimonialSettings = async (req, res) => {
    try {
        let settings = await TestimonialSettings.findOne();

        if (!settings) {
            settings = await TestimonialSettings.create({
                subtitle: 'Отзывы клиентов',
                title: 'Что говорят о нас',
                description: 'Более 98% наших клиентов рекомендуют нас своим друзьям и знакомым',
                statsValue: 4.9,
                statsStars: 5,
                statsReviews: 127,
                updatedBy: 'system'
            });
        }

        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error getting testimonial settings:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateTestimonialSettings = async (req, res) => {
    try {
        const { subtitle, title, description, statsValue, statsStars, statsReviews } = req.body;

        let settings = await TestimonialSettings.findOne();

        if (!settings) {
            settings = new TestimonialSettings();
        }

        if (subtitle !== undefined) settings.subtitle = subtitle;
        if (title !== undefined) settings.title = title;
        if (description !== undefined) settings.description = description;
        if (statsValue !== undefined) settings.statsValue = statsValue;
        if (statsStars !== undefined) settings.statsStars = statsStars;
        if (statsReviews !== undefined) settings.statsReviews = statsReviews;
        settings.updatedBy = req.admin?.email || 'admin';

        await settings.save();

        res.json({
            success: true,
            message: 'Настройки обновлены',
            data: settings
        });
    } catch (error) {
        console.error('Error updating testimonial settings:', error);
        res.status(500).json({ error: error.message });
    }
};

export const resetTestimonialSettings = async (req, res) => {
    try {
        const defaultSettings = {
            subtitle: 'Отзывы клиентов',
            title: 'Что говорят о нас',
            description: 'Более 98% наших клиентов рекомендуют нас своим друзьям и знакомым',
            statsValue: 4.9,
            statsStars: 5,
            statsReviews: 127,
            updatedBy: req.admin?.email || 'admin'
        };

        let settings = await TestimonialSettings.findOne();

        if (!settings) {
            settings = new TestimonialSettings(defaultSettings);
        } else {
            settings.subtitle = defaultSettings.subtitle;
            settings.title = defaultSettings.title;
            settings.description = defaultSettings.description;
            settings.statsValue = defaultSettings.statsValue;
            settings.statsStars = defaultSettings.statsStars;
            settings.statsReviews = defaultSettings.statsReviews;
            settings.updatedBy = defaultSettings.updatedBy;
        }

        await settings.save();

        res.json({
            success: true,
            message: 'Настройки сброшены к дефолтным',
            data: settings
        });
    } catch (error) {
        console.error('Error resetting testimonial settings:', error);
        res.status(500).json({ error: error.message });
    }
};

// ============ Отзывы ============

export const getAllTestimonials = async (req, res) => {
    try {
        let testimonials = await Testimonial.find({ active: true }).sort({ order: 1 });

        if (testimonials.length === 0) {
            testimonials = await saveDefaultTestimonials();
            testimonials = testimonials.filter(t => t.active);
        }

        let settings = await TestimonialSettings.findOne();
        if (!settings) {
            settings = await TestimonialSettings.create({
                subtitle: 'Отзывы клиентов',
                title: 'Что говорят о нас',
                description: 'Более 98% наших клиентов рекомендуют нас своим друзьям и знакомым',
                statsValue: 4.9,
                statsStars: 5,
                statsReviews: 127,
                updatedBy: 'system'
            });
        }

        res.json({
            success: true,
            data: {
                settings,
                testimonials
            }
        });
    } catch (error) {
        console.error('Error getting testimonials:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getAdminTestimonials = async (req, res) => {
    try {
        let testimonials = await Testimonial.find().sort({ order: 1 });

        if (testimonials.length === 0) {
            testimonials = await saveDefaultTestimonials();
        }

        let settings = await TestimonialSettings.findOne();
        if (!settings) {
            settings = await TestimonialSettings.create({
                subtitle: 'Отзывы клиентов',
                title: 'Что говорят о нас',
                description: 'Более 98% наших клиентов рекомендуют нас своим друзьям и знакомым',
                statsValue: 4.9,
                statsStars: 5,
                statsReviews: 127,
                updatedBy: 'system'
            });
        }

        res.json({
            success: true,
            data: {
                settings,
                testimonials
            }
        });
    } catch (error) {
        console.error('Error getting admin testimonials:', error);
        res.status(500).json({ error: error.message });
    }
};

export const createTestimonial = async (req, res) => {
    try {
        const testimonialData = req.body;

        if (req.file) {
            const imageUrl = `/uploads/testimonials/${req.file.filename}`;
            testimonialData.image = imageUrl;
            testimonialData.imageType = 'file';
        } else if (!testimonialData.image) {
            testimonialData.imageType = 'initials';
        }

        const testimonial = new Testimonial(testimonialData);
        await testimonial.save();

        res.status(201).json({
            success: true,
            data: testimonial
        });
    } catch (error) {
        console.error('Error creating testimonial:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Неверный идентификатор' });
        }

        const updateData = req.body;

        if (req.file) {
            const oldTestimonial = await Testimonial.findById(id);
            if (oldTestimonial && oldTestimonial.image && oldTestimonial.imageType === 'file') {
                const oldPath = path.join(__dirname, '..', oldTestimonial.image);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            const imageUrl = `/uploads/testimonials/${req.file.filename}`;
            updateData.image = imageUrl;
            updateData.imageType = 'file';
        }

        const testimonial = await Testimonial.findByIdAndUpdate(id, updateData, { new: true });

        if (!testimonial) {
            return res.status(404).json({ error: 'Отзыв не найден' });
        }

        res.json({
            success: true,
            data: testimonial
        });
    } catch (error) {
        console.error('Error updating testimonial:', error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Неверный идентификатор' });
        }

        const testimonial = await Testimonial.findById(id);

        if (!testimonial) {
            return res.status(404).json({ error: 'Отзыв не найден' });
        }

        if (testimonial.image && testimonial.imageType === 'file') {
            const filePath = path.join(__dirname, '..', testimonial.image);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Testimonial.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Отзыв удален'
        });
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        res.status(500).json({ error: error.message });
    }
};

export const createDefaultTestimonials = async (req, res) => {
    try {
        // Удаляем все существующие отзывы и их изображения
        const existingTestimonials = await Testimonial.find();

        // Удаляем файлы изображений существующих отзывов
        for (const testimonial of existingTestimonials) {
            if (testimonial.image && testimonial.imageType === 'file') {
                const filePath = path.join(__dirname, '..', testimonial.image);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`🗑️ Удален файл: ${filePath}`);
                }
            }
        }

        // Удаляем все отзывы из БД
        await Testimonial.deleteMany({});

        // Создаем дефолтные отзывы
        const testimonials = await saveDefaultTestimonials();

        res.json({
            success: true,
            message: 'Дефолтные отзывы созданы, все старые изображения удалены',
            data: testimonials
        });
    } catch (error) {
        console.error('Error creating default testimonials:', error);
        res.status(500).json({ error: error.message });
    }
};

export const reorderTestimonial = async (req, res) => {
    try {
        const { id, direction } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Неверный идентификатор' });
        }

        const currentTestimonial = await Testimonial.findById(id);
        if (!currentTestimonial) {
            return res.status(404).json({ error: 'Отзыв не найден' });
        }

        const currentOrder = currentTestimonial.order;
        let targetOrder;

        if (direction === 'up') {
            targetOrder = currentOrder - 1;
        } else if (direction === 'down') {
            targetOrder = currentOrder + 1;
        } else {
            return res.status(400).json({ error: 'Неверное направление' });
        }

        const targetTestimonial = await Testimonial.findOne({ order: targetOrder });
        if (!targetTestimonial) {
            return res.status(404).json({ error: 'Элемент для обмена не найден' });
        }

        currentTestimonial.order = targetOrder;
        targetTestimonial.order = currentOrder;

        await currentTestimonial.save();
        await targetTestimonial.save();

        const testimonials = await Testimonial.find().sort({ order: 1 });

        res.json({
            success: true,
            message: 'Порядок изменен',
            data: testimonials
        });
    } catch (error) {
        console.error('Error reordering testimonial:', error);
        res.status(500).json({ error: error.message });
    }
};