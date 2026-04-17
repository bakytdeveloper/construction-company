// controllers/heroController.js
import Hero from '../models/Hero.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Публичный маршрут - возвращает только активные слайды
export const getHeroContent = async (req, res) => {
    try {
        let hero = await Hero.findOne().sort({ createdAt: -1 });

        if (!hero) {
            hero = await createDefaultHero();
        }

        // Фильтруем только активные слайды для публичного доступа
        const publicHero = {
            ...hero.toObject(),
            slides: hero.slides.filter(s => s.active)
        };

        res.json({
            success: true,
            data: publicHero
        });
    } catch (error) {
        console.error('Error getting hero content:', error);
        res.status(500).json({ error: error.message });
    }
};

// Админский маршрут - возвращает все слайды (включая неактивные)
export const getAdminHeroContent = async (req, res) => {
    try {
        let hero = await Hero.findOne().sort({ createdAt: -1 });

        if (!hero) {
            hero = await createDefaultHero();
        }

        res.json({
            success: true,
            data: hero
        });
    } catch (error) {
        console.error('Error getting admin hero content:', error);
        res.status(500).json({ error: error.message });
    }
};

// Создание дефолтного hero
const createDefaultHero = async () => {
    const defaultHero = new Hero({
        slides: [
            {
                title: 'Строим дома вашей',
                titleHighlight: 'мечты в Алматы',
                titleColor: '#ffffff',
                titleHighlightColor: '#c9a03d',
                description: 'Профессиональное строительство домов под ключ, продажа квартир в элитных новостройках. Более 150 сданных объектов, 98% довольных клиентов.',
                descriptionColor: 'rgba(255, 255, 255, 0.9)',
                buttonText: 'Наши проекты',
                buttonLink: '/projects',
                buttonBgColor: '#1a472a',
                buttonTextColor: '#ffffff',
                contentPosition: 'center',
                overlayColor: 'rgba(0, 0, 0, 0.4)',
                overlayOpacity: 0.4,
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
        autoPlayInterval: 5000,
        updatedBy: 'system'
    });

    await defaultHero.save();
    return defaultHero;
};

// Обновление hero контента
export const updateHeroContent = async (req, res) => {
    try {
        const { slides, autoPlay, autoPlayInterval } = req.body;

        // Проверка на количество слайдов
        if (slides && slides.length > 3) {
            return res.status(400).json({ error: 'Не может быть больше 3 слайдов' });
        }

        let hero = await Hero.findOne();

        if (!hero) {
            hero = new Hero();
        }

        if (slides) hero.slides = slides;
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

// Загрузка изображения для слайда
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

// Удаление изображения слайда
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