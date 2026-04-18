// controllers/serviceController.js
import Service from '../models/Service.js';

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
    await Service.insertMany(defaultServices);
    return await Service.find().sort({ order: 1 });
};

// Получить все услуги (публичный)
export const getAllServices = async (req, res) => {
    try {
        let services = await Service.find({ active: true }).sort({ order: 1 });

        // Если нет ни одной услуги, создаем дефолтные
        if (services.length === 0) {
            services = await saveDefaultServices();
            // Фильтруем только активные
            services = services.filter(s => s.active);
        }

        res.json({
            success: true,
            data: services
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

        // Если нет ни одной услуги, создаем дефолтные
        if (services.length === 0) {
            services = await saveDefaultServices();
        }

        res.json({
            success: true,
            data: services
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
        // Удаляем существующие
        await Service.deleteMany({});

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