// controllers/faqController.js
import FAQ from '../models/FAQ.js';
import FAQSettings from '../models/FAQSettings.js';
import mongoose from 'mongoose';

// Дефолтные данные
const getDefaultFaqsData = () => {
    return [
        {
            question: 'Сколько стоит построить дом под ключ в Алматы?',
            answer: 'Стоимость строительства дома зависит от многих факторов: площади, материалов, сложности проекта и отделки. В среднем, цена за 1 м² составляет от 150 000 до 300 000 тенге. Мы предлагаем индивидуальный расчет после консультации с нашим специалистом.',
            order: 0,
            active: true
        },
        {
            question: 'Какие документы нужны для получения квартиры в новостройке?',
            answer: 'Для приобретения квартиры в нашем ЖК вам потребуются: удостоверение личности, ИНН, справка о доходах (при ипотеке). Мы предоставляем полное юридическое сопровождение сделки и помогаем собрать все необходимые документы.',
            order: 1,
            active: true
        },
        {
            question: 'Предоставляете ли вы гарантию на строительство?',
            answer: 'Да, мы предоставляем гарантию 10 лет на все конструктивные элементы здания и 5 лет на отделочные работы. Также у нас есть постгарантийное обслуживание в течение 2 лет после сдачи объекта.',
            order: 2,
            active: true
        },
        {
            question: 'Можно ли купить квартиру в рассрочку?',
            answer: 'Да, мы предлагаем гибкие условия рассрочки до 24 месяцев без переплаты. Также сотрудничаем со всеми крупными банками Казахстана для оформления ипотеки под низкие проценты.',
            order: 3,
            active: true
        },
        {
            question: 'Сколько времени занимает строительство дома?',
            answer: 'Сроки строительства зависят от площади и сложности проекта. В среднем, строительство дома площадью 150-200 м² занимает 8-12 месяцев. Мы строго соблюдаем договорные сроки.',
            order: 4,
            active: true
        },
        {
            question: 'Работаете ли вы с дизайн-проектами?',
            answer: 'Да, у нас есть собственное архитектурное бюро. Мы разрабатываем индивидуальные дизайн-проекты с учетом всех пожеланий клиента, включая 3D-визуализацию будущего дома или квартиры.',
            order: 5,
            active: true
        },
        {
            question: 'Есть ли у вас лицензия на строительство?',
            answer: 'Да, мы имеем все необходимые лицензии и сертификаты для осуществления строительной деятельности в РК. Наша компания является членом Ассоциации строителей Казахстана.',
            order: 6,
            active: true
        },
        {
            question: 'Могу ли я посмотреть уже построенные объекты?',
            answer: 'Конечно! Мы организуем экскурсию на наши готовые объекты, чтобы вы могли лично оценить качество нашей работы. Для этого достаточно оставить заявку на сайте или позвонить нам.',
            order: 7,
            active: true
        }
    ];
};

// Сохранение дефолтных данных в БД
const saveDefaultFaqs = async () => {
    const defaultFaqs = getDefaultFaqsData();
    await FAQ.deleteMany({});
    await FAQ.insertMany(defaultFaqs);
    return await FAQ.find().sort({ order: 1 });
};

// ============ Настройки секции ============

export const getFaqSettings = async (req, res) => {
    try {
        let settings = await FAQSettings.findOne();

        if (!settings) {
            settings = await FAQSettings.create({
                subtitle: 'Часто задаваемые вопросы',
                title: 'Ответы на популярные вопросы',
                description: 'Мы собрали самые частые вопросы наших клиентов',
                ctaTitle: 'Не нашли ответ?',
                ctaDescription: 'Задайте свой вопрос нашему специалисту и получите консультацию',
                ctaButtonText: 'Задать вопрос',
                ctaPhone: '+7 (777) 123-45-67',
                updatedBy: 'system'
            });
        }

        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error getting FAQ settings:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateFaqSettings = async (req, res) => {
    try {
        const { subtitle, title, description, ctaTitle, ctaDescription, ctaButtonText, ctaPhone } = req.body;

        let settings = await FAQSettings.findOne();

        if (!settings) {
            settings = new FAQSettings();
        }

        if (subtitle !== undefined) settings.subtitle = subtitle;
        if (title !== undefined) settings.title = title;
        if (description !== undefined) settings.description = description;
        if (ctaTitle !== undefined) settings.ctaTitle = ctaTitle;
        if (ctaDescription !== undefined) settings.ctaDescription = ctaDescription;
        if (ctaButtonText !== undefined) settings.ctaButtonText = ctaButtonText;
        if (ctaPhone !== undefined) settings.ctaPhone = ctaPhone;
        settings.updatedBy = req.admin?.email || 'admin';

        await settings.save();

        res.json({
            success: true,
            message: 'Настройки обновлены',
            data: settings
        });
    } catch (error) {
        console.error('Error updating FAQ settings:', error);
        res.status(500).json({ error: error.message });
    }
};

export const resetFaqSettings = async (req, res) => {
    try {
        const defaultSettings = {
            subtitle: 'Часто задаваемые вопросы',
            title: 'Ответы на популярные вопросы',
            description: 'Мы собрали самые частые вопросы наших клиентов',
            ctaTitle: 'Не нашли ответ?',
            ctaDescription: 'Задайте свой вопрос нашему специалисту и получите консультацию',
            ctaButtonText: 'Задать вопрос',
            ctaPhone: '+7 (777) 123-45-67',
            updatedBy: req.admin?.email || 'admin'
        };

        let settings = await FAQSettings.findOne();

        if (!settings) {
            settings = new FAQSettings(defaultSettings);
        } else {
            settings.subtitle = defaultSettings.subtitle;
            settings.title = defaultSettings.title;
            settings.description = defaultSettings.description;
            settings.ctaTitle = defaultSettings.ctaTitle;
            settings.ctaDescription = defaultSettings.ctaDescription;
            settings.ctaButtonText = defaultSettings.ctaButtonText;
            settings.ctaPhone = defaultSettings.ctaPhone;
            settings.updatedBy = defaultSettings.updatedBy;
        }

        await settings.save();

        res.json({
            success: true,
            message: 'Настройки сброшены к дефолтным',
            data: settings
        });
    } catch (error) {
        console.error('Error resetting FAQ settings:', error);
        res.status(500).json({ error: error.message });
    }
};

// ============ Вопросы ============

export const getAllFaqs = async (req, res) => {
    try {
        let faqs = await FAQ.find({ active: true }).sort({ order: 1 });

        if (faqs.length === 0) {
            faqs = await saveDefaultFaqs();
            faqs = faqs.filter(f => f.active);
        }

        let settings = await FAQSettings.findOne();
        if (!settings) {
            settings = await FAQSettings.create({
                subtitle: 'Часто задаваемые вопросы',
                title: 'Ответы на популярные вопросы',
                description: 'Мы собрали самые частые вопросы наших клиентов',
                ctaTitle: 'Не нашли ответ?',
                ctaDescription: 'Задайте свой вопрос нашему специалисту и получите консультацию',
                ctaButtonText: 'Задать вопрос',
                ctaPhone: '+7 (777) 123-45-67',
                updatedBy: 'system'
            });
        }

        res.json({
            success: true,
            data: {
                settings,
                faqs
            }
        });
    } catch (error) {
        console.error('Error getting FAQs:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getAdminFaqs = async (req, res) => {
    try {
        let faqs = await FAQ.find().sort({ order: 1 });

        if (faqs.length === 0) {
            faqs = await saveDefaultFaqs();
        }

        let settings = await FAQSettings.findOne();
        if (!settings) {
            settings = await FAQSettings.create({
                subtitle: 'Часто задаваемые вопросы',
                title: 'Ответы на популярные вопросы',
                description: 'Мы собрали самые частые вопросы наших клиентов',
                ctaTitle: 'Не нашли ответ?',
                ctaDescription: 'Задайте свой вопрос нашему специалисту и получите консультацию',
                ctaButtonText: 'Задать вопрос',
                ctaPhone: '+7 (777) 123-45-67',
                updatedBy: 'system'
            });
        }

        res.json({
            success: true,
            data: {
                settings,
                faqs
            }
        });
    } catch (error) {
        console.error('Error getting admin FAQs:', error);
        res.status(500).json({ error: error.message });
    }
};

export const createFaq = async (req, res) => {
    try {
        const faqData = req.body;
        const faq = new FAQ(faqData);
        await faq.save();

        res.status(201).json({
            success: true,
            data: faq
        });
    } catch (error) {
        console.error('Error creating FAQ:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateFaq = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Неверный идентификатор вопроса' });
        }

        const updateData = req.body;
        const faq = await FAQ.findByIdAndUpdate(id, updateData, { new: true });

        if (!faq) {
            return res.status(404).json({ error: 'Вопрос не найден' });
        }

        res.json({
            success: true,
            data: faq
        });
    } catch (error) {
        console.error('Error updating FAQ:', error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteFaq = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Неверный идентификатор вопроса' });
        }

        const faq = await FAQ.findByIdAndDelete(id);

        if (!faq) {
            return res.status(404).json({ error: 'Вопрос не найден' });
        }

        res.json({
            success: true,
            message: 'Вопрос удален'
        });
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        res.status(500).json({ error: error.message });
    }
};

export const createDefaultFaqs = async (req, res) => {
    try {
        const faqs = await saveDefaultFaqs();

        res.json({
            success: true,
            message: 'Дефолтные вопросы созданы',
            data: faqs
        });
    } catch (error) {
        console.error('Error creating default FAQs:', error);
        res.status(500).json({ error: error.message });
    }
};

// Переместить вопрос вверх/вниз
export const reorderFaq = async (req, res) => {
    try {
        const { id, direction } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Неверный идентификатор вопроса' });
        }

        const currentFaq = await FAQ.findById(id);
        if (!currentFaq) {
            return res.status(404).json({ error: 'Вопрос не найден' });
        }

        const currentOrder = currentFaq.order;
        let targetOrder;

        if (direction === 'up') {
            targetOrder = currentOrder - 1;
        } else if (direction === 'down') {
            targetOrder = currentOrder + 1;
        } else {
            return res.status(400).json({ error: 'Неверное направление' });
        }

        const targetFaq = await FAQ.findOne({ order: targetOrder });
        if (!targetFaq) {
            return res.status(404).json({ error: 'Вопрос для обмена не найден' });
        }

        // Меняем порядок местами
        currentFaq.order = targetOrder;
        targetFaq.order = currentOrder;

        await currentFaq.save();
        await targetFaq.save();

        const faqs = await FAQ.find().sort({ order: 1 });

        res.json({
            success: true,
            message: 'Порядок изменен',
            data: faqs
        });
    } catch (error) {
        console.error('Error reordering FAQ:', error);
        res.status(500).json({ error: error.message });
    }
};