// models/AboutSettings.js
import mongoose from 'mongoose';

const aboutSettingsSchema = new mongoose.Schema({
    // Hero секция
    hero: {
        title: { type: String, default: 'О нашей компании' },
        subtitle: { type: String, default: '12 лет строим дома вашей мечты в Алматы' },
        bgImage: { type: String, default: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80' },
        bgImageType: { type: String, enum: ['url', 'file'], default: 'url' },
        overlayOpacity: { type: Number, default: 0.15 }
    },
    // Миссия секция
    mission: {
        subtitle: { type: String, default: 'Наша миссия' },
        title: { type: String, default: 'Создаем пространство для счастливой жизни' },
        description: { type: String, default: 'Мы стремимся создавать не просто здания, а уютные пространства, где люди будут жить, работать и создавать семьи. Каждый наш проект — это результат тщательного планирования, использования современных технологий и любви к своему делу.' },
        stats: [
            { number: { type: String, default: '2014' }, label: { type: String, default: 'Год основания' } },
            { number: { type: String, default: '150+' }, label: { type: String, default: 'Построенных объектов' } },
            { number: { type: String, default: '50+' }, label: { type: String, default: 'Сотрудников' } }
        ],
        image: { type: String, default: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80' },
        imageType: { type: String, enum: ['url', 'file'], default: 'url' },
        badgeText: { type: String, default: 'Лидер рынка 2023' },
        badgeIcon: { type: String, default: '🏆' }
    },
    // Ценности секция
    values: {
        subtitle: { type: String, default: 'Наши ценности' },
        title: { type: String, default: 'Принципы нашей работы' }
    },
    // Карточки ценностей
    valueCards: [{
        icon: { type: String, default: '🔧' },
        title: { type: String, default: 'Качество' },
        description: { type: String, default: 'Используем только сертифицированные материалы и современные технологии' },
        order: { type: Number, default: 0 },
        active: { type: Boolean, default: true }
    }],
    // Команда секция
    team: {
        subtitle: { type: String, default: 'Наша команда' },
        title: { type: String, default: 'Профессионалы своего дела' }
    },
    // Карточки членов команды
    teamMembers: [{
        name: { type: String, default: '' },
        position: { type: String, default: '' },
        experience: { type: String, default: '' },
        image: { type: String, default: '' },
        imageType: { type: String, enum: ['url', 'file', 'initials'], default: 'initials' },
        order: { type: Number, default: 0 },
        active: { type: Boolean, default: true }
    }],
    updatedBy: {
        type: String,
        default: 'system'
    }
}, {
    timestamps: true
});

export default mongoose.model('AboutSettings', aboutSettingsSchema);