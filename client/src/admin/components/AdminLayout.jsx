// // src/admin/components/AdminLayout.jsx
// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
//
// const AdminLayout = ({ children, onLogout }) => {
//     const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//     const location = useLocation();
//
//     const menuItems = [
//         { path: '/admin', icon: '📊', label: 'Дашборд' },
//         { path: '/admin/complexes', icon: '🏢', label: 'Жилые комплексы' },
//         { path: '/admin/properties', icon: '🏠', label: 'Недвижимость' },
//         { path: '/admin/messages', icon: '✉️', label: 'Сообщения' },
//         { path: '/admin/about', icon: '📄', label: 'О компании' },
//
//
//         { path: '/admin/hero', icon: '🎨', label: 'Главный баннер' },
//         { path: '/admin/services', icon: '🔧', label: 'Услуги' },
//         { path: '/admin/advantages', icon: '⭐', label: 'Преимущества' },
//         { path: '/admin/faq', icon: '❓', label: 'FAQ' },
//         { path: '/admin/stats', icon: '📊', label: 'Статистика' },
//         { path: '/admin/testimonials', icon: '💬', label: 'Отзывы' },
//         { path: '/admin/contact', icon: '✉️', label: 'Форма связи' },
//
//     ];
//
//     const isActive = (path) => {
//         if (path === '/admin' && location.pathname === '/admin') return true;
//         if (path !== '/admin' && location.pathname.startsWith(path)) return true;
//         return false;
//     };
//
//     return (
//         <div className={`ap-admin-layout ${sidebarCollapsed ? 'ap-collapsed' : ''}`}>
//             <aside className="ap-sidebar">
//                 <div className="ap-sidebar-header">
//                     <div className="ap-logo">
//                         <span className="ap-logo-icon">🏗️</span>
//                         {!sidebarCollapsed && <span className="ap-logo-text">Almaty Build Admin</span>}
//                     </div>
//                     <button
//                         className="ap-sidebar-toggle"
//                         onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//                     >
//                         {sidebarCollapsed ? '→' : '←'}
//                     </button>
//                 </div>
//
//                 <nav className="ap-sidebar-nav">
//                     {menuItems.map(item => (
//                         <Link
//                             key={item.path}
//                             to={item.path}
//                             className={`ap-nav-item ${isActive(item.path) ? 'ap-active' : ''}`}
//                         >
//                             <span className="ap-nav-icon">{item.icon}</span>
//                             {!sidebarCollapsed && <span className="ap-nav-label">{item.label}</span>}
//                         </Link>
//                     ))}
//                 </nav>
//
//                 <div className="ap-sidebar-footer">
//                     <button className="ap-logout-btn" onClick={onLogout}>
//                         <span className="ap-nav-icon">🚪</span>
//                         {!sidebarCollapsed && <span>Выйти</span>}
//                     </button>
//                 </div>
//             </aside>
//
//             <main className="ap-main-content">
//                 <div className="ap-top-bar">
//                     <h1 className="ap-page-title">
//                         {menuItems.find(item => isActive(item.path))?.label || 'Админ панель'}
//                     </h1>
//                 </div>
//                 <div className="ap-content-wrapper">
//                     {children}
//                 </div>
//             </main>
//         </div>
//     );
// };
//
// export default AdminLayout;

// src/admin/components/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const AdminLayout = ({ children, onLogout }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [openMenus, setOpenMenus] = useState({
        mainSettings: true // По умолчанию открыт аккордеон настроек главной
    });
    const location = useLocation();

    // Основные пункты меню (без группировки)
    const mainMenuItems = [
        { path: '/admin', icon: '📊', label: 'Дашборд' },
        { path: '/admin/complexes', icon: '🏢', label: 'Жилые комплексы' },
        { path: '/admin/properties', icon: '🏠', label: 'Недвижимость' },
        { path: '/admin/messages', icon: '✉️', label: 'Сообщения' },
        { path: '/admin/about', icon: '📄', label: 'О компании' },
    ];

    // Настройки главной страницы (будут в аккордеоне)
    const mainSettingsItems = [
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

    const toggleMenu = (menuName) => {
        setOpenMenus(prev => ({
            ...prev,
            [menuName]: !prev[menuName]
        }));
    };

    // Проверяем, активен ли какой-либо пункт в аккордеоне
    const isAnySubItemActive = (items) => {
        return items.some(item => location.pathname.startsWith(item.path));
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
                    {/* Основные пункты меню */}
                    {mainMenuItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`ap-nav-item ${isActive(item.path) ? 'ap-active' : ''}`}
                        >
                            <span className="ap-nav-icon">{item.icon}</span>
                            {!sidebarCollapsed && <span className="ap-nav-label">{item.label}</span>}
                        </Link>
                    ))}

                    {/* Аккордеон для настроек главной страницы */}
                    {!sidebarCollapsed ? (
                        // Полная версия с аккордеоном
                        <div className="ap-nav-group">
                            <div
                                className={`ap-nav-group-header ${isAnySubItemActive(mainSettingsItems) ? 'ap-active-group' : ''}`}
                                onClick={() => toggleMenu('mainSettings')}
                            >
                                <span className="ap-nav-group-icon">⚙️</span>
                                <span className="ap-nav-group-label">Настройки главной</span>
                                <span className="ap-nav-group-arrow">
                                    {openMenus.mainSettings ? <FaChevronDown /> : <FaChevronRight />}
                                </span>
                            </div>
                            {openMenus.mainSettings && (
                                <div className="ap-nav-submenu">
                                    {mainSettingsItems.map(item => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`ap-nav-subitem ${isActive(item.path) ? 'ap-active' : ''}`}
                                        >
                                            <span className="ap-nav-icon">{item.icon}</span>
                                            <span className="ap-nav-label">{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        // Свернутая версия - показываем иконки отдельных пунктов
                        <>
                            <div className="ap-nav-group-collapsed">
                                <div className="ap-nav-group-collapsed-header">
                                    <span className="ap-nav-icon">⚙️</span>
                                </div>
                            </div>
                            {mainSettingsItems.map(item => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`ap-nav-item ${isActive(item.path) ? 'ap-active' : ''}`}
                                    title={item.label}
                                >
                                    <span className="ap-nav-icon">{item.icon}</span>
                                </Link>
                            ))}
                        </>
                    )}
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
                        {getPageTitle(location.pathname, mainMenuItems, mainSettingsItems)}
                    </h1>
                </div>
                <div className="ap-content-wrapper">
                    {children}
                </div>
            </main>
        </div>
    );
};

// Функция для получения заголовка страницы
const getPageTitle = (path, mainMenuItems, mainSettingsItems) => {
    const allItems = [...mainMenuItems, ...mainSettingsItems];
    const currentItem = allItems.find(item => path.startsWith(item.path));
    return currentItem?.label || 'Админ панель';
};

export default AdminLayout;