import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import SEO from '../../components/SEO/SEO';
import './ProjectDetailPage.css';

const PropertyDetailPage = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showContactForm, setShowContactForm] = useState(false);
    const [contactData, setContactData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchProperty();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchProperty = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/properties/${id}`);
            setProperty(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching property:', error);
            setLoading(false);
        }
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        try {
            const formData = {
                ...contactData,
                projectType: property?.propertyType || 'other',
                message: `${contactData.message}\n\nОбъект: ${property?.title}\nЛокация: ${property?.location}\nЦена: ${property?.price?.toLocaleString()} ₸`
            };

            await axios.post(`${process.env.REACT_APP_API_URL}/contact/submit`, formData);
            toast.success('Заявка отправлена! Специалист свяжется с вами.');
            setShowContactForm(false);
            setContactData({ name: '', phone: '', email: '', message: '' });
        } catch (error) {
            toast.error('Ошибка при отправке. Попробуйте позже.');
        } finally {
            setSending(false);
        }
    };

    const getPropertyTypeName = (type) => {
        const names = {
            apartment: 'Квартира',
            commercial: 'Коммерческая недвижимость',
            house: 'Частный дом',
            land: 'Земельный участок',
            parking: 'Парковочное место',
            storage: 'Кладовое помещение'
        };
        return names[type] || type;
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

    const getStatusText = (status) => {
        const statusMap = {
            'ready': 'Готовая к продаже',
            'under_construction': 'На стадии строительства',
            'planned': 'План будущей постройки',
            'sold': 'Продана'
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
        const classMap = {
            'ready': 'pd-status-ready',
            'under_construction': 'pd-status-construction',
            'planned': 'pd-status-planned',
            'sold': 'pd-status-sold'
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
            <div className="pd-loading">
                <div className="pd-loader"></div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="pd-not-found">
                <div className="pd-not-found-content">
                    <span>🔍</span>
                    <h2>Объект не найден</h2>
                    <p>К сожалению, запрашиваемый объект недвижимости не существует или был удален</p>
                    <Link to="/projects" className="pd-btn pd-btn-primary">Вернуться к списку</Link>
                </div>
            </div>
        );
    }

    const allImages = [property.mainImage, ...(property.images || [])].filter((v, i, a) => a.indexOf(v) === i);

    return (
        <>
            <SEO
                title={`${property.title} - ${getPropertyTypeName(property.propertyType)} в Алматы`}
                description={property.description?.substring(0, 160)}
                url={`/property/${id}`}
            />

            <div className="pd-property-detail">
                {/* Hero Section с фиксированным фоном */}
                <section className="pd-hero">
                    <div className="pd-hero-bg">
                        <img src={getImageUrl(property.mainImage)} alt={property.title} />
                        <div className="pd-hero-overlay"></div>
                    </div>
                    <div className="pd-container">
                        <div className="pd-hero-content">
                            <div className="pd-breadcrumbs">
                                <Link to="/">Главная</Link>
                                <span>/</span>
                                <Link to="/projects">Недвижимость</Link>
                                <span>/</span>
                                <span>{property.title}</span>
                            </div>
                            <div className={`pd-status-badge ${getStatusClass(property.status)}`}>
                                {getStatusText(property.status)}
                            </div>
                            <h1>{property.title}</h1>
                            <div className="pd-hero-meta">
                                <div className="pd-meta-item">
                                    <span className="pd-meta-icon">📍</span>
                                    <span>{property.location}</span>
                                </div>
                                <div className="pd-meta-item">
                                    <span className="pd-meta-icon">📐</span>
                                    <span>{property.area} м²</span>
                                </div>
                                <div className="pd-meta-item pd-price">
                                    <span className="pd-meta-icon">💰</span>
                                    <span>{property.price.toLocaleString()} ₸</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Gallery Section */}
                <section className="pd-gallery">
                    <div className="pd-container">
                        <div className="pd-gallery-wrapper">
                            <div className="pd-gallery-main">
                                <img
                                    src={getImageUrl(allImages[selectedImage])}
                                    alt={property.title}
                                />
                                {allImages.length > 1 && (
                                    <>
                                        <button
                                            className="pd-gallery-nav pd-gallery-prev"
                                            onClick={() => setSelectedImage(prev => (prev - 1 + allImages.length) % allImages.length)}
                                        >
                                            ‹
                                        </button>
                                        <button
                                            className="pd-gallery-nav pd-gallery-next"
                                            onClick={() => setSelectedImage(prev => (prev + 1) % allImages.length)}
                                        >
                                            ›
                                        </button>
                                    </>
                                )}
                            </div>
                            {allImages.length > 1 && (
                                <div className="pd-gallery-thumbs">
                                    {allImages.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`pd-thumb ${selectedImage === index ? 'pd-active' : ''}`}
                                            onClick={() => setSelectedImage(index)}
                                        >
                                            <img src={getImageUrl(image)} alt={`${property.title} ${index + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <div className="pd-main">
                    <div className="pd-container">
                        <div className="pd-grid">
                            {/* Left Column - Description & Features */}
                            <div className="pd-content">
                                {/* Description */}
                                <div className="pd-card">
                                    <h2>Описание объекта</h2>
                                    <p className="pd-description">{property.description}</p>
                                </div>

                                {/* Specifications */}
                                <div className="pd-card">
                                    <h3>Характеристики</h3>
                                    <div className="pd-specs-grid">
                                        <div className="pd-spec-item">
                                            <span className="pd-spec-label">Тип недвижимости</span>
                                            <span className="pd-spec-value">
                                                {getPropertyTypeIcon(property.propertyType)} {getPropertyTypeName(property.propertyType)}
                                            </span>
                                        </div>
                                        <div className="pd-spec-item">
                                            <span className="pd-spec-label">Общая площадь</span>
                                            <span className="pd-spec-value">{property.area} м²</span>
                                        </div>
                                        {property.rooms && (
                                            <div className="pd-spec-item">
                                                <span className="pd-spec-label">Количество комнат</span>
                                                <span className="pd-spec-value">{property.rooms}</span>
                                            </div>
                                        )}
                                        {property.floor && (
                                            <div className="pd-spec-item">
                                                <span className="pd-spec-label">Этаж</span>
                                                <span className="pd-spec-value">{property.floor} / {property.totalFloors || '?'}</span>
                                            </div>
                                        )}
                                        <div className="pd-spec-item">
                                            <span className="pd-spec-label">Статус</span>
                                            <span className={`pd-spec-value ${getStatusClass(property.status)}`}>
                                                {getStatusText(property.status)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Features */}
                                {property.features && property.features.length > 0 && (
                                    <div className="pd-card">
                                        <h3>Особенности объекта</h3>
                                        <div className="pd-features-grid">
                                            {property.features.map((feature, index) => (
                                                <div key={index} className="pd-feature-item">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                    </svg>
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Sidebar */}
                            <div className="pd-sidebar">
                                {/* Price Card */}
                                <div className="pd-price-card">
                                    <div className="pd-price-label">Стоимость</div>
                                    <div className="pd-price-value">{property.price.toLocaleString()} ₸</div>
                                    {property.area && (
                                        <div className="pd-price-per-meter">
                                            ≈ {(property.price / property.area).toLocaleString()} ₸/м²
                                        </div>
                                    )}
                                </div>

                                {/* Contact Form */}
                                {!showContactForm ? (
                                    <div className="pd-contact-card">
                                        <h3>Интересует этот объект?</h3>
                                        <p>Получите детальную консультацию</p>
                                        <button
                                            className="pd-btn pd-btn-primary pd-btn-block"
                                            onClick={() => setShowContactForm(true)}
                                        >
                                            Получить консультацию
                                        </button>
                                        <div className="pd-contact-alternative">
                                            <p>Или позвоните нам:</p>
                                            <a href="tel:+77771234567" className="pd-phone-link">
                                                📞 +7 (777) 123-45-67
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="pd-contact-form-card">
                                        <h3>Быстрая заявка</h3>
                                        <form onSubmit={handleContactSubmit}>
                                            <input
                                                type="text"
                                                placeholder="Ваше имя *"
                                                value={contactData.name}
                                                onChange={(e) => setContactData({...contactData, name: e.target.value})}
                                                required
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Телефон *"
                                                value={contactData.phone}
                                                onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                                                required
                                            />
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                value={contactData.email}
                                                onChange={(e) => setContactData({...contactData, email: e.target.value})}
                                            />
                                            <textarea
                                                placeholder="Ваш вопрос"
                                                rows="3"
                                                value={contactData.message}
                                                onChange={(e) => setContactData({...contactData, message: e.target.value})}
                                            ></textarea>
                                            <button type="submit" className="pd-btn pd-btn-primary pd-btn-block" disabled={sending}>
                                                {sending ? 'Отправка...' : 'Отправить заявку'}
                                            </button>
                                            <button
                                                type="button"
                                                className="pd-btn pd-btn-secondary pd-btn-block"
                                                onClick={() => setShowContactForm(false)}
                                            >
                                                Отмена
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Complex Info Section */}
                {property.residentialComplex && (
                    <section className="pd-complex">
                        <div className="pd-container">
                            <div className="pd-complex-card">
                                <div className="pd-complex-icon">🏢</div>
                                <h3>Жилой комплекс "{property.residentialComplex.title}"</h3>
                                <p>{property.residentialComplex.location}</p>
                                <Link to={`/projects`} className="pd-btn pd-btn-outline">
                                    Посмотреть все объекты в ЖК
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
};

export default PropertyDetailPage;