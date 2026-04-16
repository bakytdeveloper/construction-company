import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './ContactForm.css';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
        projectType: 'house'
    });
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

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

    return (
        <section className="contact-form-section">
            <div className="contact-form-bg">
                <div className="bg-gradient"></div>
                <div className="bg-map"></div>
            </div>

            <div className="container">
                <div className="contact-form-wrapper">
                    <div className="contact-info" data-aos="fade-right">
                        <div className="info-badge">
                            <span>Свяжитесь с нами</span>
                        </div>
                        <h2>Получите бесплатную консультацию</h2>
                        <p>Оставьте заявку и наш специалист свяжется с вами в ближайшее время</p>

                        <div className="info-items">
                            <div className="info-item">
                                <div className="info-icon">📍</div>
                                <div>
                                    <h4>Адрес</h4>
                                    <p>г. Алматы, ул. Абая 123, БЦ "Алмалы"</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon">📞</div>
                                <div>
                                    <h4>Телефон</h4>
                                    <p>+7 (777) 123-45-67</p>
                                    <p>+7 (727) 234-56-78</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon">✉️</div>
                                <div>
                                    <h4>Email</h4>
                                    <p>info@almaty-build.kz</p>
                                </div>
                            </div>
                        </div>

                        <div className="work-hours">
                            <div className="hours-icon">🕐</div>
                            <div>
                                <h4>Режим работы</h4>
                                <p>Пн-Пт: 09:00 - 19:00</p>
                                <p>Сб: 10:00 - 16:00</p>
                            </div>
                        </div>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit} data-aos="fade-left">
                        <div className="form-header">
                            <h3>Оставить заявку</h3>
                            <p>Заполните форму и мы свяжемся с вами</p>
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
                                    Отправить заявку
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    </svg>
                                </>
                            )}
                        </button>

                        <p className="form-note">
                            Нажимая на кнопку, вы соглашаетесь с политикой обработки персональных данных
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;