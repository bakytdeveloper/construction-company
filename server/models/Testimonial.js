// models/Testimonial.js
import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'Аскар Нуржанов'
    },
    position: {
        type: String,
        required: true,
        default: 'Владелец дома, мкр. Нурсая'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 5
    },
    text: {
        type: String,
        required: true,
        default: 'Огромное спасибо команде за профессионализм! Построили дом нашей мечты точно в срок. Отдельно хочу отметить внимание к деталям и качество материалов. Рекомендую!'
    },
    shortText: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    imageType: {
        type: String,
        enum: ['url', 'file', 'initials'],
        default: 'initials'
    },
    project: {
        type: String,
        required: true,
        default: 'Коттедж 350 м²'
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

// Автоматически генерируем shortText из text
testimonialSchema.pre('save', function(next) {
    if (this.text && this.text.length > 150) {
        this.shortText = this.text.substring(0, 150) + '...';
    } else if (this.text) {
        this.shortText = this.text;
    }
    next();
});

export default mongoose.model('Testimonial', testimonialSchema);