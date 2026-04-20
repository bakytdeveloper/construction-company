import React, { useEffect, useState } from 'react';
import SEO from '../../components/SEO/SEO';
import axios from 'axios';
import toast from 'react-hot-toast';
import './FAQPage.css';
import { useLocation } from "react-router-dom";

const FAQPage = () => {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [openIndex, setOpenIndex] = useState(null);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [questionForm, setQuestionForm] = useState({
        name: '',
        phone: '',
        email: '',
        question: ''
    });
    const [sending, setSending] = useState(false);
    const [faqData, setFaqData] = useState({
        settings: {
            subtitle: 'Часто задаваемые вопросы',
            title: 'Ответы на популярные вопросы',
            description: 'Мы собрали самые частые вопросы наших клиентов',
            ctaTitle: 'Не нашли ответ?',
            ctaDescription: 'Задайте свой вопрос нашему специалисту и получите консультацию',
            ctaButtonText: 'Задать вопрос',
            ctaPhone: '+7 (777) 123-45-67'
        },
        faqs: []
    });
    const [loading, setLoading] = useState(true);

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
        const handleEsc = (e) => {
            if (e.key === 'Escape' && showQuestionModal) {
                setShowQuestionModal(false);
                resetQuestionForm();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [showQuestionModal]);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/faq`);
            if (response.data.success && response.data.data) {
                setFaqData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            toast.error('Ошибка загрузки FAQ. Пожалуйста, обновите страницу.');
        } finally {
            setLoading(false);
        }
    };

    // Фильтрация FAQ на основе поиска
    const filteredFaqs = faqData.faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleQuestionInputChange = (e) => {
        setQuestionForm({
            ...questionForm,
            [e.target.name]: e.target.value
        });
    };

    const resetQuestionForm = () => {
        setQuestionForm({
            name: '',
            phone: '',
            email: '',
            question: ''
        });
    };

    const handleSubmitQuestion = async (e) => {
        e.preventDefault();

        if (!questionForm.name.trim()) {
            toast.error('Пожалуйста, введите ваше имя');
            return;
        }
        if (!questionForm.phone.trim()) {
            toast.error('Пожалуйста, введите телефон для связи');
            return;
        }
        if (!questionForm.email.trim()) {
            toast.error('Пожалуйста, введите email');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(questionForm.email)) {
            toast.error('Пожалуйста, введите корректный email');
            return;
        }
        if (!questionForm.question.trim()) {
            toast.error('Пожалуйста, введите ваш вопрос');
            return;
        }

        setSending(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/contact/submit`, {
                name: questionForm.name,
                phone: questionForm.phone,
                email: questionForm.email,
                message: `❓ ВОПРОС ОТ ПОЛЬЗОВАТЕЛЯ (со страницы FAQ):\n\n${questionForm.question}\n\n---\nПользователь хочет получить ответ на указанный email или телефон.`,
                projectType: 'other'
            });

            if (response.data.success) {
                toast.success('Ваш вопрос отправлен! Специалист свяжется с вами.');
                setShowQuestionModal(false);
                resetQuestionForm();
            } else {
                toast.error('Ошибка при отправке. Попробуйте позже.');
            }
        } catch (error) {
            console.error('Error sending question:', error);
            toast.error(error.response?.data?.error || 'Ошибка при отправке. Попробуйте позже.');
        } finally {
            setSending(false);
        }
    };

    const openQuestionModal = () => {
        resetQuestionForm();
        setShowQuestionModal(true);
    };

    // Schema.org разметка для FAQ
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    if (loading) {
        return (
            <div className="fpg-faq-page">
                <div className="fpg-loading">
                    <div className="fpg-loader"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO
                title="FAQ - Часто задаваемые вопросы | Строительная компания Алматы"
                description={faqData.settings.description || "Ответы на популярные вопросы о строительстве домов, покупке квартир, документах, гарантии и оплате в Алматы"}
                url="/faq"
            />

            <div className="fpg-faq-page">
                <section className="fpg-hero">
                    <div className="fpg-hero-bg"></div>
                    <div className="fpg-container">
                        <span className="fpg-hero-subtitle" data-aos="fade-up">
                            {faqData.settings.subtitle}
                        </span>
                        <h1 data-aos="fade-up" data-aos-delay="50">
                            {faqData.settings.title}
                        </h1>
                        <p data-aos="fade-up" data-aos-delay="100">
                            {faqData.settings.description}
                        </p>

                        <div className="fpg-search" data-aos="fade-up" data-aos-delay="200">
                            <input
                                type="text"
                                placeholder="Поиск по вопросам..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M21 21L16 16M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                    </div>
                </section>

                <section className="fpg-content">
                    <div className="fpg-container">
                        <div className="fpg-grid">
                            <div className="fpg-list-wrapper">
                                <div className="fpg-list">
                                    {filteredFaqs.length === 0 ? (
                                        <div className="fpg-no-results">
                                            <span>🔍</span>
                                            <h3>Ничего не найдено</h3>
                                            <p>Попробуйте изменить поисковый запрос</p>
                                        </div>
                                    ) : (
                                        filteredFaqs.map((faq, index) => (
                                            <div
                                                key={faq._id || index}
                                                className={`fpg-item ${openIndex === index ? 'fpg-active' : ''}`}
                                            >
                                                <div
                                                    className="fpg-question"
                                                    onClick={() => toggleFAQ(index)}
                                                >
                                                    <h3>{faq.question}</h3>
                                                    <span className="fpg-question-arrow">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2"/>
                                                        </svg>
                                                    </span>
                                                </div>
                                                <div className="fpg-answer">
                                                    <div className="fpg-answer-content">
                                                        <p>{faq.answer}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="fpg-sidebar">
                                <div className="fpg-contact-card">
                                    <div className="fpg-contact-card-icon">💬</div>
                                    <h3>{faqData.settings.ctaTitle}</h3>
                                    <p>{faqData.settings.ctaDescription}</p>
                                    <button className="fpg-btn fpg-btn-primary" onClick={openQuestionModal}>
                                        {faqData.settings.ctaButtonText}
                                    </button>
                                    <div className="fpg-contact-card-phone">
                                        <span>Или позвоните:</span>
                                        <a href={`tel:${faqData.settings.ctaPhone?.replace(/\D/g, '')}`}>
                                            {faqData.settings.ctaPhone}
                                        </a>
                                    </div>
                                </div>

                                <div className="fpg-info-card">
                                    <h4>Полезная информация</h4>
                                    <ul>
                                        <li>
                                            <a href="/projects">
                                                <span>🏠</span>
                                                Посмотреть наши проекты
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/about">
                                                <span>👥</span>
                                                Узнать о компании
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/contact">
                                                <span>📍</span>
                                                Схема проезда
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </div>

            {/* Модальное окно для вопроса */}
            {showQuestionModal && (
                <div className="fpg-question-modal-overlay" onClick={() => setShowQuestionModal(false)}>
                    <div className="fpg-question-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="fpg-question-modal-header">
                            <h3>📝 Задать вопрос</h3>
                            <button className="fpg-question-modal-close" onClick={() => setShowQuestionModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmitQuestion} className="fpg-question-modal-form">
                            <div className="fpg-form-group">
                                <label>Ваше имя *</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Как к вам обращаться?"
                                    value={questionForm.name}
                                    onChange={handleQuestionInputChange}
                                    required
                                />
                            </div>
                            <div className="fpg-form-row">
                                <div className="fpg-form-group">
                                    <label>Телефон *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="+7 (777) 123-45-67"
                                        value={questionForm.phone}
                                        onChange={handleQuestionInputChange}
                                        required
                                    />
                                </div>
                                <div className="fpg-form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="example@mail.com"
                                        value={questionForm.email}
                                        onChange={handleQuestionInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="fpg-form-group">
                                <label>Ваш вопрос *</label>
                                <textarea
                                    name="question"
                                    placeholder="Опишите ваш вопрос подробнее..."
                                    rows="4"
                                    value={questionForm.question}
                                    onChange={handleQuestionInputChange}
                                    required
                                ></textarea>
                            </div>
                            <div className="fpg-modal-buttons">
                                <button type="button" className="fpg-cancel-question-btn" onClick={() => setShowQuestionModal(false)}>
                                    Отмена
                                </button>
                                <button type="submit" className="fpg-submit-question-btn" disabled={sending}>
                                    {sending ? 'Отправка...' : 'Отправить вопрос'}
                                </button>
                            </div>
                            <p className="fpg-form-note">
                                Нажимая на кнопку, вы соглашаетесь с политикой обработки персональных данных
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default FAQPage;