// src/admin/pages/FAQManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './FAQManager.css';

const FAQManager = () => {
    const [faqs, setFaqs] = useState([]);
    const [settings, setSettings] = useState({
        subtitle: 'Часто задаваемые вопросы',
        title: 'Ответы на популярные вопросы',
        description: 'Мы собрали самые частые вопросы наших клиентов',
        ctaTitle: 'Не нашли ответ?',
        ctaDescription: 'Задайте свой вопрос нашему специалисту и получите консультацию',
        ctaButtonText: 'Задать вопрос',
        ctaPhone: '+7 (777) 123-45-67'
    });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [openIndex, setOpenIndex] = useState(null);

    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        order: 0,
        active: true
    });

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/faq/admin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFaqs(response.data.data.faqs || []);
            setSettings(response.data.data.settings || {
                subtitle: 'Часто задаваемые вопросы',
                title: 'Ответы на популярные вопросы',
                description: 'Мы собрали самые частые вопросы наших клиентов',
                ctaTitle: 'Не нашли ответ?',
                ctaDescription: 'Задайте свой вопрос нашему специалисту и получите консультацию',
                ctaButtonText: 'Задать вопрос',
                ctaPhone: '+7 (777) 123-45-67'
            });
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            toast.error('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/faq/settings`, settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Настройки сохранены');
            setShowSettingsModal(false);
            fetchFaqs();
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Ошибка сохранения настроек');
        }
    };

    const handleResetSettings = async () => {
        if (window.confirm('Сбросить настройки к дефолтным значениям?')) {
            const token = localStorage.getItem('adminToken');
            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/faq/settings/reset`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Настройки сброшены');
                setShowSettingsModal(false);
                fetchFaqs();
            } catch (error) {
                console.error('Error resetting settings:', error);
                toast.error('Ошибка сброса настроек');
            }
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('adminToken');

        try {
            if (editingFaq) {
                await axios.put(`${process.env.REACT_APP_API_URL}/faq/${editingFaq._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Вопрос обновлен');
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/faq`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Вопрос создан');
            }
            setShowModal(false);
            resetForm();
            fetchFaqs();
        } catch (error) {
            console.error('Error saving FAQ:', error);
            toast.error(error.response?.data?.error || 'Ошибка сохранения');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Удалить вопрос?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`${process.env.REACT_APP_API_URL}/faq/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Вопрос удален');
                fetchFaqs();
            } catch (error) {
                toast.error('Ошибка при удалении');
            }
        }
    };

    const handleReorder = async (id, direction) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(`${process.env.REACT_APP_API_URL}/faq/${id}/reorder/${direction}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Порядок изменен');
            fetchFaqs();
        } catch (error) {
            console.error('Error reordering:', error);
            toast.error('Ошибка при изменении порядка');
        }
    };

    const handleCreateDefault = async () => {
        if (window.confirm('Это действие перезапишет все существующие вопросы дефолтными. Продолжить?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.post(`${process.env.REACT_APP_API_URL}/faq/default/create`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Дефолтные вопросы созданы');
                fetchFaqs();
            } catch (error) {
                toast.error('Ошибка при создании дефолтных вопросов');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            question: '',
            answer: '',
            order: 0,
            active: true
        });
        setEditingFaq(null);
        setOpenIndex(null);
    };

    const togglePreview = () => {
        setOpenIndex(openIndex === 'preview' ? null : 'preview');
    };

    const renderPreviewCard = () => {
        return (
            <div className="faq-preview-card">
                <h4>Предпросмотр вопроса</h4>
                <div className="faq-preview-item">
                    <div className="faq-preview-question" onClick={togglePreview}>
                        <div className="faq-preview-bullet">•</div>
                        <h3>{formData.question || 'Вопрос...'}</h3>
                        <div className={`faq-preview-arrow ${openIndex === 'preview' ? 'open' : ''}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                    </div>
                    <div className={`faq-preview-answer ${openIndex === 'preview' ? 'open' : ''}`}>
                        <p>{formData.answer || 'Ответ на вопрос...'}</p>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="ap-loading">Загрузка...</div>;
    }

    return (
        <div className="faq-manager-page">
            <div className="faq-manager-header">
                <h2>Управление FAQ</h2>
                <div className="faq-header-buttons">
                    <button className="ap-create-btn" onClick={() => setShowSettingsModal(true)}>
                        ⚙️ Настройки секции
                    </button>
                    {faqs.length > 0 && (
                        <button className="ap-create-btn" onClick={handleCreateDefault}>
                            🔄 Восстановить дефолтные
                        </button>
                    )}
                    <button className="ap-create-btn" onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}>
                        + Добавить вопрос
                    </button>
                </div>
            </div>

            {faqs.length === 0 ? (
                <div className="faq-empty-state">
                    <span>❓</span>
                    <h3>Нет добавленных вопросов</h3>
                    <p>Нажмите "Восстановить дефолтные" чтобы создать стандартные вопросы, или добавьте свои.</p>
                    <button className="ap-create-btn" onClick={handleCreateDefault}>
                        Восстановить дефолтные вопросы
                    </button>
                </div>
            ) : (
                <div className="faq-items-list">
                    {faqs.map((faq, index) => (
                        <div key={faq._id} className="faq-item-card">
                            <div className="faq-item-header">
                                <div className="faq-item-bullet">•</div>
                                <div className="faq-item-content">
                                    <h3>{faq.question}</h3>
                                    <div className="faq-item-meta">
                                        <span className="faq-item-order">Порядок: {faq.order}</span>
                                        <span className={`faq-item-status ${faq.active ? 'active' : 'inactive'}`}>
                                            {faq.active ? 'Активен' : 'Неактивен'}
                                        </span>
                                    </div>
                                </div>
                                <div className="faq-item-actions">
                                    <button
                                        className="faq-move-up"
                                        onClick={() => handleReorder(faq._id, 'up')}
                                        disabled={index === 0}
                                        title="Переместить вверх"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        className="faq-move-down"
                                        onClick={() => handleReorder(faq._id, 'down')}
                                        disabled={index === faqs.length - 1}
                                        title="Переместить вниз"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        className="faq-edit-btn"
                                        onClick={() => {
                                            setEditingFaq(faq);
                                            setFormData({
                                                question: faq.question,
                                                answer: faq.answer,
                                                order: faq.order,
                                                active: faq.active
                                            });
                                            setShowModal(true);
                                        }}
                                        title="Редактировать"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="faq-delete-btn"
                                        onClick={() => handleDelete(faq._id)}
                                        title="Удалить"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            <div className="faq-item-answer">
                                <p>{faq.answer.substring(0, 150)}...</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal для настроек секции */}
            {showSettingsModal && (
                <div className="ap-modal-overlay" onClick={() => setShowSettingsModal(false)}>
                    <div className="ap-modal ap-modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="ap-modal-header">
                            <h2>Настройки секции FAQ</h2>
                            <button className="ap-modal-close" onClick={() => setShowSettingsModal(false)}>✕</button>
                        </div>
                        <div className="ap-modal-body">
                            <div className="ap-dynamic-form">
                                <div className="ap-form-group">
                                    <label>Подзаголовок</label>
                                    <input
                                        type="text"
                                        value={settings.subtitle}
                                        onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                                        placeholder="Часто задаваемые вопросы"
                                    />
                                </div>
                                <div className="ap-form-group">
                                    <label>Заголовок</label>
                                    <input
                                        type="text"
                                        value={settings.title}
                                        onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                                        placeholder="Ответы на популярные вопросы"
                                    />
                                </div>
                                <div className="ap-form-group">
                                    <label>Описание</label>
                                    <textarea
                                        value={settings.description}
                                        onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                                        rows="2"
                                        placeholder="Мы собрали самые частые вопросы наших клиентов"
                                    />
                                </div>
                                <div className="ap-form-group">
                                    <label>Заголовок CTA блока</label>
                                    <input
                                        type="text"
                                        value={settings.ctaTitle}
                                        onChange={(e) => setSettings({ ...settings, ctaTitle: e.target.value })}
                                        placeholder="Не нашли ответ?"
                                    />
                                </div>
                                <div className="ap-form-group">
                                    <label>Описание CTA блока</label>
                                    <textarea
                                        value={settings.ctaDescription}
                                        onChange={(e) => setSettings({ ...settings, ctaDescription: e.target.value })}
                                        rows="2"
                                        placeholder="Задайте свой вопрос нашему специалисту и получите консультацию"
                                    />
                                </div>
                                <div className="ap-form-row">
                                    <div className="ap-form-group">
                                        <label>Текст кнопки CTA</label>
                                        <input
                                            type="text"
                                            value={settings.ctaButtonText}
                                            onChange={(e) => setSettings({ ...settings, ctaButtonText: e.target.value })}
                                            placeholder="Задать вопрос"
                                        />
                                    </div>
                                    <div className="ap-form-group">
                                        <label>Телефон CTA</label>
                                        <input
                                            type="text"
                                            value={settings.ctaPhone}
                                            onChange={(e) => setSettings({ ...settings, ctaPhone: e.target.value })}
                                            placeholder="+7 (777) 123-45-67"
                                        />
                                    </div>
                                </div>

                                <div className="ap-form-actions">
                                    <button type="button" className="ap-btn-primary" onClick={handleSaveSettings}>
                                        💾 Сохранить
                                    </button>
                                    <button type="button" className="ap-btn-secondary" onClick={handleResetSettings}>
                                        🔄 Сбросить
                                    </button>
                                    <button type="button" className="ap-btn-secondary" onClick={() => setShowSettingsModal(false)}>
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal для создания/редактирования вопроса */}
            {showModal && (
                <div className="ap-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="ap-modal ap-modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="ap-modal-header">
                            <h2>{editingFaq ? 'Редактировать вопрос' : 'Создать вопрос'}</h2>
                            <button className="ap-modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="ap-modal-body">
                            <div className="ap-dynamic-form">
                                <div className="ap-form-group">
                                    <label>Вопрос</label>
                                    <input
                                        type="text"
                                        value={formData.question}
                                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                        placeholder="Введите вопрос..."
                                        required
                                    />
                                </div>

                                <div className="ap-form-group">
                                    <label>Ответ</label>
                                    <textarea
                                        value={formData.answer}
                                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                        rows="5"
                                        placeholder="Введите ответ на вопрос..."
                                        required
                                    />
                                </div>

                                <div className="ap-form-group">
                                    <label className="ap-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                        />
                                        Активен
                                    </label>
                                </div>

                                {renderPreviewCard()}

                                <div className="ap-form-actions">
                                    <button type="button" className="ap-btn-primary" onClick={handleSave}>
                                        💾 Сохранить
                                    </button>
                                    <button type="button" className="ap-btn-secondary" onClick={() => setShowModal(false)}>
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FAQManager;