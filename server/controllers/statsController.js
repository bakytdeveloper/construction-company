// controllers/statsController.js
import Stats from '../models/Stats.js';
import StatsSettings from '../models/StatsSettings.js';
import mongoose from 'mongoose';

// Дефолтные данные
const getDefaultStatsData = () => {
    return [
        {
            icon: '🏗️',
            iconType: 'emoji',
            reactIconName: '',
            label: 'Построенных объектов',
            value: 156,
            order: 0,
            active: true
        },
        {
            icon: '👨‍👩‍👧‍👦',
            iconType: 'emoji',
            reactIconName: '',
            label: 'Довольных клиентов',
            value: 142,
            order: 1,
            active: true
        },
        {
            icon: '📅',
            iconType: 'emoji',
            reactIconName: '',
            label: 'Лет на рынке',
            value: 12,
            order: 2,
            active: true
        },
        {
            icon: '🏆',
            iconType: 'emoji',
            reactIconName: '',
            label: 'Наград и премий',
            value: 18,
            order: 3,
            active: true
        }
    ];
};

// Сохранение дефолтных данных в БД
const saveDefaultStats = async () => {
    const defaultStats = getDefaultStatsData();
    await Stats.deleteMany({});
    await Stats.insertMany(defaultStats);
    return await Stats.find().sort({ order: 1 });
};

// ============ Настройки секции ============

export const getStatsSettings = async (req, res) => {
    try {
        let settings = await StatsSettings.findOne();

        if (!settings) {
            settings = await StatsSettings.create({
                bgImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                overlayOpacity: 0.15,
                bgType: 'url',
                gradientColors: { color1: '#1a472a', color2: '#0e2a1a', angle: 135 },
                updatedBy: 'system'
            });
        }

        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error getting stats settings:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateStatsSettings = async (req, res) => {
    try {
        const { bgImage, overlayOpacity, bgType, gradientColors } = req.body;

        let settings = await StatsSettings.findOne();

        if (!settings) {
            settings = new StatsSettings();
        }

        if (bgImage !== undefined) settings.bgImage = bgImage;
        if (overlayOpacity !== undefined) settings.overlayOpacity = overlayOpacity;
        if (bgType !== undefined) settings.bgType = bgType;
        if (gradientColors !== undefined) settings.gradientColors = gradientColors;
        settings.updatedBy = req.admin?.email || 'admin';

        await settings.save();

        res.json({
            success: true,
            message: 'Настройки обновлены',
            data: settings
        });
    } catch (error) {
        console.error('Error updating stats settings:', error);
        res.status(500).json({ error: error.message });
    }
};

export const resetStatsSettings = async (req, res) => {
    try {
        const defaultSettings = {
            bgImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            overlayOpacity: 0.15,
            bgType: 'url',
            gradientColors: { color1: '#1a472a', color2: '#0e2a1a', angle: 135 },
            updatedBy: req.admin?.email || 'admin'
        };

        let settings = await StatsSettings.findOne();

        if (!settings) {
            settings = new StatsSettings(defaultSettings);
        } else {
            settings.bgImage = defaultSettings.bgImage;
            settings.overlayOpacity = defaultSettings.overlayOpacity;
            settings.bgType = defaultSettings.bgType;
            settings.gradientColors = defaultSettings.gradientColors;
            settings.updatedBy = defaultSettings.updatedBy;
        }

        await settings.save();

        res.json({
            success: true,
            message: 'Настройки сброшены к дефолтным',
            data: settings
        });
    } catch (error) {
        console.error('Error resetting stats settings:', error);
        res.status(500).json({ error: error.message });
    }
};

// ============ Статистика ============

export const getAllStats = async (req, res) => {
    try {
        let stats = await Stats.find({ active: true }).sort({ order: 1 });

        if (stats.length === 0) {
            stats = await saveDefaultStats();
            stats = stats.filter(s => s.active);
        }

        let settings = await StatsSettings.findOne();
        if (!settings) {
            settings = await StatsSettings.create({
                bgImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                overlayOpacity: 0.15,
                bgType: 'url',
                gradientColors: { color1: '#1a472a', color2: '#0e2a1a', angle: 135 },
                updatedBy: 'system'
            });
        }

        res.json({
            success: true,
            data: {
                settings,
                stats
            }
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getAdminStats = async (req, res) => {
    try {
        let stats = await Stats.find().sort({ order: 1 });

        if (stats.length === 0) {
            stats = await saveDefaultStats();
        }

        let settings = await StatsSettings.findOne();
        if (!settings) {
            settings = await StatsSettings.create({
                bgImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                overlayOpacity: 0.15,
                bgType: 'url',
                gradientColors: { color1: '#1a472a', color2: '#0e2a1a', angle: 135 },
                updatedBy: 'system'
            });
        }

        res.json({
            success: true,
            data: {
                settings,
                stats
            }
        });
    } catch (error) {
        console.error('Error getting admin stats:', error);
        res.status(500).json({ error: error.message });
    }
};

export const createStat = async (req, res) => {
    try {
        const statData = req.body;
        const stat = new Stats(statData);
        await stat.save();

        res.status(201).json({
            success: true,
            data: stat
        });
    } catch (error) {
        console.error('Error creating stat:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateStat = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Неверный идентификатор' });
        }

        const updateData = req.body;
        const stat = await Stats.findByIdAndUpdate(id, updateData, { new: true });

        if (!stat) {
            return res.status(404).json({ error: 'Статистика не найдена' });
        }

        res.json({
            success: true,
            data: stat
        });
    } catch (error) {
        console.error('Error updating stat:', error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteStat = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Неверный идентификатор' });
        }

        const stat = await Stats.findByIdAndDelete(id);

        if (!stat) {
            return res.status(404).json({ error: 'Статистика не найдена' });
        }

        res.json({
            success: true,
            message: 'Статистика удалена'
        });
    } catch (error) {
        console.error('Error deleting stat:', error);
        res.status(500).json({ error: error.message });
    }
};

export const createDefaultStats = async (req, res) => {
    try {
        const stats = await saveDefaultStats();

        res.json({
            success: true,
            message: 'Дефолтная статистика создана',
            data: stats
        });
    } catch (error) {
        console.error('Error creating default stats:', error);
        res.status(500).json({ error: error.message });
    }
};

export const reorderStat = async (req, res) => {
    try {
        const { id, direction } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Неверный идентификатор' });
        }

        const currentStat = await Stats.findById(id);
        if (!currentStat) {
            return res.status(404).json({ error: 'Статистика не найдена' });
        }

        const currentOrder = currentStat.order;
        let targetOrder;

        if (direction === 'up') {
            targetOrder = currentOrder - 1;
        } else if (direction === 'down') {
            targetOrder = currentOrder + 1;
        } else {
            return res.status(400).json({ error: 'Неверное направление' });
        }

        const targetStat = await Stats.findOne({ order: targetOrder });
        if (!targetStat) {
            return res.status(404).json({ error: 'Элемент для обмена не найден' });
        }

        currentStat.order = targetOrder;
        targetStat.order = currentOrder;

        await currentStat.save();
        await targetStat.save();

        const stats = await Stats.find().sort({ order: 1 });

        res.json({
            success: true,
            message: 'Порядок изменен',
            data: stats
        });
    } catch (error) {
        console.error('Error reordering stat:', error);
        res.status(500).json({ error: error.message });
    }
};