import React, { useState, useRef, useCallback, useEffect } from 'react';
import './FAQ.css';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const faqRefs = useRef([]);
    const scrollTimeout = useRef(null);
    const aosInitialized = useRef(false);

    const faqs = [
        {
            question: "Сколько стоит построить дом под ключ в Алматы?",
            answer: "Стоимость строительства дома зависит от многих факторов: площади, материалов, сложности проекта и отделки. В среднем, цена за 1 м² составляет от 150 000 до 300 000 тенге. Мы предлагаем индивидуальный расчет после консультации с нашим специалистом.",
            category: "price",
            icon: "💰"
        },
        {
            question: "Какие документы нужны для получения квартиры в новостройке?",
            answer: "Для приобретения квартиры в нашем ЖК вам потребуются: удостоверение личности, ИНН, справка о доходах (при ипотеке). Мы предоставляем полное юридическое сопровождение сделки и помогаем собрать все необходимые документы.",
            category: "documents",
            icon: "📋"
        },
        {
            question: "Предоставляете ли вы гарантию на строительство?",
            answer: "Да, мы предоставляем гарантию 10 лет на все конструктивные элементы здания и 5 лет на отделочные работы. Также у нас есть постгарантийное обслуживание в течение 2 лет после сдачи объекта.",
            category: "guarantee",
            icon: "🏆"
        },
        {
            question: "Можно ли купить квартиру в рассрочку?",
            answer: "Да, мы предлагаем гибкие условия рассрочки до 24 месяцев без переплаты. Также сотрудничаем со всеми крупными банками Казахстана для оформления ипотеки под низкие проценты.",
            category: "payment",
            icon: "💳"
        },
        {
            question: "Сколько времени занимает строительство дома?",
            answer: "Сроки строительства зависят от площади и сложности проекта. В среднем, строительство дома площадью 150-200 м² занимает 8-12 месяцев. Мы строго соблюдаем договорные сроки.",
            category: "timing",
            icon: "⏱️"
        },
        {
            question: "Работаете ли вы с дизайн-проектами?",
            answer: "Да, у нас есть собственное архитектурное бюро. Мы разрабатываем индивидуальные дизайн-проекты с учетом всех пожеланий клиента, включая 3D-визуализацию будущего дома или квартиры.",
            category: "design",
            icon: "🎨"
        },
        {
            question: "Есть ли у вас лицензия на строительство?",
            answer: "Да, мы имеем все необходимые лицензии и сертификаты для осуществления строительной деятельности в РК. Наша компания является членом Ассоциации строителей Казахстана.",
            category: "license",
            icon: "📜"
        },
        {
            question: "Могу ли я посмотреть уже построенные объекты?",
            answer: "Конечно! Мы организуем экскурсию на наши готовые объекты, чтобы вы могли лично оценить качество нашей работы. Для этого достаточно оставить заявку на сайте или позвонить нам.",
            category: "tour",
            icon: "👀"
        }
    ];

    const categories = [
        { id: 'all', name: 'Все вопросы', icon: '📌' },
        { id: 'price', name: 'Цены и оплата', icon: '💰' },
        { id: 'documents', name: 'Документы', icon: '📋' },
        { id: 'guarantee', name: 'Гарантия', icon: '🏆' },
        { id: 'payment', name: 'Рассрочка', icon: '💳' },
        { id: 'design', name: 'Дизайн', icon: '🎨' }
    ];

    const [activeCategory, setActiveCategory] = useState('all');

    const filteredFaqs = activeCategory === 'all'
        ? faqs
        : faqs.filter(faq => faq.category === activeCategory);

    // Отключаем AOS анимации на элементах FAQ при монтировании
    useEffect(() => {
        // Удаляем атрибуты data-aos у всех FAQ элементов, чтобы предотвратить конфликты
        const faqElements = document.querySelectorAll('.faq-item');
        faqElements.forEach(el => {
            el.removeAttribute('data-aos');
            el.removeAttribute('data-aos-delay');
        });
    }, [filteredFaqs]);

    const toggleFAQ = useCallback((index) => {
        const newIndex = openIndex === index ? null : index;

        // Очищаем предыдущий таймаут скролла
        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }

        setOpenIndex(newIndex);

        // Отключаем скролл на время анимации
        setIsScrolling(true);

        // Включаем скролл обратно через время анимации
        scrollTimeout.current = setTimeout(() => {
            setIsScrolling(false);
        }, 400);

        // Опциональный плавный скролл только если элемент вышел за пределы viewport
        if (newIndex !== null && faqRefs.current[newIndex]) {
            scrollTimeout.current = setTimeout(() => {
                const element = faqRefs.current[newIndex];
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

                    // Скроллим только если элемент не виден полностью
                    if (!isVisible) {
                        const elementPosition = rect.top;
                        const offsetPosition = elementPosition + window.pageYOffset - 100;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
                setIsScrolling(false);
            }, 350);
        }
    }, [openIndex]);

    // Schema.org structured data for FAQ
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

    // Scroll to contact form
    const scrollToContact = () => {
        const contactSection = document.querySelector('.contact-form-section');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="faq-section">
            <div className="faq-bg">
                <div className="faq-pattern"></div>
            </div>

            <div className="container">
                <div className="section-header" data-aos="fade-up">
                    <span className="section-subtitle">Часто задаваемые вопросы</span>
                    <h2>Ответы на популярные вопросы</h2>
                    <p className="section-description">
                        Мы собрали самые частые вопросы наших клиентов
                    </p>
                </div>

                <div className="faq-categories" data-aos="fade-up">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                            onClick={() => {
                                setActiveCategory(category.id);
                                setOpenIndex(null);
                            }}
                        >
                            <span>{category.icon}</span>
                            {category.name}
                        </button>
                    ))}
                </div>

                <div className="faq-grid">
                    <div className="faq-list">
                        {filteredFaqs.map((faq, index) => (
                            <div
                                key={index}
                                ref={el => faqRefs.current[index] = el}
                                className={`faq-item ${openIndex === index ? 'active' : ''}`}
                                style={{
                                    opacity: 1,
                                    transform: 'none',
                                    animation: 'none'
                                }}
                            >
                                <div
                                    className="faq-question"
                                    onClick={() => toggleFAQ(index)}
                                    style={{ pointerEvents: isScrolling ? 'none' : 'auto' }}
                                >
                                    <div className="question-icon">{faq.icon}</div>
                                    <h3>{faq.question}</h3>
                                    <div className="question-arrow">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                    </div>
                                </div>
                                <div className="faq-answer">
                                    <div className="faq-answer-content">
                                        <p>{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="faq-cta" data-aos="fade-left">
                        <div className="cta-card">
                            <div className="cta-icon">💬</div>
                            <h3>Не нашли ответ?</h3>
                            <p>Задайте свой вопрос нашему специалисту и получите консультацию</p>
                            <button className="cta-btn" onClick={scrollToContact}>
                                Задать вопрос
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </button>
                            <div className="cta-phone">
                                <span>Или позвоните:</span>
                                <a href="tel:+77771234567">+7 (777) 123-45-67</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hidden SEO schema */}
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </div>
        </section>
    );
};

export default FAQ;