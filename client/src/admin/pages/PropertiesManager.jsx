// src/admin/pages/PropertiesManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import DynamicForm from '../components/DynamicForm';
import {useLocation} from "react-router-dom";

const PropertiesManager = () => {
    const [properties, setProperties] = useState([]);
    const [complexes, setComplexes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        scrollToTop();
    }, [location.search]);

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

    // Функция для получения корректного URL изображения
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/placeholder-image.jpg';
        if (imagePath.startsWith('http')) return imagePath;
        if (imagePath.startsWith('/uploads')) {
            return `${process.env.REACT_APP_API_URL?.replace('/api', '') || process.env.REACT_APP_IMG_URL}${imagePath}`;
        }
        return imagePath;
    };

    const handleSubmit = async (formData, fileImages) => {
        const token = localStorage.getItem('adminToken');
        const formDataToSend = new FormData();

        // Подготавливаем данные для отправки
        const submitData = {
            title: formData.title || '',
            description: formData.description || '',
            location: formData.location || '',
            propertyType: formData.propertyType || 'apartment',
            status: formData.status || 'ready',
            area: formData.area ? Number(formData.area) : null,
            price: formData.price ? Number(formData.price) : null,
            rooms: formData.rooms ? Number(formData.rooms) : null,
            floor: formData.floor || null,
            residentialComplex: formData.residentialComplex || null,
            features: formData.features || [],
            images: formData.images || []
        };

        // Если есть URL изображения и нет файлов, устанавливаем первое URL как mainImage
        if (submitData.images.length > 0 && fileImages.length === 0) {
            submitData.mainImage = submitData.images[0];
        }

        formDataToSend.append('data', JSON.stringify(submitData));

        // Добавляем файлы
        fileImages.forEach((img) => {
            if (img.file) {
                formDataToSend.append('images', img.file);
            }
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
            const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Ошибка при сохранении';
            toast.error(errorMsg);
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
                                src={getImageUrl(property.mainImage)}
                                alt={property.title}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/placeholder-image.jpg';
                                }}
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
                                        // Преобразуем существующие изображения в формат для формы
                                        const allImages = [...(property.images || [])];

                                        // Если mainImage не входит в images, добавляем его
                                        if (property.mainImage && !allImages.includes(property.mainImage)) {
                                            allImages.unshift(property.mainImage);
                                        }

                                        const existingImages = allImages.map((img, idx) => ({
                                            id: `existing-${idx}-${Date.now()}`,
                                            url: getImageUrl(img),
                                            type: 'url',
                                            isNew: false
                                        }));

                                        setEditingProperty({
                                            ...property,
                                            _id: property._id, // Явно передаем _id
                                            images: existingImages,
                                            features: property.features || []
                                        });
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