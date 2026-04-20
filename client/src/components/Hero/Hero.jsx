// components/Hero/Hero.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Hero.css';

const Hero = () => {
    const [heroData, setHeroData] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const heroRef = useRef(null);
    const autoPlayRef = useRef(null);

    useEffect(() => {
        fetchHeroData();
    }, []);

    const fetchHeroData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/hero/content`);
            console.log('Hero data received:', response.data);
            setHeroData(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching hero data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!heroData || !heroData.autoPlay) return;

        const activeSlides = heroData.slides.filter(s => s.active);
        if (activeSlides.length <= 1) return;

        autoPlayRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
        }, heroData.autoPlayInterval || 5000);

        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, [heroData]);

    useEffect(() => {
        const handleParallax = () => {
            if (!heroRef.current) return;
            const scrolled = window.pageYOffset;
            heroRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
        };

        window.addEventListener('scroll', handleParallax);
        return () => window.removeEventListener('scroll', handleParallax);
    }, []);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        if (imagePath.startsWith('/uploads')) {
            const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
            return `${baseUrl}${imagePath}`;
        }
        return imagePath;
    };

    const getBackgroundStyle = (slide) => {
        if (slide.bgType === 'gradient') {
            if (slide.gradientConfig && slide.gradientConfig.color1 && slide.gradientConfig.color2) {
                return {
                    background: `linear-gradient(${slide.gradientConfig.angle || 135}deg, ${slide.gradientConfig.color1} 0%, ${slide.gradientConfig.color2} 100%)`
                };
            }
            return { background: slide.bgValue };
        }
        if (slide.bgType === 'url' || slide.bgType === 'file') {
            const imageUrl = getImageUrl(slide.bgValue);
            return {
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            };
        }
        return {};
    };

    if (loading) {
        return <div className="hero-loading">Загрузка...</div>;
    }

    const activeSlides = heroData?.slides?.filter(s => s.active) || [];
    if (activeSlides.length === 0) return null;

    // Убеждаемся, что currentSlide в пределах массива
    const safeCurrentSlide = currentSlide >= activeSlides.length ? 0 : currentSlide;
    const slide = activeSlides[safeCurrentSlide];

    // Функция для получения класса позиционирования контента
    const getContentPositionClass = (position) => {
        switch (position) {
            case 'left':
                return 'hero-content-left';
            case 'right':
                return 'hero-content-right';
            case 'center':
            default:
                return 'hero-content-center';
        }
    };

    console.log('Current slide:', slide.title, 'bgType:', slide.bgType, 'bgValue:', slide.bgValue);

    return (
        <section className="hero">
            <div className="hero-background" ref={heroRef} style={getBackgroundStyle(slide)}>
                <div className="hero-overlay" style={{
                    background: slide.overlayColor || `rgba(0, 0, 0, ${slide.overlayOpacity || 0.4})`
                }}></div>
                <div className="hero-pattern"></div>
            </div>

            {/* Текстовый контент (заголовок и описание) - позиционируется согласно выбору админа */}
            <div className={`hero-content ${getContentPositionClass(slide.contentPosition || 'center')}`}>
                {/* SEO оптимизация - структурированные данные */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CreativeWork",
                        "name": slide.title + ' ' + slide.titleHighlight,
                        "description": slide.description,
                        "text": slide.title + ' ' + slide.titleHighlight + '. ' + slide.description
                    })}
                </script>

                <h1 data-aos="fade-up" data-aos-delay="100" className="hero-title-h1">
                    <span style={{ color: slide.titleColor || '#ffffff' }}>{slide.title}</span>
                    {slide.titleHighlight && (
                        <>
                            <br />
                            <span style={{ color: slide.titleHighlightColor || '#c9a03d' }}>{slide.titleHighlight}</span>
                        </>
                    )}
                </h1>

                <p data-aos="fade-up" data-aos-delay="200" style={{ color: slide.descriptionColor || 'rgba(255,255,255,0.9)' }}>
                    {slide.description}
                </p>
            </div>

            {/* Кнопки и статистика - всегда по центру на 100% ширины */}
            <div className="hero-slider-btn-state">
                <div className="hero-buttons" data-aos="fade-up" data-aos-delay="300">
                    <Link
                        to={slide.buttonLink || '/projects'}
                        className="btn btn-primary"
                        style={{
                            background: slide.buttonBgColor || '#1a472a',
                            color: slide.buttonTextColor || '#ffffff'
                        }}
                        aria-label={slide.buttonText || 'Наши проекты'}
                    >
                        {slide.buttonText || 'Наши проекты'}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </Link>
                </div>

                {slide.showStats && slide.stats && slide.stats.length > 0 && (
                    <div className="hero-stats" data-aos="fade-up" data-aos-delay="400">
                        {slide.stats.map((stat, idx) => (
                            <React.Fragment key={idx}>
                                <div className="stat-item">
                                    <div className="stat-number">{stat.number}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                                {idx < slide.stats.length - 1 && <div className="stat-divider" aria-hidden="true"></div>}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>

            {activeSlides.length > 1 && (
                <div className="hero-slider-controls">
                    <button
                        className="slider-prev"
                        onClick={() => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
                        aria-label="Предыдущий слайд"
                    >
                        ‹
                    </button>
                    <div className="slider-dots">
                        {activeSlides.map((_, idx) => (
                            <button
                                key={idx}
                                className={`slider-dot ${safeCurrentSlide === idx ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(idx)}
                                aria-label={`Перейти к слайду ${idx + 1}`}
                            />
                        ))}
                    </div>
                    <button
                        className="slider-next"
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % activeSlides.length)}
                        aria-label="Следующий слайд"
                    >
                        ›
                    </button>
                </div>
            )}

            <div className="hero-scroll-indicator" aria-label="Прокрутить вниз">
                <div className="mouse"></div>
                {/*<div className="arrow-down"></div>*/}
            </div>
        </section>
    );
};

export default Hero;





