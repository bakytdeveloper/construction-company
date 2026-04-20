// src/components/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container header-container">
                <Link to="/" className="logo">
                    <div className="logo-icon">🏗️</div>
                    <div className="logo-text">
                        <span className="logo-title">Almaty Build</span>
                        <span className="logo-subtitle">Строительная компания</span>
                    </div>
                </Link>

                {/* Десктопная навигация */}
                <nav className="nav-menu desktop-nav">
                    <ul className="nav-list">
                        <li>
                            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                                Главная
                            </Link>
                        </li>
                        <li>
                            <Link to="/projects" className={`nav-link ${location.pathname === '/projects' ? 'active' : ''}`}>
                                Проекты
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
                                О компании
                            </Link>
                        </li>
                        <li>
                            <Link to="/faq" className={`nav-link ${location.pathname === '/faq' ? 'active' : ''}`}>
                                FAQ
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
                                Контакты
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Телефон - виден на всех устройствах */}
                <a href="tel:+77771234567" className="header-phone">
                    <span className="phone-icon">📞</span>
                    <span className="phone-number">+7 (777) 123-45-67</span>
                </a>
            </div>
        </header>
    );
};

export default Header;