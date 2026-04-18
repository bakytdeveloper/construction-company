// models/FAQ.js
import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        default: 'Сколько стоит построить дом под ключ в Алматы?'
    },
    answer: {
        type: String,
        required: true,
        default: 'Стоимость строительства дома зависит от многих факторов: площади, материалов, сложности проекта и отделки. В среднем, цена за 1 м² составляет от 150 000 до 300 000 тенге.'
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

export default mongoose.model('FAQ', faqSchema);