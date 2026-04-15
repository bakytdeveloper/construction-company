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
            'ready': 'status-ready',
            'under_construction': 'status-construction',
            'planned': 'status-planned',
            'sold': 'status-sold'
        };
        return classMap[status] || '';
    };

    if (loading) {
        return (
            <div className="property-detail-loading">
                <div className="loader"></div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="property-not-found">
                <h2>Объект не найден</h2>
                <Link to="/projects" className="btn btn-primary">Вернуться к списку</Link>
            </div>
        );
    }

    return (
        <>
            <SEO
                title={`${property.title} - ${getPropertyTypeName(property.propertyType)} в Алматы`}
                description={property.description.substring(0, 160)}
                url={`/property/${id}`}
            />

            <div className="property-detail-page">
                <section className="detail-hero">
                    <div className="detail-hero-bg">
                        <img src={property.mainImage.startsWith('http') ? property.mainImage : `${process.env.REACT_APP_IMG_URL}${property.mainImage}`} alt={property.title} />
                        <div className="detail-hero-overlay"></div>
                    </div>
                    <div className="container">
                        <div className="detail-hero-content">
                            <div className="breadcrumbs">
                                <Link to="/">Главная</Link>
                                <span>/</span>
                                <Link to="/projects">Недвижимость</Link>
                                <span>/</span>
                                <span>{property.title}</span>
                            </div>
                            <div className={`hero-status-badge ${getStatusClass(property.status)}`}>
                                {getStatusText(property.status)}
                            </div>
                            <h1 data-aos="fade-up">{property.title}</h1>
                            <div className="detail-badges" data-aos="fade-up" data-aos-delay="100">
                                <span className="badge">📍 {property.location}</span>
                                <span className="badge">📐 {property.area} м²</span>
                                <span className="badge price-badge">💰 {property.price.toLocaleString()} ₸</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="detail-gallery">
                    <div className="container">
                        <div className="gallery-main" data-aos="fade-up">
                            <img
                                src={(property.images?.[selectedImage] || property.mainImage).startsWith('http')
                                    ? (property.images?.[selectedImage] || property.mainImage)
                                    : `${process.env.REACT_APP_IMG_URL}${property.images?.[selectedImage] || property.mainImage}`}
                                alt={property.title}
                            />
                        </div>
                        {property.images && property.images.length > 0 && (
                            <div className="gallery-thumbs" data-aos="fade-up" data-aos-delay="100">
                                {property.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`thumb ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img src={image.startsWith('http') ? image : `${process.env.REACT_APP_IMG_URL}${image}`} alt={`${property.title} ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <section className="detail-info">
                    <div className="container">
                        <div className="info-grid">
                            <div className="info-description" data-aos="fade-right">
                                <h2>Описание объекта</h2>
                                <p>{property.description}</p>

                                <div className="property-specs-detail">
                                    <h3>Характеристики</h3>
                                    <div className="specs-grid">
                                        <div className="spec-item">
                                            <span className="spec-label">Тип недвижимости:</span>
                                            <span className="spec-value">{getPropertyTypeName(property.propertyType)}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label">Общая площадь:</span>
                                            <span className="spec-value">{property.area} м²</span>
                                        </div>
                                        {property.rooms && (
                                            <div className="spec-item">
                                                <span className="spec-label">Количество комнат:</span>
                                                <span className="spec-value">{property.rooms}</span>
                                            </div>
                                        )}
                                        {property.floor && (
                                            <div className="spec-item">
                                                <span className="spec-label">Этаж:</span>
                                                <span className="spec-value">{property.floor} / {property.totalFloors || '?'}</span>
                                            </div>
                                        )}
                                        <div className="spec-item">
                                            <span className="spec-label">Статус:</span>
                                            <span className={`spec-value ${getStatusClass(property.status)}`}>{getStatusText(property.status)}</span>
                                        </div>
                                    </div>
                                </div>

                                {property.features && property.features.length > 0 && (
                                    <>
                                        <h3>Особенности</h3>
                                        <ul className="features-list">
                                            {property.features.map((feature, index) => (
                                                <li key={index}>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>

                            <div className="info-sidebar" data-aos="fade-left">
                                {!showContactForm ? (
                                    <div className="consultation-card">
                                        <h3>Интересует этот объект?</h3>
                                        <p>Получите детальную консультацию</p>
                                        <div className="price-highlight">
                                            <span className="price-label">Стоимость</span>
                                            <span className="price-value">{property.price.toLocaleString()} ₸</span>
                                        </div>
                                        <button
                                            className="btn btn-primary consultation-btn"
                                            onClick={() => setShowContactForm(true)}
                                        >
                                            Получить консультацию
                                        </button>
                                        <div className="contact-alternative">
                                            <p>Или позвоните нам:</p>
                                            <a href="tel:+77771234567">📞 +7 (777) 123-45-67</a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="quick-contact-form">
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
                                            <button type="submit" className="btn btn-primary" disabled={sending}>
                                                {sending ? 'Отправка...' : 'Отправить заявку'}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-cancel"
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
                </section>

                {property.residentialComplex && (
                    <section className="complex-info">
                        <div className="container">
                            <div className="complex-card">
                                <h3>📍 Находится в ЖК "{property.residentialComplex.title}"</h3>
                                <p>{property.residentialComplex.location}</p>
                                <Link to={`/complex/${property.residentialComplex._id}`} className="btn btn-outline">
                                    Посмотреть все объекты в ЖК
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