import React, { useState } from 'react';
import './Services.css';

const Services = () => {
    const [hoveredCard, setHoveredCard] = useState(null);

    const services = [
        {
            icon: '🏠',
            title: 'Строительство домов',
            titleKz: 'Үй құрылысы',
            description: 'Строительство частных домов под ключ. Индивидуальные проекты, современные материалы, гарантия 10 лет.',
            features: ['Под ключ', 'Энергоэффективные', 'Современный дизайн'],
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
            icon: '🏢',
            title: 'Продажа квартир',
            titleKz: 'Пәтер сату',
            description: 'Элитные квартиры в новостройках Алматы. Панорамные виды, развитая инфраструктура, отделка премиум-класса.',
            features: ['От застройщика', 'Выгодные цены', 'Рассрочка'],
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
            icon: '🏭',
            title: 'Коммерческая недвижимость',
            titleKz: 'Коммерциялық жылжымайтын мүлік',
            description: 'Офисы, торговые помещения, складские комплексы. Лучшие локации для вашего бизнеса.',
            features: ['Высокая проходимость', 'Парковка', 'Гибкие условия'],
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
            icon: '🔧',
            title: 'Ремонт и отделка',
            titleKz: 'Жөндеу және әрлеу',
            description: 'Евроремонт, дизайн-проекты, отделка под ключ. Работаем с любыми помещениями.',
            features: ['Дизайн проект', 'Евростандарт', 'Быстрые сроки'],
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        }
    ];

    return (
        <section className="services">
            <div className="services-bg-pattern"></div>
            <div className="container">
                <div className="section-header" data-aos="fade-up">
                    <span className="section-subtitle">Наши услуги</span>
                    <h2>Что мы предлагаем</h2>
                    <p className="section-description">
                        Полный спектр услуг в строительстве и недвижимости. От идеи до готового объекта
                    </p>
                </div>

                <div className="services-grid">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`service-card ${hoveredCard === index ? 'hovered' : ''}`}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="service-inner">
                                <div className="service-front">
                                    <div className="service-icon" style={{ background: service.gradient }}>
                                        <span>{service.icon}</span>
                                    </div>
                                    <h3>{service.title}</h3>
                                    <p className="service-title-kz">{service.titleKz}</p>
                                    <div className="service-hover-trigger">
                                        <span>Узнать больше</span>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                    </div>
                                </div>

                                <div className="service-back">
                                    <div className="service-back-content">
                                        <p className="service-description">{service.description}</p>
                                        <ul className="service-features">
                                            {service.features.map((feature, idx) => (
                                                <li key={idx}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <button className="service-btn">Заказать услугу</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;