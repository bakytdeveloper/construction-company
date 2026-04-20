// pages/AboutPage/AboutPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import SEO from '../../components/SEO/SEO';
import { iconComponents, getIconColor, isEmoji } from '../../admin/components/iconLibrary';
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

    // Функция для рендера иконки
    const renderIcon = (iconId, size = 48) => {
        if (!iconId) return <span style={{ fontSize: `${size}px` }}>🔧</span>;

        // Проверяем, является ли иконка эмодзи
        if (isEmoji(iconId)) {
            return <span style={{ fontSize: `${size}px`, display: 'inline-block' }}>{iconId}</span>;
        }

        // React иконка
        const IconComponent = iconComponents[iconId];
        if (IconComponent) {
            const color = getIconColor(iconId);
            return <IconComponent size={size} color={color} />;
        }

        // Fallback
        return <span style={{ fontSize: `${size}px` }}>🔧</span>;
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
                                    <div className="value-icon">
                                        {renderIcon(card.icon, 48)}
                                    </div>
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