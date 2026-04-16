// // import React, { useState, useEffect } from 'react';
// // import { Link } from 'react-router-dom';
// // import axios from 'axios';
// // import SEO from '../../components/SEO/SEO';
// // import './ProjectsPage.css';
// //
// // const ProjectsPage = () => {
// //     const [projects, setProjects] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [activeCategory, setActiveCategory] = useState('all');
// //     const [searchTerm, setSearchTerm] = useState('');
// //
// //     const categories = [
// //         { id: 'all', name: 'Все проекты', icon: '🏠' },
// //         { id: 'houses', name: 'Дома', icon: '🏡' },
// //         { id: 'apartments', name: 'Квартиры', icon: '🏢' },
// //         { id: 'commercial', name: 'Коммерческие', icon: '🏭' }
// //     ];
// //
// //     useEffect(() => {
// //         fetchProjects();
// //     }, []);
// //
// //     const fetchProjects = async () => {
// //         try {
// //             const response = await axios.get(`${process.env.REACT_APP_API_URL}/projects`);
// //             setProjects(response.data);
// //             setLoading(false);
// //         } catch (error) {
// //             console.error('Error fetching projects:', error);
// //             setLoading(false);
// //         }
// //     };
// //
// //     const filteredProjects = projects.filter(project => {
// //         const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
// //         const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //             project.location.toLowerCase().includes(searchTerm.toLowerCase());
// //         return matchesCategory && matchesSearch;
// //     });
// //
// //     if (loading) {
// //         return (
// //             <div className="projects-page-loading">
// //                 <div className="loader"></div>
// //             </div>
// //         );
// //     }
// //
// //     return (
// //         <>
// //             <SEO
// //                 title="Наши проекты - Строительная компания Алматы | Портфолио"
// //                 description="Посмотрите наши реализованные проекты: дома, квартиры, коммерческая недвижимость в Алматы. Фото и описания."
// //                 url="/projects"
// //             />
// //
// //             <div className="projects-page">
// //                 {/* Hero Section */}
// //                 <section className="projects-hero">
// //                     <div className="projects-hero-bg"></div>
// //                     <div className="container">
// //                         <h1 data-aos="fade-up">Наши проекты</h1>
// //                         <p data-aos="fade-up" data-aos-delay="100">
// //                             Более 150 реализованных объектов в Алматы
// //                         </p>
// //                     </div>
// //                 </section>
// //
// //                 {/* Filters Section */}
// //                 <section className="projects-filters">
// //                     <div className="container">
// //                         <div className="filters-wrapper" data-aos="fade-up">
// //                             <div className="category-filters">
// //                                 {categories.map(category => (
// //                                     <button
// //                                         key={category.id}
// //                                         className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
// //                                         onClick={() => setActiveCategory(category.id)}
// //                                     >
// //                                         <span>{category.icon}</span>
// //                                         {category.name}
// //                                     </button>
// //                                 ))}
// //                             </div>
// //
// //                             <div className="search-box">
// //                                 <input
// //                                     type="text"
// //                                     placeholder="Поиск по проектам..."
// //                                     value={searchTerm}
// //                                     onChange={(e) => setSearchTerm(e.target.value)}
// //                                 />
// //                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
// //                                     <path d="M21 21L16 16M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2"/>
// //                                 </svg>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </section>
// //
// //                 {/* Projects Grid */}
// //                 <section className="projects-grid-section">
// //                     <div className="container">
// //                         {filteredProjects.length === 0 ? (
// //                             <div className="no-projects">
// //                                 <span>🔍</span>
// //                                 <h3>Проекты не найдены</h3>
// //                                 <p>Попробуйте изменить параметры поиска</p>
// //                             </div>
// //                         ) : (
// //                             <div className="projects-grid">
// //                                 {filteredProjects.map((project, index) => (
// //                                     <div
// //                                         key={project._id}
// //                                         className="project-card-large"
// //                                         data-aos="fade-up"
// //                                         data-aos-delay={index * 100}
// //                                     >
// //                                         <div className="project-image">
// //                                             <img
// //                                                 src={`${process.env.REACT_APP_IMG_URL}${project.mainImage}`}
// //                                                 alt={project.title}
// //                                             />
// //                                             <div className="project-badge">
// //                                                 {project.category === 'houses' ? '🏡 Дом' :
// //                                                     project.category === 'apartments' ? '🏢 Квартира' : '🏭 Коммерческая'}
// //                                             </div>
// //                                         </div>
// //                                         <div className="project-details">
// //                                             <h2>{project.title}</h2>
// //                                             <div className="project-specs">
// //                                                 <div className="spec">
// //                                                     <span>📍</span>
// //                                                     <span>{project.location}</span>
// //                                                 </div>
// //                                                 <div className="spec">
// //                                                     <span>📐</span>
// //                                                     <span>{project.area} м²</span>
// //                                                 </div>
// //                                                 <div className="spec">
// //                                                     <span>💰</span>
// //                                                     <span>от {project.price.toLocaleString()} ₸</span>
// //                                                 </div>
// //                                             </div>
// //                                             <p>{project.description.substring(0, 150)}...</p>
// //                                             <Link to={`/projects/${project._id}`} className="btn btn-primary">
// //                                                 Подробнее
// //                                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
// //                                                     <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
// //                                                 </svg>
// //                                             </Link>
// //                                         </div>
// //                                     </div>
// //                                 ))}
// //                             </div>
// //                         )}
// //                     </div>
// //                 </section>
// //             </div>
// //         </>
// //     );
// // };
// //
// // export default ProjectsPage;
//
//
//
//
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import SEO from '../../components/SEO/SEO';
// import './ProjectsPage.css';
//
// const ProjectsPage = () => {
//     const [properties, setProperties] = useState([]);
//     const [complexes, setComplexes] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filters, setFilters] = useState({
//         type: 'all',
//         complex: 'all',
//         status: 'all',
//         search: ''
//     });
//
//     const propertyTypes = [
//         { id: 'all', name: 'Вся недвижимость', icon: '🏠' },
//         { id: 'apartment', name: 'Квартиры', icon: '🏢' },
//         { id: 'commercial', name: 'Коммерческая', icon: '🏭' },
//         { id: 'house', name: 'Частные дома', icon: '🏡' },
//         { id: 'parking', name: 'Парковки', icon: '🅿️' },
//         { id: 'storage', name: 'Кладовые', icon: '📦' }
//     ];
//
//     const statusTypes = [
//         { id: 'all', name: 'Все статусы' },
//         { id: 'ready', name: 'Готовая' },
//         { id: 'under_construction', name: 'Строится' },
//         { id: 'planned', name: 'Планируется' },
//         { id: 'sold', name: 'Продана' }
//     ];
//
//     useEffect(() => {
//         fetchComplexes();
//         fetchProperties();
//     }, []);
//
//     useEffect(() => {
//         fetchProperties();
//     }, [filters]);
//
//     const fetchComplexes = async () => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_API_URL}/complexes`);
//             setComplexes(response.data.data);
//         } catch (error) {
//             console.error('Error fetching complexes:', error);
//         }
//     };
//
//     const fetchProperties = async () => {
//         setLoading(true);
//         try {
//             const params = new URLSearchParams();
//             if (filters.type !== 'all') params.append('type', filters.type);
//             if (filters.complex !== 'all') params.append('complex', filters.complex);
//             if (filters.status !== 'all') params.append('status', filters.status);
//             if (filters.search) params.append('search', filters.search);
//
//             const response = await axios.get(`${process.env.REACT_APP_API_URL}/properties?${params}`);
//             setProperties(response.data.data);
//         } catch (error) {
//             console.error('Error fetching properties:', error);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const getPropertyTypeIcon = (type) => {
//         const icons = {
//             apartment: '🏢',
//             commercial: '🏭',
//             house: '🏡',
//             land: '🌾',
//             parking: '🅿️',
//             storage: '📦'
//         };
//         return icons[type] || '🏠';
//     };
//
//     const getPropertyTypeName = (type) => {
//         const names = {
//             apartment: 'Квартира',
//             commercial: 'Коммерческая',
//             house: 'Частный дом',
//             land: 'Земельный участок',
//             parking: 'Парковочное место',
//             storage: 'Кладовое помещение'
//         };
//         return names[type] || type;
//     };
//
//     const getStatusText = (status) => {
//         const statusMap = {
//             'ready': '✅ Готовая',
//             'under_construction': '🔨 Строится',
//             'planned': '📋 Планируется',
//             'sold': '🔴 Продана'
//         };
//         return statusMap[status] || status;
//     };
//
//     const getStatusClass = (status) => {
//         const classMap = {
//             'ready': 'status-ready',
//             'under_construction': 'status-construction',
//             'planned': 'status-planned',
//             'sold': 'status-sold'
//         };
//         return classMap[status] || '';
//     };
//
//     if (loading) {
//         return (
//             <div className="projects-page-loading">
//                 <div className="loader"></div>
//             </div>
//         );
//     }
//
//     return (
//         <>
//             <SEO
//                 title="Недвижимость в Алматы - Квартиры, дома, коммерческая недвижимость"
//                 description="Продажа квартир в ЖК Алматы, частных домов, коммерческой недвижимости. Большой выбор объектов от застройщика."
//                 url="/projects"
//             />
//
//             <div className="projects-page">
//                 <section className="projects-hero">
//                     <div className="projects-hero-bg"></div>
//                     <div className="container">
//                         <h1 data-aos="fade-up">Недвижимость в Алматы</h1>
//                         <p data-aos="fade-up" data-aos-delay="100">
//                             Квартиры, дома, коммерческая недвижимость от застройщика
//                         </p>
//                     </div>
//                 </section>
//
//                 <section className="projects-filters">
//                     <div className="container">
//                         <div className="filters-wrapper" data-aos="fade-up">
//                             <div className="search-box">
//                                 <input
//                                     type="text"
//                                     placeholder="Поиск по названию, описанию, локации..."
//                                     value={filters.search}
//                                     onChange={(e) => setFilters({...filters, search: e.target.value})}
//                                 />
//                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                                     <path d="M21 21L16 16M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2"/>
//                                 </svg>
//                             </div>
//
//                             <div className="filter-group">
//                                 <label>Тип недвижимости:</label>
//                                 <div className="filter-buttons">
//                                     {propertyTypes.map(type => (
//                                         <button
//                                             key={type.id}
//                                             className={`filter-btn ${filters.type === type.id ? 'active' : ''}`}
//                                             onClick={() => setFilters({...filters, type: type.id})}
//                                         >
//                                             <span>{type.icon}</span>
//                                             {type.name}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>
//
//                             {complexes.length > 0 && (
//                                 <div className="filter-group">
//                                     <label>Жилой комплекс:</label>
//                                     <select
//                                         value={filters.complex}
//                                         onChange={(e) => setFilters({...filters, complex: e.target.value})}
//                                         className="filter-select"
//                                     >
//                                         <option value="all">Все ЖК</option>
//                                         {complexes.map(complex => (
//                                             <option key={complex._id} value={complex._id}>
//                                                 {complex.title}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             )}
//
//                             <div className="filter-group">
//                                 <label>Статус:</label>
//                                 <div className="filter-buttons">
//                                     {statusTypes.map(status => (
//                                         <button
//                                             key={status.id}
//                                             className={`filter-btn status-btn ${getStatusClass(status.id)} ${filters.status === status.id ? 'active' : ''}`}
//                                             onClick={() => setFilters({...filters, status: status.id})}
//                                         >
//                                             {status.name}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//
//                 <section className="projects-grid-section">
//                     <div className="container">
//                         {properties.length === 0 ? (
//                             <div className="no-properties">
//                                 <span>🔍</span>
//                                 <h3>Объекты не найдены</h3>
//                                 <p>Попробуйте изменить параметры поиска</p>
//                             </div>
//                         ) : (
//                             <>
//                                 <div className="results-count">
//                                     Найдено: {properties.length} объектов
//                                 </div>
//                                 <div className="properties-grid">
//                                     {properties.map((property, index) => (
//                                         <div
//                                             key={property._id}
//                                             className="property-card"
//                                             data-aos="fade-up"
//                                             data-aos-delay={index * 100}
//                                         >
//                                             <div className="property-image">
//                                                 <img
//                                                     src={property.mainImage.startsWith('http') ? property.mainImage : `${process.env.REACT_APP_IMG_URL}${property.mainImage}`}
//                                                     alt={property.title}
//                                                 />
//                                                 <div className={`property-status-badge ${getStatusClass(property.status)}`}>
//                                                     {getStatusText(property.status)}
//                                                 </div>
//                                                 <div className="property-type-badge">
//                                                     {getPropertyTypeIcon(property.propertyType)} {getPropertyTypeName(property.propertyType)}
//                                                 </div>
//                                             </div>
//                                             <div className="property-details">
//                                                 <h3>{property.title}</h3>
//                                                 <div className="property-location">
//                                                     📍 {property.location}
//                                                 </div>
//                                                 {property.residentialComplex && (
//                                                     <div className="property-complex">
//                                                         🏢 ЖК: {property.residentialComplex.title}
//                                                     </div>
//                                                 )}
//                                                 <div className="property-specs">
//                                                     <div className="spec">
//                                                         <span>📐</span>
//                                                         <span>{property.area} м²</span>
//                                                     </div>
//                                                     {property.rooms && (
//                                                         <div className="spec">
//                                                             <span>🛏️</span>
//                                                             <span>{property.rooms} комн.</span>
//                                                         </div>
//                                                     )}
//                                                     {property.floor && (
//                                                         <div className="spec">
//                                                             <span>🏗️</span>
//                                                             <span>{property.floor}/{property.totalFloors || '?'} этаж</span>
//                                                         </div>
//                                                     )}
//                                                     <div className="spec price">
//                                                         <span>💰</span>
//                                                         <span>{property.price.toLocaleString()} ₸</span>
//                                                     </div>
//                                                 </div>
//                                                 <p className="property-description">
//                                                     {property.description.substring(0, 120)}...
//                                                 </p>
//                                                 <Link to={`/property/${property._id}`} className="btn btn-primary">
//                                                     Подробнее
//                                                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                                                         <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
//                                                     </svg>
//                                                 </Link>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 </section>
//             </div>
//         </>
//     );
// };
//
// export default ProjectsPage;




import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../../components/SEO/SEO';
import './ProjectsPage.css';

const ProjectsPage = () => {
    const [properties, setProperties] = useState([]);
    const [complexes, setComplexes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: 'all',
        complex: 'all',
        status: 'all',
        search: ''
    });

    const propertyTypes = [
        { id: 'all', name: 'Вся недвижимость', icon: '🏠' },
        { id: 'apartment', name: 'Квартиры', icon: '🏢' },
        { id: 'commercial', name: 'Коммерческая', icon: '🏭' },
        { id: 'house', name: 'Частные дома', icon: '🏡' },
        { id: 'parking', name: 'Парковки', icon: '🅿️' },
        { id: 'storage', name: 'Кладовые', icon: '📦' }
    ];

    const statusTypes = [
        { id: 'all', name: 'Все статусы' },
        { id: 'ready', name: 'Готовая', class: 'pp-status-ready' },
        { id: 'under_construction', name: 'Строится', class: 'pp-status-construction' },
        { id: 'planned', name: 'Планируется', class: 'pp-status-planned' },
        { id: 'sold', name: 'Продана', class: 'pp-status-sold' }
    ];

    useEffect(() => {
        fetchComplexes();
        fetchProperties();
    }, []);

    useEffect(() => {
        fetchProperties();
    }, [filters]);

    const fetchComplexes = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/complexes`);
            setComplexes(response.data.data || []);
        } catch (error) {
            console.error('Error fetching complexes:', error);
        }
    };

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.type !== 'all') params.append('type', filters.type);
            if (filters.complex !== 'all') params.append('complex', filters.complex);
            if (filters.status !== 'all') params.append('status', filters.status);
            if (filters.search) params.append('search', filters.search);

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/properties?${params}`);
            setProperties(response.data.data || []);
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPropertyTypeIcon = (type) => {
        const icons = {
            apartment: '🏢',
            commercial: '🏭',
            house: '🏡',
            land: '🌾',
            parking: '🅿️',
            storage: '📦'
        };
        return icons[type] || '🏠';
    };

    const getPropertyTypeName = (type) => {
        const names = {
            apartment: 'Квартира',
            commercial: 'Коммерческая',
            house: 'Частный дом',
            land: 'Земельный участок',
            parking: 'Парковка',
            storage: 'Кладовая'
        };
        return names[type] || type;
    };

    const getStatusText = (status) => {
        const statusMap = {
            'ready': 'Готовая',
            'under_construction': 'Строится',
            'planned': 'Планируется',
            'sold': 'Продана'
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
        const classMap = {
            'ready': 'pp-status-ready',
            'under_construction': 'pp-status-construction',
            'planned': 'pp-status-planned',
            'sold': 'pp-status-sold'
        };
        return classMap[status] || '';
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/placeholder-image.jpg';
        if (imagePath.startsWith('http')) return imagePath;
        if (imagePath.startsWith('/uploads')) {
            return `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${imagePath}`;
        }
        return imagePath;
    };

    if (loading) {
        return (
            <div className="pp-loading">
                <div className="pp-loader"></div>
            </div>
        );
    }

    return (
        <>
            <SEO
                title="Недвижимость в Алматы - Квартиры, дома, коммерческая недвижимость"
                description="Продажа квартир в ЖК Алматы, частных домов, коммерческой недвижимости. Большой выбор объектов от застройщика."
                url="/projects"
            />

            <div className="pp-projects-page">
                {/* Hero Section - компактный */}
                <section className="pp-hero">
                    <div className="pp-hero-bg"></div>
                    <div className="pp-container">
                        <div className="pp-breadcrumbs">
                            <Link to="/">Главная</Link>
                            <span className="pp-separator">/</span>
                            <span className="pp-current">Недвижимость</span>
                        </div>
                        <div className="pp-projects-page-title">
                            <h1 data-aos="fade-up">Недвижимость в Алматы</h1>
                            <p data-aos="fade-up" data-aos-delay="100">
                                Квартиры, дома, коммерческая недвижимость от застройщика
                            </p>
                        </div>
                    </div>
                </section>

                {/* Filters Section - компактный */}
                <section className="pp-filters">
                    <div className="pp-container">
                        <div className="pp-filters-wrapper" data-aos="fade-up">
                            <div className="pp-search-box">
                                <input
                                    className="pp-search-box-input"
                                    type="text"
                                    placeholder="Поиск по названию, локации..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                                />
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 21L16 16M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </div>

                            <div className="pp-filter-group">
                                <div className="pp-filter-buttons">
                                    {propertyTypes.map(type => (
                                        <button
                                            key={type.id}
                                            className={`pp-filter-btn ${filters.type === type.id ? 'pp-active' : ''}`}
                                            onClick={() => setFilters({...filters, type: type.id})}
                                        >
                                            <span>{type.icon}</span>
                                            {type.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pp-filter-row">
                                {complexes.length > 0 && (
                                    <div className="pp-filter-item">
                                        <select
                                            value={filters.complex}
                                            onChange={(e) => setFilters({...filters, complex: e.target.value})}
                                            className="pp-select"
                                        >
                                            <option value="all">Все ЖК</option>
                                            {complexes.map(complex => (
                                                <option key={complex._id} value={complex._id}>
                                                    {complex.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="pp-filter-item">
                                    <div className="pp-status-buttons">
                                        {statusTypes.map(status => (
                                            <button
                                                key={status.id}
                                                className={`pp-status-btn ${getStatusClass(status.id)} ${filters.status === status.id ? 'pp-active' : ''}`}
                                                onClick={() => setFilters({...filters, status: status.id})}
                                            >
                                                {status.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Results Section */}
                <section className="pp-results">
                    <div className="pp-container">
                        {properties.length === 0 ? (
                            <div className="pp-no-results">
                                <span>🔍</span>
                                <h3>Объекты не найдены</h3>
                                <p>Попробуйте изменить параметры поиска</p>
                            </div>
                        ) : (
                            <>
                                <div className="pp-results-header">
                                    <div className="pp-results-count">
                                        Найдено: <strong>{properties.length}</strong> объектов
                                    </div>
                                    <div className="pp-results-sort">
                                        <span>Сортировка:</span>
                                        <select className="pp-sort-select">
                                            <option>По умолчанию</option>
                                            <option>Сначала дешевле</option>
                                            <option>Сначала дороже</option>
                                            <option>По площади</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pp-properties-grid">
                                    {properties.map((property, index) => (
                                        <div
                                            key={property._id}
                                            className="pp-property-card"
                                            data-aos="fade-up"
                                            data-aos-delay={Math.min(index * 50, 300)}
                                        >
                                            <div className="pp-card-image">
                                                <img
                                                    src={getImageUrl(property.mainImage)}
                                                    alt={property.title}
                                                    loading="lazy"
                                                />
                                                <div className={`pp-card-status ${getStatusClass(property.status)}`}>
                                                    {getStatusText(property.status)}
                                                </div>
                                                <div className="pp-card-type">
                                                    {getPropertyTypeIcon(property.propertyType)} {getPropertyTypeName(property.propertyType)}
                                                </div>
                                            </div>
                                            <div className="pp-card-content">
                                                <h3>{property.title}</h3>
                                                <div className="pp-card-location">
                                                    📍 {property.location}
                                                </div>
                                                {property.residentialComplex && (
                                                    <div className="pp-card-complex">
                                                        🏢 {property.residentialComplex.title}
                                                    </div>
                                                )}
                                                <div className="pp-card-specs">
                                                    <div className="pp-spec-item">
                                                        <span>📐</span>
                                                        <span>{property.area} м²</span>
                                                    </div>
                                                    {property.rooms && (
                                                        <div className="pp-spec-item">
                                                            <span>🛏️</span>
                                                            <span>{property.rooms} комн.</span>
                                                        </div>
                                                    )}
                                                    {property.floor && (
                                                        <div className="pp-spec-item">
                                                            <span>🏗️</span>
                                                            <span>{property.floor}{property.totalFloors ? `/${property.totalFloors}` : ''} эт.</span>
                                                        </div>
                                                    )}
                                                    <div className="pp-spec-item pp-price">
                                                        <span>💰</span>
                                                        <span>{property.price.toLocaleString()} ₸</span>
                                                    </div>
                                                </div>
                                                <p className="pp-card-description">
                                                    {property.description.substring(0, 100)}...
                                                </p>
                                                <Link to={`/property/${property._id}`} className="pp-btn pp-btn-primary">
                                                    Подробнее
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
};

export default ProjectsPage;