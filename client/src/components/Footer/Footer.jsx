import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [clickCount, setClickCount] = useState(0);
    const [showAdminHint, setShowAdminHint] = useState(false);
    const [availablePropertyTypes, setAvailablePropertyTypes] = useState([]);

    // Все возможные типы недвижимости с их данными
    const allPropertyTypes = [
        { id: 'apartment', name: 'Квартиры', icon: '🏢', filterParam: 'type=apartment' },
        { id: 'house', name: 'Частные дома', icon: '🏡', filterParam: 'type=house' },
        { id: 'commercial', name: 'Коммерческая', icon: '🏭', filterParam: 'type=commercial' },
        { id: 'parking', name: 'Парковки', icon: '🅿️', filterParam: 'type=parking' },
        { id: 'storage', name: 'Кладовые', icon: '📦', filterParam: 'type=storage' }
    ];

    useEffect(() => {
        fetchAvailableTypes();
    }, []);

    const fetchAvailableTypes = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/properties`);
            const properties = response.data.data || [];

            // Собираем уникальные типы недвижимости, которые есть в базе
            const existingTypes = new Set();
            properties.forEach(prop => {
                if (prop.propertyType) {
                    existingTypes.add(prop.propertyType);
                }
            });

            // Фильтруем только те типы, которые есть в базе
            const available = allPropertyTypes.filter(type =>
                existingTypes.has(type.id)
            );

            setAvailablePropertyTypes(available);
        } catch (error) {
            console.error('Error fetching property types:', error);
            // В случае ошибки показываем все типы
            setAvailablePropertyTypes(allPropertyTypes);
        }
    };

    const handleSecretClick = () => {
        const newCount = clickCount + 1;
        setClickCount(newCount);

        if (newCount === 5) {
            setShowAdminHint(true);
            setTimeout(() => setShowAdminHint(false), 3000);
        }

        if (newCount === 7) {
            window.location.href = '/admin';
            setClickCount(0);
        }

        setTimeout(() => {
            if (clickCount < 7) {
                setClickCount(0);
            }
        }, 5000);
    };

    return (
        <footer className="footer">
            <div className="footer-bg">
                <div className="footer-pattern"></div>
            </div>

            <div className="container">
                <div className="footer-top">
                    <div className="footer-section" data-aos="fade-up">
                        <div className="footer-logo" onClick={handleSecretClick} style={{ cursor: 'pointer' }}>
                            <div className="logo-icon">🏗️</div>
                            <div>
                                <h3>Almaty Build</h3>
                                <p>Строительная компания</p>
                            </div>
                        </div>
                        {showAdminHint && (
                            <div className="admin-hint">
                                🔐 Ещё 2 клика для входа в админ-панель
                            </div>
                        )}
                        <p className="footer-description">
                            Строим дома вашей мечты в Алматы с 2014 года.
                            Более 150 сданных объектов, гарантия качества 10 лет.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link" aria-label="Instagram">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" strokeWidth="2"/>
                                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
                                </svg>
                            </a>
                            <a href="#" className="social-link" aria-label="Facebook">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </a>
                            <a href="#" className="social-link" aria-label="YouTube">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M22.54 6.42C22.4213 5.94541 22.1793 5.51057 21.8387 5.15941C21.498 4.80824 21.0708 4.55318 20.6 4.42C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92925 4.59318 2.50199 4.84824 2.16134 5.19941C1.82068 5.55057 1.57872 5.98541 1.46 6.46C1.14523 8.20556 0.991235 9.97631 1 11.75C0.991235 13.5237 1.14523 15.2944 1.46 17.04C1.57872 17.5146 1.82068 17.9494 2.16134 18.3006C2.50199 18.6518 2.92925 18.9068 3.4 19.04C5.12 19.5 12 19.5 12 19.5C12 19.5 18.88 19.5 20.6 19.04C21.0708 18.9068 21.498 18.6518 21.8387 18.3006C22.1793 17.9494 22.4213 17.5146 22.54 17.04C22.8548 15.2944 23.0088 13.5237 23 11.75C23.0088 9.97631 22.8548 8.20556 22.54 6.42Z" stroke="currentColor" strokeWidth="2"/>
                                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"/>
                                </svg>
                            </a>
                            <a href="#" className="social-link" aria-label="Telegram">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="footer-section" data-aos="fade-up" data-aos-delay="100">
                        <h4>Навигация</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Главная</Link></li>
                            <li><Link to="/projects">Недвижимость</Link></li>
                            <li><Link to="/about">О компании</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/contact">Контакты</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section" data-aos="fade-up" data-aos-delay="200">
                        <h4>Типы недвижимости</h4>
                        <ul className="footer-links">
                            {availablePropertyTypes.length > 0 ? (
                                availablePropertyTypes.map(type => (
                                    <li key={type.id}>
                                        <Link to={`/projects?${type.filterParam}`}>
                                            {type.icon} {type.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                // Показываем заглушку пока загружаются данные
                                <li><span>Загрузка...</span></li>
                            )}
                        </ul>
                    </div>

                    <div className="footer-section" data-aos="fade-up" data-aos-delay="300">
                        <h4>Контакты</h4>
                        <ul className="footer-contacts">
                            <li>
                                <span>📍</span>
                                <span>г. Алматы, ул. Абая 123</span>
                            </li>
                            <li>
                                <span>📞</span>
                                <span>+7 (777) 123-45-67</span>
                            </li>
                            <li>
                                <span>✉️</span>
                                <span>info@almaty-build.kz</span>
                            </li>
                            <li>
                                <span>🕐</span>
                                <span>Пн-Пт: 09:00 - 19:00</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {currentYear} Almaty Build. Все права защищены.</p>
                    <div className="footer-bottom-links">
                        <Link to="/privacy">Политика конфиденциальности</Link>
                        <Link to="/terms">Условия использования</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;