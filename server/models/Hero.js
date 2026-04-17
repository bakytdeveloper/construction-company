// models/Hero.js
import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: 'Строим дома вашей'
    },
    titleHighlight: {
        type: String,
        default: 'мечты в Алматы'
    },
    description: {
        type: String,
        default: 'Профессиональное строительство домов под ключ, продажа квартир в элитных новостройках. Более 150 сданных объектов, 98% довольных клиентов.'
    },
    buttonText: {
        type: String,
        default: 'Наши проекты'
    },
    buttonLink: {
        type: String,
        default: '/projects'
    },
    // Позиционирование контента
    contentPosition: {
        type: String,
        enum: ['left', 'center', 'right'],
        default: 'center'
    },
    // Тип фона: градиент или изображение
    bgType: {
        type: String,
        enum: ['gradient', 'url', 'file'],
        default: 'gradient'
    },
    // Значение фона (URL изображения или градиент)
    bgValue: {
        type: String,
        default: 'linear-gradient(135deg, #0a1a0f 0%, #1a3a2a 100%)'
    },
    // Альтернативный текст для изображения
    altText: {
        type: String,
        default: ''
    },
    // Параметры градиента
    gradientConfig: {
        angle: { type: Number, default: 135 },
        color1: { type: String, default: '#0a1a0f' },
        color2: { type: String, default: '#1a3a2a' }
    },
    // Статистика
    showStats: {
        type: Boolean,
        default: true
    },
    stats: {
        type: [
            {
                number: { type: String, default: '150+' },
                label: { type: String, default: 'Построенных домов' }
            }
        ],
        default: [
            { number: '150+', label: 'Построенных домов' },
            { number: '98%', label: 'Довольных клиентов' },
            { number: '12 лет', label: 'На рынке' }
        ]
    },
    // Активность слайда
    active: {
        type: Boolean,
        default: true
    },
    // Порядок отображения
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const heroSchema = new mongoose.Schema({
    slides: [slideSchema],
    autoPlay: {
        type: Boolean,
        default: true
    },
    autoPlayInterval: {
        type: Number,
        default: 5000
    },
    updatedBy: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

export default mongoose.model('Hero', heroSchema);