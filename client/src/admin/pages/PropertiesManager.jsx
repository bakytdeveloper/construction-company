// src/admin/pages/PropertiesManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import DynamicForm from '../components/DynamicForm';

const PropertiesManager = () => {
    const [properties, setProperties] = useState([]);
    const [complexes, setComplexes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const [propertiesRes, complexesRes] = await Promise.all([
                axios.get(`${process.env.REACT_APP_API_URL}/properties`),
                axios.get(`${process.env.REACT_APP_API_URL}/admin/complexes`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setProperties(propertiesRes.data.data || []);
            setComplexes(complexesRes.data.data || []);
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

        const fileImages = formData.images.filter(img => img.file);
        const urlImages = formData.images.filter(img => !img.file);

        formData.images = urlImages.map(img => img.url);

        formDataToSend.append('data', JSON.stringify(formData));

        fileImages.forEach(img => {
            formDataToSend.append('images', img.file);
        });

        try {
            if (editingProperty) {
                await axios.put(`${process.env.REACT_APP_API_URL}/admin/properties/${editingProperty._id}`, formDataToSend, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Объект обновлен');
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/admin/properties`, formDataToSend, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Объект создан');
            }
            setShowModal(false);
            setEditingProperty(null);
            fetchData();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.error || 'Ошибка при сохранении');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Удалить объект недвижимости?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`${process.env.REACT_APP_API_URL}/admin/properties/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Объект удален');
                fetchData();
            } catch (error) {
                toast.error('Ошибка при удалении');
            }
        }
    };

    const getPropertyTypeLabel = (type) => {
        const types = {
            apartment: '🏢 Квартира',
            commercial: '🏭 Коммерческая',
            house: '🏡 Дом',
            parking: '🅿️ Парковка',
            storage: '📦 Кладовая'
        };
        return types[type] || type;
    };

    const filteredProperties = properties.filter(property =>
        property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    setEditingProperty(null);
                    setShowModal(true);
                }}>
                    + Создать объект
                </button>
            </div>

            <div className="ap-items-grid">
                {filteredProperties.map(property => (
                    <div key={property._id} className="ap-item-card">
                        <div className="ap-card-image">
                            <img
                                src={property.mainImage?.startsWith('http') ? property.mainImage : `${process.env.REACT_APP_IMG_URL}${property.mainImage}`}
                                alt={property.title}
                                onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                            />
                            <span className={`ap-status-badge ap-status-${property.status}`}>
                                {property.status === 'ready' ? 'Готова' :
                                    property.status === 'under_construction' ? 'Строится' :
                                        property.status === 'planned' ? 'Планируется' : 'Продана'}
                            </span>
                        </div>
                        <div className="ap-card-content">
                            <h3>{property.title}</h3>
                            <p className="ap-location">📍 {property.location}</p>
                            <p className="ap-stats">
                                {getPropertyTypeLabel(property.propertyType)} • {property.area} м²
                            </p>
                            <p className="ap-stats">💰 {property.price?.toLocaleString()} ₸</p>
                            <div className="ap-card-actions">
                                <button
                                    className="ap-edit-btn"
                                    onClick={() => {
                                        setEditingProperty(property);
                                        setShowModal(true);
                                    }}
                                >
                                    ✏️ Редактировать
                                </button>
                                <button
                                    className="ap-delete-btn"
                                    onClick={() => handleDelete(property._id)}
                                >
                                    🗑️ Удалить
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="ap-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="ap-modal ap-modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="ap-modal-header">
                            <h2>{editingProperty ? 'Редактировать объект' : 'Создать объект'}</h2>
                            <button className="ap-modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="ap-modal-body">
                            <DynamicForm
                                type="property"
                                initialData={editingProperty || {}}
                                onSubmit={handleSubmit}
                                onCancel={() => setShowModal(false)}
                                complexes={complexes}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertiesManager;