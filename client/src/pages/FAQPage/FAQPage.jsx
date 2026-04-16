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

    const faqs = [
        {
            question: "Сколько стоит построить дом под ключ в Алматы?",
            answer: "Стоимость строительства дома зависит от многих факторов: площади, материалов, сложности проекта и отделки. В среднем, цена за 1 м² составляет от 150 000 до 300 000 тенге. Мы предлагаем индивидуальный расчет после консультации с нашим специалистом.",
            category: "price"
        },
        {
            question: "Какие документы нужны для получения квартиры в новостройке?",
            answer: "Для приобретения квартиры в нашем ЖК вам потребуются: удостоверение личности, ИНН, справка о доходах (при ипотеке). Мы предоставляем полное юридическое сопровождение сделки и помогаем собрать все необходимые документы.",
            category: "documents"
        },
        {
            question: "Предоставляете ли вы гарантию на строительство?",
            answer: "Да, мы предоставляем гарантию 10 лет на все конструктивные элементы здания и 5 лет на отделочные работы. Также у нас есть постгарантийное обслуживание в течение 2 лет после сдачи объекта.",
            category: "guarantee"
        },
        {
            question: "Можно ли купить квартиру в рассрочку?",
            answer: "Да, мы предлагаем гибкие условия рассрочки до 24 месяцев без переплаты. Также сотрудничаем со всеми крупными банками Казахстана для оформления ипотеки под низкие проценты.",
            category: "payment"
        },
        {
            question: "Сколько времени занимает строительство дома?",
            answer: "Сроки строительства зависят от площади и сложности проекта. В среднем, строительство дома площадью 150-200 м² занимает 8-12 месяцев. Мы строго соблюдаем договорные сроки.",
            category: "construction"
        },
        {
            question: "Работаете ли вы с дизайн-проектами?",
            answer: "Да, у нас есть собственное архитектурное бюро. Мы разрабатываем индивидуальные дизайн-проекты с учетом всех пожеланий клиента, включая 3D-визуализацию будущего дома или квартиры.",
            category: "design"
        },
        {
            question: "Есть ли у вас лицензия на строительство?",
            answer: "Да, мы имеем все необходимые лицензии и сертификаты для осуществления строительной деятельности в РК. Наша компания является членом Ассоциации строителей Казахстана.",
            category: "license"
        },
        {
            question: "Могу ли я посмотреть уже построенные объекты?",
            answer: "Конечно! Мы организуем экскурсию на наши готовые объекты, чтобы вы могли лично оценить качество нашей работы. Для этого достаточно оставить заявку на сайте или позвонить нам.",
            category: "tour"
        },
        {
            question: "Какие материалы вы используете при строительстве?",
            answer: "Мы используем только сертифицированные материалы от ведущих производителей: кирпич Керамика, газоблок Ytong, утеплитель Rockwool, кровля Rauta. Все материалы соответствуют ГОСТ и СНиП РК.",
            category: "materials"
        },
        {
            question: "Есть ли возможность внести изменения в типовой проект?",
            answer: "Да, мы можем адаптировать любой типовой проект под ваши пожелания: изменить планировку, добавить дополнительные помещения, изменить фасад и многое другое.",
            category: "design"
        },
        {
            question: "Как происходит оплата по этапам строительства?",
            answer: "Мы работаем по поэтапной оплате: аванс за материалы, оплата после завершения каждого этапа строительства. Это гарантирует прозрачность и безопасность для клиента.",
            category: "payment"
        },
        {
            question: "Помогаете ли вы с оформлением ипотеки?",
            answer: "Да, наши специалисты помогут собрать все необходимые документы и выбрать лучшие условия ипотеки среди банков-партнеров: Halyk Bank, Kaspi Bank, Jusan Bank, Отбасы Банк.",
            category: "payment"
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
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

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <>
            <SEO
                title="FAQ - Часто задаваемые вопросы | Строительная компания Алматы"
                description="Ответы на популярные вопросы о строительстве домов, покупке квартир, документах, гарантии и оплате в Алматы"
                url="/faq"
            />

            <div className="fpg-faq-page">
                <section className="fpg-hero">
                    <div className="fpg-hero-bg"></div>
                    <div className="fpg-container">
                        <h1 data-aos="fade-up">Часто задаваемые вопросы</h1>
                        <p data-aos="fade-up" data-aos-delay="100">
                            Ответы на самые популярные вопросы наших клиентов
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
                                            key={index}
                                            className={`fpg-item ${openIndex === index ? 'fpg-active' : ''}`}
                                            data-aos="fade-up"
                                            data-aos-delay={Math.min(index * 50, 300)}
                                        >
                                            <div className="fpg-question" onClick={() => toggleFAQ(index)}>
                                                <h3>{faq.question}</h3>
                                                <span className="fpg-question-arrow">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2"/>
                                                    </svg>
                                                </span>
                                            </div>
                                            <div className="fpg-answer">
                                                <p>{faq.answer}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="fpg-sidebar">
                                <div className="fpg-contact-card">
                                    <div className="fpg-contact-card-icon">💬</div>
                                    <h3>Остались вопросы?</h3>
                                    <p>Наши специалисты готовы ответить на любые ваши вопросы</p>
                                    <button className="fpg-btn fpg-btn-primary" onClick={openQuestionModal}>
                                        Задать вопрос
                                    </button>
                                    <div className="fpg-contact-card-phone">
                                        <span>Или позвоните:</span>
                                        <a href="tel:+77771234567">+7 (777) 123-45-67</a>
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