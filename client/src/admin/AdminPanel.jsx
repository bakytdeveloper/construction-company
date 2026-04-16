// src/admin/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import {Routes, Route, Navigate, useLocation} from 'react-router-dom'; // Убираем BrowserRouter
import { Toaster } from 'react-hot-toast';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ComplexesManager from './pages/ComplexesManager';
import PropertiesManager from './pages/PropertiesManager';
import MessagesManager from './pages/MessagesManager';
import './AdminPanel.css';

const AdminPanel = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const location = useLocation();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        scrollToTop();
    }, [location.search]);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <div className="ap-loading">Загрузка...</div>;
    }

    // Если не авторизован, показываем страницу логина
    if (!isAuthenticated) {
        return <Login onLogin={() => setIsAuthenticated(true)} />;
    }

    // Если авторизован, показываем админ-панель с вложенными маршрутами
    return (
        <>
            <Toaster position="top-right" />
            <AdminLayout onLogout={() => setIsAuthenticated(false)}>
                <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="complexes" element={<ComplexesManager />} />
                    <Route path="properties" element={<PropertiesManager />} />
                    <Route path="messages" element={<MessagesManager />} />
                </Routes>
            </AdminLayout>
        </>
    );
};

export default AdminPanel;