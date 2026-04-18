// models/StatsSettings.js
import mongoose from 'mongoose';

const statsSettingsSchema = new mongoose.Schema({
    bgImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    },
    overlayOpacity: {
        type: Number,
        default: 0.15
    },
    bgType: {
        type: String,
        enum: ['url', 'gradient'],
        default: 'url'
    },
    gradientColors: {
        color1: { type: String, default: '#1a472a' },
        color2: { type: String, default: '#0e2a1a' },
        angle: { type: Number, default: 135 }
    },
    updatedBy: {
        type: String,
        default: 'system'
    }
}, {
    timestamps: true
});

export default mongoose.model('StatsSettings', statsSettingsSchema);