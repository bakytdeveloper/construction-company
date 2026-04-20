// src/admin/components/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children, onLogout }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const location = useLocation();

    const menuItems = [
        { path: '/admin', icon: '📊', label: 'Дашборд' },
        { path: '/admin/complexes', icon: '🏢', label: 'Жилые комплексы' },
        { path: '/admin/properties', icon: '🏠', label: 'Недвижимость' },
        { path: '/admin/messages', icon: '✉️', label: 'Сообщения' },
        { path: '/admin/about', icon: '📄', label: 'О компании' },


        { path: '/admin/hero', icon: '🎨', label: 'Главный баннер' },
        { path: '/admin/services', icon: '🔧', label: 'Услуги' },
        { path: '/admin/advantages', icon: '⭐', label: 'Преимущества' },
        { path: '/admin/faq', icon: '❓', label: 'FAQ' },
        { path: '/admin/stats', icon: '📊', label: 'Статистика' },
        { path: '/admin/testimonials', icon: '💬', label: 'Отзывы' },
        { path: '/admin/contact', icon: '✉️', label: 'Форма связи' },

    ];

    const isActive = (path) => {
        if (path === '/admin' && location.pathname === '/admin') return true;
        if (path !== '/admin' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <div className={`ap-admin-layout ${sidebarCollapsed ? 'ap-collapsed' : ''}`}>
            <aside className="ap-sidebar">
                <div className="ap-sidebar-header">
                    <div className="ap-logo">
                        <span className="ap-logo-icon">🏗️</span>
                        {!sidebarCollapsed && <span className="ap-logo-text">Almaty Build Admin</span>}
                    </div>
                    <button
                        className="ap-sidebar-toggle"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    >
                        {sidebarCollapsed ? '→' : '←'}
                    </button>
                </div>

                <nav className="ap-sidebar-nav">
                    {menuItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`ap-nav-item ${isActive(item.path) ? 'ap-active' : ''}`}
                        >
                            <span className="ap-nav-icon">{item.icon}</span>
                            {!sidebarCollapsed && <span className="ap-nav-label">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="ap-sidebar-footer">
                    <button className="ap-logout-btn" onClick={onLogout}>
                        <span className="ap-nav-icon">🚪</span>
                        {!sidebarCollapsed && <span>Выйти</span>}
                    </button>
                </div>
            </aside>

            <main className="ap-main-content">
                <div className="ap-top-bar">
                    <h1 className="ap-page-title">
                        {menuItems.find(item => isActive(item.path))?.label || 'Админ панель'}
                    </h1>
                </div>
                <div className="ap-content-wrapper">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;