// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import Modal from 'react-modal';
// import './ProjectsShowcase.css';
//
// Modal.setAppElement('#root');
//
// const ProjectsShowcase = () => {
//     const [projects, setProjects] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedProject, setSelectedProject] = useState(null);
//     const [modalIsOpen, setModalIsOpen] = useState(false);
//
//     useEffect(() => {
//         fetchProjects();
//     }, []);
//
//     const fetchProjects = async () => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_API_URL}/projects`);
//             setProjects(response.data.slice(0, 6));
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching projects:', error);
//             setLoading(false);
//         }
//     };
//
//     const openModal = (project) => {
//         setSelectedProject(project);
//         setModalIsOpen(true);
//     };
//
//     const closeModal = () => {
//         setModalIsOpen(false);
//         setSelectedProject(null);
//     };
//
//     if (loading) {
//         return (
//             <div className="projects-loading">
//                 <div className="loader"></div>
//             </div>
//         );
//     }
//
//     return (
//         <section className="projects-showcase">
//             <div className="container">
//                 <div className="section-header" data-aos="fade-up">
//                     <span className="section-subtitle">Наши работы</span>
//                     <h2>Лучшие проекты</h2>
//                     <p className="section-description">
//                         Реализованные проекты, которыми мы гордимся
//                     </p>
//                 </div>
//
//                 <div className="projects-grid">
//                     {projects.map((project, index) => (
//                         <div
//                             key={project._id}
//                             className="project-card"
//                             data-aos="fade-up"
//                             data-aos-delay={index * 100}
//                             onClick={() => openModal(project)}
//                         >
//                             <div className="project-image-wrapper">
//                                 <img
//                                     src={`${process.env.REACT_APP_IMG_URL}${project.mainImage}`}
//                                     alt={project.title}
//                                     loading="lazy"
//                                 />
//                                 <div className="project-overlay">
//                                     <div className="project-overlay-content">
//                     <span className="project-category">
//                       {project.category === 'houses' ? '🏠 Дом' :
//                           project.category === 'apartments' ? '🏢 Квартира' : '🏭 Коммерческая'}
//                     </span>
//                                         <button className="project-view-btn">
//                                             Смотреть проект
//                                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                                                 <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
//                                             </svg>
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="project-info">
//                                 <h3>{project.title}</h3>
//                                 <div className="project-meta">
//                                     <span>📍 {project.location}</span>
//                                     <span>📐 {project.area} м²</span>
//                                     <span>💰 от {project.price.toLocaleString()} ₸</span>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//
//                 <div className="projects-cta" data-aos="fade-up">
//                     <Link to="/projects" className="btn btn-primary">
//                         Все проекты
//                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                             <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
//                         </svg>
//                     </Link>
//                 </div>
//             </div>
//
//             {/* Modal для детального просмотра */}
//             <Modal
//                 isOpen={modalIsOpen}
//                 onRequestClose={closeModal}
//                 className="project-modal"
//                 overlayClassName="project-modal-overlay"
//             >
//                 {selectedProject && (
//                     <div className="modal-content">
//                         <button className="modal-close" onClick={closeModal}>×</button>
//
//                         <div className="modal-gallery">
//                             <img
//                                 src={`${process.env.REACT_APP_IMG_URL}${selectedProject.mainImage}`}
//                                 alt={selectedProject.title}
//                                 className="modal-main-image"
//                             />
//                             <div className="modal-thumbnails">
//                                 {selectedProject.images?.slice(0, 4).map((img, idx) => (
//                                     <img
//                                         key={idx}
//                                         src={`${process.env.REACT_APP_IMG_URL}${img}`}
//                                         alt={`${selectedProject.title} ${idx + 1}`}
//                                         className="modal-thumb"
//                                     />
//                                 ))}
//                             </div>
//                         </div>
//
//                         <div className="modal-info">
//                             <h2>{selectedProject.title}</h2>
//                             <div className="modal-details">
//                                 <div className="detail-item">
//                                     <strong>📍 Локация:</strong> {selectedProject.location}
//                                 </div>
//                                 <div className="detail-item">
//                                     <strong>📐 Площадь:</strong> {selectedProject.area} м²
//                                 </div>
//                                 <div className="detail-item">
//                                     <strong>💰 Стоимость:</strong> от {selectedProject.price.toLocaleString()} ₸
//                                 </div>
//                             </div>
//                             <p className="modal-description">{selectedProject.description}</p>
//                             <div className="modal-features">
//                                 <h4>Особенности проекта:</h4>
//                                 <ul>
//                                     {selectedProject.features?.map((feature, idx) => (
//                                         <li key={idx}>{feature}</li>
//                                     ))}
//                                 </ul>
//                             </div>
//                             <button className="btn btn-primary modal-contact-btn">
//                                 Получить консультацию
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </Modal>
//         </section>
//     );
// };
//
// export default ProjectsShowcase;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import './ProjectsShowcase.css';

Modal.setAppElement('#root');

const ProjectsShowcase = () => {
    const [complexes, setComplexes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplex, setSelectedComplex] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        fetchComplexes();
    }, []);

    const fetchComplexes = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/complexes`);
            setComplexes(response.data.data.slice(0, 6));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching complexes:', error);
            setLoading(false);
        }
    };

    const openModal = (complex) => {
        setSelectedComplex(complex);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedComplex(null);
    };

    const getStatusText = (status) => {
        const statusMap = {
            'completed': '🏗️ Построен',
            'under_construction': '🔨 Строится',
            'planned': '📋 Планируется'
        };
        return statusMap[status] || status;
    };

    if (loading) {
        return (
            <div className="projects-loading">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <section className="projects-showcase">
            <div className="container">
                <div className="section-header" data-aos="fade-up">
                    <span className="section-subtitle">Наши Жилые Комплексы</span>
                    <h2>Лучшие ЖК Алматы</h2>
                    <p className="section-description">
                        Современные жилые комплексы с развитой инфраструктурой
                    </p>
                </div>

                <div className="projects-grid">
                    {complexes.map((complex, index) => (
                        <div
                            key={complex._id}
                            className="project-card"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                            onClick={() => openModal(complex)}
                        >
                            <div className="project-image-wrapper">
                                <img
                                    src={complex.mainImage.startsWith('http') ? complex.mainImage : `${process.env.REACT_APP_IMG_URL}${complex.mainImage}`}
                                    alt={complex.title}
                                    loading="lazy"
                                />
                                <div className="project-overlay">
                                    <div className="project-overlay-content">
                                        <span className="project-category">
                                            {getStatusText(complex.status)}
                                        </span>
                                        <button className="project-view-btn">
                                            Подробнее о ЖК
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="project-info">
                                <h3>{complex.title}</h3>
                                <div className="project-meta">
                                    <span>📍 {complex.location}</span>
                                    {complex.specifications?.apartments && (
                                        <span>🏢 {complex.specifications.apartments} кв.</span>
                                    )}
                                    {complex.specifications?.floors && (
                                        <span>🏗️ {complex.specifications.floors} эт.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="projects-cta" data-aos="fade-up">
                    <Link to="/projects" className="btn btn-primary">
                        Вся недвижимость
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Modal для детального просмотра ЖК */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="project-modal"
                overlayClassName="project-modal-overlay"
            >
                {selectedComplex && (
                    <div className="projects-showcase-modal-content">
                        <button className="modal-close" onClick={closeModal}>×</button>

                        <div className="modal-gallery">
                            <img
                                src={selectedComplex.mainImage.startsWith('http') ? selectedComplex.mainImage : `${process.env.REACT_APP_IMG_URL}${selectedComplex.mainImage}`}
                                alt={selectedComplex.title}
                                className="modal-main-image"
                            />
                        </div>

                        <div className="modal-info">
                            <h2>{selectedComplex.title}</h2>
                            <div className="modal-details">
                                <div className="detail-item">
                                    <strong>📍 Локация:</strong> {selectedComplex.location}
                                </div>
                                {selectedComplex.specifications?.buildYear && (
                                    <div className="detail-item">
                                        <strong>📅 Год постройки:</strong> {selectedComplex.specifications.buildYear}
                                    </div>
                                )}
                                <div className="detail-item">
                                    <strong>📊 Статус:</strong> {getStatusText(selectedComplex.status)}
                                </div>
                            </div>
                            <p className="modal-description">{selectedComplex.description}</p>

                            {selectedComplex.features && selectedComplex.features.length > 0 && (
                                <div className="modal-features">
                                    <h4>Особенности ЖК:</h4>
                                    <ul>
                                        {selectedComplex.features.map((feature, idx) => (
                                            <li key={idx}>{feature}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <Link to={`/complex/${selectedComplex._id}`} className="btn btn-primary modal-contact-btn">
                                Посмотреть недвижимость в ЖК
                            </Link>
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
};

export default ProjectsShowcase;