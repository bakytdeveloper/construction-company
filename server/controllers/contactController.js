// controllers/contactController.js
import ContactSettings from '../models/ContactSettings.js';
import ContactMessage from '../models/ContactMessage.js';
import { sendContactNotification } from '../utils/emailService.js';

// ============ Отправка формы ============

// Отправить сообщение из формы связи
export const submitContactForm = async (req, res) => {
    try {
        const { name, phone, email, message, projectType } = req.body;

        // Валидация
        if (!name || !phone || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'Пожалуйста, заполните все обязательные поля'
            });
        }

        // Валидация email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Пожалуйста, введите корректный email адрес'
            });
        }

        // Добавьте вспомогательную функцию:
        const getProjectTypeLabel = (type) => {
            const types = {
                'house': '🏠 Строительство дома',
                'apartment': '🏢 Покупка квартиры',
                'commercial': '🏭 Коммерческая недвижимость',
                'other': '📝 Другое'
            };
            return types[type] || type;
        };

        // В submitContactForm функции, при создании contactMessage добавьте:
        const contactMessage = new ContactMessage({
            name,
            phone,
            email,
            message,
            projectType: projectType || 'other',
            projectTypeLabel: getProjectTypeLabel(projectType || 'other'),
            isRead: false
        });



        await contactMessage.save();
        console.log(`✅ Заявка сохранена в БД с ID: ${contactMessage._id}`);

        // Отправка email уведомлений (если настроено)
        try {
            await sendContactNotification({
                name,
                phone,
                email,
                message,
                projectType: projectType || 'other'
            });
        } catch (emailError) {
            console.error('Email error but contact saved:', emailError);
            // Не возвращаем ошибку, так как заявка уже сохранена
        }

        res.status(201).json({
            success: true,
            message: '✅ Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.',
            data: {
                id: contactMessage._id,
                name: contactMessage.name,
                createdAt: contactMessage.createdAt
            }
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            error: 'Ошибка при отправке сообщения. Пожалуйста, попробуйте позже.'
        });
    }
};

// ============ Настройки секции ============

// Получить настройки
export const getContactSettings = async (req, res) => {
    try {
        let settings = await ContactSettings.findOne();

        if (!settings) {
            settings = await ContactSettings.create({
                leftPanel: {
                    badge: 'Свяжитесь с нами',
                    title: 'Получите бесплатную консультацию',
                    description: 'Оставьте заявку и наш специалист свяжется с вами в ближайшее время',
                    address: 'г. Алматы, ул. Абая 123, БЦ "Алмалы"',
                    phone1: '+7 (777) 123-45-67',
                    phone2: '+7 (727) 234-56-78',
                    email: 'info@almaty-build.kz',
                    workHours: 'Пн-Пт: 09:00 - 19:00',
                    workHoursSat: 'Сб: 10:00 - 16:00'
                },
                rightPanel: {
                    title: 'Оставить заявку',
                    description: 'Заполните форму и мы свяжемся с вами',
                    buttonText: 'Отправить заявку',
                    note: 'Нажимая на кнопку, вы соглашаетесь с политикой обработки персональных данных'
                },
                background: {
                    gradientStart: '#0a1a0f',
                    gradientEnd: '#1a3a2a',
                    overlayOpacity: 0.15
                },
                updatedBy: 'system'
            });
        }

        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error getting contact settings:', error);
        res.status(500).json({ error: error.message });
    }
};

// Обновить настройки
export const updateContactSettings = async (req, res) => {
    try {
        const { leftPanel, rightPanel, background } = req.body;

        let settings = await ContactSettings.findOne();

        if (!settings) {
            settings = new ContactSettings();
        }

        if (leftPanel) settings.leftPanel = leftPanel;
        if (rightPanel) settings.rightPanel = rightPanel;
        if (background) settings.background = background;
        settings.updatedBy = req.admin?.email || 'admin';

        await settings.save();

        res.json({
            success: true,
            message: 'Настройки обновлены',
            data: settings
        });
    } catch (error) {
        console.error('Error updating contact settings:', error);
        res.status(500).json({ error: error.message });
    }
};

// Сбросить настройки к дефолтным
export const resetContactSettings = async (req, res) => {
    try {
        const defaultSettings = {
            leftPanel: {
                badge: 'Свяжитесь с нами',
                title: 'Получите бесплатную консультацию',
                description: 'Оставьте заявку и наш специалист свяжется с вами в ближайшее время',
                address: 'г. Алматы, ул. Абая 123, БЦ "Алмалы"',
                phone1: '+7 (777) 123-45-67',
                phone2: '+7 (727) 234-56-78',
                email: 'info@almaty-build.kz',
                workHours: 'Пн-Пт: 09:00 - 19:00',
                workHoursSat: 'Сб: 10:00 - 16:00'
            },
            rightPanel: {
                title: 'Оставить заявку',
                description: 'Заполните форму и мы свяжемся с вами',
                buttonText: 'Отправить заявку',
                note: 'Нажимая на кнопку, вы соглашаетесь с политикой обработки персональных данных'
            },
            background: {
                gradientStart: '#0a1a0f',
                gradientEnd: '#1a3a2a',
                overlayOpacity: 0.15
            },
            updatedBy: req.admin?.email || 'admin'
        };

        let settings = await ContactSettings.findOne();

        if (!settings) {
            settings = new ContactSettings(defaultSettings);
        } else {
            settings.leftPanel = defaultSettings.leftPanel;
            settings.rightPanel = defaultSettings.rightPanel;
            settings.background = defaultSettings.background;
            settings.updatedBy = defaultSettings.updatedBy;
        }

        await settings.save();

        res.json({
            success: true,
            message: 'Настройки сброшены к дефолтным',
            data: settings
        });
    } catch (error) {
        console.error('Error resetting contact settings:', error);
        res.status(500).json({ error: error.message });
    }
};

// ============ Сообщения ============

// Получить все сообщения
export const getAllMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            data: messages
        });
    } catch (error) {
        console.error('Error getting messages:', error);
        res.status(500).json({ error: error.message });
    }
};

// Отметить сообщение как прочитанное
export const markMessageAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await ContactMessage.findById(id);
        if (!message) {
            return res.status(404).json({ error: 'Сообщение не найдено' });
        }

        message.isRead = true;
        await message.save();

        res.json({
            success: true,
            message: 'Сообщение отмечено как прочитанное',
            data: message
        });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ error: error.message });
    }
};

// Удалить сообщение
export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await ContactMessage.findByIdAndDelete(id);
        if (!message) {
            return res.status(404).json({ error: 'Сообщение не найдено' });
        }

        res.json({
            success: true,
            message: 'Сообщение удалено'
        });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: error.message });
    }
};