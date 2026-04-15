// seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ResidentialComplex from '../models/ResidentialComplex.js';
import Property from '../models/Property.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Очищаем существующие данные (опционально)
        await Property.deleteMany({});
        await ResidentialComplex.deleteMany({});
        console.log('🗑️ Старые данные удалены');

        console.log('📦 Создание начальных данных...');

        // Создание Жилого комплекса
        const complex = new ResidentialComplex({
            title: 'ЖК «Алматы Тауэрс»',
            description: 'Современный жилой комплекс премиум-класса в центре Алматы. Панорамные виды на горы, развитая инфраструктура, подземный паркинг. Комплекс построен с использованием передовых технологий и энергоэффективных материалов.',
            location: 'г. Алматы, мкр. Самал, ул. Абая 150',
            coordinates: {
                lat: 43.2567,
                lng: 76.9286
            },
            mainImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            images: [
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
            ],
            features: [
                'Охраняемая территория 24/7',
                'Подземный паркинг',
                'Фитнес-центр',
                'Детская площадка',
                'Зона отдыха',
                'Видеонаблюдение'
            ],
            specifications: {
                floors: 25,
                apartments: 320,
                parking: 400,
                buildYear: 2022,
                developer: 'Almaty Build Construction'
            },
            infrastructure: [
                'Супермаркет',
                'Школа',
                'Детский сад',
                'Аптека',
                'Рестораны',
                'Спортплощадка'
            ],
            status: 'completed',
            seoTitle: 'ЖК Алматы Тауэрс - элитный жилой комплекс в центре Алматы',
            seoDescription: 'Квартиры в ЖК Алматы Тауэрс. Премиум-класс, панорамный вид на горы, развитая инфраструктура. Продажа от застройщика.'
        });

        await complex.save();
        console.log('✅ Создан Жилой комплекс: ЖК «Алматы Тауэрс»');

        // Создание отдельной недвижимости (квартира в ЖК)
        const property1 = new Property({
            title: '3-комнатная квартира в ЖК «Алматы Тауэрс»',
            slug: '3-komnatnaya-kvartira-v-zhk-almaty-tauers', // Добавьте slug
            description: 'Просторная 3-комнатная квартира с панорамным видом на горы. Свежая отделка, высокие потолки, современная планировка. Квартира расположена на 15 этаже 25-этажного дома. Развитая инфраструктура, близость к центру города.',
            propertyType: 'apartment',
            category: 'residential',
            residentialComplex: complex._id,
            location: 'г. Алматы, мкр. Самал',
            area: 125,
            price: 45000000,
            rooms: 3,
            floor: 15,
            totalFloors: 25,
            status: 'ready',
            mainImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            images: [
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
            ],
            features: [
                'Панорамные окна',
                'Высокие потолки 3.2 м',
                'Чистовая отделка',
                'Встроенная кухня',
                'Кондиционирование',
                'Теплый пол'
            ],
            contactPhone: '+7 (777) 123-45-67',
            contactEmail: 'info@almaty-build.kz',
            seoTitle: '3-комнатная квартира в ЖК Алматы Тауэрс - продажа',
            seoDescription: 'Продается просторная квартира в центре Алматы. Панорамный вид, отделка, развитая инфраструктура.'
        });

        await property1.save();
        console.log('✅ Создана квартира в ЖК «Алматы Тауэрс»');

        // Создание отдельной недвижимости (коммерческое помещение)
        const property2 = new Property({
            title: 'Коммерческое помещение на первой линии',
            slug: 'kommercheskoe-pomeschenie-na-pervoy-linii', // Добавьте slug
            description: 'Отличное коммерческое помещение на первой линии в центре Алматы. Подходит для магазина, офиса, аптеки, салона красоты. Высокая проходимость, удобный заезд, отдельный вход.',
            propertyType: 'commercial',
            category: 'commercial',
            residentialComplex: null,
            location: 'г. Алматы, ул. Толе би',
            area: 85,
            price: 32000000,
            rooms: null,
            floor: 1,
            totalFloors: 5,
            status: 'ready',
            mainImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            images: [
                'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                'https://images.unsplash.com/photo-1497366412874-3415097a6e11?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
            ],
            features: [
                'Отдельный вход',
                'Высокая проходимость',
                'Парковка',
                'Витринные окна',
                'Черновая отделка',
                'Собственный санузел'
            ],
            contactPhone: '+7 (777) 123-45-67',
            contactEmail: 'commercial@almaty-build.kz',
            seoTitle: 'Коммерческое помещение в центре Алматы - продажа',
            seoDescription: 'Продается коммерческое помещение на первой линии. Высокая проходимость, отдельный вход, парковка.'
        });

        await property2.save();
        console.log('✅ Создано коммерческое помещение');

        console.log('🎉 Начальные данные успешно созданы!');
    } catch (error) {
        console.error('❌ Ошибка при создании seed данных:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Отключено от MongoDB');
    }
};

seedData();