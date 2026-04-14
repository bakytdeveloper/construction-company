import React, { useRef, useState } from 'react';
import './Testimonials.css';

const Testimonials = () => {
    const scrollRef = useRef(null);
    const [activeId, setActiveId] = useState(null);

    const testimonials = [
        {
            id: 1,
            name: 'Аскар Нуржанов',
            position: 'Владелец дома, мкр. Нурсая',
            rating: 5,
            text: 'Огромное спасибо команде за профессионализм! Построили дом нашей мечты точно в срок. Отдельно хочу отметить внимание к деталям и качество материалов. Рекомендую!',
            shortText: 'Огромное спасибо команде за профессионализм! Построили дом нашей мечты точно в срок...',
            image: 'https://randomuser.me/api/portraits/men/1.jpg',
            project: 'Коттедж 350 м²'
        },
        {
            id: 2,
            name: 'Гульнара Садвакасова',
            position: 'Квартира в ЖК "Алмалы"',
            rating: 5,
            text: 'Приобрели квартиру в новостройке. Очень довольны качеством отделки и планировкой. Застройщик выполнил все обязательства в срок. Спасибо!',
            shortText: 'Приобрели квартиру в новостройке. Очень довольны качеством отделки и планировкой...',
            image: 'https://randomuser.me/api/portraits/women/2.jpg',
            project: 'Квартира 120 м²'
        },
        {
            id: 3,
            name: 'Ерлан Мукашев',
            position: 'Директор компании',
            rating: 5,
            text: 'Заказывали строительство офисного здания. Работа выполнена на высшем уровне. Команда профессионалов, всегда на связи, решают все вопросы оперативно.',
            shortText: 'Заказывали строительство офисного здания. Работа выполнена на высшем уровне...',
            image: 'https://randomuser.me/api/portraits/men/3.jpg',
            project: 'Бизнес-центр'
        },
        {
            id: 4,
            name: 'Айгуль Жумабаева',
            position: 'Семейная пара',
            rating: 5,
            text: 'Спасибо за наш уютный дом! Всё сделано с душой и вниманием к нашим пожеланиям. Даже соседи завидуют :) Обязательно будем рекомендовать вас друзьям!',
            shortText: 'Спасибо за наш уютный дом! Всё сделано с душой и вниманием к нашим пожеланиям...',
            image: 'https://randomuser.me/api/portraits/women/4.jpg',
            project: 'Таунхаус 180 м²'
        }
    ];

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const toggleCard = (id) => {
        // Просто переключаем активную карточку
        setActiveId(activeId === id ? null : id);
    };

    return (
        <section className="testimonials">
            <div className="container">
                <div className="section-header" data-aos="fade-up">
                    <span className="section-subtitle">Отзывы клиентов</span>
                    <h2>Что говорят о нас</h2>
                    <p className="section-description">
                        Более 98% наших клиентов рекомендуют нас своим друзьям и знакомым
                    </p>
                </div>

                <div className="testimonials-wrapper">
                    <button className="scroll-btn scroll-left" onClick={() => scroll('left')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>

                    <div className="testimonials-scroll" ref={scrollRef}>
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={testimonial.id}
                                className={`testimonial-card ${activeId === testimonial.id ? 'active' : ''}`}
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                onClick={() => toggleCard(testimonial.id)}
                            >
                                <div className="testimonial-quote">“</div>
                                <div className="testimonial-content">
                                    <div className="testimonial-text-wrapper">
                                        <p className="testimonial-text">
                                            {activeId === testimonial.id ? testimonial.text : testimonial.shortText}
                                        </p>
                                    </div>
                                    {activeId !== testimonial.id && (
                                        <div className="read-more-hint">
                                            <span>Нажмите, чтобы прочитать полностью</span>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                        </div>
                                    )}
                                    {activeId === testimonial.id && (
                                        <div className="read-less-hint">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M7 11L12 6L17 11M7 18L12 13L17 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                            <span>Свернуть</span>
                                        </div>
                                    )}
                                    <div className="testimonial-rating">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <span key={i} className="star">★</span>
                                        ))}
                                    </div>
                                    <div className="testimonial-author">
                                        <img src={testimonial.image} alt={testimonial.name} />
                                        <div className="author-info">
                                            <h4>{testimonial.name}</h4>
                                            <p>{testimonial.position}</p>
                                            <span className="project-name">{testimonial.project}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="scroll-btn scroll-right" onClick={() => scroll('right')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                <div className="testimonials-stats">
                    <div className="stat-badge">
                        <span className="stat-value">4.9</span>
                        <span className="stat-stars">★★★★★</span>
                        <span className="stat-reviews">на основе 127 отзывов</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;