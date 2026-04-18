// models/FAQSettings.js
import mongoose from 'mongoose';

const faqSettingsSchema = new mongoose.Schema({
    subtitle: {
        type: String,
        default: 'Часто задаваемые вопросы'
    },
    title: {
        type: String,
        default: 'Ответы на популярные вопросы'
    },
    description: {
        type: String,
        default: 'Мы собрали самые частые вопросы наших клиентов'
    },
    ctaTitle: {
        type: String,
        default: 'Не нашли ответ?'
    },
    ctaDescription: {
        type: String,
        default: 'Задайте свой вопрос нашему специалисту и получите консультацию'
    },
    ctaButtonText: {
        type: String,
        default: 'Задать вопрос'
    },
    ctaPhone: {
        type: String,
        default: '+7 (777) 123-45-67'
    },
    updatedBy: {
        type: String,
        default: 'system'
    }
}, {
    timestamps: true
});

export default mongoose.model('FAQSettings', faqSettingsSchema);