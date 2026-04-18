import {
    FaWrench, FaTools, FaShower, FaBath, FaToilet, FaFaucet, FaWater, FaFire, FaGasPump,
    FaHammer, FaScrewdriver, FaRuler,
    FaCheck, FaClock, FaShieldAlt, FaStar, FaHeart, FaThumbsUp, FaAward, FaTrophy, FaMedal,
    FaRocket, FaFighterJet, FaTachometerAlt,
    FaGem, FaCrown,
    FaMoneyBill, FaPercentage, FaCoins,
    FaPhone, FaEnvelope, FaComment, FaComments
} from 'react-icons/fa';

// Маппинг названий иконок к реальным компонентам
export const iconComponents = {
    FaWrench, FaTools, FaShower, FaBath, FaToilet, FaFaucet, FaWater, FaFire, FaGasPump,
    FaHammer, FaScrewdriver, FaRuler,
    FaCheck, FaClock, FaShieldAlt, FaStar, FaHeart, FaThumbsUp, FaAward, FaTrophy, FaMedal,
    FaRocket, FaFighterJet, FaTachometerAlt,
    FaGem, FaCrown,
    FaMoneyBill, FaPercentage, FaCoins,
    FaPhone, FaEnvelope, FaComment, FaComments
};

// Информация об иконках
export const iconInfo = {
    // Сантехнические иконки
    FaWrench: { name: 'Гаечный ключ', category: 'Сантехника' },
    FaTools: { name: 'Инструменты', category: 'Сантехника' },
    FaShower: { name: 'Душ', category: 'Сантехника' },
    FaBath: { name: 'Ванна', category: 'Сантехника' },
    FaToilet: { name: 'Унитаз', category: 'Сантехника' },
    FaFaucet: { name: 'Кран', category: 'Сантехника' },
    FaWater: { name: 'Вода', category: 'Сантехника' },
    FaFire: { name: 'Огонь', category: 'Сантехника' },
    FaGasPump: { name: 'Газ', category: 'Сантехника' },

    // Инструменты
    FaHammer: { name: 'Молоток', category: 'Инструменты' },
    FaScrewdriver: { name: 'Отвертка', category: 'Инструменты' },
    FaRuler: { name: 'Линейка', category: 'Инструменты' },

    // Общие иконки
    FaCheck: { name: 'Галочка', category: 'Общие' },
    FaClock: { name: 'Часы', category: 'Общие' },
    FaShieldAlt: { name: 'Щит', category: 'Общие' },
    FaStar: { name: 'Звезда', category: 'Общие' },
    FaHeart: { name: 'Сердце', category: 'Общие' },
    FaThumbsUp: { name: 'Палец вверх', category: 'Общие' },
    FaAward: { name: 'Награда', category: 'Общие' },
    FaTrophy: { name: 'Трофей', category: 'Общие' },
    FaMedal: { name: 'Медаль', category: 'Общие' },

    // Скорость/срочность
    FaRocket: { name: 'Ракета', category: 'Скорость' },
    FaFighterJet: { name: 'Самолет', category: 'Скорость' },
    FaTachometerAlt: { name: 'Спидометр', category: 'Скорость' },

    // Качество
    FaGem: { name: 'Драгоценность', category: 'Качество' },
    FaCrown: { name: 'Корона', category: 'Качество' },
    // FaDiamond: { name: 'Алмаз', category: 'Качество' },

    // Цена/экономия
    FaMoneyBill: { name: 'Деньги', category: 'Цена' },
    FaPercentage: { name: 'Процент', category: 'Цена' },
    FaCoins: { name: 'Монеты', category: 'Цена' },

    // Коммуникация
    FaPhone: { name: 'Телефон', category: 'Коммуникация' },
    FaEnvelope: { name: 'Почта', category: 'Коммуникация' },
    FaComment: { name: 'Комментарий', category: 'Коммуникация' },
    FaComments: { name: 'Комментарии', category: 'Коммуникация' }
};

export const iconCategories = [
    'Сантехника',
    'Инструменты',
    'Общие',
    'Скорость',
    'Качество',
    'Цена',
    'Коммуникация'
];

// Функция для получения компонента иконки по имени
export const getIconComponent = (iconName) => {
    return iconComponents[iconName] || FaTools; // По умолчанию FaTools
};

// Функция для получения иконок по категории
export const getIconsByCategory = (category) => {
    return Object.entries(iconInfo)
        .filter(([_, info]) => info.category === category)
        .map(([key, info]) => ({ id: key, ...info }));
};

// Функция для поиска иконок
export const searchIcons = (query) => {
    const lowerQuery = query.toLowerCase();
    return Object.entries(iconInfo)
        .filter(([key, info]) =>
            key.toLowerCase().includes(lowerQuery) ||
            info.name.toLowerCase().includes(lowerQuery) ||
            info.category.toLowerCase().includes(lowerQuery)
        )
        .map(([key, info]) => ({ id: key, ...info }));
};