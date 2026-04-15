// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import './AdminPanel.css';
//
// const AdminPanel = () => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [loginData, setLoginData] = useState({ email: '', password: '' });
//     const [activeTab, setActiveTab] = useState('projects');
//     const [projects, setProjects] = useState([]);
//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showProjectModal, setShowProjectModal] = useState(false);
//     const [editingProject, setEditingProject] = useState(null);
//     const [projectForm, setProjectForm] = useState({
//         title: '', titleKz: '', category: 'houses', description: '',
//         descriptionKz: '', location: '', area: '', price: '', features: []
//     });
//     const [featureInput, setFeatureInput] = useState('');
//     const [selectedImages, setSelectedImages] = useState([]);
//
//     useEffect(() => {
//         const token = localStorage.getItem('adminToken');
//         if (token) {
//             setIsAuthenticated(true);
//             fetchProjects();
//             fetchMessages();
//         }
//     }, [isAuthenticated]);
//
//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin/login`, loginData);
//             localStorage.setItem('adminToken', response.data.token);
//             setIsAuthenticated(true);
//             toast.success('Вход выполнен успешно!');
//             fetchProjects();
//             fetchMessages();
//         } catch (error) {
//             toast.error('Неверный email или пароль');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleLogout = () => {
//         localStorage.removeItem('adminToken');
//         setIsAuthenticated(false);
//         toast.success('Выход выполнен');
//     };
//
//     const fetchProjects = async () => {
//         try {
//             const token = localStorage.getItem('adminToken');
//             const response = await axios.get(`${process.env.REACT_APP_API_URL}/projects`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setProjects(response.data);
//         } catch (error) {
//             console.error('Error fetching projects:', error);
//         }
//     };
//
//     const fetchMessages = async () => {
//         try {
//             const token = localStorage.getItem('adminToken');
//             const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/contacts`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setMessages(response.data);
//         } catch (error) {
//             console.error('Error fetching messages:', error);
//         }
//     };
//
//     const handleCreateProject = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append('data', JSON.stringify(projectForm));
//         selectedImages.forEach(img => formData.append('images', img));
//
//         try {
//             const token = localStorage.getItem('adminToken');
//             await axios.post(`${process.env.REACT_APP_API_URL}/admin/projects`, formData, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             toast.success('Проект создан успешно!');
//             setShowProjectModal(false);
//             resetProjectForm();
//             fetchProjects();
//         } catch (error) {
//             toast.error('Ошибка при создании проекта');
//         }
//     };
//
//     const handleDeleteProject = async (id) => {
//         if (window.confirm('Удалить проект?')) {
//             try {
//                 const token = localStorage.getItem('adminToken');
//                 await axios.delete(`${process.env.REACT_APP_API_URL}/admin/projects/${id}`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 toast.success('Проект удален');
//                 fetchProjects();
//             } catch (error) {
//                 toast.error('Ошибка при удалении');
//             }
//         }
//     };
//
//     const resetProjectForm = () => {
//         setProjectForm({
//             title: '', titleKz: '', category: 'houses', description: '',
//             descriptionKz: '', location: '', area: '', price: '', features: []
//         });
//         setSelectedImages([]);
//         setFeatureInput('');
//         setEditingProject(null);
//     };
//
//     const addFeature = () => {
//         if (featureInput.trim()) {
//             setProjectForm({
//                 ...projectForm,
//                 features: [...projectForm.features, featureInput.trim()]
//             });
//             setFeatureInput('');
//         }
//     };
//
//     const removeFeature = (index) => {
//         setProjectForm({
//             ...projectForm,
//             features: projectForm.features.filter((_, i) => i !== index)
//         });
//     };
//
//     const markMessageAsRead = async (id) => {
//         try {
//             const token = localStorage.getItem('adminToken');
//             await axios.put(`${process.env.REACT_APP_API_URL}/admin/contacts/${id}/read`, {}, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             fetchMessages();
//             toast.success('Сообщение отмечено как прочитанное');
//         } catch (error) {
//             toast.error('Ошибка');
//         }
//     };
//
//     if (!isAuthenticated) {
//         return (
//             <div className="admin-login">
//                 <div className="login-container">
//                     <div className="login-header">
//                         <h2>Админ панель</h2>
//                         <p>Введите учетные данные для входа</p>
//                     </div>
//                     <form onSubmit={handleLogin}>
//                         <div className="input-group">
//                             <input
//                                 type="email"
//                                 placeholder="Email"
//                                 value={loginData.email}
//                                 onChange={(e) => setLoginData({...loginData, email: e.target.value})}
//                                 required
//                             />
//                         </div>
//                         <div className="input-group">
//                             <input
//                                 type="password"
//                                 placeholder="Пароль"
//                                 value={loginData.password}
//                                 onChange={(e) => setLoginData({...loginData, password: e.target.value})}
//                                 required
//                             />
//                         </div>
//                         <button type="submit" disabled={loading}>
//                             {loading ? 'Вход...' : 'Войти'}
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         );
//     }
//
//     return (
//         <div className="admin-panel">
//             <div className="admin-header">
//                 <h1>Админ панель</h1>
//                 <button onClick={handleLogout} className="logout-btn">Выйти</button>
//             </div>
//
//             <div className="admin-tabs">
//                 <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>
//                     📁 Проекты ({projects.length})
//                 </button>
//                 <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>
//                     ✉️ Сообщения ({messages.filter(m => !m.isRead).length})
//                 </button>
//             </div>
//
//             <div className="admin-content">
//                 {activeTab === 'projects' && (
//                     <div className="projects-management">
//                         <button className="create-btn" onClick={() => setShowProjectModal(true)}>
//                             + Создать проект
//                         </button>
//
//                         <div className="projects-table">
//                             <table>
//                                 <thead>
//                                 <tr>
//                                     <th>Фото</th>
//                                     <th>Название</th>
//                                     <th>Категория</th>
//                                     <th>Локация</th>
//                                     <th>Цена</th>
//                                     <th>Действия</th>
//                                 </tr>
//                                 </thead>
//                                 <tbody>
//                                 {projects.map(project => (
//                                     <tr key={project._id}>
//                                         <td><img src={`${process.env.REACT_APP_IMG_URL}${project.mainImage}`} alt={project.title} width="50" /></td>
//                                         <td>{project.title}</td>
//                                         <td>{project.category}</td>
//                                         <td>{project.location}</td>
//                                         <td>{project.price.toLocaleString()} ₸</td>
//                                         <td>
//                                             <button className="delete-btn" onClick={() => handleDeleteProject(project._id)}>🗑️</button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 )}
//
//                 {activeTab === 'messages' && (
//                     <div className="messages-management">
//                         <div className="messages-list">
//                             {messages.map(message => (
//                                 <div key={message._id} className={`message-card ${!message.isRead ? 'unread' : ''}`}>
//                                     <div className="message-header">
//                                         <h3>{message.name}</h3>
//                                         <span className="message-date">{new Date(message.createdAt).toLocaleString()}</span>
//                                     </div>
//                                     <div className="message-details">
//                                         <p><strong>Email:</strong> {message.email}</p>
//                                         <p><strong>Телефон:</strong> {message.phone}</p>
//                                         <p><strong>Тип проекта:</strong> {message.projectType}</p>
//                                         <p><strong>Сообщение:</strong> {message.message}</p>
//                                     </div>
//                                     {!message.isRead && (
//                                         <button className="read-btn" onClick={() => markMessageAsRead(message._id)}>
//                                             Отметить как прочитанное
//                                         </button>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </div>
//
//             {/* Modal for create/edit project */}
//             {showProjectModal && (
//                 <div className="modal-overlay" onClick={() => setShowProjectModal(false)}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         <h2>{editingProject ? 'Редактировать проект' : 'Создать проект'}</h2>
//                         <form onSubmit={handleCreateProject}>
//                             <div className="form-row">
//                                 <input
//                                     type="text"
//                                     placeholder="Название (RU)"
//                                     value={projectForm.title}
//                                     onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
//                                     required
//                                 />
//                                 <input
//                                     type="text"
//                                     placeholder="Название (KZ)"
//                                     value={projectForm.titleKz}
//                                     onChange={(e) => setProjectForm({...projectForm, titleKz: e.target.value})}
//                                 />
//                             </div>
//
//                             <select
//                                 value={projectForm.category}
//                                 onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
//                                 required
//                             >
//                                 <option value="houses">Дома</option>
//                                 <option value="apartments">Квартиры</option>
//                                 <option value="commercial">Коммерческие</option>
//                             </select>
//
//                             <textarea
//                                 placeholder="Описание (RU)"
//                                 value={projectForm.description}
//                                 onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
//                                 required
//                                 rows="4"
//                             ></textarea>
//
//                             <textarea
//                                 placeholder="Описание (KZ)"
//                                 value={projectForm.descriptionKz}
//                                 onChange={(e) => setProjectForm({...projectForm, descriptionKz: e.target.value})}
//                                 rows="4"
//                             ></textarea>
//
//                             <div className="form-row">
//                                 <input
//                                     type="text"
//                                     placeholder="Локация"
//                                     value={projectForm.location}
//                                     onChange={(e) => setProjectForm({...projectForm, location: e.target.value})}
//                                     required
//                                 />
//                                 <input
//                                     type="number"
//                                     placeholder="Площадь (м²)"
//                                     value={projectForm.area}
//                                     onChange={(e) => setProjectForm({...projectForm, area: e.target.value})}
//                                     required
//                                 />
//                             </div>
//
//                             <input
//                                 type="number"
//                                 placeholder="Цена (₸)"
//                                 value={projectForm.price}
//                                 onChange={(e) => setProjectForm({...projectForm, price: e.target.value})}
//                                 required
//                             />
//
//                             <div className="features-section">
//                                 <div className="features-input">
//                                     <input
//                                         type="text"
//                                         placeholder="Добавить особенность"
//                                         value={featureInput}
//                                         onChange={(e) => setFeatureInput(e.target.value)}
//                                     />
//                                     <button type="button" onClick={addFeature}>+</button>
//                                 </div>
//                                 <div className="features-list">
//                                     {projectForm.features.map((feature, index) => (
//                                         <span key={index} className="feature-tag">
//                       {feature}
//                                             <button type="button" onClick={() => removeFeature(index)}>×</button>
//                     </span>
//                                     ))}
//                                 </div>
//                             </div>
//
//                             <div className="images-section">
//                                 <label>Изображения (можно выбрать несколько)</label>
//                                 <input
//                                     type="file"
//                                     multiple
//                                     accept="image/*"
//                                     onChange={(e) => setSelectedImages(Array.from(e.target.files))}
//                                 />
//                                 {selectedImages.length > 0 && (
//                                     <p>Выбрано файлов: {selectedImages.length}</p>
//                                 )}
//                             </div>
//
//                             <div className="modal-buttons">
//                                 <button type="submit" className="save-btn">Сохранить</button>
//                                 <button type="button" className="cancel-btn" onClick={() => setShowProjectModal(false)}>Отмена</button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default AdminPanel;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AdminPanel.css';

const AdminPanel = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [activeTab, setActiveTab] = useState('complexes');
    const [complexes, setComplexes] = useState([]);
    const [properties, setProperties] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('complex'); // 'complex' or 'property'
    const [editingItem, setEditingItem] = useState(null);
    const [complexForm, setComplexForm] = useState({
        title: '',
        description: '',
        location: '',
        mainImage: '',
        images: [],
        features: [],
        specifications: { floors: '', apartments: '', parking: '', buildYear: '', developer: '' },
        infrastructure: [],
        status: 'completed'
    });
    const [propertyForm, setPropertyForm] = useState({
        title: '',
        description: '',
        propertyType: 'apartment',
        category: 'residential',
        residentialComplex: '',
        location: '',
        area: '',
        price: '',
        rooms: '',
        floor: '',
        totalFloors: '',
        status: 'ready',
        mainImage: '',
        images: [],
        features: [],
        contactPhone: '',
        contactEmail: ''
    });
    const [featureInput, setFeatureInput] = useState('');
    const [infraInput, setInfraInput] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [complexesList, setComplexesList] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            setIsAuthenticated(true);
            fetchComplexes();
            fetchProperties();
            fetchMessages();
            fetchAllComplexes();
        }
    }, [isAuthenticated]);

    const fetchAllComplexes = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/complexes`);
            setComplexesList(response.data.data);
        } catch (error) {
            console.error('Error fetching complexes:', error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin/login`, loginData);
            localStorage.setItem('adminToken', response.data.token);
            setIsAuthenticated(true);
            toast.success('Вход выполнен успешно!');
            fetchComplexes();
            fetchProperties();
            fetchMessages();
            fetchAllComplexes();
        } catch (error) {
            toast.error('Неверный email или пароль');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        toast.success('Выход выполнен');
    };

    const fetchComplexes = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/complexes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComplexes(response.data.data);
        } catch (error) {
            console.error('Error fetching complexes:', error);
        }
    };

    const fetchProperties = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/properties`);
            setProperties(response.data.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/contacts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Ensure messages is an array
            setMessages(response.data.data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        }
    };

    const handleCreateComplex = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('data', JSON.stringify(complexForm));
        selectedImages.forEach(img => formData.append('images', img));

        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(`${process.env.REACT_APP_API_URL}/admin/complexes`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Жилой комплекс создан успешно!');
            setShowModal(false);
            resetForms();
            fetchComplexes();
            fetchAllComplexes();
        } catch (error) {
            toast.error('Ошибка при создании ЖК');
        }
    };

    const handleCreateProperty = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('data', JSON.stringify(propertyForm));
        selectedImages.forEach(img => formData.append('images', img));

        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(`${process.env.REACT_APP_API_URL}/admin/properties`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Объект недвижимости создан успешно!');
            setShowModal(false);
            resetForms();
            fetchProperties();
        } catch (error) {
            toast.error('Ошибка при создании объекта');
        }
    };

    const handleDeleteComplex = async (id) => {
        if (window.confirm('Удалить ЖК? Все связанные объекты недвижимости потеряют привязку.')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`${process.env.REACT_APP_API_URL}/admin/complexes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Жилой комплекс удален');
                fetchComplexes();
                fetchProperties();
                fetchAllComplexes();
            } catch (error) {
                toast.error('Ошибка при удалении');
            }
        }
    };

    const handleDeleteProperty = async (id) => {
        if (window.confirm('Удалить объект недвижимости?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`${process.env.REACT_APP_API_URL}/admin/properties/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Объект удален');
                fetchProperties();
            } catch (error) {
                toast.error('Ошибка при удалении');
            }
        }
    };

    const resetForms = () => {
        setComplexForm({
            title: '',
            description: '',
            location: '',
            mainImage: '',
            images: [],
            features: [],
            specifications: { floors: '', apartments: '', parking: '', buildYear: '', developer: '' },
            infrastructure: [],
            status: 'completed'
        });
        setPropertyForm({
            title: '',
            description: '',
            propertyType: 'apartment',
            category: 'residential',
            residentialComplex: '',
            location: '',
            area: '',
            price: '',
            rooms: '',
            floor: '',
            totalFloors: '',
            status: 'ready',
            mainImage: '',
            images: [],
            features: [],
            contactPhone: '',
            contactEmail: ''
        });
        setSelectedImages([]);
        setFeatureInput('');
        setInfraInput('');
        setEditingItem(null);
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            if (modalType === 'complex') {
                setComplexForm({
                    ...complexForm,
                    features: [...complexForm.features, featureInput.trim()]
                });
            } else {
                setPropertyForm({
                    ...propertyForm,
                    features: [...propertyForm.features, featureInput.trim()]
                });
            }
            setFeatureInput('');
        }
    };

    const removeFeature = (index) => {
        if (modalType === 'complex') {
            setComplexForm({
                ...complexForm,
                features: complexForm.features.filter((_, i) => i !== index)
            });
        } else {
            setPropertyForm({
                ...propertyForm,
                features: propertyForm.features.filter((_, i) => i !== index)
            });
        }
    };

    const addInfrastructure = () => {
        if (infraInput.trim()) {
            setComplexForm({
                ...complexForm,
                infrastructure: [...complexForm.infrastructure, infraInput.trim()]
            });
            setInfraInput('');
        }
    };

    const removeInfrastructure = (index) => {
        setComplexForm({
            ...complexForm,
            infrastructure: complexForm.infrastructure.filter((_, i) => i !== index)
        });
    };

    const markMessageAsRead = async (id) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`${process.env.REACT_APP_API_URL}/admin/contacts/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMessages();
            toast.success('Сообщение отмечено как прочитанное');
        } catch (error) {
            toast.error('Ошибка');
        }
    };

    const openCreateModal = (type) => {
        setModalType(type);
        resetForms();
        setShowModal(true);
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-login">
                <div className="login-container">
                    <div className="login-header">
                        <h2>Админ панель</h2>
                        <p>Введите учетные данные для входа</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Email"
                                value={loginData.email}
                                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Пароль"
                                value={loginData.password}
                                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Вход...' : 'Войти'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h1>Админ панель</h1>
                <button onClick={handleLogout} className="logout-btn">Выйти</button>
            </div>

            <div className="admin-tabs">
                <button className={activeTab === 'complexes' ? 'active' : ''} onClick={() => setActiveTab('complexes')}>
                    🏢 Жилые комплексы ({complexes.length})
                </button>
                <button className={activeTab === 'properties' ? 'active' : ''} onClick={() => setActiveTab('properties')}>
                    🏠 Недвижимость ({properties.length})
                </button>
                <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>
                    ✉️ Сообщения ({Array.isArray(messages) ? messages.filter(m => !m.isRead).length : 0})
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'complexes' && (
                    <div className="complexes-management">
                        <button className="create-btn" onClick={() => openCreateModal('complex')}>
                            + Создать Жилой комплекс
                        </button>

                        <div className="items-table">
                            <table>
                                <thead>
                                <tr>
                                    <th>Фото</th>
                                    <th>Название</th>
                                    <th>Локация</th>
                                    <th>Статус</th>
                                    <th>Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {complexes.map(complex => (
                                    <tr key={complex._id}>
                                        <td>
                                            <img
                                                src={complex.mainImage?.startsWith('http') ? complex.mainImage : `${process.env.REACT_APP_IMG_URL}${complex.mainImage}`}
                                                alt={complex.title}
                                                width="50"
                                                height="50"
                                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        </td>
                                        <td>{complex.title}</td>
                                        <td>{complex.location}</td>
                                        <td>
                                                <span className={`status-badge status-${complex.status}`}>
                                                    {complex.status === 'completed' ? 'Построен' :
                                                        complex.status === 'under_construction' ? 'Строится' : 'Планируется'}
                                                </span>
                                        </td>
                                        <td>
                                            <button className="delete-btn" onClick={() => handleDeleteComplex(complex._id)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'properties' && (
                    <div className="properties-management">
                        <button className="create-btn" onClick={() => openCreateModal('property')}>
                            + Создать объект недвижимости
                        </button>

                        <div className="items-table">
                            <table>
                                <thead>
                                <tr>
                                    <th>Фото</th>
                                    <th>Название</th>
                                    <th>Тип</th>
                                    <th>Локация</th>
                                    <th>Цена</th>
                                    <th>Статус</th>
                                    <th>Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {properties.map(property => (
                                    <tr key={property._id}>
                                        <td>
                                            <img
                                                src={property.mainImage?.startsWith('http') ? property.mainImage : `${process.env.REACT_APP_IMG_URL}${property.mainImage}`}
                                                alt={property.title}
                                                width="50"
                                                height="50"
                                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        </td>
                                        <td>{property.title}</td>
                                        <td>
                                            {property.propertyType === 'apartment' ? 'Квартира' :
                                                property.propertyType === 'commercial' ? 'Коммерческая' :
                                                    property.propertyType === 'house' ? 'Дом' :
                                                        property.propertyType === 'parking' ? 'Парковка' : 'Кладовая'}
                                        </td>
                                        <td>{property.location}</td>
                                        <td>{property.price?.toLocaleString()} ₸</td>
                                        <td>
                                                <span className={`status-badge status-${property.status}`}>
                                                    {property.status === 'ready' ? 'Готова' :
                                                        property.status === 'under_construction' ? 'Строится' :
                                                            property.status === 'planned' ? 'Планируется' : 'Продана'}
                                                </span>
                                        </td>
                                        <td>
                                            <button className="delete-btn" onClick={() => handleDeleteProperty(property._id)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="messages-management">
                        <div className="messages-list">
                            {Array.isArray(messages) && messages.length === 0 ? (
                                <div className="no-messages">Нет сообщений</div>
                            ) : (
                                Array.isArray(messages) && messages.map(message => (
                                    <div key={message._id} className={`message-card ${!message.isRead ? 'unread' : ''}`}>
                                        <div className="message-header">
                                            <h3>{message.name}</h3>
                                            <span className="message-date">{new Date(message.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className="message-details">
                                            <p><strong>Email:</strong> {message.email}</p>
                                            <p><strong>Телефон:</strong> {message.phone}</p>
                                            <p><strong>Тип проекта:</strong> {message.projectType}</p>
                                            <p><strong>Сообщение:</strong> {message.message}</p>
                                        </div>
                                        {!message.isRead && (
                                            <button className="read-btn" onClick={() => markMessageAsRead(message._id)}>
                                                Отметить как прочитанное
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal for create */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                        <h2>{modalType === 'complex' ? 'Создать Жилой комплекс' : 'Создать объект недвижимости'}</h2>

                        {modalType === 'complex' ? (
                            <form onSubmit={handleCreateComplex}>
                                <div className="form-row">
                                    <input
                                        type="text"
                                        placeholder="Название ЖК *"
                                        value={complexForm.title}
                                        onChange={(e) => setComplexForm({...complexForm, title: e.target.value})}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Локация *"
                                        value={complexForm.location}
                                        onChange={(e) => setComplexForm({...complexForm, location: e.target.value})}
                                        required
                                    />
                                </div>

                                <textarea
                                    placeholder="Описание ЖК *"
                                    value={complexForm.description}
                                    onChange={(e) => setComplexForm({...complexForm, description: e.target.value})}
                                    required
                                    rows="3"
                                />

                                <div className="form-row">
                                    <select
                                        value={complexForm.status}
                                        onChange={(e) => setComplexForm({...complexForm, status: e.target.value})}
                                    >
                                        <option value="completed">Построен</option>
                                        <option value="under_construction">Строится</option>
                                        <option value="planned">Планируется</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="URL главного фото"
                                        value={complexForm.mainImage}
                                        onChange={(e) => setComplexForm({...complexForm, mainImage: e.target.value})}
                                    />
                                </div>

                                <div className="features-section">
                                    <label>Особенности ЖК:</label>
                                    <div className="features-input">
                                        <input
                                            type="text"
                                            placeholder="Добавить особенность"
                                            value={featureInput}
                                            onChange={(e) => setFeatureInput(e.target.value)}
                                        />
                                        <button type="button" onClick={addFeature}>+</button>
                                    </div>
                                    <div className="features-list">
                                        {complexForm.features.map((feature, index) => (
                                            <span key={index} className="feature-tag">
                                                {feature}
                                                <button type="button" onClick={() => removeFeature(index)}>×</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="features-section">
                                    <label>Инфраструктура:</label>
                                    <div className="features-input">
                                        <input
                                            type="text"
                                            placeholder="Добавить объект инфраструктуры"
                                            value={infraInput}
                                            onChange={(e) => setInfraInput(e.target.value)}
                                        />
                                        <button type="button" onClick={addInfrastructure}>+</button>
                                    </div>
                                    <div className="features-list">
                                        {complexForm.infrastructure.map((item, index) => (
                                            <span key={index} className="feature-tag">
                                                {item}
                                                <button type="button" onClick={() => removeInfrastructure(index)}>×</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="images-section">
                                    <label>Изображения (можно выбрать несколько файлов)</label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => setSelectedImages(Array.from(e.target.files))}
                                    />
                                    {selectedImages.length > 0 && (
                                        <p>Выбрано файлов: {selectedImages.length}</p>
                                    )}
                                </div>

                                <div className="modal-buttons">
                                    <button type="submit" className="save-btn">Сохранить</button>
                                    <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Отмена</button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleCreateProperty}>
                                <div className="form-row">
                                    <input
                                        type="text"
                                        placeholder="Название объекта *"
                                        value={propertyForm.title}
                                        onChange={(e) => setPropertyForm({...propertyForm, title: e.target.value})}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Локация *"
                                        value={propertyForm.location}
                                        onChange={(e) => setPropertyForm({...propertyForm, location: e.target.value})}
                                        required
                                    />
                                </div>

                                <textarea
                                    placeholder="Описание *"
                                    value={propertyForm.description}
                                    onChange={(e) => setPropertyForm({...propertyForm, description: e.target.value})}
                                    required
                                    rows="3"
                                />

                                <div className="form-row">
                                    <select
                                        value={propertyForm.propertyType}
                                        onChange={(e) => setPropertyForm({...propertyForm, propertyType: e.target.value})}
                                    >
                                        <option value="apartment">Квартира</option>
                                        <option value="commercial">Коммерческая</option>
                                        <option value="house">Частный дом</option>
                                        <option value="parking">Парковка</option>
                                        <option value="storage">Кладовая</option>
                                    </select>
                                    <select
                                        value={propertyForm.status}
                                        onChange={(e) => setPropertyForm({...propertyForm, status: e.target.value})}
                                    >
                                        <option value="ready">Готовая</option>
                                        <option value="under_construction">Строится</option>
                                        <option value="planned">Планируется</option>
                                        <option value="sold">Продана</option>
                                    </select>
                                </div>

                                <div className="form-row">
                                    <input
                                        type="number"
                                        placeholder="Площадь (м²) *"
                                        value={propertyForm.area}
                                        onChange={(e) => setPropertyForm({...propertyForm, area: e.target.value})}
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Цена (₸) *"
                                        value={propertyForm.price}
                                        onChange={(e) => setPropertyForm({...propertyForm, price: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <input
                                        type="number"
                                        placeholder="Количество комнат"
                                        value={propertyForm.rooms}
                                        onChange={(e) => setPropertyForm({...propertyForm, rooms: e.target.value})}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Этаж"
                                        value={propertyForm.floor}
                                        onChange={(e) => setPropertyForm({...propertyForm, floor: e.target.value})}
                                    />
                                </div>

                                {complexesList.length > 0 && (
                                    <select
                                        value={propertyForm.residentialComplex}
                                        onChange={(e) => setPropertyForm({...propertyForm, residentialComplex: e.target.value})}
                                    >
                                        <option value="">Не привязан к ЖК</option>
                                        {complexesList.map(complex => (
                                            <option key={complex._id} value={complex._id}>
                                                {complex.title}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                <input
                                    type="text"
                                    placeholder="URL главного фото"
                                    value={propertyForm.mainImage}
                                    onChange={(e) => setPropertyForm({...propertyForm, mainImage: e.target.value})}
                                />

                                <div className="features-section">
                                    <label>Особенности объекта:</label>
                                    <div className="features-input">
                                        <input
                                            type="text"
                                            placeholder="Добавить особенность"
                                            value={featureInput}
                                            onChange={(e) => setFeatureInput(e.target.value)}
                                        />
                                        <button type="button" onClick={addFeature}>+</button>
                                    </div>
                                    <div className="features-list">
                                        {propertyForm.features.map((feature, index) => (
                                            <span key={index} className="feature-tag">
                                                {feature}
                                                <button type="button" onClick={() => removeFeature(index)}>×</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="images-section">
                                    <label>Изображения (можно выбрать несколько файлов)</label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => setSelectedImages(Array.from(e.target.files))}
                                    />
                                    {selectedImages.length > 0 && (
                                        <p>Выбрано файлов: {selectedImages.length}</p>
                                    )}
                                </div>

                                <div className="modal-buttons">
                                    <button type="submit" className="save-btn">Сохранить</button>
                                    <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Отмена</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;