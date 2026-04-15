import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Название объекта обязательно'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Описание обязательно']
    },
    propertyType: {
        type: String,
        enum: ['apartment', 'commercial', 'house', 'land', 'parking', 'storage'],
        required: true
    },
    category: {
        type: String,
        enum: ['residential', 'commercial', 'business'],
        default: 'residential'
    },
    residentialComplex: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ResidentialComplex',
        default: null
    },
    location: {
        type: String,
        required: true
    },
    area: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rooms: {
        type: Number,
        default: null
    },
    floor: {
        type: Number,
        default: null
    },
    totalFloors: {
        type: Number,
        default: null
    },
    status: {
        type: String,
        enum: ['ready', 'under_construction', 'planned', 'sold'],
        default: 'ready'
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
    documents: [{
        type: String
    }],
    contactPhone: String,
    contactEmail: String,
    seoTitle: String,
    seoDescription: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Индекс для поиска
propertySchema.index({ title: 'text', description: 'text', location: 'text' });

export default mongoose.model('Property', propertySchema);