import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Имя обязательно'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Телефон обязателен'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email обязателен'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Неверный формат email']
    },
    message: {
        type: String,
        required: [true, 'Сообщение обязательно']
    },
    projectType: {
        type: String,
        enum: ['house', 'apartment', 'commercial', 'other'],
        default: 'other'
    },
    status: {
        type: String,
        enum: ['new', 'read', 'responded'],
        default: 'new'
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('ContactMessage', contactMessageSchema);