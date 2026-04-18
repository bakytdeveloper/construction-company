// models/Stats.js
import mongoose from 'mongoose';

const statItemSchema = new mongoose.Schema({
    icon: {
        type: String,
        required: true,
        default: '🏗️'
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
    label: {
        type: String,
        required: true,
        default: 'Построенных объектов'
    },
    value: {
        type: Number,
        required: true,
        default: 156
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

export default mongoose.model('Stats', statItemSchema);