// components/ContactForm/ContactForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './ContactForm.css';

const ContactForm = () => {
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
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
        projectType: 'house'
    });
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [settingsLoading, setSettingsLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/contact/settings`);
            setSettings(response.data.data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setSettingsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Пожалуйста, введите корректный email адрес');
            setLoading(false);
            return;
        }

        const phoneRegex = /^[\+\(]?[0-9\(\)\-\s]{10,}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error('Пожалуйста, введите корректный номер телефона');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/contact/submit`, formData);

            if (response.data.success) {
                toast.success(response.data.message || 'Сообщение успешно отправлено!');
                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    message: '',
                    projectType: 'house'
                });
            } else {
                toast.error('Ошибка при отправке. Попробуйте позже.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error(error.response?.data?.error || 'Ошибка при отправке. Попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    const getBackgroundStyle = () => {
        return {
            background: `linear-gradient(135deg, ${settings.background.gradientStart} 0%, ${settings.background.gradientEnd} 100%)`
        };
    };

    if (settingsLoading) {
        return (
            <section className="contact-form-section">
                <div className="container">
                    <div className="contact-form-loading">Загрузка...</div>
                </div>
            </section>
        );
    }

    return (
        <section className="contact-form-section" style={getBackgroundStyle()}>
            <div className="contact-form-bg">
                <div className="bg-gradient" style={{ opacity: settings.background.overlayOpacity }}></div>
                <div className="bg-map"></div>
            </div>

            <div className="container">
                <div className="contact-form-wrapper">
                    <div className="contact-info" data-aos="fade-right">
                        <div className="info-badge">
                            <span>{settings.leftPanel.badge}</span>
                        </div>
                        <h2>{settings.leftPanel.title}</h2>
                        <p>{settings.leftPanel.description}</p>

                        <div className="info-items">
                            <div className="info-item">
                                <div className="info-icon">📍</div>
                                <div>
                                    <h4>Адрес</h4>
                                    <p>{settings.leftPanel.address}</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon">📞</div>
                                <div>
                                    <h4>Телефон</h4>
                                    <p>{settings.leftPanel.phone1}</p>
                                    <p>{settings.leftPanel.phone2}</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon">✉️</div>
                                <div>
                                    <h4>Email</h4>
                                    <p>{settings.leftPanel.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="work-hours">
                            <div className="hours-icon">🕐</div>
                            <div>
                                <h4>Режим работы</h4>
                                <p>{settings.leftPanel.workHours}</p>
                                <p>{settings.leftPanel.workHoursSat}</p>
                            </div>
                        </div>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit} data-aos="fade-left">
                        <div className="form-header">
                            <h3>{settings.rightPanel.title}</h3>
                            <p>{settings.rightPanel.description}</p>
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className={focusedField === 'name' || formData.name ? 'filled' : ''}
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                            />
                            <label>Ваше имя *</label>
                            <span className="focus-border"></span>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className={focusedField === 'phone' || formData.phone ? 'filled' : ''}
                                    onFocus={() => setFocusedField('phone')}
                                    onBlur={() => setFocusedField(null)}
                                />
                                <label>Телефон *</label>
                                <span className="focus-border"></span>
                            </div>

                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={focusedField === 'email' || formData.email ? 'filled' : ''}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                />
                                <label>Email *</label>
                                <span className="focus-border"></span>
                            </div>
                        </div>

                        <div className="form-group select-group">
                            <select
                                name="projectType"
                                value={formData.projectType}
                                onChange={handleChange}
                                className="custom-select"
                            >
                                <option value="house">🏠 Строительство дома</option>
                                <option value="apartment">🏢 Покупка квартиры</option>
                                <option value="commercial">🏭 Коммерческая недвижимость</option>
                                <option value="other">📝 Другое</option>
                            </select>
                            <span className="select-arrow-icon">▼</span>
                        </div>

                        <div className="form-group">
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"
                                required
                                className={focusedField === 'message' || formData.message ? 'filled' : ''}
                                onFocus={() => setFocusedField('message')}
                                onBlur={() => setFocusedField(null)}
                            ></textarea>
                            <label>Сообщение *</label>
                            <span className="focus-border"></span>
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? (
                                <div className="btn-loader"></div>
                            ) : (
                                <>
                                    {settings.rightPanel.buttonText}
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    </svg>
                                </>
                            )}
                        </button>

                        <p className="form-note">{settings.rightPanel.note}</p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;