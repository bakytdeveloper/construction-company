// components/Advantages/Advantages.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Advantages.css';
import { iconComponents } from '../../admin/components/iconLibrary.js';

const Advantages = () => {
    const [data, setData] = useState({
        settings: {
            subtitle: 'Почему выбирают нас',
            title: 'Наши преимущества',
            description: 'Более 150 семей доверили нам строительство своего дома'
        },
        advantages: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdvantages();
    }, []);

    const fetchAdvantages = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/advantages`);
            setData(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching advantages:', error);
            setLoading(false);
        }
    };

    const getIconComponent = (iconName) => {
        return iconComponents[iconName];
    };

    const renderIcon = (advantage) => {
        if (advantage.iconType === 'emoji') {
            return <span className="icon-3d">{advantage.icon || '⭐'}</span>;
        } else if (advantage.iconType === 'react-icon' && advantage.reactIconName) {
            const Icon = getIconComponent(advantage.reactIconName);
            return Icon ? <Icon className="icon-3d" /> : <span className="icon-3d">⭐</span>;
        }
        return <span className="icon-3d">⭐</span>;
    };

    if (loading) {
        return (
            <section className="advantages">
                <div className="container">
                    <div className="advantages-loading">Загрузка...</div>
                </div>
            </section>
        );
    }

    return (
        <section className="advantages">
            <div className="advantages-bg">
                <div className="advantages-bg-overlay"></div>
                <div className="advantages-bg-pattern"></div>
            </div>

            <div className="container">
                <div className="section-header" data-aos="fade-up">
                    <span className="section-subtitle">{data.settings.subtitle}</span>
                    <h2>{data.settings.title}</h2>
                    <p className="section-description">{data.settings.description}</p>
                </div>

                <div className="advantages-grid">
                    {data.advantages.map((adv, index) => (
                        <div
                            key={adv._id}
                            className="advantage-card"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="advantage-card-inner">
                                <div className="advantage-icon" style={{ background: `linear-gradient(135deg, ${adv.color}20, ${adv.color}40)` }}>
                                    {renderIcon(adv)}
                                </div>
                                <h3>{adv.title}</h3>
                                <p>{adv.description}</p>
                                <div className="advantage-shine"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Advantages;