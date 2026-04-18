// controllers/advantageController.js
import Advantage from '../models/Advantage.js';
import AdvantageSettings from '../models/AdvantageSettings.js';
import mongoose from 'mongoose';

// Дефолтные данные
const getDefaultAdvantagesData = () => {
    return [
        {
            icon: '⚡',
            iconType: 'emoji',
            reactIconName: '',
            title: 'Соблюдение сроков',
            description: 'Точное соблюдение сроков строительства',
            color: '#1a472a',
            order: 0,
            active: true
        },
        {
            icon: '💎',
            iconType: 'emoji',
            reactIconName: '',
            title: 'Европейские стандарты',
            description: 'Используем только сертифицированные материалы',
            color: '#c9a03d',
            order: 1,
            active: true
        },
        {
            icon: '👥',
            iconType: 'emoji',
            reactIconName: '',
            title: 'Индивидуальный подход',
            description: 'Учитываем все пожелания клиента',
            color: '#1a472a',
            order: 2,
            active: true
        },
        {
            icon: '📋',
            iconType: 'emoji',
            reactIconName: '',
            title: 'Юридическая поддержка',
            description: 'Полное сопровождение сделок',
            color: '#c9a03d',
            order: 3,
            active: true
        }
    ];
};

// Сохранение дефолтных данных в БД
const saveDefaultAdvantages = async () => {
    const defaultAdvantages = getDefaultAdvantagesData();
    await Advantage.deleteMany({});
    await Advantage.insertMany(defaultAdvantages);
    return await Advantage.find().sort({ order: 1 });
};

// ============ Настройки секции ============

// Получить настройки секции
export const getAdvantageSettings = async (req, res) => {
    try {
        let settings = await AdvantageSettings.findOne();

        if (!settings) {
            settings = await AdvantageSettings.create({
                subtitle: 'Почему выбирают нас',
                title: 'Наши преимущества',
                description: 'Более 150 семей доверили нам строительство своего дома',
                updatedBy: req.admin?.email || 'system'
            });
        }

        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error getting advantage settings:', error);
        res.status(500).json({ error: error.message });
    }
};

// Обновить настройки секции
export const updateAdvantageSettings = async (req, res) => {
    try {
        console.log('📝 Updating advantage settings:', req.body);

        const { subtitle, title, description } = req.body;

        let settings = await AdvantageSettings.findOne();

        if (!settings) {
            settings = new AdvantageSettings();
        }

        if (subtitle !== undefined) settings.subtitle = subtitle;
        if (title !== undefined) settings.title = title;
        if (description !== undefined) settings.description = description;
        settings.updatedBy = req.admin?.email || 'admin';

        await settings.save();

        console.log('✅ Settings saved:', settings);

        res.json({
            success: true,
            message: 'Настройки обновлены',
            data: settings
        });
    } catch (error) {
        console.error('Error updating advantage settings:', error);
        res.status(500).json({ error: error.message });
    }
};

// Сбросить настройки секции к дефолтным
export const resetAdvantageSettings = async (req, res) => {
    try {
        const defaultSettings = {
            subtitle: 'Почему выбирают нас',
            title: 'Наши преимущества',
            description: 'Более 150 семей доверили нам строительство своего дома',
            updatedBy: req.admin?.email || 'admin'
        };

        let settings = await AdvantageSettings.findOne();

        if (!settings) {
            settings = new AdvantageSettings(defaultSettings);
        } else {
            settings.subtitle = defaultSettings.subtitle;
            settings.title = defaultSettings.title;
            settings.description = defaultSettings.description;
            settings.updatedBy = defaultSettings.updatedBy;
        }

        await settings.save();

        res.json({
            success: true,
            message: 'Настройки сброшены к дефолтным',
            data: settings
        });
    } catch (error) {
        console.error('Error resetting advantage settings:', error);
        res.status(500).json({ error: error.message });
    }
};

// ============ Преимущества ============

// Получить все преимущества (публичный)
export const getAllAdvantages = async (req, res) => {
    try {
        let advantages = await Advantage.find({ active: true }).sort({ order: 1 });

        if (advantages.length === 0) {
            advantages = await saveDefaultAdvantages();
            advantages = advantages.filter(a => a.active);
        }

        let settings = await AdvantageSettings.findOne();
        if (!settings) {
            settings = await AdvantageSettings.create({
                subtitle: 'Почему выбирают нас',
                title: 'Наши преимущества',
                description: 'Более 150 семей доверили нам строительство своего дома',
                updatedBy: 'system'
            });
        }

        res.json({
            success: true,
            data: {
                settings,
                advantages
            }
        });
    } catch (error) {
        console.error('Error getting advantages:', error);
        res.status(500).json({ error: error.message });
    }
};

// Получить все преимущества для админа (включая неактивные)
export const getAdminAdvantages = async (req, res) => {
    try {
        let advantages = await Advantage.find().sort({ order: 1 });

        if (advantages.length === 0) {
            advantages = await saveDefaultAdvantages();
        }

        let settings = await AdvantageSettings.findOne();
        if (!settings) {
            settings = await AdvantageSettings.create({
                subtitle: 'Почему выбирают нас',
                title: 'Наши преимущества',
                description: 'Более 150 семей доверили нам строительство своего дома',
                updatedBy: 'system'
            });
        }

        res.json({
            success: true,
            data: {
                settings,
                advantages
            }
        });
    } catch (error) {
        console.error('Error getting admin advantages:', error);
        res.status(500).json({ error: error.message });
    }
};

// Создать преимущество
export const createAdvantage = async (req, res) => {
    try {
        const advantageData = req.body;
        const advantage = new Advantage(advantageData);
        await advantage.save();

        res.status(201).json({
            success: true,
            data: advantage
        });
    } catch (error) {
        console.error('Error creating advantage:', error);
        res.status(500).json({ error: error.message });
    }
};

// Обновить преимущество
export const updateAdvantage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Неверный идентификатор преимущества' });
        }

        const updateData = req.body;
        const advantage = await Advantage.findByIdAndUpdate(id, updateData, { new: true });

        if (!advantage) {
            return res.status(404).json({ error: 'Преимущество не найдено' });
        }

        res.json({
            success: true,
            data: advantage
        });
    } catch (error) {
        console.error('Error updating advantage:', error);
        res.status(500).json({ error: error.message });
    }
};

// Удалить преимущество
export const deleteAdvantage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Неверный идентификатор преимущества' });
        }

        const advantage = await Advantage.findByIdAndDelete(id);

        if (!advantage) {
            return res.status(404).json({ error: 'Преимущество не найдено' });
        }

        res.json({
            success: true,
            message: 'Преимущество удалено'
        });
    } catch (error) {
        console.error('Error deleting advantage:', error);
        res.status(500).json({ error: error.message });
    }
};

// Создать дефолтные преимущества (принудительно)
export const createDefaultAdvantages = async (req, res) => {
    try {
        const advantages = await saveDefaultAdvantages();

        res.json({
            success: true,
            message: 'Дефолтные преимущества созданы',
            data: advantages
        });
    } catch (error) {
        console.error('Error creating default advantages:', error);
        res.status(500).json({ error: error.message });
    }
};