import React, { useEffect, useRef } from 'react';
import './Advantages.css';

const Advantages = () => {
    const advantages = [
        // {
        //     icon: '🏆',
        //     title: '10 лет гарантии',
        //     description: 'Предоставляем расширенную гарантию на все виды работ',
        //     color: '#c9a03d'
        // },
        {
            icon: '⚡',
            title: 'Соблюдение сроков',
            description: 'Точное соблюдение сроков строительства',
            color: '#1a472a'
        },
        {
            icon: '💎',
            title: 'Европейские стандарты',
            description: 'Используем только сертифицированные материалы',
            color: '#c9a03d'
        },
        {
            icon: '👥',
            title: 'Индивидуальный подход',
            description: 'Учитываем все пожелания клиента',
            color: '#1a472a'
        },
        {
            icon: '📋',
            title: 'Юридическая поддержка',
            description: 'Полное сопровождение сделок',
            color: '#c9a03d'
        },
        // {
        //     icon: '🔧',
        //     title: 'Постгарантийное обслуживание',
        //     description: 'Бесплатное обслуживание 2 года',
        //     color: '#1a472a'
        // }
    ];

    return (
        <section className="advantages">
            <div className="advantages-bg">
                <div className="advantages-bg-overlay"></div>
                <div className="advantages-bg-pattern"></div>
            </div>

            <div className="container">
                <div className="section-header" data-aos="fade-up">
                    <span className="section-subtitle">Почему выбирают нас</span>
                    <h2>Наши преимущества</h2>
                    <p className="section-description">
                        Более 150 семей доверили нам строительство своего дома
                    </p>
                </div>

                <div className="advantages-grid">
                    {advantages.map((adv, index) => (
                        <div
                            key={index}
                            className="advantage-card"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="advantage-card-inner">
                                <div className="advantage-icon" style={{ background: `linear-gradient(135deg, ${adv.color}20, ${adv.color}40)` }}>
                                    <span className="icon-3d">{adv.icon}</span>
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