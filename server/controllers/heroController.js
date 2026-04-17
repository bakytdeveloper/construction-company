// controllers/heroController.js
import Hero from '../models/Hero.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Получить контент Hero
export const getHeroContent = async (req, res) => {
    try {
        let hero = await Hero.findOne().sort({ createdAt: -1 });

        if (!hero) {
            // Создаем дефолтный контент если нет
            hero = await createDefaultHero();
        }

        res.json({
            success: true,
            data: hero
        });
    } catch (error) {
        console.error('Error getting hero content:', error);
        res.status(500).json({ error: error.message });
    }
};

// Создать дефолтный контент
const createDefaultHero = async () => {
    const defaultHero = new Hero({
        slides: [
            {
                title: 'Строим дома вашей',
                titleHighlight: 'мечты в Алматы',
                description: 'Профессиональное строительство домов под ключ, продажа квартир в элитных новостройках. Более 150 сданных объектов, 98% довольных клиентов.',
                buttonText: 'Наши проекты',
                buttonLink: '/projects',
                contentPosition: 'center',
                bgType: 'gradient',
                bgValue: 'linear-gradient(135deg, #0a1a0f 0%, #1a3a2a 100%)',
                gradientConfig: {
                    angle: 135,
                    color1: '#0a1a0f',
                    color2: '#1a3a2a'
                },
                showStats: true,
                active: true,
                order: 0
            }
        ],
        autoPlay: true,
        autoPlayInterval: 5000
    });

    await defaultHero.save();
    return defaultHero;
};

// Обновить Hero контент
export const updateHeroContent = async (req, res) => {
    try {
        const { slides, autoPlay, autoPlayInterval } = req.body;

        let hero = await Hero.findOne();

        if (!hero) {
            hero = new Hero();
        }

        hero.slides = slides;
        if (autoPlay !== undefined) hero.autoPlay = autoPlay;
        if (autoPlayInterval !== undefined) hero.autoPlayInterval = autoPlayInterval;
        hero.updatedBy = req.admin?.email || 'admin';

        await hero.save();

        res.json({
            success: true,
            message: 'Hero контент обновлен',
            data: hero
        });
    } catch (error) {
        console.error('Error updating hero content:', error);
        res.status(500).json({ error: error.message });
    }
};

// Загрузить изображение для слайда
export const uploadSlideImage = async (req, res) => {
    try {
        const { slideIndex } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: 'Файл не загружен' });
        }

        let hero = await Hero.findOne();
        if (!hero) {
            hero = await createDefaultHero();
        }

        const index = parseInt(slideIndex);
        if (index < 0 || index >= hero.slides.length) {
            return res.status(404).json({ error: 'Слайд не найден' });
        }

        // Удаляем старое изображение если было
        const oldImage = hero.slides[index].bgValue;
        if (oldImage && oldImage.startsWith('/uploads/hero/')) {
            const oldPath = path.join(__dirname, '..', oldImage);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        const imageUrl = `/uploads/hero/${req.file.filename}`;
        hero.slides[index].bgValue = imageUrl;
        hero.slides[index].bgType = 'file';

        await hero.save();

        res.json({
            success: true,
            message: 'Изображение загружено',
            data: hero
        });
    } catch (error) {
        console.error('Error uploading slide image:', error);
        res.status(500).json({ error: error.message });
    }
};

// Удалить изображение слайда
export const deleteSlideImage = async (req, res) => {
    try {
        const { slideIndex } = req.params;

        let hero = await Hero.findOne();
        if (!hero) {
            return res.status(404).json({ error: 'Hero не найден' });
        }

        const index = parseInt(slideIndex);
        if (index < 0 || index >= hero.slides.length) {
            return res.status(404).json({ error: 'Слайд не найден' });
        }

        const imagePath = hero.slides[index].bgValue;
        if (imagePath && imagePath.startsWith('/uploads/hero/')) {
            const fullPath = path.join(__dirname, '..', imagePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }

        hero.slides[index].bgValue = 'linear-gradient(135deg, #0a1a0f 0%, #1a3a2a 100%)';
        hero.slides[index].bgType = 'gradient';

        await hero.save();

        res.json({
            success: true,
            message: 'Изображение удалено',
            data: hero
        });
    } catch (error) {
        console.error('Error deleting slide image:', error);
        res.status(500).json({ error: error.message });
    }
};