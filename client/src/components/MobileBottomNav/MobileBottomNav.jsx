// src/components/MobileBottomNav/MobileBottomNav.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MobileBottomNav.css';

const MobileBottomNav = () => {
    const location = useLocation();

    const navItems = [
        {
            path: '/',
            label: 'Главная',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 3L21 9L12 15L3 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <path d="M5 11V19H19V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
            )
        },
        {
            path: '/projects',
            label: 'Проекты',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
            )
        },
        {
            path: '/about',
            label: 'О нас',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            )
        },
        {
            path: '/faq',
            label: 'FAQ',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            )
        },
        {
            path: '/contact',
            label: 'Контакты',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19C22 19.5304 21.7892 20.0391 21.4142 20.4142C21.0391 20.7892 20.5304 21 20 21C16.0993 20.763 12.4202 19.3379 9.46 16.96C9.08893 16.6561 8.74134 16.3255 8.42 15.97C8.03811 15.6139 7.68936 15.2239 7.38 14.8C4.98774 11.8028 3.54321 8.14121 3.28 4.3C3.27222 3.77948 3.47289 3.27771 3.83679 2.90245C4.20069 2.5272 4.69616 2.3108 5.22 2.3H8.08C8.3113 2.29811 8.53927 2.35767 8.74028 2.47278C8.94129 2.58789 9.10851 2.75484 9.224 2.956C9.53673 3.47272 9.77162 4.03633 9.92 4.63C10.0697 5.23963 10.1394 5.86636 10.13 6.5C10.1255 6.91565 10.0445 7.32664 9.89 7.71L9.31 9.04C9.25099 9.17456 9.22887 9.3221 9.24599 9.46789C9.26311 9.61368 9.31884 9.75213 9.407 9.87C10.4319 11.3081 11.6901 12.5646 13.13 13.59C13.2479 13.6782 13.3863 13.7339 13.5321 13.751C13.6779 13.7681 13.8254 13.746 13.96 13.687L15.29 13.107C15.6734 12.9524 16.0843 12.8715 16.5 12.867C17.1336 12.8576 17.7603 12.9273 18.37 13.077C18.9637 13.2254 19.5273 13.4603 20.044 13.773C20.2452 13.8885 20.4121 14.0557 20.5272 14.2567C20.6423 14.4577 20.7019 14.6857 20.7 14.917L20.7 17.78C20.6892 18.3038 20.4728 18.7993 20.0975 19.1632C19.7222 19.5271 19.2202 19.7278 18.7 19.72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
            )
        }
    ];

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <nav className="mobile-bottom-nav" role="navigation" aria-label="Мобильная навигация">
            {navItems.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`mobile-nav-item ${isActive(item.path)}`}
                    aria-label={item.label}
                    aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                    <span className="mobile-nav-icon" aria-hidden="true">
                        {item.icon}
                    </span>
                    <span className="mobile-nav-label">{item.label}</span>
                </Link>
            ))}
        </nav>
    );
};

export default MobileBottomNav;