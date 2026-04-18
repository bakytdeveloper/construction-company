// models/TestimonialSettings.js
import mongoose from 'mongoose';

const testimonialSettingsSchema = new mongoose.Schema({
    subtitle: {
        type: String,
        default: 'Отзывы клиентов'
    },
    title: {
        type: String,
        default: 'Что говорят о нас'
    },
    description: {
        type: String,
        default: 'Более 98% наших клиентов рекомендуют нас своим друзьям и знакомым'
    },
    statsValue: {
        type: Number,
        default: 4.9
    },
    statsStars: {
        type: Number,
        default: 5
    },
    statsReviews: {
        type: Number,
        default: 127
    },
    updatedBy: {
        type: String,
        default: 'system'
    }
}, {
    timestamps: true
});

export default mongoose.model('TestimonialSettings', testimonialSettingsSchema);