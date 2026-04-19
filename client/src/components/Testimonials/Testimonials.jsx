// components/Testimonials/Testimonials.jsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Testimonials.css';

const Testimonials = () => {
    const scrollRef = useRef(null);
    const [activeId, setActiveId] = useState(null);
    const [data, setData] = useState({
        settings: {
            subtitle: 'Отзывы клиентов',
            title: 'Что говорят о нас',
            description: 'Более 98% наших клиентов рекомендуют нас своим друзьям и знакомым',
            statsValue: 4.9,
            statsStars: 5,
            statsReviews: 127
        },
        testimonials: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/testimonials`);
            setData(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            setLoading(false);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const toggleCard = useCallback((id, e) => {
        // Останавливаем всплытие, чтобы не было конфликтов с AOS
        if (e) e.stopPropagation();
        setActiveId(prevId => prevId === id ? null : id);
    }, []);

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        if (imagePath.startsWith('/uploads')) {
            const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || process.env.REACT_APP_IMG_URL;
            return `${baseUrl}${imagePath}`;
        }
        return imagePath;
    };

    const getShortText = (text) => {
        if (!text) return '';
        if (text.length <= 70) return text;
        return text.substring(0, 70) + '...';
    };

    if (loading) {
        return (
            <section className="testimonials">
                <div className="container">
                    <div className="testimonials-loading">Загрузка...</div>
                </div>
            </section>
        );
    }

    return (
        <section className="testimonials">
            <div className="container">
                <div className="section-header" data-aos="fade-up">
                    <span className="section-subtitle">{data.settings.subtitle}</span>
                    <h2>{data.settings.title}</h2>
                    <p className="section-description">{data.settings.description}</p>
                </div>

                <div className="testimonials-wrapper">
                    <button className="scroll-btn scroll-left" onClick={() => scroll('left')} aria-label="Предыдущие отзывы">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>

                    <div className="testimonials-scroll" ref={scrollRef}>
                        {data.testimonials.map((testimonial, index) => (
                            <div
                                key={testimonial._id}
                                className="testimonial-wrapper"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div
                                    className={`testimonial-card ${activeId === testimonial._id ? 'active' : ''}`}
                                    onClick={(e) => toggleCard(testimonial._id, e)}
                                >
                                    <div className="testimonial-quote">“</div>
                                    <div className="testimonial-content">
                                        <div className="testimonial-text-wrapper">
                                            <p className="testimonial-text">
                                                {activeId === testimonial._id
                                                    ? testimonial.text
                                                    : (testimonial.shortText || getShortText(testimonial.text))}
                                            </p>
                                        </div>
                                        {activeId !== testimonial._id && (
                                            <div className="read-more-hint">
                                                <span>Нажмите, чтобы прочитать полностью</span>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                </svg>
                                            </div>
                                        )}
                                        {activeId === testimonial._id && (
                                            <div className="read-less-hint">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M7 11L12 6L17 11M7 18L12 13L17 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                </svg>
                                                <span>Свернуть</span>
                                            </div>
                                        )}
                                        <div className="testimonial-rating">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={`star ${i < testimonial.rating ? 'filled' : ''}`}>★</span>
                                            ))}
                                        </div>
                                        <div className="testimonial-author">
                                            {testimonial.imageType === 'initials' ? (
                                                <div className="author-initials">{getInitials(testimonial.name)}</div>
                                            ) : (
                                                <img src={getImageUrl(testimonial.image)} alt={testimonial.name} />
                                            )}
                                            <div className="author-info">
                                                <h4>{testimonial.name}</h4>
                                                <p>{testimonial.position}</p>
                                                <span className="project-name">{testimonial.project}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="scroll-btn scroll-right" onClick={() => scroll('right')} aria-label="Следующие отзывы">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                <div className="testimonials-stats">
                    <div className="stat-badge">
                        <span className="stat-value">{data.settings.statsValue}</span>
                        <span className="stat-stars">
                            {'★'.repeat(data.settings.statsStars)}
                        </span>
                        <span className="stat-reviews">на основе {data.settings.statsReviews} отзывов</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;