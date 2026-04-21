// src/admin/pages/MessagesManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation } from "react-router-dom";
import './MessagesManager.css';

const MessagesManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [expandedMessages, setExpandedMessages] = useState({});

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
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/contact/messages`, {
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
            await axios.put(`${process.env.REACT_APP_API_URL}/contact/messages/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Отмечено как прочитанное');
            fetchMessages();
        } catch (error) {
            toast.error('Ошибка');
        }
    };

    const deleteMessage = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить это сообщение?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`${process.env.REACT_APP_API_URL}/contact/messages/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Сообщение удалено');
                fetchMessages();
            } catch (error) {
                toast.error('Ошибка при удалении');
            }
        }
    };

    const toggleMessageExpand = (id) => {
        setExpandedMessages(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const getProjectTypeLabel = (type) => {
        const types = {
            'house': '🏠 Строительство дома',
            'apartment': '🏢 Покупка квартиры',
            'commercial': '🏭 Коммерческая недвижимость',
            'other': '📝 Другое'
        };
        return types[type] || type;
    };

    const truncateText = (text, maxLength = 10) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
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
        <div className="ms-manager-page">
            <div className="ms-manager-header">
                <h2>Управление сообщениями</h2>
                <div className="ms-filter-buttons">
                    <button
                        className={`ms-filter-btn ${filter === 'all' ? 'ms-active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        Все ({messages.length})
                    </button>
                    <button
                        className={`ms-filter-btn ${filter === 'unread' ? 'ms-active' : ''}`}
                        onClick={() => setFilter('unread')}
                    >
                        Непрочитанные ({messages.filter(m => !m.isRead).length})
                    </button>
                    <button
                        className={`ms-filter-btn ${filter === 'read' ? 'ms-active' : ''}`}
                        onClick={() => setFilter('read')}
                    >
                        Прочитанные ({messages.filter(m => m.isRead).length})
                    </button>
                </div>
            </div>

            <div className="ms-messages-list">
                {filteredMessages.length === 0 ? (
                    <div className="ms-no-messages">
                        <span>📭</span>
                        <h3>Нет сообщений</h3>
                        <p>Здесь будут отображаться все заявки с сайта</p>
                    </div>
                ) : (
                    filteredMessages.map(message => {
                        const isExpanded = expandedMessages[message._id];
                        const messageText = message.message || '';
                        const shouldTruncate = messageText.length > 10;
                        const displayText = isExpanded ? messageText : truncateText(messageText);

                        return (
                            <div key={message._id} className={`ms-message-card ${!message.isRead ? 'ms-unread' : ''}`}>
                                <div className="ms-message-header">
                                    <div className="ms-message-user">
                                        <div className="ms-user-avatar">
                                            {message.name?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div className="ms-user-info">
                                            <h3>{message.name}</h3>
                                            <div className="ms-user-contacts">
                                                <span>📧 {message.email}</span>
                                                <span>📞 {message.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ms-message-meta">
                                        <span className="ms-message-date">
                                            {new Date(message.createdAt).toLocaleString('ru-RU')}
                                        </span>
                                        <span className="ms-message-type">
                                            {getProjectTypeLabel(message.projectType)}
                                        </span>
                                    </div>
                                </div>

                                <div className="ms-message-content">
                                    <div className="ms-message-text">
                                        <p>{displayText}</p>
                                        {shouldTruncate && (
                                            <button
                                                className="ms-toggle-btn"
                                                onClick={() => toggleMessageExpand(message._id)}
                                            >
                                                {isExpanded ? 'Свернуть ↑' : 'Развернуть ↓'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="ms-message-actions">
                                    {!message.isRead && (
                                        <button
                                            className="ms-read-btn"
                                            onClick={() => markAsRead(message._id)}
                                        >
                                            ✓ Отметить как прочитанное
                                        </button>
                                    )}
                                    <button
                                        className="ms-delete-btn"
                                        onClick={() => deleteMessage(message._id)}
                                    >
                                        🗑️ Удалить
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MessagesManager;