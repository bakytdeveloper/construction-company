// models/Service.js
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    icon: {
        type: String,
        required: true,
        default: '🏠'
    },
    iconType: {
        type: String,
        enum: ['emoji', 'react-icon'],
        default: 'emoji'
    },
    reactIconName: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        required: true,
        default: 'Строительство домов'
    },
    titleKz: {
        type: String,
        default: 'Үй құрылысы'
    },
    description: {
        type: String,
        required: true,
        default: 'Строительство частных домов под ключ. Индивидуальные проекты, современные материалы, гарантия 10 лет.'
    },
    features: [{
        type: String
    }],
    gradient: {
        type: String,
        default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    gradientColors: {
        color1: { type: String, default: '#667eea' },
        color2: { type: String, default: '#764ba2' },
        angle: { type: Number, default: 135 }
    },
    order: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Service', serviceSchema);