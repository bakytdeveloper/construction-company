// import {
//     FaWrench, FaTools, FaShower, FaBath, FaToilet, FaFaucet, FaWater, FaFire, FaGasPump,
//     FaHammer, FaScrewdriver, FaRuler,
//     FaCheck, FaClock, FaShieldAlt, FaStar, FaHeart, FaThumbsUp, FaAward, FaTrophy, FaMedal,
//     FaRocket, FaFighterJet, FaTachometerAlt,
//     FaGem, FaCrown,
//     FaMoneyBill, FaPercentage, FaCoins,
//     FaPhone, FaEnvelope, FaComment, FaComments
// } from 'react-icons/fa';
//
// // Маппинг названий иконок к реальным компонентам
// export const iconComponents = {
//     FaWrench, FaTools, FaShower, FaBath, FaToilet, FaFaucet, FaWater, FaFire, FaGasPump,
//     FaHammer, FaScrewdriver, FaRuler,
//     FaCheck, FaClock, FaShieldAlt, FaStar, FaHeart, FaThumbsUp, FaAward, FaTrophy, FaMedal,
//     FaRocket, FaFighterJet, FaTachometerAlt,
//     FaGem, FaCrown,
//     FaMoneyBill, FaPercentage, FaCoins,
//     FaPhone, FaEnvelope, FaComment, FaComments
// };
//
// // Информация об иконках
// export const iconInfo = {
//     // Сантехнические иконки
//     FaWrench: { name: 'Гаечный ключ', category: 'Сантехника' },
//     FaTools: { name: 'Инструменты', category: 'Сантехника' },
//     FaShower: { name: 'Душ', category: 'Сантехника' },
//     FaBath: { name: 'Ванна', category: 'Сантехника' },
//     FaToilet: { name: 'Унитаз', category: 'Сантехника' },
//     FaFaucet: { name: 'Кран', category: 'Сантехника' },
//     FaWater: { name: 'Вода', category: 'Сантехника' },
//     FaFire: { name: 'Огонь', category: 'Сантехника' },
//     FaGasPump: { name: 'Газ', category: 'Сантехника' },
//
//     // Инструменты
//     FaHammer: { name: 'Молоток', category: 'Инструменты' },
//     FaScrewdriver: { name: 'Отвертка', category: 'Инструменты' },
//     FaRuler: { name: 'Линейка', category: 'Инструменты' },
//
//     // Общие иконки
//     FaCheck: { name: 'Галочка', category: 'Общие' },
//     FaClock: { name: 'Часы', category: 'Общие' },
//     FaShieldAlt: { name: 'Щит', category: 'Общие' },
//     FaStar: { name: 'Звезда', category: 'Общие' },
//     FaHeart: { name: 'Сердце', category: 'Общие' },
//     FaThumbsUp: { name: 'Палец вверх', category: 'Общие' },
//     FaAward: { name: 'Награда', category: 'Общие' },
//     FaTrophy: { name: 'Трофей', category: 'Общие' },
//     FaMedal: { name: 'Медаль', category: 'Общие' },
//
//     // Скорость/срочность
//     FaRocket: { name: 'Ракета', category: 'Скорость' },
//     FaFighterJet: { name: 'Самолет', category: 'Скорость' },
//     FaTachometerAlt: { name: 'Спидометр', category: 'Скорость' },
//
//     // Качество
//     FaGem: { name: 'Драгоценность', category: 'Качество' },
//     FaCrown: { name: 'Корона', category: 'Качество' },
//     // FaDiamond: { name: 'Алмаз', category: 'Качество' },
//
//     // Цена/экономия
//     FaMoneyBill: { name: 'Деньги', category: 'Цена' },
//     FaPercentage: { name: 'Процент', category: 'Цена' },
//     FaCoins: { name: 'Монеты', category: 'Цена' },
//
//     // Коммуникация
//     FaPhone: { name: 'Телефон', category: 'Коммуникация' },
//     FaEnvelope: { name: 'Почта', category: 'Коммуникация' },
//     FaComment: { name: 'Комментарий', category: 'Коммуникация' },
//     FaComments: { name: 'Комментарии', category: 'Коммуникация' }
// };
//
// export const iconCategories = [
//     'Сантехника',
//     'Инструменты',
//     'Общие',
//     'Скорость',
//     'Качество',
//     'Цена',
//     'Коммуникация'
// ];
//
// // Функция для получения компонента иконки по имени
// export const getIconComponent = (iconName) => {
//     return iconComponents[iconName] || FaTools; // По умолчанию FaTools
// };
//
// // Функция для получения иконок по категории
// export const getIconsByCategory = (category) => {
//     return Object.entries(iconInfo)
//         .filter(([_, info]) => info.category === category)
//         .map(([key, info]) => ({ id: key, ...info }));
// };
//
// // Функция для поиска иконок
// export const searchIcons = (query) => {
//     const lowerQuery = query.toLowerCase();
//     return Object.entries(iconInfo)
//         .filter(([key, info]) =>
//             key.toLowerCase().includes(lowerQuery) ||
//             info.name.toLowerCase().includes(lowerQuery) ||
//             info.category.toLowerCase().includes(lowerQuery)
//         )
//         .map(([key, info]) => ({ id: key, ...info }));
// };




// src/components/iconLibrary.js
import {
    FaWrench, FaTools, FaShower, FaBath, FaToilet, FaFaucet, FaWater, FaFire, FaGasPump,
    FaHammer, FaScrewdriver, FaRuler, FaHardHat,
    FaCheck, FaClock, FaShieldAlt, FaStar, FaHeart, FaThumbsUp, FaAward, FaTrophy, FaMedal,
    FaRocket, FaFighterJet, FaTachometerAlt, FaBolt, FaLightbulb,
    FaGem, FaCrown,
    FaMoneyBill, FaPercentage, FaCoins, FaWallet, FaChartLine,
    FaPhone, FaEnvelope, FaComment, FaComments, FaWhatsapp, FaTelegram,
    FaHome, FaBuilding, FaCity, FaTree, FaLeaf, FaSun, FaMoon, FaCloudSun,
    FaHandshake, FaUserTie, FaUsers, FaUserFriends, FaChild,
    FaSmile, FaGrinStars, FaGrinHearts, FaGrinBeam,
    FaRegSmile, FaRegHeart, FaRegStar, FaRegThumbsUp, FaRegClock,
    FaRegBuilding, FaRegCheckCircle, FaRegCircle, FaRegDotCircle,
    FaRegFileAlt, FaRegClipboard, FaRegCalendarAlt
} from 'react-icons/fa';

// Разноцветные эмодзи
const emojis = {
    '🔧': { name: 'Гаечный ключ', category: 'Инструменты', color: '#666' },
    '🔨': { name: 'Молоток', category: 'Инструменты', color: '#8B4513' },
    '⛏️': { name: 'Кирка', category: 'Инструменты', color: '#999' },
    '⚒️': { name: 'Молоток и кирка', category: 'Инструменты', color: '#888' },
    '🪚': { name: 'Пила', category: 'Инструменты', color: '#AAA' },
    '🛠️': { name: 'Инструменты', category: 'Инструменты', color: '#777' },
    '📐': { name: 'Линейка', category: 'Инструменты', color: '#4CAF50' },
    '📏': { name: 'Линейка', category: 'Инструменты', color: '#2196F3' },
    '🔩': { name: 'Винт', category: 'Инструменты', color: '#9E9E9E' },
    '⚙️': { name: 'Шестерня', category: 'Инструменты', color: '#607D8B' },

    // Здания и недвижимость
    '🏠': { name: 'Дом', category: 'Недвижимость', color: '#8B6914' },
    '🏡': { name: 'Дом с садом', category: 'Недвижимость', color: '#8B6914' },
    '🏢': { name: 'Офисное здание', category: 'Недвижимость', color: '#607D8B' },
    '🏗️': { name: 'Строительство', category: 'Недвижимость', color: '#FF9800' },
    '🏘️': { name: 'Дома', category: 'Недвижимость', color: '#8B6914' },
    '🏙️': { name: 'Город', category: 'Недвижимость', color: '#607D8B' },
    '🏚️': { name: 'Старый дом', category: 'Недвижимость', color: '#795548' },
    '🏦': { name: 'Банк', category: 'Недвижимость', color: '#FFC107' },

    // Природа и экология
    '🌳': { name: 'Дерево', category: 'Природа', color: '#4CAF50' },
    '🌲': { name: 'Ель', category: 'Природа', color: '#388E3C' },
    '🌿': { name: 'Трава', category: 'Природа', color: '#8BC34A' },
    '🍃': { name: 'Лист', category: 'Природа', color: '#4CAF50' },
    '🌸': { name: 'Цветок', category: 'Природа', color: '#FF69B4' },
    '🌺': { name: 'Цветок гибискус', category: 'Природа', color: '#FF1493' },
    '🌻': { name: 'Подсолнух', category: 'Природа', color: '#FFD700' },
    '🌞': { name: 'Солнце', category: 'Природа', color: '#FFD700' },
    '☀️': { name: 'Солнце', category: 'Природа', color: '#FFC107' },
    '🌈': { name: 'Радуга', category: 'Природа', color: 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)' },

    // Качество и награды
    '⭐': { name: 'Звезда', category: 'Награды', color: '#FFD700' },
    '🌟': { name: 'Блестящая звезда', category: 'Награды', color: '#FFD700' },
    '✨': { name: 'Искры', category: 'Награды', color: '#FFD700' },
    '🏆': { name: 'Трофей', category: 'Награды', color: '#FFD700' },
    '🥇': { name: 'Золотая медаль', category: 'Награды', color: '#FFD700' },
    '🥈': { name: 'Серебряная медаль', category: 'Награды', color: '#C0C0C0' },
    '🥉': { name: 'Бронзовая медаль', category: 'Награды', color: '#CD7F32' },
    '🎯': { name: 'Цель', category: 'Награды', color: '#F44336' },
    '💎': { name: 'Драгоценность', category: 'Награды', color: '#00BCD4' },

    // Эмодзи эмоции
    '😊': { name: 'Улыбка', category: 'Эмоции', color: '#FFD700' },
    '😍': { name: 'Влюбленность', category: 'Эмоции', color: '#FF1493' },
    '👍': { name: 'Палец вверх', category: 'Эмоции', color: '#4CAF50' },
    '🤝': { name: 'Рукопожатие', category: 'Эмоции', color: '#FF9800' },
    '💪': { name: 'Сила', category: 'Эмоции', color: '#2196F3' },
    '❤️': { name: 'Сердце', category: 'Эмоции', color: '#F44336' },
    '🧡': { name: 'Оранжевое сердце', category: 'Эмоции', color: '#FF9800' },
    '💛': { name: 'Желтое сердце', category: 'Эмоции', color: '#FFEB3B' },
    '💚': { name: 'Зеленое сердце', category: 'Эмоции', color: '#4CAF50' },
    '💙': { name: 'Синее сердце', category: 'Эмоции', color: '#2196F3' },
    '💜': { name: 'Фиолетовое сердце', category: 'Эмоции', color: '#9C27B0' },

    // Часы и скорость
    '⏰': { name: 'Будильник', category: 'Время', color: '#F44336' },
    '⏱️': { name: 'Секундомер', category: 'Время', color: '#607D8B' },
    '⏲️': { name: 'Таймер', category: 'Время', color: '#607D8B' },
    '🕐': { name: 'Часы', category: 'Время', color: '#4CAF50' },
    '🚀': { name: 'Ракета', category: 'Скорость', color: '#F44336' },
    '⚡': { name: 'Молния', category: 'Скорость', color: '#FFEB3B' },

    // Финансы
    '💰': { name: 'Деньги', category: 'Финансы', color: '#FFD700' },
    '💵': { name: 'Доллар', category: 'Финансы', color: '#4CAF50' },
    '💶': { name: 'Евро', category: 'Финансы', color: '#2196F3' },
    '💷': { name: 'Фунт', category: 'Финансы', color: '#9C27B0' },
    '💳': { name: 'Кредитная карта', category: 'Финансы', color: '#607D8B' },
    // '🏦': { name: 'Банк', category: 'Финансы', color: '#FFC107' },
    '📈': { name: 'Рост', category: 'Финансы', color: '#4CAF50' },
    '📉': { name: 'Падение', category: 'Финансы', color: '#F44336' },

    // Коммуникация
    '📞': { name: 'Телефон', category: 'Коммуникация', color: '#4CAF50' },
    '📱': { name: 'Мобильный телефон', category: 'Коммуникация', color: '#2196F3' },
    '✉️': { name: 'Письмо', category: 'Коммуникация', color: '#FF9800' },
    '📧': { name: 'Email', category: 'Коммуникация', color: '#F44336' },
    '💬': { name: 'Диалог', category: 'Коммуникация', color: '#4CAF50' },
    '💭': { name: 'Мысль', category: 'Коммуникация', color: '#9E9E9E' },

    // Защита и безопасность
    '🛡️': { name: 'Щит', category: 'Безопасность', color: '#2196F3' },
    '🔒': { name: 'Замок', category: 'Безопасность', color: '#4CAF50' },
    '🔓': { name: 'Открытый замок', category: 'Безопасность', color: '#FF9800' },
    '🔐': { name: 'Закрытый замок', category: 'Безопасность', color: '#F44336' },
    '🛑': { name: 'Стоп', category: 'Безопасность', color: '#F44336' },
    '⚠️': { name: 'Предупреждение', category: 'Безопасность', color: '#FF9800' }
};

// React иконки с цветами
const reactIcons = {
    FaWrench: { name: 'Гаечный ключ', category: 'Инструменты', icon: FaWrench, defaultColor: '#666' },
    FaTools: { name: 'Инструменты', category: 'Инструменты', icon: FaTools, defaultColor: '#777' },
    FaHammer: { name: 'Молоток', category: 'Инструменты', icon: FaHammer, defaultColor: '#8B4513' },
    FaScrewdriver: { name: 'Отвертка', category: 'Инструменты', icon: FaScrewdriver, defaultColor: '#666' },
    FaHardHat: { name: 'Каска', category: 'Инструменты', icon: FaHardHat, defaultColor: '#FF9800' },
    // FaHelmetSafety: { name: 'Защитная каска', category: 'Инструменты', icon: FaHelmetSafety, defaultColor: '#FFC107' },

    FaHome: { name: 'Дом', category: 'Недвижимость', icon: FaHome, defaultColor: '#8B6914' },
    FaBuilding: { name: 'Здание', category: 'Недвижимость', icon: FaBuilding, defaultColor: '#607D8B' },
    FaCity: { name: 'Город', category: 'Недвижимость', icon: FaCity, defaultColor: '#757575' },

    FaStar: { name: 'Звезда', category: 'Награды', icon: FaStar, defaultColor: '#FFD700' },
    FaAward: { name: 'Награда', category: 'Награды', icon: FaAward, defaultColor: '#FFD700' },
    FaTrophy: { name: 'Трофей', category: 'Награды', icon: FaTrophy, defaultColor: '#FFD700' },
    FaMedal: { name: 'Медаль', category: 'Награды', icon: FaMedal, defaultColor: '#C0C0C0' },

    FaHeart: { name: 'Сердце', category: 'Эмоции', icon: FaHeart, defaultColor: '#F44336' },
    FaThumbsUp: { name: 'Палец вверх', category: 'Эмоции', icon: FaThumbsUp, defaultColor: '#4CAF50' },
    FaHandshake: { name: 'Рукопожатие', category: 'Эмоции', icon: FaHandshake, defaultColor: '#FF9800' },
    FaUserTie: { name: 'Руководитель', category: 'Эмоции', icon: FaUserTie, defaultColor: '#2196F3' },
    FaUsers: { name: 'Пользователи', category: 'Эмоции', icon: FaUsers, defaultColor: '#4CAF50' },

    FaClock: { name: 'Часы', category: 'Время', icon: FaClock, defaultColor: '#607D8B' },
    FaRocket: { name: 'Ракета', category: 'Скорость', icon: FaRocket, defaultColor: '#F44336' },
    FaBolt: { name: 'Молния', category: 'Скорость', icon: FaBolt, defaultColor: '#FFEB3B' },
    FaTachometerAlt: { name: 'Спидометр', category: 'Скорость', icon: FaTachometerAlt, defaultColor: '#2196F3' },

    FaMoneyBill: { name: 'Деньги', category: 'Финансы', icon: FaMoneyBill, defaultColor: '#4CAF50' },
    FaCoins: { name: 'Монеты', category: 'Финансы', icon: FaCoins, defaultColor: '#FFD700' },
    FaWallet: { name: 'Кошелек', category: 'Финансы', icon: FaWallet, defaultColor: '#607D8B' },
    FaChartLine: { name: 'Рост', category: 'Финансы', icon: FaChartLine, defaultColor: '#4CAF50' },

    FaPhone: { name: 'Телефон', category: 'Коммуникация', icon: FaPhone, defaultColor: '#4CAF50' },
    FaEnvelope: { name: 'Почта', category: 'Коммуникация', icon: FaEnvelope, defaultColor: '#F44336' },
    FaComment: { name: 'Комментарий', category: 'Коммуникация', icon: FaComment, defaultColor: '#2196F3' },
    FaWhatsapp: { name: 'WhatsApp', category: 'Коммуникация', icon: FaWhatsapp, defaultColor: '#25D366' },
    FaTelegram: { name: 'Telegram', category: 'Коммуникация', icon: FaTelegram, defaultColor: '#26A5E4' },

    FaShieldAlt: { name: 'Защита', category: 'Безопасность', icon: FaShieldAlt, defaultColor: '#2196F3' },

    FaTree: { name: 'Дерево', category: 'Природа', icon: FaTree, defaultColor: '#4CAF50' },
    FaLeaf: { name: 'Лист', category: 'Природа', icon: FaLeaf, defaultColor: '#8BC34A' },
    FaSun: { name: 'Солнце', category: 'Природа', icon: FaSun, defaultColor: '#FFD700' },

    FaLightbulb: { name: 'Лампочка', category: 'Идеи', icon: FaLightbulb, defaultColor: '#FFC107' },
    FaGem: { name: 'Драгоценность', category: 'Качество', icon: FaGem, defaultColor: '#00BCD4' }
};

// Маппинг для быстрого доступа
export const iconComponents = Object.fromEntries(
    Object.entries(reactIcons).map(([key, value]) => [key, value.icon])
);

// Объединенная информация об иконках
export const iconInfo = {
    ...Object.fromEntries(
        Object.entries(reactIcons).map(([key, value]) => [
            key,
            { name: value.name, category: value.category, type: 'react', defaultColor: value.defaultColor }
        ])
    ),
    ...Object.fromEntries(
        Object.entries(emojis).map(([emoji, value]) => [
            emoji,
            { name: value.name, category: value.category, type: 'emoji', defaultColor: value.color }
        ])
    )
};

export const iconCategories = [
    'Инструменты',
    'Недвижимость',
    'Награды',
    'Эмоции',
    'Время',
    'Скорость',
    'Финансы',
    'Коммуникация',
    'Безопасность',
    'Природа',
    'Идеи',
    'Качество'
];

// Функция для получения компонента иконки
export const getIconComponent = (iconName) => {
    if (reactIcons[iconName]) {
        return reactIcons[iconName].icon;
    }
    return null;
};

// Функция для проверки является ли иконка эмодзи
export const isEmoji = (iconName) => {
    return iconName && iconName.length <= 2 && !reactIcons[iconName];
};

// Функция для получения цвета иконки
export const getIconColor = (iconName) => {
    if (reactIcons[iconName]) {
        return reactIcons[iconName].defaultColor;
    }
    if (emojis[iconName]) {
        return emojis[iconName].color;
    }
    return '#666';
};