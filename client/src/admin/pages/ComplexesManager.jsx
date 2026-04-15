// src/admin/pages/ComplexesManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import DynamicForm from '../components/DynamicForm';

const ComplexesManager = () => {
    const [complexes, setComplexes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingComplex, setEditingComplex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchComplexes();
    }, []);

    const fetchComplexes = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/complexes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComplexes(response.data.data || []);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Ошибка при загрузке данных');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        const token = localStorage.getItem('adminToken');
        const formDataToSend = new FormData();

        // Prepare data for submission
        const submitData = { ...formData };

        // Separate files from URLs
        const fileImages = formData.images.filter(img => img.file);
        const urlImages = formData.images.filter(img => !img.file);

        submitData.images = urlImages.map(img => img.url);

        formDataToSend.append('data', JSON.stringify(submitData));

        fileImages.forEach(img => {
            formDataToSend.append('images', img.file);
        });

        try {
            if (editingComplex) {
                await axios.put(`${process.env.REACT_APP_API_URL}/admin/complexes/${editingComplex._id}`, formDataToSend, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Жилой комплекс обновлен');
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/admin/complexes`, formDataToSend, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Жилой комплекс создан');
            }
            setShowModal(false);
            setEditingComplex(null);
            fetchComplexes();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.error || 'Ошибка при сохранении');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Удалить жилой комплекс? Все связанные объекты потеряют привязку.')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`${process.env.REACT_APP_API_URL}/admin/complexes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Жилой комплекс удален');
                fetchComplexes();
            } catch (error) {
                toast.error('Ошибка при удалении');
            }
        }
    };

    const filteredComplexes = complexes.filter(complex =>
        complex.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complex.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusLabel = (status) => {
        switch(status) {
            case 'completed': return { text: 'Построен', class: 'ap-status-completed' };
            case 'under_construction': return { text: 'Строится', class: 'ap-status-construction' };
            case 'planned': return { text: 'Планируется', class: 'ap-status-planned' };
            default: return { text: status, class: '' };
        }
    };

    if (loading) {
        return <div className="ap-loading">Загрузка...</div>;
    }

    return (
        <div className="ap-manager-page">
            <div className="ap-manager-header">
                <div className="ap-search-bar">
                    <input
                        type="text"
                        placeholder="🔍 Поиск по названию или адресу..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="ap-create-btn" onClick={() => {
                    setEditingComplex(null);
                    setShowModal(true);
                }}>
                    + Создать Жилой комплекс
                </button>
            </div>

            <div className="ap-items-grid">
                {filteredComplexes.map(complex => {
                    const status = getStatusLabel(complex.status);
                    return (
                        <div key={complex._id} className="ap-item-card">
                            <div className="ap-card-image">
                                <img
                                    src={complex.mainImage?.startsWith('http') ? complex.mainImage : `${process.env.REACT_APP_IMG_URL}${complex.mainImage}`}
                                    alt={complex.title}
                                    onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                />
                                <span className={`ap-status-badge ${status.class}`}>
                                    {status.text}
                                </span>
                            </div>
                            <div className="ap-card-content">
                                <h3>{complex.title}</h3>
                                <p className="ap-location">📍 {complex.location}</p>
                                {complex.specifications?.apartments && (
                                    <p className="ap-stats">🏢 {complex.specifications.apartments} квартир</p>
                                )}
                                <div className="ap-card-actions">
                                    <button
                                        className="ap-edit-btn"
                                        onClick={() => {
                                            setEditingComplex(complex);
                                            setShowModal(true);
                                        }}
                                    >
                                        ✏️ Редактировать
                                    </button>
                                    <button
                                        className="ap-delete-btn"
                                        onClick={() => handleDelete(complex._id)}
                                    >
                                        🗑️ Удалить
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showModal && (
                <div className="ap-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="ap-modal ap-modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="ap-modal-header">
                            <h2>{editingComplex ? 'Редактировать ЖК' : 'Создать Жилой комплекс'}</h2>
                            <button className="ap-modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="ap-modal-body">
                            <DynamicForm
                                type="complex"
                                initialData={editingComplex || {}}
                                onSubmit={handleSubmit}
                                onCancel={() => setShowModal(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplexesManager;