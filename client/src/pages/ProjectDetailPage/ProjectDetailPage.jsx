import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../../components/SEO/SEO';
import './ProjectDetailPage.css';

const ProjectDetailPage = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        fetchProject();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchProject = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/projects/${id}`);
            setProject(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching project:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="project-detail-loading">
                <div className="loader"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="project-not-found">
                <h2>Проект не найден</h2>
                <Link to="/projects" className="btn btn-primary">Вернуться к проектам</Link>
            </div>
        );
    }

    return (
        <>
            <SEO
                title={`${project.title} - Проект строительной компании Алматы`}
                description={project.description.substring(0, 160)}
                url={`/projects/${id}`}
            />

            <div className="project-detail-page">
                {/* Hero Section */}
                <section className="detail-hero">
                    <div className="detail-hero-bg">
                        <img src={`${process.env.REACT_APP_IMG_URL}${project.mainImage}`} alt={project.title} />
                        <div className="detail-hero-overlay"></div>
                    </div>
                    <div className="container">
                        <div className="detail-hero-content">
                            <div className="breadcrumbs">
                                <Link to="/">Главная</Link>
                                <span>/</span>
                                <Link to="/projects">Проекты</Link>
                                <span>/</span>
                                <span>{project.title}</span>
                            </div>
                            <h1 data-aos="fade-up">{project.title}</h1>
                            <div className="detail-badges" data-aos="fade-up" data-aos-delay="100">
                                <span className="badge">📍 {project.location}</span>
                                <span className="badge">📐 {project.area} м²</span>
                                <span className="badge">💰 от {project.price.toLocaleString()} ₸</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Gallery Section */}
                <section className="detail-gallery">
                    <div className="container">
                        <div className="gallery-main" data-aos="fade-up">
                            <img
                                src={`${process.env.REACT_APP_IMG_URL}${project.images[selectedImage] || project.mainImage}`}
                                alt={project.title}
                            />
                        </div>
                        <div className="gallery-thumbs" data-aos="fade-up" data-aos-delay="100">
                            {project.images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`thumb ${selectedImage === index ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <img src={`${process.env.REACT_APP_IMG_URL}${image}`} alt={`${project.title} ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Info Section */}
                <section className="detail-info">
                    <div className="container">
                        <div className="info-grid">
                            <div className="info-description" data-aos="fade-right">
                                <h2>Описание проекта</h2>
                                <p>{project.description}</p>

                                {project.features && project.features.length > 0 && (
                                    <>
                                        <h3>Особенности проекта</h3>
                                        <ul className="features-list">
                                            {project.features.map((feature, index) => (
                                                <li key={index}>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>

                            <div className="info-sidebar" data-aos="fade-left">
                                <div className="consultation-card">
                                    <h3>Интересует этот проект?</h3>
                                    <p>Получите детальную консультацию</p>
                                    <form className="quick-form">
                                        <input type="text" placeholder="Ваше имя" />
                                        <input type="tel" placeholder="Телефон" />
                                        <button type="submit" className="btn btn-primary">
                                            Получить консультацию
                                        </button>
                                    </form>
                                    <div className="contact-alternative">
                                        <p>Или позвоните нам:</p>
                                        <a href="tel:+77771234567">+7 (777) 123-45-67</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Similar Projects */}
                <section className="similar-projects">
                    <div className="container">
                        <h2 data-aos="fade-up">Похожие проекты</h2>
                        <div className="similar-grid">
                            {/* Здесь можно добавить похожие проекты */}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default ProjectDetailPage;