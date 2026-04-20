// import React, {useEffect} from 'react';
// import SEO from '../../components/SEO/SEO';
// import './AboutPage.css';
// import {useLocation} from "react-router-dom";
//
// const AboutPage = () => {
//     const location = useLocation();
//
//     const scrollToTop = () => {
//         window.scrollTo({
//             top: 0,
//             left: 0,
//             behavior: 'smooth'
//         });
//     };
//
//     useEffect(() => {
//         scrollToTop();
//     }, [location.search]);
//
//
//     return (
//         <>
//             <SEO
//                 title="О компании - Строительная компания Алматы | 12 лет опыта"
//                 description="Узнайте больше о строительной компании Алматы. 12 лет опыта, 150+ построенных объектов, профессиональная команда."
//                 url="/about"
//             />
//
//             <div className="about-page">
//                 {/* Hero Section */}
//                 <section className="about-hero">
//                     <div className="about-hero-bg"></div>
//                     <div className="container">
//                         <h1 data-aos="fade-up">О нашей компании</h1>
//                         <p data-aos="fade-up" data-aos-delay="100">
//                             12 лет строим дома вашей мечты в Алматы
//                         </p>
//                     </div>
//                 </section>
//
//                 {/* Mission Section */}
//                 <section className="mission-section">
//                     <div className="container">
//                         <div className="mission-grid">
//                             <div className="mission-content" data-aos="fade-right">
//                                 <span className="section-subtitle">Наша миссия</span>
//                                 <h2>Создаем пространство для счастливой жизни</h2>
//                                 <p>
//                                     Мы стремимся создавать не просто здания, а уютные пространства,
//                                     где люди будут жить, работать и создавать семьи. Каждый наш проект
//                                     — это результат тщательного планирования, использования современных
//                                     технологий и любви к своему делу.
//                                 </p>
//                                 <div className="mission-stats">
//                                     <div className="mission-stat">
//                                         <div className="stat-number">2014</div>
//                                         <div className="stat-label">Год основания</div>
//                                     </div>
//                                     <div className="mission-stat">
//                                         <div className="stat-number">150+</div>
//                                         <div className="stat-label">Построенных объектов</div>
//                                     </div>
//                                     <div className="mission-stat">
//                                         <div className="stat-number">50+</div>
//                                         <div className="stat-label">Сотрудников</div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="mission-image" data-aos="fade-left">
//                                 <img
//                                     src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
//                                     alt="Наша команда"
//                                 />
//                                 <div className="image-badge">
//                                     <span>🏆</span>
//                                     <p>Лидер рынка 2023</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//
//                 {/* Values Section */}
//                 <section className="values-section">
//                     <div className="container">
//                         <div className="section-header" data-aos="fade-up">
//                             <span className="section-subtitle">Наши ценности</span>
//                             <h2>Принципы нашей работы</h2>
//                         </div>
//                         <div className="values-grid">
//                             <div className="value-card" data-aos="fade-up" data-aos-delay="100">
//                                 <div className="value-icon">🔧</div>
//                                 <h3>Качество</h3>
//                                 <p>Используем только сертифицированные материалы и современные технологии</p>
//                             </div>
//                             <div className="value-card" data-aos="fade-up" data-aos-delay="200">
//                                 <div className="value-icon">⏱️</div>
//                                 <h3>Надежность</h3>
//                                 <p>Соблюдаем сроки и берем на себя полную ответственность</p>
//                             </div>
//                             <div className="value-card" data-aos="fade-up" data-aos-delay="300">
//                                 <div className="value-icon">🤝</div>
//                                 <h3>Честность</h3>
//                                 <p>Прозрачные условия сотрудничества без скрытых платежей</p>
//                             </div>
//                             <div className="value-card" data-aos="fade-up" data-aos-delay="400">
//                                 <div className="value-icon">💡</div>
//                                 <h3>Инновации</h3>
//                                 <p>Внедряем передовые строительные технологии</p>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//
//                 {/* Team Section */}
//                 <section className="team-section">
//                     <div className="container">
//                         <div className="section-header" data-aos="fade-up">
//                             <span className="section-subtitle">Наша команда</span>
//                             <h2>Профессионалы своего дела</h2>
//                         </div>
//                         <div className="team-grid">
//                             {[
//                                 { name: 'Азат Нуржанов', position: 'Генеральный директор', experience: '15 лет', image: 'https://randomuser.me/api/portraits/men/10.jpg' },
//                                 { name: 'Марат Сулейменов', position: 'Главный архитектор', experience: '12 лет', image: 'https://randomuser.me/api/portraits/men/11.jpg' },
//                                 { name: 'Айгуль Садыкова', position: 'Руководитель отдела продаж', experience: '10 лет', image: 'https://randomuser.me/api/portraits/women/12.jpg' },
//                                 { name: 'Ержан Омаров', position: 'Прораб', experience: '20 лет', image: 'https://randomuser.me/api/portraits/men/13.jpg' }
//                             ].map((member, index) => (
//                                 <div className="team-card" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
//                                     <div className="team-image">
//                                         <img src={member.image} alt={member.name} />
//                                         <div className="team-overlay">
//                                             <span>Стаж: {member.experience}</span>
//                                         </div>
//                                     </div>
//                                     <h3>{member.name}</h3>
//                                     <p>{member.position}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </section>
//             </div>
//         </>
//     );
// };
//
// export default AboutPage;





// pages/AboutPage/AboutPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import SEO from '../../components/SEO/SEO';
import './AboutPage.css';

const AboutPage = () => {
    const location = useLocation();
    const [settings, setSettings] = useState(null);
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
        fetchSettings();
    }, [location.search]);

    const fetchSettings = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/about`);
            setSettings(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching about settings:', error);
            setLoading(false);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        if (imagePath.startsWith('/uploads')) {
            const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
            return `${baseUrl}${imagePath}`;
        }
        return imagePath;
    };

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    if (loading || !settings) {
        return (
            <div className="about-loading">
                <div className="loader"></div>
            </div>
        );
    }

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
                    <div
                        className="about-hero-bg"
                        style={{
                            backgroundImage: `url(${getImageUrl(settings.hero.bgImage)})`,
                            opacity: settings.hero.overlayOpacity
                        }}
                    ></div>
                    <div className="container">
                        <h1 data-aos="fade-up">{settings.hero.title}</h1>
                        <p data-aos="fade-up" data-aos-delay="100">{settings.hero.subtitle}</p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="mission-section">
                    <div className="container">
                        <div className="mission-grid">
                            <div className="mission-content" data-aos="fade-right">
                                <span className="section-subtitle">{settings.mission.subtitle}</span>
                                <h2>{settings.mission.title}</h2>
                                <p>{settings.mission.description}</p>
                                <div className="mission-stats">
                                    {settings.mission.stats.map((stat, idx) => (
                                        <div className="mission-stat" key={idx}>
                                            <div className="stat-number">{stat.number}</div>
                                            <div className="stat-label">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mission-image" data-aos="fade-left">
                                <img src={getImageUrl(settings.mission.image)} alt="Наша команда" />
                                <div className="image-badge">
                                    <span>{settings.mission.badgeIcon}</span>
                                    <p>{settings.mission.badgeText}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="values-section">
                    <div className="container">
                        <div className="section-header" data-aos="fade-up">
                            <span className="section-subtitle">{settings.values.subtitle}</span>
                            <h2>{settings.values.title}</h2>
                        </div>
                        <div className="values-grid">
                            {settings.valueCards.filter(card => card.active).map((card, index) => (
                                <div className="value-card" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                                    <div className="value-icon">{card.icon}</div>
                                    <h3>{card.title}</h3>
                                    <p>{card.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="team-section">
                    <div className="container">
                        <div className="section-header" data-aos="fade-up">
                            <span className="section-subtitle">{settings.team.subtitle}</span>
                            <h2>{settings.team.title}</h2>
                        </div>
                        <div className="team-grid">
                            {settings.teamMembers.filter(member => member.active).map((member, index) => (
                                <div className="team-card" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                                    <div className="team-image">
                                        {member.imageType === 'initials' ? (
                                            <div className="team-initials">{getInitials(member.name)}</div>
                                        ) : (
                                            <img src={getImageUrl(member.image)} alt={member.name} />
                                        )}
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