import mongoose from 'mongoose';

const residentialComplexSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Название ЖК обязательно'],
        trim: true,
        unique: true // Добавляем unique вместо slug
    },
    description: {
        type: String,
        required: [true, 'Описание ЖК обязательно']
    },
    location: {
        type: String,
        required: [true, 'Адрес ЖК обязателен']
    },
    mainImage: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    features: [{
        type: String
    }],
    specifications: {
        floors: {
            type: Number,
            default: null,
            description: 'Количество этажей'
        },
        apartments: {
            type: Number,
            default: null,
            description: 'Количество квартир'
        },
        parking: {
            type: Number,
            default: null,
            description: 'Количество парковочных мест'
        },
        buildYear: {
            type: Number,
            default: null,
            description: 'Год постройки'
        }
    },
    infrastructure: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['completed', 'under_construction', 'planned'],
        default: 'completed'
    },
    seoTitle: String,
    seoDescription: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('ResidentialComplex', residentialComplexSchema);