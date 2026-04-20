// controllers/aboutController.js
import AboutSettings from '../models/AboutSettings.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Дефолтные данные для карточек ценностей
const getDefaultValueCards = () => {
    return [
        { icon: '🔧', title: 'Качество', description: 'Используем только сертифицированные материалы и современные технологии', order: 0, active: true },
        { icon: '⏱️', title: 'Надежность', description: 'Соблюдаем сроки и берем на себя полную ответственность', order: 1, active: true },
        { icon: '🤝', title: 'Честность', description: 'Прозрачные условия сотрудничества без скрытых платежей', order: 2, active: true },
        { icon: '💡', title: 'Инновации', description: 'Внедряем передовые строительные технологии', order: 3, active: true }
    ];
};

// Дефолтные данные для членов команды
const getDefaultTeamMembers = () => {
    return [
        { name: 'Азат Нуржанов', position: 'Генеральный директор', experience: '15 лет', image: 'https://randomuser.me/api/portraits/men/10.jpg', imageType: 'url', order: 0, active: true },
        { name: 'Марат Сулейменов', position: 'Главный архитектор', experience: '12 лет', image: 'https://randomuser.me/api/portraits/men/11.jpg', imageType: 'url', order: 1, active: true },
        { name: 'Айгуль Садыкова', position: 'Руководитель отдела продаж', experience: '10 лет', image: 'https://randomuser.me/api/portraits/women/12.jpg', imageType: 'url', order: 2, active: true },
        { name: 'Ержан Омаров', position: 'Прораб', experience: '20 лет', image: 'https://randomuser.me/api/portraits/men/13.jpg', imageType: 'url', order: 3, active: true }
    ];
};

// Удаление файла изображения
const deleteImageFile = (imagePath) => {
    if (imagePath && imagePath.startsWith('/uploads/about/')) {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`🗑️ Файл удален: ${fullPath}`);
        }
    }
};

// ============ Настройки секции ============

// Получить настройки
export const getAboutSettings = async (req, res) => {
    try {
        let settings = await AboutSettings.findOne();

        if (!settings) {
            settings = await AboutSettings.create({
                hero: {
                    title: 'О нашей компании',
                    subtitle: '12 лет строим дома вашей мечты в Алматы',
                    bgImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                    bgImageType: 'url',
                    overlayOpacity: 0.15
                },
                mission: {
                    subtitle: 'Наша миссия',
                    title: 'Создаем пространство для счастливой жизни',
                    description: 'Мы стремимся создавать не просто здания, а уютные пространства, где люди будут жить, работать и создавать семьи. Каждый наш проект — это результат тщательного планирования, использования современных технологий и любви к своему делу.',
                    stats: [
                        { number: '2014', label: 'Год основания' },
                        { number: '150+', label: 'Построенных объектов' },
                        { number: '50+', label: 'Сотрудников' }
                    ],
                    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                    imageType: 'url',
                    badgeText: 'Лидер рынка 2023',
                    badgeIcon: '🏆'
                },
                values: {
                    subtitle: 'Наши ценности',
                    title: 'Принципы нашей работы'
                },
                valueCards: getDefaultValueCards(),
                team: {
                    subtitle: 'Наша команда',
                    title: 'Профессионалы своего дела'
                },
                teamMembers: getDefaultTeamMembers(),
                updatedBy: 'system'
            });
        }

        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error getting about settings:', error);
        res.status(500).json({ error: error.message });
    }
};

// Обновить настройки
export const updateAboutSettings = async (req, res) => {
    try {
        const { hero, mission, values, team, valueCards, teamMembers } = req.body;

        let settings = await AboutSettings.findOne();

        if (!settings) {
            settings = new AboutSettings();
        }

        if (hero) settings.hero = hero;
        if (mission) settings.mission = mission;
        if (values) settings.values = values;
        if (team) settings.team = team;
        if (valueCards) settings.valueCards = valueCards;
        if (teamMembers) settings.teamMembers = teamMembers;
        settings.updatedBy = req.admin?.email || 'admin';

        await settings.save();

        res.json({
            success: true,
            message: 'Настройки обновлены',
            data: settings
        });
    } catch (error) {
        console.error('Error updating about settings:', error);
        res.status(500).json({ error: error.message });
    }
};

// Сбросить настройки к дефолтным
export const resetAboutSettings = async (req, res) => {
    try {
        const defaultSettings = {
            hero: {
                title: 'О нашей компании',
                subtitle: '12 лет строим дома вашей мечты в Алматы',
                bgImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                bgImageType: 'url',
                overlayOpacity: 0.15
            },
            mission: {
                subtitle: 'Наша миссия',
                title: 'Создаем пространство для счастливой жизни',
                description: 'Мы стремимся создавать не просто здания, а уютные пространства, где люди будут жить, работать и создавать семьи. Каждый наш проект — это результат тщательного планирования, использования современных технологий и любви к своему делу.',
                stats: [
                    { number: '2014', label: 'Год основания' },
                    { number: '150+', label: 'Построенных объектов' },
                    { number: '50+', label: 'Сотрудников' }
                ],
                image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                imageType: 'url',
                badgeText: 'Лидер рынка 2023',
                badgeIcon: '🏆'
            },
            values: {
                subtitle: 'Наши ценности',
                title: 'Принципы нашей работы'
            },
            valueCards: getDefaultValueCards(),
            team: {
                subtitle: 'Наша команда',
                title: 'Профессионалы своего дела'
            },
            teamMembers: getDefaultTeamMembers(),
            updatedBy: req.admin?.email || 'admin'
        };

        let settings = await AboutSettings.findOne();

        if (!settings) {
            settings = new AboutSettings(defaultSettings);
        } else {
            settings.hero = defaultSettings.hero;
            settings.mission = defaultSettings.mission;
            settings.values = defaultSettings.values;
            settings.team = defaultSettings.team;
            settings.valueCards = defaultSettings.valueCards;
            settings.teamMembers = defaultSettings.teamMembers;
            settings.updatedBy = defaultSettings.updatedBy;
        }

        await settings.save();

        res.json({
            success: true,
            message: 'Настройки сброшены к дефолтным',
            data: settings
        });
    } catch (error) {
        console.error('Error resetting about settings:', error);
        res.status(500).json({ error: error.message });
    }
};

// ============ Загрузка изображений ============

// Загрузить изображение для миссии
export const uploadMissionImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Файл не загружен' });
        }

        let settings = await AboutSettings.findOne();
        if (!settings) {
            settings = new AboutSettings();
        }

        // Удаляем старое изображение если было
        if (settings.mission.image && settings.mission.imageType === 'file') {
            deleteImageFile(settings.mission.image);
        }

        const imageUrl = `/uploads/about/${req.file.filename}`;
        settings.mission.image = imageUrl;
        settings.mission.imageType = 'file';

        await settings.save();

        res.json({
            success: true,
            message: 'Изображение загружено',
            data: settings
        });
    } catch (error) {
        console.error('Error uploading mission image:', error);
        if (req.file) {
            const uploadedPath = path.join(__dirname, '..', 'uploads/about', req.file.filename);
            if (fs.existsSync(uploadedPath)) {
                fs.unlinkSync(uploadedPath);
            }
        }
        res.status(500).json({ error: error.message });
    }
};

// Загрузить изображение для члена команды
export const uploadTeamMemberImage = async (req, res) => {
    try {
        const { memberIndex } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: 'Файл не загружен' });
        }

        let settings = await AboutSettings.findOne();
        if (!settings) {
            settings = new AboutSettings();
        }

        const index = parseInt(memberIndex);
        if (isNaN(index) || index < 0 || index >= settings.teamMembers.length) {
            const uploadedPath = path.join(__dirname, '..', 'uploads/about', req.file.filename);
            if (fs.existsSync(uploadedPath)) {
                fs.unlinkSync(uploadedPath);
            }
            return res.status(404).json({ error: 'Член команды не найден' });
        }

        // Удаляем старое изображение если было
        if (settings.teamMembers[index].image && settings.teamMembers[index].imageType === 'file') {
            deleteImageFile(settings.teamMembers[index].image);
        }

        const imageUrl = `/uploads/about/${req.file.filename}`;
        settings.teamMembers[index].image = imageUrl;
        settings.teamMembers[index].imageType = 'file';

        await settings.save();

        res.json({
            success: true,
            message: 'Изображение загружено',
            data: settings
        });
    } catch (error) {
        console.error('Error uploading team member image:', error);
        if (req.file) {
            const uploadedPath = path.join(__dirname, '..', 'uploads/about', req.file.filename);
            if (fs.existsSync(uploadedPath)) {
                fs.unlinkSync(uploadedPath);
            }
        }
        res.status(500).json({ error: error.message });
    }
};

// Загрузить фоновое изображение для hero
export const uploadHeroBgImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Файл не загружен' });
        }

        let settings = await AboutSettings.findOne();
        if (!settings) {
            settings = new AboutSettings();
        }

        // Удаляем старое изображение если было
        if (settings.hero.bgImage && settings.hero.bgImageType === 'file') {
            deleteImageFile(settings.hero.bgImage);
        }

        const imageUrl = `/uploads/about/${req.file.filename}`;
        settings.hero.bgImage = imageUrl;
        settings.hero.bgImageType = 'file';

        await settings.save();

        res.json({
            success: true,
            message: 'Фоновое изображение загружено',
            data: settings
        });
    } catch (error) {
        console.error('Error uploading hero bg image:', error);
        if (req.file) {
            const uploadedPath = path.join(__dirname, '..', 'uploads/about', req.file.filename);
            if (fs.existsSync(uploadedPath)) {
                fs.unlinkSync(uploadedPath);
            }
        }
        res.status(500).json({ error: error.message });
    }
};

// Удалить изображение члена команды
export const deleteTeamMemberImage = async (req, res) => {
    try {
        const { memberIndex } = req.params;

        let settings = await AboutSettings.findOne();
        if (!settings) {
            return res.status(404).json({ error: 'Настройки не найдены' });
        }

        const index = parseInt(memberIndex);
        if (isNaN(index) || index < 0 || index >= settings.teamMembers.length) {
            return res.status(404).json({ error: 'Член команды не найден' });
        }

        if (settings.teamMembers[index].image && settings.teamMembers[index].imageType === 'file') {
            deleteImageFile(settings.teamMembers[index].image);
        }

        settings.teamMembers[index].image = '';
        settings.teamMembers[index].imageType = 'initials';

        await settings.save();

        res.json({
            success: true,
            message: 'Изображение удалено',
            data: settings
        });
    } catch (error) {
        console.error('Error deleting team member image:', error);
        res.status(500).json({ error: error.message });
    }
};

// ============ Управление карточками ============

// Переместить карточку ценности
export const reorderValueCard = async (req, res) => {
    try {
        const { id, direction } = req.params;

        let settings = await AboutSettings.findOne();
        if (!settings) {
            return res.status(404).json({ error: 'Настройки не найдены' });
        }

        const index = parseInt(id);
        if (isNaN(index) || index < 0 || index >= settings.valueCards.length) {
            return res.status(404).json({ error: 'Карточка не найдена' });
        }

        let targetIndex;
        if (direction === 'up') {
            targetIndex = index - 1;
        } else if (direction === 'down') {
            targetIndex = index + 1;
        } else {
            return res.status(400).json({ error: 'Неверное направление' });
        }

        if (targetIndex < 0 || targetIndex >= settings.valueCards.length) {
            return res.status(400).json({ error: 'Невозможно переместить' });
        }

        const temp = settings.valueCards[index];
        settings.valueCards[index] = settings.valueCards[targetIndex];
        settings.valueCards[targetIndex] = temp;

        await settings.save();

        res.json({
            success: true,
            message: 'Порядок изменен',
            data: settings
        });
    } catch (error) {
        console.error('Error reordering value card:', error);
        res.status(500).json({ error: error.message });
    }
};

// Переместить члена команды
export const reorderTeamMember = async (req, res) => {
    try {
        const { id, direction } = req.params;

        let settings = await AboutSettings.findOne();
        if (!settings) {
            return res.status(404).json({ error: 'Настройки не найдены' });
        }

        const index = parseInt(id);
        if (isNaN(index) || index < 0 || index >= settings.teamMembers.length) {
            return res.status(404).json({ error: 'Член команды не найден' });
        }

        let targetIndex;
        if (direction === 'up') {
            targetIndex = index - 1;
        } else if (direction === 'down') {
            targetIndex = index + 1;
        } else {
            return res.status(400).json({ error: 'Неверное направление' });
        }

        if (targetIndex < 0 || targetIndex >= settings.teamMembers.length) {
            return res.status(400).json({ error: 'Невозможно переместить' });
        }

        const temp = settings.teamMembers[index];
        settings.teamMembers[index] = settings.teamMembers[targetIndex];
        settings.teamMembers[targetIndex] = temp;

        await settings.save();

        res.json({
            success: true,
            message: 'Порядок изменен',
            data: settings
        });
    } catch (error) {
        console.error('Error reordering team member:', error);
        res.status(500).json({ error: error.message });
    }
};