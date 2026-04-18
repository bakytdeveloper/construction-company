// components/FAQ/FAQ.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './FAQ.css';

const FAQ = () => {
    const [data, setData] = useState({
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
    const [openIndex, setOpenIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const faqRefs = useRef([]);
    const scrollTimeout = useRef(null);
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/faq`);
            setData(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            setLoading(false);
        }
    };

    const toggleFAQ = useCallback((index) => {
        const newIndex = openIndex === index ? null : index;

        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }

        setOpenIndex(newIndex);
        setIsScrolling(true);

        scrollTimeout.current = setTimeout(() => {
            setIsScrolling(false);
        }, 400);

        if (newIndex !== null && faqRefs.current[newIndex]) {
            scrollTimeout.current = setTimeout(() => {
                const element = faqRefs.current[newIndex];
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

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

    const scrollToContact = () => {
        const contactSection = document.querySelector('.contact-form-section');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": data.faqs.map(faq => ({
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
            <section className="faq-section">
                <div className="container">
                    <div className="faq-loading">Загрузка...</div>
                </div>
            </section>
        );
    }

    return (
        <section className="faq-section">
            <div className="faq-bg">
                <div className="faq-pattern"></div>
            </div>

            <div className="container">
                <div className="section-header" data-aos="fade-up">
                    <span className="section-subtitle">{data.settings.subtitle}</span>
                    <h2>{data.settings.title}</h2>
                    <p className="section-description">{data.settings.description}</p>
                </div>

                <div className="faq-grid">
                    <div className="faq-list">
                        {data.faqs.map((faq, index) => (
                            <div
                                key={faq._id}
                                ref={el => faqRefs.current[index] = el}
                                className={`faq-item ${openIndex === index ? 'active' : ''}`}
                            >
                                <div
                                    className="faq-question"
                                    onClick={() => toggleFAQ(index)}
                                    style={{ pointerEvents: isScrolling ? 'none' : 'auto' }}
                                >
                                    <div className="question-bullet">•</div>
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
                            <h3>{data.settings.ctaTitle}</h3>
                            <p>{data.settings.ctaDescription}</p>
                            <button className="cta-btn" onClick={scrollToContact}>
                                {data.settings.ctaButtonText}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </button>
                            <div className="cta-phone">
                                <span>Или позвоните:</span>
                                <a href={`tel:${data.settings.ctaPhone?.replace(/\D/g, '')}`}>{data.settings.ctaPhone}</a>
                            </div>
                        </div>
                    </div>
                </div>

                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </div>
        </section>
    );
};

export default FAQ;