import mongoose from 'mongoose';

const residentialComplexSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Название ЖК обязательно'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Описание ЖК обязательно']
    },
    location: {
        type: String,
        required: [true, 'Адрес ЖК обязателен']
    },
    coordinates: {
        lat: Number,
        lng: Number
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
        floors: Number,
        apartments: Number,
        parking: Number,
        buildYear: Number,
        developer: String
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