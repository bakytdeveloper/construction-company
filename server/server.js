import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Routes
import contactRoutes from './routes/contactRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import complexRoutes from './routes/complexRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import fs from 'fs';
import heroRoutes from "./routes/heroRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import advantageRoutes from "./routes/advantageRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Создание папок для загрузок
const uploadsDir = path.join(__dirname, 'uploads');
const complexesDir = path.join(uploadsDir, 'complexes');
const propertiesDir = path.join(uploadsDir, 'properties');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(complexesDir)) fs.mkdirSync(complexesDir, { recursive: true });
if (!fs.existsSync(propertiesDir)) fs.mkdirSync(propertiesDir, { recursive: true });

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5000'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/properties', projectRoutes);
app.use('/api/complexes', complexRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/advantages', advantageRoutes);
app.use('/api/faq', faqRoutes);


// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});