import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../../components/SEO/SEO';
import './ProjectsPage.css';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        { id: 'all', name: 'Все проекты', icon: '🏠' },
        { id: 'houses', name: 'Дома', icon: '🏡' },
        { id: 'apartments', name: 'Квартиры', icon: '🏢' },
        { id: 'commercial', name: 'Коммерческие', icon: '🏭' }
    ];

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/projects`);
            setProjects(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(project => {
        const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="projects-page-loading">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <>
            <SEO
                title="Наши проекты - Строительная компания Алматы | Портфолио"
                description="Посмотрите наши реализованные проекты: дома, квартиры, коммерческая недвижимость в Алматы. Фото и описания."
                url="/projects"
            />

            <div className="projects-page">
                {/* Hero Section */}
                <section className="projects-hero">
                    <div className="projects-hero-bg"></div>
                    <div className="container">
                        <h1 data-aos="fade-up">Наши проекты</h1>
                        <p data-aos="fade-up" data-aos-delay="100">
                            Более 150 реализованных объектов в Алматы
                        </p>
                    </div>
                </section>

                {/* Filters Section */}
                <section className="projects-filters">
                    <div className="container">
                        <div className="filters-wrapper" data-aos="fade-up">
                            <div className="category-filters">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(category.id)}
                                    >
                                        <span>{category.icon}</span>
                                        {category.name}
                                    </button>
                                ))}
                            </div>

                            <div className="search-box">
                                <input
                                    type="text"
                                    placeholder="Поиск по проектам..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 21L16 16M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Projects Grid */}
                <section className="projects-grid-section">
                    <div className="container">
                        {filteredProjects.length === 0 ? (
                            <div className="no-projects">
                                <span>🔍</span>
                                <h3>Проекты не найдены</h3>
                                <p>Попробуйте изменить параметры поиска</p>
                            </div>
                        ) : (
                            <div className="projects-grid">
                                {filteredProjects.map((project, index) => (
                                    <div
                                        key={project._id}
                                        className="project-card-large"
                                        data-aos="fade-up"
                                        data-aos-delay={index * 100}
                                    >
                                        <div className="project-image">
                                            <img
                                                src={`${process.env.REACT_APP_IMG_URL}${project.mainImage}`}
                                                alt={project.title}
                                            />
                                            <div className="project-badge">
                                                {project.category === 'houses' ? '🏡 Дом' :
                                                    project.category === 'apartments' ? '🏢 Квартира' : '🏭 Коммерческая'}
                                            </div>
                                        </div>
                                        <div className="project-details">
                                            <h2>{project.title}</h2>
                                            <div className="project-specs">
                                                <div className="spec">
                                                    <span>📍</span>
                                                    <span>{project.location}</span>
                                                </div>
                                                <div className="spec">
                                                    <span>📐</span>
                                                    <span>{project.area} м²</span>
                                                </div>
                                                <div className="spec">
                                                    <span>💰</span>
                                                    <span>от {project.price.toLocaleString()} ₸</span>
                                                </div>
                                            </div>
                                            <p>{project.description.substring(0, 150)}...</p>
                                            <Link to={`/projects/${project._id}`} className="btn btn-primary">
                                                Подробнее
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
};

export default ProjectsPage;