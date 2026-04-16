import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../../components/SEO/SEO';
import './ProjectsPage.css';

const ProjectsPage = () => {
    const [allProperties, setAllProperties] = useState([]);
    const [properties, setProperties] = useState([]);
    const [complexes, setComplexes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: 'all',
        complex: 'all',
        status: 'all',
        search: ''
    });

    // Доступные опции для фильтрации (на основе данных)
    const [availableTypes, setAvailableTypes] = useState([]);
    const [availableStatuses, setAvailableStatuses] = useState([]);
    const [availableComplexes, setAvailableComplexes] = useState([]);

    const propertyTypes = [
        { id: 'all', name: 'Вся недвижимость', icon: '🏠' },
        { id: 'apartment', name: 'Квартиры', icon: '🏢' },
        { id: 'commercial', name: 'Коммерческая', icon: '🏭' },
        { id: 'house', name: 'Частные дома', icon: '🏡' },
        { id: 'parking', name: 'Парковки', icon: '🅿️' },
        { id: 'storage', name: 'Кладовые', icon: '📦' }
    ];

    const allStatusTypes = [
        { id: 'all', name: 'Все статусы' },
        { id: 'ready', name: 'Готовая', class: 'pp-status-ready' },
        { id: 'under_construction', name: 'Строится', class: 'pp-status-construction' },
        { id: 'planned', name: 'Планируется', class: 'pp-status-planned' },
        { id: 'sold', name: 'Продана', class: 'pp-status-sold' }
    ];

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, allProperties]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Загружаем все объекты недвижимости без фильтров
            const propertiesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/properties`);
            const allProps = propertiesResponse.data.data || [];
            setAllProperties(allProps);

            // Загружаем ЖК
            const complexesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/complexes`);
            const allComplexes = complexesResponse.data.data || [];
            setComplexes(allComplexes);

            // Анализируем доступные типы недвижимости
            const typesSet = new Set();
            const statusesSet = new Set();
            const complexesSet = new Set();

            allProps.forEach(prop => {
                if (prop.propertyType) typesSet.add(prop.propertyType);
                if (prop.status) statusesSet.add(prop.status);
                if (prop.residentialComplex) complexesSet.add(prop.residentialComplex);
            });

            // Формируем доступные опции для фильтров
            const availableTypesList = propertyTypes.filter(type =>
                type.id === 'all' || typesSet.has(type.id)
            );

            const availableStatusesList = allStatusTypes.filter(status =>
                status.id === 'all' || statusesSet.has(status.id)
            );

            const availableComplexesList = [
                { id: 'all', name: 'Все ЖК', _id: 'all' },
                ...allComplexes.filter(complex => complexesSet.has(complex._id))
            ];

            setAvailableTypes(availableTypesList);
            setAvailableStatuses(availableStatusesList);
            setAvailableComplexes(availableComplexesList);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...allProperties];

        // Фильтр по типу
        if (filters.type !== 'all') {
            filtered = filtered.filter(prop => prop.propertyType === filters.type);
        }

        // Фильтр по ЖК
        if (filters.complex !== 'all') {
            filtered = filtered.filter(prop => prop.residentialComplex === filters.complex);
        }

        // Фильтр по статусу
        if (filters.status !== 'all') {
            filtered = filtered.filter(prop => prop.status === filters.status);
        }

        // Фильтр по поиску
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(prop =>
                prop.title?.toLowerCase().includes(searchLower) ||
                prop.description?.toLowerCase().includes(searchLower) ||
                prop.location?.toLowerCase().includes(searchLower)
            );
        }

        setProperties(filtered);
    };

    const getPropertyTypeIcon = (type) => {
        const icons = {
            apartment: '🏢',
            commercial: '🏭',
            house: '🏡',
            land: '🌾',
            parking: '🅿️',
            storage: '📦'
        };
        return icons[type] || '🏠';
    };

    const getPropertyTypeName = (type) => {
        const names = {
            apartment: 'Квартира',
            commercial: 'Коммерческая',
            house: 'Частный дом',
            land: 'Земельный участок',
            parking: 'Парковка',
            storage: 'Кладовая'
        };
        return names[type] || type;
    };

    const getStatusText = (status) => {
        const statusMap = {
            'ready': 'Готовая',
            'under_construction': 'Строится',
            'planned': 'Планируется',
            'sold': 'Продана'
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
        const classMap = {
            'ready': 'pp-status-ready',
            'under_construction': 'pp-status-construction',
            'planned': 'pp-status-planned',
            'sold': 'pp-status-sold'
        };
        return classMap[status] || '';
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/placeholder-image.jpg';
        if (imagePath.startsWith('http')) return imagePath;
        if (imagePath.startsWith('/uploads')) {
            return `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${imagePath}`;
        }
        return imagePath;
    };

    if (loading) {
        return (
            <div className="pp-loading">
                <div className="pp-loader"></div>
            </div>
        );
    }

    return (
        <>
            <SEO
                title="Недвижимость в Алматы - Квартиры, дома, коммерческая недвижимость"
                description="Продажа квартир в ЖК Алматы, частных домов, коммерческой недвижимости. Большой выбор объектов от застройщика."
                url="/projects"
            />

            <div className="pp-projects-page">
                {/* Hero Section */}
                <section className="pp-hero">
                    <div className="pp-hero-bg"></div>
                    <div className="pp-container">
                        <div className="pp-breadcrumbs">
                            <Link to="/">Главная</Link>
                            <span className="pp-separator">/</span>
                            <span className="pp-current">Недвижимость</span>
                        </div>
                        <div className="pp-projects-page-title">
                            <h1 data-aos="fade-up">Недвижимость в Алматы</h1>
                            <p data-aos="fade-up" data-aos-delay="100">
                                Квартиры, дома, коммерческая недвижимость от застройщика
                            </p>
                        </div>
                    </div>
                </section>

                {/* Filters Section */}
                <section className="pp-filters">
                    <div className="pp-container">
                        <div className="pp-filters-wrapper" data-aos="fade-up">
                            <div className="pp-search-box">
                                <input
                                    className="pp-search-box-input"
                                    type="text"
                                    placeholder="Поиск по названию, локации..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                                />
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 21L16 16M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </div>

                            {/* Тип недвижимости - только доступные */}
                            {availableTypes.length > 1 && (
                                <div className="pp-filter-group">
                                    <div className="pp-filter-buttons">
                                        {availableTypes.map(type => (
                                            <button
                                                key={type.id}
                                                className={`pp-filter-btn ${filters.type === type.id ? 'pp-active' : ''}`}
                                                onClick={() => setFilters({...filters, type: type.id})}
                                            >
                                                <span>{type.icon}</span>
                                                {type.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Жилые комплексы - только те, где есть объекты */}
                            {availableComplexes.length > 1 && (
                                <div className="pp-filter-row">
                                    <div className="pp-filter-item">
                                        <select
                                            value={filters.complex}
                                            onChange={(e) => setFilters({...filters, complex: e.target.value})}
                                            className="pp-select"
                                        >
                                            {availableComplexes.map(complex => (
                                                <option key={complex._id} value={complex._id}>
                                                    {complex.name || complex.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Статус - только доступные */}
                            {availableStatuses.length > 1 && (
                                <div className="pp-filter-item">
                                    <div className="pp-status-buttons">
                                        {availableStatuses.map(status => (
                                            <button
                                                key={status.id}
                                                className={`pp-status-btn ${getStatusClass(status.id)} ${filters.status === status.id ? 'pp-active' : ''}`}
                                                onClick={() => setFilters({...filters, status: status.id})}
                                            >
                                                {status.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Results Section */}
                <section className="pp-results">
                    <div className="pp-container">
                        {properties.length === 0 ? (
                            <div className="pp-no-results">
                                <span>🔍</span>
                                <h3>Объекты не найдены</h3>
                                <p>Попробуйте изменить параметры поиска</p>
                            </div>
                        ) : (
                            <>
                                <div className="pp-results-header">
                                    <div className="pp-results-count">
                                        Найдено: <strong>{properties.length}</strong> объектов
                                    </div>
                                </div>

                                <div className="pp-properties-grid">
                                    {properties.map((property, index) => (
                                        <div
                                            key={property._id}
                                            className="pp-property-card"
                                            data-aos="fade-up"
                                            data-aos-delay={Math.min(index * 50, 300)}
                                        >
                                            <div className="pp-card-image">
                                                <img
                                                    src={getImageUrl(property.mainImage)}
                                                    alt={property.title}
                                                    loading="lazy"
                                                />
                                                <div className={`pp-card-status ${getStatusClass(property.status)}`}>
                                                    {getStatusText(property.status)}
                                                </div>
                                                <div className="pp-card-type">
                                                    {getPropertyTypeIcon(property.propertyType)} {getPropertyTypeName(property.propertyType)}
                                                </div>
                                            </div>
                                            <div className="pp-card-content">
                                                <h3>{property.title}</h3>
                                                <div className="pp-card-location">
                                                    📍 {property.location}
                                                </div>
                                                {property.residentialComplex && (
                                                    <div className="pp-card-complex">
                                                        🏢 {property.residentialComplex.title}
                                                    </div>
                                                )}
                                                <div className="pp-card-specs">
                                                    <div className="pp-spec-item">
                                                        <span>📐</span>
                                                        <span>{property.area} м²</span>
                                                    </div>
                                                    {property.rooms && (
                                                        <div className="pp-spec-item">
                                                            <span>🛏️</span>
                                                            <span>{property.rooms} комн.</span>
                                                        </div>
                                                    )}
                                                    {property.floor && (
                                                        <div className="pp-spec-item">
                                                            <span>🏗️</span>
                                                            <span>{property.floor}{property.totalFloors ? `/${property.totalFloors}` : ''} эт.</span>
                                                        </div>
                                                    )}
                                                    <div className="pp-spec-item pp-price">
                                                        <span>💰</span>
                                                        <span>{property.price.toLocaleString()} ₸</span>
                                                    </div>
                                                </div>
                                                <p className="pp-card-description">
                                                    {property.description?.substring(0, 100)}...
                                                </p>
                                                <Link to={`/property/${property._id}`} className="pp-btn pp-btn-primary">
                                                    Подробнее
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
};

export default ProjectsPage;