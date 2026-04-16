import React, {useEffect} from 'react';
import SEO from '../../components/SEO/SEO';
import './AboutPage.css';
import {useLocation} from "react-router-dom";

const AboutPage = () => {
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


    return (
        <>
            <SEO
                title="О компании - Строительная компания Алматы | 12 лет опыта"
                description="Узнайте больше о строительной компании Алматы. 12 лет опыта, 150+ построенных объектов, профессиональная команда."
                url="/about"
            />

            <div className="about-page">
                {/* Hero Section */}
                <section className="about-hero">
                    <div className="about-hero-bg"></div>
                    <div className="container">
                        <h1 data-aos="fade-up">О нашей компании</h1>
                        <p data-aos="fade-up" data-aos-delay="100">
                            12 лет строим дома вашей мечты в Алматы
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="mission-section">
                    <div className="container">
                        <div className="mission-grid">
                            <div className="mission-content" data-aos="fade-right">
                                <span className="section-subtitle">Наша миссия</span>
                                <h2>Создаем пространство для счастливой жизни</h2>
                                <p>
                                    Мы стремимся создавать не просто здания, а уютные пространства,
                                    где люди будут жить, работать и создавать семьи. Каждый наш проект
                                    — это результат тщательного планирования, использования современных
                                    технологий и любви к своему делу.
                                </p>
                                <div className="mission-stats">
                                    <div className="mission-stat">
                                        <div className="stat-number">2014</div>
                                        <div className="stat-label">Год основания</div>
                                    </div>
                                    <div className="mission-stat">
                                        <div className="stat-number">150+</div>
                                        <div className="stat-label">Построенных объектов</div>
                                    </div>
                                    <div className="mission-stat">
                                        <div className="stat-number">50+</div>
                                        <div className="stat-label">Сотрудников</div>
                                    </div>
                                </div>
                            </div>
                            <div className="mission-image" data-aos="fade-left">
                                <img
                                    src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                                    alt="Наша команда"
                                />
                                <div className="image-badge">
                                    <span>🏆</span>
                                    <p>Лидер рынка 2023</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="values-section">
                    <div className="container">
                        <div className="section-header" data-aos="fade-up">
                            <span className="section-subtitle">Наши ценности</span>
                            <h2>Принципы нашей работы</h2>
                        </div>
                        <div className="values-grid">
                            <div className="value-card" data-aos="fade-up" data-aos-delay="100">
                                <div className="value-icon">🔧</div>
                                <h3>Качество</h3>
                                <p>Используем только сертифицированные материалы и современные технологии</p>
                            </div>
                            <div className="value-card" data-aos="fade-up" data-aos-delay="200">
                                <div className="value-icon">⏱️</div>
                                <h3>Надежность</h3>
                                <p>Соблюдаем сроки и берем на себя полную ответственность</p>
                            </div>
                            <div className="value-card" data-aos="fade-up" data-aos-delay="300">
                                <div className="value-icon">🤝</div>
                                <h3>Честность</h3>
                                <p>Прозрачные условия сотрудничества без скрытых платежей</p>
                            </div>
                            <div className="value-card" data-aos="fade-up" data-aos-delay="400">
                                <div className="value-icon">💡</div>
                                <h3>Инновации</h3>
                                <p>Внедряем передовые строительные технологии</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="team-section">
                    <div className="container">
                        <div className="section-header" data-aos="fade-up">
                            <span className="section-subtitle">Наша команда</span>
                            <h2>Профессионалы своего дела</h2>
                        </div>
                        <div className="team-grid">
                            {[
                                { name: 'Азат Нуржанов', position: 'Генеральный директор', experience: '15 лет', image: 'https://randomuser.me/api/portraits/men/10.jpg' },
                                { name: 'Марат Сулейменов', position: 'Главный архитектор', experience: '12 лет', image: 'https://randomuser.me/api/portraits/men/11.jpg' },
                                { name: 'Айгуль Садыкова', position: 'Руководитель отдела продаж', experience: '10 лет', image: 'https://randomuser.me/api/portraits/women/12.jpg' },
                                { name: 'Ержан Омаров', position: 'Прораб', experience: '20 лет', image: 'https://randomuser.me/api/portraits/men/13.jpg' }
                            ].map((member, index) => (
                                <div className="team-card" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                                    <div className="team-image">
                                        <img src={member.image} alt={member.name} />
                                        <div className="team-overlay">
                                            <span>Стаж: {member.experience}</span>
                                        </div>
                                    </div>
                                    <h3>{member.name}</h3>
                                    <p>{member.position}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default AboutPage;