import React, { useState } from 'react';
import SEO from '../../components/SEO/SEO';
import './FAQPage.css';

const FAQPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openIndex, setOpenIndex] = useState(null);

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

            <div className="faq-page">
                <section className="faq-page-hero">
                    <div className="faq-page-hero-bg"></div>
                    <div className="container">
                        <h1 data-aos="fade-up">Часто задаваемые вопросы</h1>
                        <p data-aos="fade-up" data-aos-delay="100">
                            Ответы на самые популярные вопросы наших клиентов
                        </p>

                        <div className="faq-search" data-aos="fade-up" data-aos-delay="200">
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

                <section className="faq-page-content">
                    <div className="container">
                        <div className="faq-page-grid">
                            <div className="faq-page-list">
                                {filteredFaqs.length === 0 ? (
                                    <div className="no-results">
                                        <span>🔍</span>
                                        <h3>Ничего не найдено</h3>
                                        <p>Попробуйте изменить поисковый запрос</p>
                                    </div>
                                ) : (
                                    filteredFaqs.map((faq, index) => (
                                        <div
                                            key={index}
                                            className={`faq-page-item ${openIndex === index ? 'active' : ''}`}
                                            data-aos="fade-up"
                                            data-aos-delay={index * 50}
                                        >
                                            <div className="faq-page-question" onClick={() => toggleFAQ(index)}>
                                                <h3>{faq.question}</h3>
                                                <span className="question-arrow">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </span>
                                            </div>
                                            <div className="faq-page-answer">
                                                <p>{faq.answer}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="faq-page-sidebar">
                                <div className="contact-card">
                                    <div className="contact-card-icon">💬</div>
                                    <h3>Остались вопросы?</h3>
                                    <p>Наши специалисты готовы ответить на любые ваши вопросы</p>
                                    <button className="btn btn-primary" onClick={() => {
                                        document.querySelector('.contact-form-section')?.scrollIntoView({ behavior: 'smooth' });
                                    }}>
                                        Задать вопрос
                                    </button>
                                    <div className="contact-card-phone">
                                        <span>Или позвоните:</span>
                                        <a href="tel:+77771234567">+7 (777) 123-45-67</a>
                                    </div>
                                </div>

                                <div className="info-card">
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
        </>
    );
};

export default FAQPage;