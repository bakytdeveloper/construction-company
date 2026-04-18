// models/ServiceSettings.js
import mongoose from 'mongoose';

const serviceSettingsSchema = new mongoose.Schema({
    subtitle: {
        type: String,
        default: 'Наши услуги'
    },
    title: {
        type: String,
        default: 'Что мы предлагаем'
    },
    description: {
        type: String,
        default: 'Полный спектр услуг в строительстве и недвижимости. От идеи до готового объекта'
    },
    updatedBy: {
        type: String,
        default: 'system'
    }
}, {
    timestamps: true
});

export default mongoose.model('ServiceSettings', serviceSettingsSchema);