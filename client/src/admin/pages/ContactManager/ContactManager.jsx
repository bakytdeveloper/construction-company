// src/admin/pages/ContactManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './ContactManager.css';

const ContactManager = () => {
    const [settings, setSettings] = useState({
        leftPanel: {
            badge: 'Свяжитесь с нами',
            title: 'Получите бесплатную консультацию',
            description: 'Оставьте заявку и наш специалист свяжется с вами в ближайшее время',
            address: 'г. Алматы, ул. Абая 123, БЦ "Алмалы"',
            phone1: '+7 (777) 123-45-67',
            phone2: '+7 (727) 234-56-78',
            email: 'info@almaty-build.kz',
            workHours: 'Пн-Пт: 09:00 - 19:00',
            workHoursSat: 'Сб: 10:00 - 16:00'
        },
        rightPanel: {
            title: 'Оставить заявку',
            description: 'Заполните форму и мы свяжемся с вами',
            buttonText: 'Отправить заявку',
            note: 'Нажимая на кнопку, вы соглашаетесь с политикой обработки персональных данных'
        },
        background: {
            gradientStart: '#0a1a0f',
            gradientEnd: '#1a3a2a',
            overlayOpacity: 0.15
        }
    });
    const [loading, setLoading] = useState(true);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [activeTab, setActiveTab] = useState('settings'); // 'settings' or 'messages'

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/contact/settings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSettings(response.data.data);
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/contact/settings`, settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Настройки сохранены');
            setShowSettingsModal(false);
            fetchSettings();
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Ошибка сохранения настроек');
        }
    };

    const handleResetSettings = async () => {
        if (window.confirm('Сбросить настройки к дефолтным значениям?')) {
            const token = localStorage.getItem('adminToken');
            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/contact/settings/reset`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Настройки сброшены');
                setShowSettingsModal(false);
                fetchSettings();
            } catch (error) {
                console.error('Error resetting settings:', error);
                toast.error('Ошибка сброса настроек');
            }
        }
    };

    const getBackgroundStyle = () => {
        return {
            background: `linear-gradient(135deg, ${settings.background.gradientStart} 0%, ${settings.background.gradientEnd} 100%)`
        };
    };

    const renderPreview = () => {
        return (
            <div className="cf-preview-card">
                <h4>Предпросмотр формы связи</h4>
                <div className="cf-preview-wrapper" style={getBackgroundStyle()}>
                    <div className="cf-preview-overlay" style={{ opacity: settings.background.overlayOpacity }}></div>
                    <div className="cf-preview-container">
                        <div className="cf-preview-grid">
                            {/* Левая панель */}
                            <div className="cf-preview-info">
                                <div className="cf-preview-badge">{settings.leftPanel.badge}</div>
                                <h2>{settings.leftPanel.title}</h2>
                                <p>{settings.leftPanel.description}</p>
                                <div className="cf-preview-info-items">
                                    <div className="cf-preview-info-item">
                                        <div className="cf-preview-icon">📍</div>
                                        <div>
                                            <h4>Адрес</h4>
                                            <p>{settings.leftPanel.address}</p>
                                        </div>
                                    </div>
                                    <div className="cf-preview-info-item">
                                        <div className="cf-preview-icon">📞</div>
                                        <div>
                                            <h4>Телефон</h4>
                                            <p>{settings.leftPanel.phone1}</p>
                                            <p>{settings.leftPanel.phone2}</p>
                                        </div>
                                    </div>
                                    <div className="cf-preview-info-item">
                                        <div className="cf-preview-icon">✉️</div>
                                        <div>
                                            <h4>Email</h4>
                                            <p>{settings.leftPanel.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="cf-preview-hours">
                                    <div className="cf-preview-hours-icon">🕐</div>
                                    <div>
                                        <h4>Режим работы</h4>
                                        <p>{settings.leftPanel.workHours}</p>
                                        <p>{settings.leftPanel.workHoursSat}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Правая панель */}
                            <div className="cf-preview-form">
                                <div className="cf-preview-form-header">
                                    <h3>{settings.rightPanel.title}</h3>
                                    <p>{settings.rightPanel.description}</p>
                                </div>
                                <div className="cf-preview-form-fields">
                                    <div className="cf-preview-field">
                                        <input type="text" placeholder=" " />
                                        <label>Ваше имя *</label>
                                    </div>
                                    <div className="cf-preview-field-row">
                                        <div className="cf-preview-field">
                                            <input type="tel" placeholder=" " />
                                            <label>Телефон *</label>
                                        </div>
                                        <div className="cf-preview-field">
                                            <input type="email" placeholder=" " />
                                            <label>Email *</label>
                                        </div>
                                    </div>
                                    <div className="cf-preview-field">
                                        <select>
                                            <option>🏠 Строительство дома</option>
                                        </select>
                                    </div>
                                    <div className="cf-preview-field">
                                        <textarea rows="3" placeholder=" "></textarea>
                                        <label>Сообщение *</label>
                                    </div>
                                    <button className="cf-preview-btn">{settings.rightPanel.buttonText}</button>
                                    <p className="cf-preview-note">{settings.rightPanel.note}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="ap-loading">Загрузка...</div>;
    }

    return (
        <div className="cf-manager-page">
            <div className="cf-manager-header">
                <h2>Управление формой связи</h2>
                <div className="cf-header-buttons">
                    <button className="ap-create-btn" onClick={() => setShowSettingsModal(true)}>
                        ⚙️ Настройки секции
                    </button>
                </div>
            </div>

            {/* Предпросмотр */}
            {renderPreview()}

            {/* Modal для настроек */}
            {showSettingsModal && (
                <div className="ap-modal-overlay" onClick={() => setShowSettingsModal(false)}>
                    <div className="ap-modal ap-modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="ap-modal-header">
                            <h2>Настройки формы связи</h2>
                            <button className="ap-modal-close" onClick={() => setShowSettingsModal(false)}>✕</button>
                        </div>
                        <div className="ap-modal-body">
                            <div className="cf-dynamic-form">
                                {/* Левая панель */}
                                <div className="cf-form-section">
                                    <h3>Левая панель (Информация)</h3>
                                    <div className="ap-form-group">
                                        <label>Бейдж</label>
                                        <input
                                            type="text"
                                            value={settings.leftPanel.badge}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                leftPanel: { ...settings.leftPanel, badge: e.target.value }
                                            })}
                                            placeholder="Свяжитесь с нами"
                                        />
                                    </div>
                                    <div className="ap-form-group">
                                        <label>Заголовок</label>
                                        <input
                                            type="text"
                                            value={settings.leftPanel.title}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                leftPanel: { ...settings.leftPanel, title: e.target.value }
                                            })}
                                            placeholder="Получите бесплатную консультацию"
                                        />
                                    </div>
                                    <div className="ap-form-group">
                                        <label>Описание</label>
                                        <textarea
                                            value={settings.leftPanel.description}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                leftPanel: { ...settings.leftPanel, description: e.target.value }
                                            })}
                                            rows="2"
                                            placeholder="Оставьте заявку и наш специалист свяжется с вами"
                                        />
                                    </div>
                                    <div className="ap-form-group">
                                        <label>Адрес</label>
                                        <input
                                            type="text"
                                            value={settings.leftPanel.address}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                leftPanel: { ...settings.leftPanel, address: e.target.value }
                                            })}
                                            placeholder="г. Алматы, ул. Абая 123"
                                        />
                                    </div>
                                    <div className="ap-form-row">
                                        <div className="ap-form-group">
                                            <label>Телефон 1</label>
                                            <input
                                                type="text"
                                                value={settings.leftPanel.phone1}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    leftPanel: { ...settings.leftPanel, phone1: e.target.value }
                                                })}
                                                placeholder="+7 (777) 123-45-67"
                                            />
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Телефон 2</label>
                                            <input
                                                type="text"
                                                value={settings.leftPanel.phone2}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    leftPanel: { ...settings.leftPanel, phone2: e.target.value }
                                                })}
                                                placeholder="+7 (727) 234-56-78"
                                            />
                                        </div>
                                    </div>
                                    <div className="ap-form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={settings.leftPanel.email}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                leftPanel: { ...settings.leftPanel, email: e.target.value }
                                            })}
                                            placeholder="info@almaty-build.kz"
                                        />
                                    </div>
                                    <div className="ap-form-row">
                                        <div className="ap-form-group">
                                            <label>Рабочие часы (Пн-Пт)</label>
                                            <input
                                                type="text"
                                                value={settings.leftPanel.workHours}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    leftPanel: { ...settings.leftPanel, workHours: e.target.value }
                                                })}
                                                placeholder="Пн-Пт: 09:00 - 19:00"
                                            />
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Рабочие часы (Сб)</label>
                                            <input
                                                type="text"
                                                value={settings.leftPanel.workHoursSat}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    leftPanel: { ...settings.leftPanel, workHoursSat: e.target.value }
                                                })}
                                                placeholder="Сб: 10:00 - 16:00"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Правая панель */}
                                <div className="cf-form-section">
                                    <h3>Правая панель (Форма)</h3>
                                    <div className="ap-form-group">
                                        <label>Заголовок формы</label>
                                        <input
                                            type="text"
                                            value={settings.rightPanel.title}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                rightPanel: { ...settings.rightPanel, title: e.target.value }
                                            })}
                                            placeholder="Оставить заявку"
                                        />
                                    </div>
                                    <div className="ap-form-group">
                                        <label>Описание формы</label>
                                        <input
                                            type="text"
                                            value={settings.rightPanel.description}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                rightPanel: { ...settings.rightPanel, description: e.target.value }
                                            })}
                                            placeholder="Заполните форму и мы свяжемся с вами"
                                        />
                                    </div>
                                    <div className="ap-form-group">
                                        <label>Текст кнопки</label>
                                        <input
                                            type="text"
                                            value={settings.rightPanel.buttonText}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                rightPanel: { ...settings.rightPanel, buttonText: e.target.value }
                                            })}
                                            placeholder="Отправить заявку"
                                        />
                                    </div>
                                    <div className="ap-form-group">
                                        <label>Примечание</label>
                                        <textarea
                                            value={settings.rightPanel.note}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                rightPanel: { ...settings.rightPanel, note: e.target.value }
                                            })}
                                            rows="2"
                                            placeholder="Нажимая на кнопку, вы соглашаетесь с политикой обработки персональных данных"
                                        />
                                    </div>
                                </div>

                                {/* Фон */}
                                <div className="cf-form-section">
                                    <h3>Настройки фона</h3>
                                    <div className="ap-form-row">
                                        <div className="ap-form-group">
                                            <label>Цвет градиента (начало)</label>
                                            <input
                                                type="color"
                                                style={{padding: "0"}}
                                                value={settings.background.gradientStart}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    background: { ...settings.background, gradientStart: e.target.value }
                                                })}
                                            />
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Цвет градиента (конец)</label>
                                            <input
                                                type="color"
                                                style={{padding: "0"}}
                                                value={settings.background.gradientEnd}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    background: { ...settings.background, gradientEnd: e.target.value }
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div className="ap-form-group">
                                        <label>Прозрачность оверлея</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={settings.background.overlayOpacity}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                background: { ...settings.background, overlayOpacity: parseFloat(e.target.value) }
                                            })}
                                        />
                                        <span>{Math.round(settings.background.overlayOpacity * 100)}%</span>
                                    </div>
                                    <div className="cf-gradient-preview" style={{
                                        background: `linear-gradient(135deg, ${settings.background.gradientStart} 0%, ${settings.background.gradientEnd} 100%)`,
                                        height: '60px',
                                        borderRadius: '8px'
                                    }} />
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
        </div>
    );
};

export default ContactManager;