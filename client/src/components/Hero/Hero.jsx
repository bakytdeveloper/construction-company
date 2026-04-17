// components/Hero/Hero.jsx - обновленная версия
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
            setHeroData(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching hero data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!heroData || !heroData.autoPlay) return;

        autoPlayRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroData.slides.filter(s => s.active).length);
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
            return `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${imagePath}`;
        }
        return imagePath;
    };

    if (loading) {
        return <div className="hero-loading">Загрузка...</div>;
    }

    const activeSlides = heroData?.slides?.filter(s => s.active) || [];
    const slide = activeSlides[currentSlide] || activeSlides[0];

    if (!slide) return null;

    const getBackgroundStyle = () => {
        if (slide.bgType === 'gradient') {
            return { background: slide.bgValue };
        }
        return { backgroundImage: `url(${getImageUrl(slide.bgValue)})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    };

    return (
        <section className="hero">
            <div className="hero-background" ref={heroRef} style={getBackgroundStyle()}>
                <div className="hero-overlay"></div>
                <div className="hero-pattern"></div>
            </div>

            <div className="hero-content container" style={{ textAlign: slide.contentPosition || 'center' }}>
                <h1 data-aos="fade-up" data-aos-delay="100" className="hero-title-h1">
                    {slide.title}<br />
                    <span className="gradient-text">{slide.titleHighlight}</span>
                </h1>

                <p data-aos="fade-up" data-aos-delay="200">
                    {slide.description}
                </p>

                <div className="hero-buttons" data-aos="fade-up" data-aos-delay="300">
                    <Link to={slide.buttonLink || '/projects'} className="btn btn-primary">
                        {slide.buttonText || 'Наши проекты'}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </Link>
                </div>

                {slide.showStats && (
                    <div className="hero-stats" data-aos="fade-up" data-aos-delay="400">
                        {slide.stats?.map((stat, idx) => (
                            <React.Fragment key={idx}>
                                <div className="stat-item">
                                    <div className="stat-number">{stat.number}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                                {idx < slide.stats.length - 1 && <div className="stat-divider"></div>}
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
                    >
                        ‹
                    </button>
                    <div className="slider-dots">
                        {activeSlides.map((_, idx) => (
                            <button
                                key={idx}
                                className={`slider-dot ${currentSlide === idx ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(idx)}
                            />
                        ))}
                    </div>
                    <button
                        className="slider-next"
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % activeSlides.length)}
                    >
                        ›
                    </button>
                </div>
            )}

            <div className="hero-scroll-indicator">
                <div className="mouse"></div>
                <div className="arrow-down"></div>
            </div>
        </section>
    );
};

export default Hero;