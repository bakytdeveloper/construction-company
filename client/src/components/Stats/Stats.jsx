// components/Stats/Stats.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Stats.css';
import { iconComponents } from '../../admin/components/iconLibrary.js';

const Stats = () => {
    const [data, setData] = useState({
        settings: {
            bgImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            overlayOpacity: 0.15,
            bgType: 'url',
            gradientColors: { color1: '#1a472a', color2: '#0e2a1a', angle: 135 }
        },
        stats: []
    });
    const [counts, setCounts] = useState({});
    const statsRef = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/stats`);
            setData(response.data.data);
            // Инициализируем counts
            const initialCounts = {};
            response.data.data.stats.forEach(stat => {
                initialCounts[stat._id] = 0;
            });
            setCounts(initialCounts);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated && data.stats.length > 0) {
                        setHasAnimated(true);
                        animateNumbers();
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => observer.disconnect();
    }, [data.stats, hasAnimated]);

    const animateNumbers = () => {
        const duration = 2000;
        const step = 16;

        data.stats.forEach((stat) => {
            let current = 0;
            const increment = stat.value / (duration / step);
            const timer = setInterval(() => {
                current += increment;
                if (current >= stat.value) {
                    setCounts(prev => ({ ...prev, [stat._id]: stat.value }));
                    clearInterval(timer);
                } else {
                    setCounts(prev => ({ ...prev, [stat._id]: Math.floor(current) }));
                }
            }, step);
        });
    };

    const getIconComponent = (iconName) => {
        return iconComponents[iconName];
    };

    const renderIcon = (stat) => {
        if (stat.iconType === 'emoji') {
            return <span>{stat.icon || '🏗️'}</span>;
        } else if (stat.iconType === 'react-icon' && stat.reactIconName) {
            const Icon = getIconComponent(stat.reactIconName);
            return Icon ? <Icon /> : <span>🏗️</span>;
        }
        return <span>🏗️</span>;
    };

    const getBackgroundStyle = () => {
        if (data.settings.bgType === 'gradient') {
            return {
                background: `linear-gradient(${data.settings.gradientColors.angle}deg, ${data.settings.gradientColors.color1} 0%, ${data.settings.gradientColors.color2} 100%)`
            };
        }
        return {
            backgroundImage: `url(${data.settings.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        };
    };

    if (loading) {
        return (
            <section className="stats">
                <div className="container">
                    <div className="stats-loading">Загрузка...</div>
                </div>
            </section>
        );
    }

    return (
        <section className="stats" ref={statsRef} style={getBackgroundStyle()}>
            <div className="stats-overlay" style={{ opacity: data.settings.overlayOpacity }}></div>

            <div className="container">
                <div className="stats-grid">
                    {data.stats.map((stat, index) => (
                        <div
                            key={stat._id}
                            className="stat-card"
                            data-aos="zoom-in"
                            data-aos-delay={index * 150}
                        >
                            <div className="stat-icon">{renderIcon(stat)}</div>
                            <div className="stat-number">
                                {counts[stat._id] || 0}+
                            </div>
                            <div className="stat-label">{stat.label}</div>
                            <div className="stat-bar">
                                <div
                                    className="stat-bar-fill"
                                    style={{ width: `${((counts[stat._id] || 0) / stat.value) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;