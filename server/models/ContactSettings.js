// models/ContactSettings.js
import mongoose from 'mongoose';

const contactSettingsSchema = new mongoose.Schema({
    // Левая панель (информация)
    leftPanel: {
        badge: { type: String, default: 'Свяжитесь с нами' },
        title: { type: String, default: 'Получите бесплатную консультацию' },
        description: { type: String, default: 'Оставьте заявку и наш специалист свяжется с вами в ближайшее время' },
        address: { type: String, default: 'г. Алматы, ул. Абая 123, БЦ "Алмалы"' },
        phone1: { type: String, default: '+7 (777) 123-45-67' },
        phone2: { type: String, default: '+7 (727) 234-56-78' },
        email: { type: String, default: 'info@almaty-build.kz' },
        workHours: { type: String, default: 'Пн-Пт: 09:00 - 19:00' },
        workHoursSat: { type: String, default: 'Сб: 10:00 - 16:00' }
    },
    // Правая панель (форма)
    rightPanel: {
        title: { type: String, default: 'Оставить заявку' },
        description: { type: String, default: 'Заполните форму и мы свяжемся с вами' },
        buttonText: { type: String, default: 'Отправить заявку' },
        note: { type: String, default: 'Нажимая на кнопку, вы соглашаетесь с политикой обработки персональных данных' }
    },
    // Фон
    background: {
        gradientStart: { type: String, default: '#0a1a0f' },
        gradientEnd: { type: String, default: '#1a3a2a' },
        overlayOpacity: { type: Number, default: 0.15 }
    },
    updatedBy: {
        type: String,
        default: 'system'
    }
}, {
    timestamps: true
});

export default mongoose.model('ContactSettings', contactSettingsSchema);