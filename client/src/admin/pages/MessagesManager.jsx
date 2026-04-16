// src/admin/pages/MessagesManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {useLocation} from "react-router-dom";

const MessagesManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

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
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/contacts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data.data || []);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Ошибка при загрузке сообщений');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`${process.env.REACT_APP_API_URL}/admin/contacts/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Отмечено как прочитанное');
            fetchMessages();
        } catch (error) {
            toast.error('Ошибка');
        }
    };

    const filteredMessages = messages.filter(message => {
        if (filter === 'unread') return !message.isRead;
        if (filter === 'read') return message.isRead;
        return true;
    });

    if (loading) {
        return <div className="ap-loading">Загрузка...</div>;
    }

    return (
        <div className="ap-manager-page">
            <div className="ap-manager-header">
                <div className="ap-filter-buttons">
                    <button
                        className={`ap-filter-btn ${filter === 'all' ? 'ap-active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        Все ({messages.length})
                    </button>
                    <button
                        className={`ap-filter-btn ${filter === 'unread' ? 'ap-active' : ''}`}
                        onClick={() => setFilter('unread')}
                    >
                        Непрочитанные ({messages.filter(m => !m.isRead).length})
                    </button>
                    <button
                        className={`ap-filter-btn ${filter === 'read' ? 'ap-active' : ''}`}
                        onClick={() => setFilter('read')}
                    >
                        Прочитанные ({messages.filter(m => m.isRead).length})
                    </button>
                </div>
            </div>

            <div className="ap-messages-list">
                {filteredMessages.length === 0 ? (
                    <div className="ap-no-messages">
                        📭 Нет сообщений
                    </div>
                ) : (
                    filteredMessages.map(message => (
                        <div key={message._id} className={`ap-message-card ${!message.isRead ? 'ap-unread' : ''}`}>
                            <div className="ap-message-header">
                                <h3>{message.name}</h3>
                                <span className="ap-message-date">
                                    {new Date(message.createdAt).toLocaleString('ru-RU')}
                                </span>
                            </div>
                            <div className="ap-message-details">
                                <p><strong>Email:</strong> {message.email}</p>
                                <p><strong>Телефон:</strong> {message.phone}</p>
                                <p><strong>Тип проекта:</strong> {message.projectType}</p>
                                <p><strong>Сообщение:</strong> {message.message}</p>
                            </div>
                            {!message.isRead && (
                                <button
                                    className="ap-read-btn"
                                    onClick={() => markAsRead(message._id)}
                                >
                                    ✓ Отметить как прочитанное
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MessagesManager;