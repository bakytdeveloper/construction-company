import React, { useEffect, useState, useRef } from 'react';
import './Stats.css';

const Stats = () => {
    const [counts, setCounts] = useState({
        projects: 0,
        clients: 0,
        experience: 0,
        awards: 0
    });
    const statsRef = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    const statsData = [
        { id: 'projects', label: 'Построенных объектов', value: 156, icon: '🏗️' },
        { id: 'clients', label: 'Довольных клиентов', value: 142, icon: '👨‍👩‍👧‍👦' },
        { id: 'experience', label: 'Лет на рынке', value: 12, icon: '📅' },
        { id: 'awards', label: 'Наград и премий', value: 18, icon: '🏆' }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
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
    }, [hasAnimated]);

    const animateNumbers = () => {
        const duration = 2000;
        const step = 16;
        const steps = duration / step;

        statsData.forEach((stat) => {
            let current = 0;
            const increment = stat.value / steps;
            const timer = setInterval(() => {
                current += increment;
                if (current >= stat.value) {
                    setCounts(prev => ({ ...prev, [stat.id]: stat.value }));
                    clearInterval(timer);
                } else {
                    setCounts(prev => ({ ...prev, [stat.id]: Math.floor(current) }));
                }
            }, step);
        });
    };

    return (
        <section className="stats" ref={statsRef}>
            <div className="stats-bg-video">
                <div className="stats-overlay"></div>
            </div>

            <div className="container">
                <div className="stats-grid">
                    {statsData.map((stat, index) => (
                        <div
                            key={stat.id}
                            className="stat-card"
                            data-aos="zoom-in"
                            data-aos-delay={index * 150}
                        >
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-number">
                                {counts[stat.id]}+
                            </div>
                            <div className="stat-label">{stat.label}</div>
                            <div className="stat-bar">
                                <div
                                    className="stat-bar-fill"
                                    style={{ width: `${(counts[stat.id] / stat.value) * 100}%` }}
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