// controllers/serviceController.js
import Service from '../models/Service.js';
import ServiceSettings from '../models/ServiceSettings.js';
import mongoose from 'mongoose';

// Дефолтные данные
const getDefaultServicesData = () => {
    return [
        {
            icon: '🏠',
            iconType: 'emoji',
            reactIconName: '',
            title: 'Строительство домов',
            titleKz: 'Үй құрылысы',
            description: 'Строительство частных домов под ключ. Индивидуальные проекты, современные материалы, гарантия 10 лет.',
            features: ['Под ключ', 'Энергоэффективные', 'Современный дизайн'],
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            gradientColors: { color1: '#667eea', color2: '#764ba2', angle: 135 },
            order: 0,
            active: true
        },
        {
            icon: '🏢',
            iconType: 'emoji',
            reactIconName: '',
            title: 'Продажа квартир',
            titleKz: 'Пәтер сату',
            description: 'Элитные квартиры в новостройках Алматы. Панорамные виды, развитая инфраструктура, отделка премиум-класса.',
            features: ['От застройщика', 'Выгодные цены', 'Рассрочка'],
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            gradientColors: { color1: '#f093fb', color2: '#f5576c', angle: 135 },
            order: 1,
            active: true
        },
        {
            icon: '🏭',
            iconType: 'emoji',
            reactIconName: '',
            title: 'Коммерческая недвижимость',
            titleKz: 'Коммерциялық жылжымайтын мүлік',
            description: 'Офисы, торговые помещения, складские комплексы. Лучшие локации для вашего бизнеса.',
            features: ['Высокая проходимость', 'Парковка', 'Гибкие условия'],
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            gradientColors: { color1: '#4facfe', color2: '#00f2fe', angle: 135 },
            order: 2,
            active: true
        },
        {
            icon: '🔧',
            iconType: 'emoji',
            reactIconName: '',
            title: 'Ремонт и отделка',
            titleKz: 'Жөндеу және әрлеу',
            description: 'Евроремонт, дизайн-проекты, отделка под ключ. Работаем с любыми помещениями.',
            features: ['Дизайн проект', 'Евростандарт', 'Быстрые сроки'],
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            gradientColors: { color1: '#fa709a', color2: '#fee140', angle: 135 },
            order: 3,
            active: true
        }
    ];
};

// Сохранение дефолтных данных в БД
const saveDefaultServices = async () => {
    const defaultServices = getDefaultServicesData();
    await Service.deleteMany({});
    await Service.insertMany(defaultServices);
    return await Service.find().sort({ order: 1 });
};

// ============ Настройки секции ============

// Получить настройки секции
export const getServiceSettings = async (req, res) => {
    try {
        let settings = await ServiceSettings.findOne();

        if (!settings) {
            settings = await ServiceSettings.create({
                subtitle: 'Наши услуги',
                title: 'Что мы предлагаем',
                description: 'Полный спектр услуг в строительстве и недвижимости. От идеи до готового объекта',
                updatedBy: req.admin?.email || 'system'
            });
        }

        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error getting service settings:', error);
        res.status(500).json({ error: error.message });
    }
};

// Обновить настройки секции
export const updateServiceSettings = async (req, res) => {
    try {
        console.log('📝 Updating service settings:', req.body);

        const { subtitle, title, description } = req.body;

        let settings = await ServiceSettings.findOne();

        if (!settings) {
            settings = new ServiceSettings();
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
        console.error('Error updating service settings:', error);
        res.status(500).json({ error: error.message });
    }
};

// Сбросить настройки секции к дефолтным
export const resetServiceSettings = async (req, res) => {
    try {
        const defaultSettings = {
            subtitle: 'Наши услуги',
            title: 'Что мы предлагаем',
            description: 'Полный спектр услуг в строительстве и недвижимости. От идеи до готового объекта',
            updatedBy: req.admin?.email || 'admin'
        };

        let settings = await ServiceSettings.findOne();

        if (!settings) {
            settings = new ServiceSettings(defaultSettings);
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
        console.error('Error resetting service settings:', error);
        res.status(500).json({ error: error.message });
    }
};

// ============ Услуги ============

// Получить все услуги (публичный)
export const getAllServices = async (req, res) => {
    try {
        let services = await Service.find({ active: true }).sort({ order: 1 });

        if (services.length === 0) {
            services = await saveDefaultServices();
            services = services.filter(s => s.active);
        }

        let settings = await ServiceSettings.findOne();
        if (!settings) {
            settings = await ServiceSettings.create({
                subtitle: 'Наши услуги',
                title: 'Что мы предлагаем',
                description: 'Полный спектр услуг в строительстве и недвижимости. От идеи до готового объекта',
                updatedBy: 'system'
            });
        }

        res.json({
            success: true,
            data: {
                settings,
                services
            }
        });
    } catch (error) {
        console.error('Error getting services:', error);
        res.status(500).json({ error: error.message });
    }
};

// Получить все услуги для админа (включая неактивные)
export const getAdminServices = async (req, res) => {
    try {
        let services = await Service.find().sort({ order: 1 });

        if (services.length === 0) {
            services = await saveDefaultServices();
        }

        let settings = await ServiceSettings.findOne();
        if (!settings) {
            settings = await ServiceSettings.create({
                subtitle: 'Наши услуги',
                title: 'Что мы предлагаем',
                description: 'Полный спектр услуг в строительстве и недвижимости. От идеи до готового объекта',
                updatedBy: 'system'
            });
        }

        res.json({
            success: true,
            data: {
                settings,
                services
            }
        });
    } catch (error) {
        console.error('Error getting admin services:', error);
        res.status(500).json({ error: error.message });
    }
};

// Создать услугу
export const createService = async (req, res) => {
    try {
        const serviceData = req.body;

        if (serviceData.gradientColors) {
            const { color1, color2, angle } = serviceData.gradientColors;
            serviceData.gradient = `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
        }

        const service = new Service(serviceData);
        await service.save();

        res.status(201).json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: error.message });
    }
};

// Обновить услугу
export const updateService = async (req, res) => {
    try {
        const { id } = req.params;

        // Проверяем, является ли id валидным ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Неверный идентификатор услуги' });
        }

        const updateData = req.body;

        if (updateData.gradientColors) {
            const { color1, color2, angle } = updateData.gradientColors;
            updateData.gradient = `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
        }

        const service = await Service.findByIdAndUpdate(id, updateData, { new: true });

        if (!service) {
            return res.status(404).json({ error: 'Услуга не найдена' });
        }

        res.json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ error: error.message });
    }
};

// Удалить услугу
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        // Проверяем, является ли id валидным ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Неверный идентификатор услуги' });
        }

        const service = await Service.findByIdAndDelete(id);

        if (!service) {
            return res.status(404).json({ error: 'Услуга не найдена' });
        }

        res.json({
            success: true,
            message: 'Услуга удалена'
        });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ error: error.message });
    }
};

// Создать дефолтные услуги (принудительно)
export const createDefaultServices = async (req, res) => {
    try {
        const services = await saveDefaultServices();

        res.json({
            success: true,
            message: 'Дефолтные услуги созданы',
            data: services
        });
    } catch (error) {
        console.error('Error creating default services:', error);
        res.status(500).json({ error: error.message });
    }
};