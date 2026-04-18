// models/AdvantageSettings.js
import mongoose from 'mongoose';

const advantageSettingsSchema = new mongoose.Schema({
    subtitle: {
        type: String,
        default: 'Почему выбирают нас'
    },
    title: {
        type: String,
        default: 'Наши преимущества'
    },
    description: {
        type: String,
        default: 'Более 150 семей доверили нам строительство своего дома'
    },
    updatedBy: {
        type: String,
        default: 'system'
    }
}, {
    timestamps: true
});

export default mongoose.model('AdvantageSettings', advantageSettingsSchema);