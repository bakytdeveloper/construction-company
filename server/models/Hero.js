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
    titleColor: {
        type: String,
        default: '#ffffff'
    },
    titleHighlightColor: {
        type: String,
        default: '#c9a03d'
    },
    description: {
        type: String,
        default: 'Профессиональное строительство домов под ключ, продажа квартир в элитных новостройках. Более 150 сданных объектов, 98% довольных клиентов.'
    },
    descriptionColor: {
        type: String,
        default: 'rgba(255, 255, 255, 0.9)'
    },
    buttonText: {
        type: String,
        default: 'Наши проекты'
    },
    buttonLink: {
        type: String,
        default: '/projects'
    },
    buttonBgColor: {
        type: String,
        default: '#1a472a'
    },
    buttonTextColor: {
        type: String,
        default: '#ffffff'
    },
    contentPosition: {
        type: String,
        enum: ['left', 'center', 'right'],
        default: 'center'
    },
    // Затемнение фона
    overlayColor: {
        type: String,
        default: 'rgba(0, 0, 0, 0.4)'
    },
    overlayOpacity: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.4
    },
    // Тип фона: градиент или изображение
    bgType: {
        type: String,
        enum: ['gradient', 'url', 'file'],
        default: 'gradient'
    },
    bgValue: {
        type: String,
        default: 'linear-gradient(135deg, #0a1a0f 0%, #1a3a2a 100%)'
    },
    altText: {
        type: String,
        default: ''
    },
    gradientConfig: {
        angle: { type: Number, default: 135 },
        color1: { type: String, default: '#0a1a0f' },
        color2: { type: String, default: '#1a3a2a' }
    },
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
    active: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const heroSchema = new mongoose.Schema({
    slides: {
        type: [slideSchema],
        validate: {
            validator: function(v) {
                return v.length <= 3;
            },
            message: 'Не может быть больше 3 слайдов'
        }
    },
    autoPlay: {
        type: Boolean,
        default: true
    },
    autoPlayInterval: {
        type: Number,
        default: 25000
    },
    updatedBy: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

export default mongoose.model('Hero', heroSchema);