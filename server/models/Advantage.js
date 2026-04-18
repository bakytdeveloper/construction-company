// models/Advantage.js
import mongoose from 'mongoose';

const advantageSchema = new mongoose.Schema({
    icon: {
        type: String,
        required: true,
        default: '⚡'
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
        default: 'Соблюдение сроков'
    },
    description: {
        type: String,
        required: true,
        default: 'Точное соблюдение сроков строительства'
    },
    color: {
        type: String,
        default: '#1a472a'
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

export default mongoose.model('Advantage', advantageSchema);