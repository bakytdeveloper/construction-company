import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    const heroRef = useRef(null);

    useEffect(() => {
        const handleParallax = (e) => {
            if (!heroRef.current) return;
            const scrolled = window.pageYOffset;
            heroRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
        };

        window.addEventListener('scroll', handleParallax);
        return () => window.removeEventListener('scroll', handleParallax);
    }, []);

    return (
        <section className="hero">
            <div className="hero-background" ref={heroRef}>
                <div className="hero-overlay"></div>
                <div className="hero-pattern"></div>
            </div>

            <div className="hero-content container">
                {/*<div className="hero-badge" data-aos="fade-down">*/}
                {/*    <span className="badge-icon">🏗️</span>*/}
                {/*    <span>Лидер строительства в Алматы с 2012 года</span>*/}
                {/*</div>*/}

                <h1 data-aos="fade-up" data-aos-delay="100">
                    Строим дома вашей<br />
                    <span className="gradient-text">мечты в Алматы</span>
                </h1>

                <p data-aos="fade-up" data-aos-delay="200">
                    Профессиональное строительство домов под ключ, продажа квартир в элитных новостройках.
                    Более 150 сданных объектов, 98% довольных клиентов.
                </p>

                <div className="hero-buttons" data-aos="fade-up" data-aos-delay="300">
                    <Link to="/projects" className="btn btn-primary">
                        Наши проекты
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Link>
                    <button className="btn btn-outline hero-video-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 9.5L3 14.5C3 18 5 20 8.5 20H15.5C19 20 21 18 21 14.5V9.5C21 6 19 4 15.5 4H8.5C5 4 3 6 3 9.5Z" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M9.5 8.5L9.5 15.5C9.5 16.7 10.8 17.4 11.8 16.7L16.5 13.7C17.4 13.1 17.4 11.9 16.5 11.3L11.8 8.3C10.8 7.6 9.5 8.3 9.5 9.5V8.5Z" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        Видео о компании
                    </button>
                </div>

                <div className="hero-stats" data-aos="fade-up" data-aos-delay="400">
                    <div className="stat-item">
                        <div className="stat-number">150+</div>
                        <div className="stat-label">Построенных домов</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <div className="stat-number">98%</div>
                        <div className="stat-label">Довольных клиентов</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <div className="stat-number">12 лет</div>
                        <div className="stat-label">На рынке</div>
                    </div>
                </div>
            </div>

            <div className="hero-scroll-indicator">
                <div className="mouse"></div>
                <div className="arrow-down"></div>
            </div>
        </section>
    );
};

export default Hero;