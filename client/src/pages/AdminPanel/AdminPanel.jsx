import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AdminPanel.css';

const AdminPanel = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projectForm, setProjectForm] = useState({
        title: '', titleKz: '', category: 'houses', description: '',
        descriptionKz: '', location: '', area: '', price: '', features: []
    });
    const [featureInput, setFeatureInput] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            setIsAuthenticated(true);
            fetchProjects();
            fetchMessages();
        }
    }, [isAuthenticated]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin/login`, loginData);
            localStorage.setItem('adminToken', response.data.token);
            setIsAuthenticated(true);
            toast.success('Вход выполнен успешно!');
            fetchProjects();
            fetchMessages();
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

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/projects`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/contacts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('data', JSON.stringify(projectForm));
        selectedImages.forEach(img => formData.append('images', img));

        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(`${process.env.REACT_APP_API_URL}/admin/projects`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Проект создан успешно!');
            setShowProjectModal(false);
            resetProjectForm();
            fetchProjects();
        } catch (error) {
            toast.error('Ошибка при создании проекта');
        }
    };

    const handleDeleteProject = async (id) => {
        if (window.confirm('Удалить проект?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`${process.env.REACT_APP_API_URL}/admin/projects/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Проект удален');
                fetchProjects();
            } catch (error) {
                toast.error('Ошибка при удалении');
            }
        }
    };

    const resetProjectForm = () => {
        setProjectForm({
            title: '', titleKz: '', category: 'houses', description: '',
            descriptionKz: '', location: '', area: '', price: '', features: []
        });
        setSelectedImages([]);
        setFeatureInput('');
        setEditingProject(null);
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setProjectForm({
                ...projectForm,
                features: [...projectForm.features, featureInput.trim()]
            });
            setFeatureInput('');
        }
    };

    const removeFeature = (index) => {
        setProjectForm({
            ...projectForm,
            features: projectForm.features.filter((_, i) => i !== index)
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
                <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>
                    📁 Проекты ({projects.length})
                </button>
                <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>
                    ✉️ Сообщения ({messages.filter(m => !m.isRead).length})
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'projects' && (
                    <div className="projects-management">
                        <button className="create-btn" onClick={() => setShowProjectModal(true)}>
                            + Создать проект
                        </button>

                        <div className="projects-table">
                            <table>
                                <thead>
                                <tr>
                                    <th>Фото</th>
                                    <th>Название</th>
                                    <th>Категория</th>
                                    <th>Локация</th>
                                    <th>Цена</th>
                                    <th>Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {projects.map(project => (
                                    <tr key={project._id}>
                                        <td><img src={`${process.env.REACT_APP_IMG_URL}${project.mainImage}`} alt={project.title} width="50" /></td>
                                        <td>{project.title}</td>
                                        <td>{project.category}</td>
                                        <td>{project.location}</td>
                                        <td>{project.price.toLocaleString()} ₸</td>
                                        <td>
                                            <button className="delete-btn" onClick={() => handleDeleteProject(project._id)}>🗑️</button>
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
                            {messages.map(message => (
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
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal for create/edit project */}
            {showProjectModal && (
                <div className="modal-overlay" onClick={() => setShowProjectModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingProject ? 'Редактировать проект' : 'Создать проект'}</h2>
                        <form onSubmit={handleCreateProject}>
                            <div className="form-row">
                                <input
                                    type="text"
                                    placeholder="Название (RU)"
                                    value={projectForm.title}
                                    onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Название (KZ)"
                                    value={projectForm.titleKz}
                                    onChange={(e) => setProjectForm({...projectForm, titleKz: e.target.value})}
                                />
                            </div>

                            <select
                                value={projectForm.category}
                                onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                                required
                            >
                                <option value="houses">Дома</option>
                                <option value="apartments">Квартиры</option>
                                <option value="commercial">Коммерческие</option>
                            </select>

                            <textarea
                                placeholder="Описание (RU)"
                                value={projectForm.description}
                                onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                                required
                                rows="4"
                            ></textarea>

                            <textarea
                                placeholder="Описание (KZ)"
                                value={projectForm.descriptionKz}
                                onChange={(e) => setProjectForm({...projectForm, descriptionKz: e.target.value})}
                                rows="4"
                            ></textarea>

                            <div className="form-row">
                                <input
                                    type="text"
                                    placeholder="Локация"
                                    value={projectForm.location}
                                    onChange={(e) => setProjectForm({...projectForm, location: e.target.value})}
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Площадь (м²)"
                                    value={projectForm.area}
                                    onChange={(e) => setProjectForm({...projectForm, area: e.target.value})}
                                    required
                                />
                            </div>

                            <input
                                type="number"
                                placeholder="Цена (₸)"
                                value={projectForm.price}
                                onChange={(e) => setProjectForm({...projectForm, price: e.target.value})}
                                required
                            />

                            <div className="features-section">
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
                                    {projectForm.features.map((feature, index) => (
                                        <span key={index} className="feature-tag">
                      {feature}
                                            <button type="button" onClick={() => removeFeature(index)}>×</button>
                    </span>
                                    ))}
                                </div>
                            </div>

                            <div className="images-section">
                                <label>Изображения (можно выбрать несколько)</label>
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
                                <button type="button" className="cancel-btn" onClick={() => setShowProjectModal(false)}>Отмена</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;