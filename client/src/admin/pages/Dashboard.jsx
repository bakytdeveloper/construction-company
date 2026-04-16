// src/admin/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useLocation} from "react-router-dom";

const Dashboard = () => {
    const [stats, setStats] = useState({
        complexes: 0,
        properties: 0,
        messages: 0,
        unreadMessages: 0
    });
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
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');

            // Правильные URL для админ-панели
            const [complexesRes, propertiesRes, messagesRes] = await Promise.all([
                axios.get(`${process.env.REACT_APP_API_URL}/admin/complexes`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${process.env.REACT_APP_API_URL}/admin/properties`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${process.env.REACT_APP_API_URL}/admin/contacts`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setStats({
                complexes: complexesRes.data.data?.length || 0,
                properties: propertiesRes.data.data?.length || 0,
                messages: messagesRes.data.data?.length || 0,
                unreadMessages: messagesRes.data.data?.filter(m => !m.isRead).length || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { icon: '🏢', label: 'Жилые комплексы', value: stats.complexes, color: '#1a472a' },
        { icon: '🏠', label: 'Объекты недвижимости', value: stats.properties, color: '#c9a03d' },
        { icon: '✉️', label: 'Всего сообщений', value: stats.messages, color: '#3b82f6' },
        { icon: '🔴', label: 'Непрочитанные', value: stats.unreadMessages, color: '#ef4444' },
    ];

    if (loading) {
        return <div className="ap-loading">Загрузка...</div>;
    }

    return (
        <div className="ap-dashboard">
            {statCards.map((card, index) => (
                <div key={index} className="ap-stat-card">
                    <div className="ap-stat-icon" style={{ background: `${card.color}15` }}>
                        {card.icon}
                    </div>
                    <div className="ap-stat-content">
                        <h3>{card.label}</h3>
                        <p className="ap-stat-number">{card.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Dashboard;