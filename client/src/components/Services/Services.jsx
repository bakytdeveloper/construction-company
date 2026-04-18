// components/Services/Services.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Services.css';
import { iconComponents } from '../../admin/components/iconLibrary.js';

const Services = () => {
    const [data, setData] = useState({
        settings: {
            subtitle: 'Наши услуги',
            title: 'Что мы предлагаем',
            description: 'Полный спектр услуг в строительстве и недвижимости. От идеи до готового объекта'
        },
        services: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/services`);
            setData(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching services:', error);
            setLoading(false);
        }
    };

    const getIconComponent = (iconName) => {
        return iconComponents[iconName];
    };

    const renderIcon = (service) => {
        if (service.iconType === 'emoji') {
            return <span>{service.icon || '🏠'}</span>;
        } else if (service.iconType === 'react-icon' && service.reactIconName) {
            const Icon = getIconComponent(service.reactIconName);
            return Icon ? <Icon /> : <span>🏠</span>;
        }
        return <span>🏠</span>;
    };

    const scrollToContact = () => {
        const contactSection = document.querySelector('.contact-form-section');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <section className="services">
                <div className="container">
                    <div className="services-loading">Загрузка...</div>
                </div>
            </section>
        );
    }

    return (
        <section className="services">
            <div className="services-bg-pattern"></div>
            <div className="container">
                <div className="section-header" data-aos="fade-up">
                    <span className="section-subtitle">{data.settings.subtitle}</span>
                    <h2>{data.settings.title}</h2>
                    <p className="section-description">{data.settings.description}</p>
                </div>

                <div className="services-grid">
                    {data.services.map((service, index) => (
                        <div
                            key={service._id}
                            className="service-card"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="service-inner">
                                <div className="service-front">
                                    <div className="service-icon" style={{ background: service.gradient }}>
                                        {renderIcon(service)}
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
                                            {service.features?.map((feature, idx) => (
                                                <li key={idx}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <button className="service-btn" onClick={scrollToContact}>Заказать услугу</button>
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