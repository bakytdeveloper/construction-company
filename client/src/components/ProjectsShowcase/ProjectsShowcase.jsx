import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import './ProjectsShowcase.css';

Modal.setAppElement('#root');

const ProjectsShowcase = () => {
    const [complexes, setComplexes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplex, setSelectedComplex] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchComplexes();
    }, []);

    const fetchComplexes = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/complexes`);
            setComplexes(response.data.data.slice(0, 6));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching complexes:', error);
            setLoading(false);
        }
    };

    const openModal = (complex) => {
        setSelectedComplex(complex);
        setCurrentImageIndex(0);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedComplex(null);
        setCurrentImageIndex(0);
    };

    const scrollToContactForm = () => {
        closeModal();
        setTimeout(() => {
            const contactSection = document.querySelector('.contact-form-section');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 300);
    };

    const getStatusText = (status) => {
        const statusMap = {
            'completed': { text: 'Построен', icon: '🏗️', class: 'ps-status-completed' },
            'under_construction': { text: 'Строится', icon: '🔨', class: 'ps-status-construction' },
            'planned': { text: 'Планируется', icon: '📋', class: 'ps-status-planned' }
        };
        return statusMap[status] || { text: status, icon: '🏠', class: '' };
    };

    const nextImage = () => {
        const allImages = getAllImages();
        if (allImages.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
        }
    };

    const prevImage = () => {
        const allImages = getAllImages();
        if (allImages.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
        }
    };

    const getAllImages = () => {
        if (!selectedComplex) return [];
        const images = [];
        if (selectedComplex.mainImage) images.push(selectedComplex.mainImage);
        if (selectedComplex.images && selectedComplex.images.length > 0) {
            images.push(...selectedComplex.images);
        }
        return [...new Set(images)];
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/placeholder-image.jpg';
        if (imagePath.startsWith('http')) return imagePath;
        if (imagePath.startsWith('/uploads')) {
            return `${process.env.REACT_APP_API_URL?.replace('/api', '') || process.env.REACT_APP_IMG_URL}${imagePath}`;
        }
        return imagePath;
    };

    if (loading) {
        return (
            <div className="ps-loading">
                <div className="ps-loader"></div>
            </div>
        );
    }

    return (
        <section className="ps-projects-showcase">
            <div className="ps-container">
                <div className="ps-section-header" data-aos="fade-up">
                    <span className="ps-section-subtitle">Наши Жилые Комплексы</span>
                    <h2>Лучшие ЖК Алматы</h2>
                    <p className="ps-section-description">
                        Современные жилые комплексы с развитой инфраструктурой
                    </p>
                </div>

                <div className="ps-projects-grid">
                    {complexes.map((complex, index) => {
                        const status = getStatusText(complex.status);
                        return (
                            <div
                                key={complex._id}
                                className="ps-project-card"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                onClick={() => openModal(complex)}
                            >
                                <div className="ps-project-image-wrapper">
                                    <img
                                        src={getImageUrl(complex.mainImage)}
                                        alt={complex.title}
                                        loading="lazy"
                                    />
                                    <div className="ps-project-status-badge">
                                        <span>{status.icon} {status.text}</span>
                                    </div>
                                    <div className="ps-project-overlay">
                                        <div className="ps-project-overlay-content">
                                            <button className="ps-project-view-btn">
                                                Подробнее о ЖК
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="ps-project-info">
                                    <h3>{complex.title}</h3>
                                    <div className="ps-project-meta">
                                        <span>📍 {complex.location}</span>
                                        {complex.specifications?.apartments && (
                                            <span>🏢 {complex.specifications.apartments.toLocaleString()} кв.</span>
                                        )}
                                        {complex.specifications?.floors && (
                                            <span>🏗️ {complex.specifications.floors} эт.</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="ps-projects-cta" data-aos="fade-up">
                    <Link to="/projects" className="ps-btn ps-btn-primary">
                        Вся недвижимость
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Modal для детального просмотра ЖК */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="ps-modal"
                overlayClassName="ps-modal-overlay"
            >
                {selectedComplex && (() => {
                    const status = getStatusText(selectedComplex.status);
                    const allImages = getAllImages();
                    const currentImage = allImages[currentImageIndex];

                    return (
                        <div className="ps-modal-content">
                            <button className="ps-modal-close" onClick={closeModal}>×</button>

                            {/* Галерея изображений */}
                            <div className="ps-modal-gallery">
                                <div className="ps-gallery-main">
                                    <img
                                        src={getImageUrl(currentImage)}
                                        alt={selectedComplex.title}
                                        className="ps-modal-main-image"
                                    />
                                    {allImages.length > 1 && (
                                        <>
                                            <button className="ps-gallery-nav ps-gallery-prev" onClick={prevImage}>
                                                ‹
                                            </button>
                                            <button className="ps-gallery-nav ps-gallery-next" onClick={nextImage}>
                                                ›
                                            </button>
                                        </>
                                    )}
                                </div>
                                {allImages.length > 1 && (
                                    <div className="ps-modal-thumbnails">
                                        {allImages.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={getImageUrl(img)}
                                                alt={`${selectedComplex.title} ${idx + 1}`}
                                                className={`ps-modal-thumb ${currentImageIndex === idx ? 'ps-active' : ''}`}
                                                onClick={() => setCurrentImageIndex(idx)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Информация о ЖК */}
                            <div className="ps-modal-info">
                                <div className="ps-info-header">
                                    <h2>{selectedComplex.title}</h2>
                                    <span className={`ps-complex-status ${status.class}`}>
                                        {status.icon} {status.text}
                                    </span>
                                </div>

                                <p className="ps-modal-description">{selectedComplex.description}</p>

                                {/* Основные характеристики в виде карточек */}
                                <div className="ps-specs-grid">
                                    {selectedComplex.specifications?.apartments && (
                                        <div className="ps-spec-card">
                                            <div className="ps-spec-icon">🏢</div>
                                            <div className="ps-spec-content">
                                                <span className="ps-spec-label">Квартир</span>
                                                <strong className="ps-spec-value">{selectedComplex.specifications.apartments.toLocaleString()}</strong>
                                            </div>
                                        </div>
                                    )}
                                    {selectedComplex.specifications?.floors && (
                                        <div className="ps-spec-card">
                                            <div className="ps-spec-icon">🏗️</div>
                                            <div className="ps-spec-content">
                                                <span className="ps-spec-label">Этажность</span>
                                                <strong className="ps-spec-value">{selectedComplex.specifications.floors}</strong>
                                            </div>
                                        </div>
                                    )}
                                    {selectedComplex.specifications?.parking && (
                                        <div className="ps-spec-card">
                                            <div className="ps-spec-icon">🅿️</div>
                                            <div className="ps-spec-content">
                                                <span className="ps-spec-label">Парковка</span>
                                                <strong className="ps-spec-value">{selectedComplex.specifications.parking} мест</strong>
                                            </div>
                                        </div>
                                    )}
                                    {selectedComplex.specifications?.buildYear && (
                                        <div className="ps-spec-card">
                                            <div className="ps-spec-icon">📅</div>
                                            <div className="ps-spec-content">
                                                <span className="ps-spec-label">Год постройки</span>
                                                <strong className="ps-spec-value">{selectedComplex.specifications.buildYear}</strong>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Локация */}
                                <div className="ps-info-section">
                                    <h3>📍 Расположение</h3>
                                    <div className="ps-location-card">
                                        <p>{selectedComplex.location}</p>
                                    </div>
                                </div>

                                {/* Особенности ЖК */}
                                {selectedComplex.features && selectedComplex.features.length > 0 && (
                                    <div className="ps-info-section">
                                        <h3>✨ Особенности ЖК</h3>
                                        <div className="ps-features-list">
                                            {selectedComplex.features.map((feature, idx) => (
                                                <span key={idx} className="ps-feature-tag">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Инфраструктура рядом */}
                                {selectedComplex.infrastructure && selectedComplex.infrastructure.length > 0 && (
                                    <div className="ps-info-section">
                                        <h3>🏪 Инфраструктура рядом</h3>
                                        <div className="ps-infrastructure-list">
                                            {selectedComplex.infrastructure.map((item, idx) => (
                                                <span key={idx} className="ps-infra-tag">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Кнопка действия */}
                                <button className="ps-btn ps-btn-primary ps-modal-action-btn" onClick={scrollToContactForm}>
                                    Узнать подробнее
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    );
                })()}
            </Modal>
        </section>
    );
};

export default ProjectsShowcase;