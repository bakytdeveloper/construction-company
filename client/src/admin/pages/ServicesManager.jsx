// src/admin/pages/ServicesManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { iconComponents, iconInfo } from '../components/iconLibrary.js';

const ServicesManager = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [iconSearch, setIconSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const [formData, setFormData] = useState({
        icon: '🏠',
        iconType: 'emoji',
        reactIconName: '',
        title: '',
        titleKz: '',
        description: '',
        features: [],
        gradientColors: { color1: '#667eea', color2: '#764ba2', angle: 135 },
        order: 0,
        active: true
    });

    const [featureInput, setFeatureInput] = useState('');

    const iconCategories = ['all', 'Сантехника', 'Инструменты', 'Общие', 'Скорость', 'Качество', 'Цена', 'Коммуникация'];

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/services/admin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setServices(response.data.data || []);
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('adminToken');

        try {
            if (editingService) {
                await axios.put(`${process.env.REACT_APP_API_URL}/services/${editingService._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Услуга обновлена');
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/services`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Услуга создана');
            }
            setShowModal(false);
            resetForm();
            fetchServices();
        } catch (error) {
            console.error('Error saving service:', error);
            toast.error(error.response?.data?.error || 'Ошибка сохранения');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Удалить услугу?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`${process.env.REACT_APP_API_URL}/services/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Услуга удалена');
                fetchServices();
            } catch (error) {
                toast.error('Ошибка при удалении');
            }
        }
    };

    const handleCreateDefault = async () => {
        if (window.confirm('Это действие перезапишет все существующие услуги дефолтными. Продолжить?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.post(`${process.env.REACT_APP_API_URL}/services/default/create`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Дефолтные услуги созданы');
                fetchServices();
            } catch (error) {
                toast.error('Ошибка при создании дефолтных услуг');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            icon: '🏠',
            iconType: 'emoji',
            reactIconName: '',
            title: '',
            titleKz: '',
            description: '',
            features: [],
            gradientColors: { color1: '#667eea', color2: '#764ba2', angle: 135 },
            order: 0,
            active: true
        });
        setFeatureInput('');
        setEditingService(null);
        setShowIconPicker(false);
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setFormData({
                ...formData,
                features: [...formData.features, featureInput.trim()]
            });
            setFeatureInput('');
        }
    };

    const removeFeature = (index) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_, i) => i !== index)
        });
    };

    const handleGradientChange = (field, value) => {
        const newColors = { ...formData.gradientColors, [field]: value };
        setFormData({ ...formData, gradientColors: newColors });
    };

    const selectIcon = (iconName) => {
        setFormData({
            ...formData,
            iconType: 'react-icon',
            reactIconName: iconName,
            icon: ''
        });
        setShowIconPicker(false);
    };

    const selectEmoji = (emoji) => {
        setFormData({
            ...formData,
            iconType: 'emoji',
            icon: emoji,
            reactIconName: ''
        });
        setShowIconPicker(false);
    };

    const getIconPreview = () => {
        if (formData.iconType === 'emoji') {
            return <span style={{ fontSize: '2rem' }}>{formData.icon || '🏠'}</span>;
        } else if (formData.iconType === 'react-icon' && formData.reactIconName) {
            const IconComponent = iconComponents[formData.reactIconName];
            return IconComponent ? <IconComponent style={{ fontSize: '2rem' }} /> : <span>🏠</span>;
        }
        return <span>🏠</span>;
    };

    const getFilteredIcons = () => {
        let icons = [];
        if (selectedCategory === 'all') {
            icons = Object.entries(iconInfo);
        } else {
            icons = Object.entries(iconInfo).filter(([_, info]) => info.category === selectedCategory);
        }

        if (iconSearch) {
            icons = icons.filter(([key, info]) =>
                key.toLowerCase().includes(iconSearch.toLowerCase()) ||
                info.name.toLowerCase().includes(iconSearch.toLowerCase())
            );
        }

        return icons;
    };

    // Функция для рендера предпросмотра карточки
    const renderPreviewCard = () => {
        const previewService = {
            ...formData,
            gradient: `linear-gradient(${formData.gradientColors.angle}deg, ${formData.gradientColors.color1} 0%, ${formData.gradientColors.color2} 100%)`
        };

        return (
            <div className="ap-preview-card">
                <h4>Предпросмотр карточки услуги</h4>
                <div className="service-preview-wrapper">
                    <div className="service-preview-card">
                        <div className="service-preview-inner">
                            <div className="service-preview-front">
                                <div className="service-preview-icon" style={{ background: previewService.gradient }}>
                                    {getIconPreview()}
                                </div>
                                <h3>{previewService.title || 'Название услуги'}</h3>
                                <p className="service-preview-title-kz">{previewService.titleKz || 'Қызмет атауы'}</p>
                                <div className="service-preview-trigger">
                                    <span>Узнать больше</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="service-preview-back">
                                <div className="service-preview-back-content">
                                    <p>{previewService.description || 'Описание услуги...'}</p>
                                    <ul>
                                        {previewService.features.map((f, i) => (
                                            <li key={i}>✓ {f}</li>
                                        ))}
                                        {previewService.features.length === 0 && <li>✓ Добавьте особенности</li>}
                                    </ul>
                                    <button className="service-preview-btn">Заказать услугу</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="ap-loading">Загрузка...</div>;
    }

    return (
        <div className="ap-manager-page">
            <div className="ap-manager-header">
                <h2>Управление услугами</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {services.length > 0 && (
                        <button className="ap-create-btn" onClick={handleCreateDefault}>
                            🔄 Восстановить дефолтные
                        </button>
                    )}
                    <button className="ap-create-btn" onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}>
                        + Добавить услугу
                    </button>
                </div>
            </div>

            {services.length === 0 ? (
                <div className="ap-empty-state">
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <span style={{ fontSize: '4rem' }}>🔧</span>
                        <h3>Нет добавленных услуг</h3>
                        <p>Нажмите "Восстановить дефолтные" чтобы создать стандартные услуги, или добавьте свои.</p>
                        <button className="ap-create-btn" onClick={handleCreateDefault}>
                            Восстановить дефолтные услуги
                        </button>
                    </div>
                </div>
            ) : (
                <div className="ap-items-grid">
                    {services.map((service) => (
                        <div key={service._id} className="ap-item-card">
                            <div className="ap-card-image" style={{
                                background: service.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '120px'
                            }}>
                                <div style={{ fontSize: '3rem' }}>
                                    {service.iconType === 'emoji' ? (
                                        <span>{service.icon}</span>
                                    ) : service.reactIconName && iconComponents[service.reactIconName] ? (
                                        React.createElement(iconComponents[service.reactIconName], { style: { fontSize: '3rem', color: 'white' } })
                                    ) : (
                                        <span>🏠</span>
                                    )}
                                </div>
                            </div>
                            <div className="ap-card-content">
                                <h3>{service.title}</h3>
                                <p className="ap-location" style={{ fontSize: '0.8rem', color: '#666' }}>{service.titleKz}</p>
                                <p className="ap-stats" style={{ fontSize: '0.8rem' }}>{service.description?.substring(0, 80)}...</p>
                                <div className="ap-card-actions">
                                    <button
                                        className="ap-edit-btn"
                                        onClick={() => {
                                            setEditingService(service);
                                            setFormData({
                                                icon: service.icon || '🏠',
                                                iconType: service.iconType || 'emoji',
                                                reactIconName: service.reactIconName || '',
                                                title: service.title || '',
                                                titleKz: service.titleKz || '',
                                                description: service.description || '',
                                                features: service.features || [],
                                                gradientColors: service.gradientColors || { color1: '#667eea', color2: '#764ba2', angle: 135 },
                                                order: service.order || 0,
                                                active: service.active !== false
                                            });
                                            setShowModal(true);
                                        }}
                                    >
                                        ✏️ Редактировать
                                    </button>
                                    <button
                                        className="ap-delete-btn"
                                        onClick={() => handleDelete(service._id)}
                                    >
                                        🗑️ Удалить
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal для создания/редактирования */}
            {showModal && (
                <div className="ap-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="ap-modal ap-modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="ap-modal-header">
                            <h2>{editingService ? 'Редактировать услугу' : 'Создать услугу'}</h2>
                            <button className="ap-modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="ap-modal-body">
                            <div className="ap-dynamic-form">
                                {/* Выбор иконки */}
                                <div className="ap-form-group">
                                    <label>Иконка</label>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div className="ap-icon-preview" style={{
                                            width: '60px',
                                            height: '60px',
                                            background: `linear-gradient(${formData.gradientColors.angle}deg, ${formData.gradientColors.color1} 0%, ${formData.gradientColors.color2} 100%)`,
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {getIconPreview()}
                                        </div>
                                        <button
                                            type="button"
                                            className="ap-create-btn"
                                            onClick={() => setShowIconPicker(!showIconPicker)}
                                        >
                                            {formData.iconType === 'emoji' ? '📁 Выбрать иконку' : '🎨 Сменить иконку'}
                                        </button>
                                    </div>
                                </div>

                                {/* Пайкер иконок */}
                                {showIconPicker && (
                                    <div className="ap-icon-picker" style={{
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        marginBottom: '20px',
                                        background: '#f9fafb'
                                    }}>
                                        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                            <button
                                                className={`ap-filter-btn ${formData.iconType === 'emoji' ? 'active' : ''}`}
                                                onClick={() => setFormData({ ...formData, iconType: 'emoji', icon: '🏠', reactIconName: '' })}
                                            >
                                                😀 Emoji
                                            </button>
                                            <button
                                                className={`ap-filter-btn ${formData.iconType === 'react-icon' ? 'active' : ''}`}
                                                onClick={() => setFormData({ ...formData, iconType: 'react-icon' })}
                                            >
                                                🎨 React Icons
                                            </button>
                                        </div>

                                        {formData.iconType === 'emoji' ? (
                                            <div>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '10px' }}>
                                                    {['🏠', '🏢', '🏭', '🔧', '🛠️', '⚙️', '🔨', '🪚', '📐', '🔩', '🧰', '🔑', '💼', '📊', '📈', '⭐', '🎯', '💎', '🏆', '🎨'].map(emoji => (
                                                        <button
                                                            key={emoji}
                                                            onClick={() => selectEmoji(emoji)}
                                                            style={{
                                                                fontSize: '2rem',
                                                                background: 'white',
                                                                border: '1px solid #e5e7eb',
                                                                borderRadius: '8px',
                                                                cursor: 'pointer',
                                                                padding: '8px',
                                                                transition: 'all 0.3s'
                                                            }}
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Поиск иконок..."
                                                        value={iconSearch}
                                                        onChange={(e) => setIconSearch(e.target.value)}
                                                        style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                                    />
                                                    <select
                                                        value={selectedCategory}
                                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                                    >
                                                        {iconCategories.map(cat => (
                                                            <option key={cat} value={cat}>{cat === 'all' ? 'Все категории' : cat}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                                                    {getFilteredIcons().map(([iconName, info]) => {
                                                        const IconComponent = iconComponents[iconName];
                                                        return (
                                                            <button
                                                                key={iconName}
                                                                onClick={() => selectIcon(iconName)}
                                                                style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center',
                                                                    gap: '4px',
                                                                    padding: '8px',
                                                                    background: 'white',
                                                                    border: '1px solid #e5e7eb',
                                                                    borderRadius: '8px',
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.3s'
                                                                }}
                                                            >
                                                                {IconComponent && <IconComponent style={{ fontSize: '1.5rem' }} />}
                                                                <span style={{ fontSize: '0.7rem' }}>{info.name}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="ap-form-group">
                                    <label>Название (RU)</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Строительство домов"
                                        required
                                    />
                                </div>

                                <div className="ap-form-group">
                                    <label>Название (KZ)</label>
                                    <input
                                        type="text"
                                        value={formData.titleKz}
                                        onChange={(e) => setFormData({ ...formData, titleKz: e.target.value })}
                                        placeholder="Үй құрылысы"
                                    />
                                </div>

                                <div className="ap-form-group">
                                    <label>Описание</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows="3"
                                        placeholder="Подробное описание услуги..."
                                        required
                                    />
                                </div>

                                <div className="ap-form-section">
                                    <h4>Особенности услуги</h4>
                                    <div className="ap-tags-input">
                                        <input
                                            type="text"
                                            value={featureInput}
                                            onChange={(e) => setFeatureInput(e.target.value)}
                                            placeholder="Например: Под ключ"
                                            onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                                        />
                                        <button type="button" onClick={addFeature}>+ Добавить</button>
                                    </div>
                                    <div className="ap-tags-list">
                                        {formData.features.map((feature, index) => (
                                            <span key={index} className="ap-tag">
                                                {feature}
                                                <button type="button" onClick={() => removeFeature(index)}>×</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="ap-form-section">
                                    <h4>Градиент фона</h4>
                                    <div className="ap-form-row">
                                        <div className="ap-form-group">
                                            <label>Цвет 1</label>
                                            <input
                                                style={{padding: '0'}}
                                                type="color"
                                                value={formData.gradientColors.color1}
                                                onChange={(e) => handleGradientChange('color1', e.target.value)}
                                            />
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Цвет 2</label>
                                            <input
                                                style={{padding: '0'}}
                                                type="color"
                                                value={formData.gradientColors.color2}
                                                onChange={(e) => handleGradientChange('color2', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="ap-form-group">
                                        <label>Угол градиента</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="360"
                                            value={formData.gradientColors.angle}
                                            onChange={(e) => handleGradientChange('angle', parseInt(e.target.value))}
                                        />
                                        <span>{formData.gradientColors.angle}°</span>
                                    </div>
                                    <div className="ap-gradient-preview" style={{
                                        background: `linear-gradient(${formData.gradientColors.angle}deg, ${formData.gradientColors.color1} 0%, ${formData.gradientColors.color2} 100%)`,
                                        height: '50px',
                                        borderRadius: '8px',
                                        marginTop: '10px'
                                    }} />
                                </div>

                                <div className="ap-form-row">
                                    <div className="ap-form-group">
                                        <label>Порядок сортировки</label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="ap-form-group">
                                        <label className="ap-checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.active}
                                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            />
                                            Активна
                                        </label>
                                    </div>
                                </div>

                                {/* Предпросмотр карточки */}
                                {renderPreviewCard()}

                                <div className="ap-form-actions">
                                    <button type="button" className="ap-btn-primary" onClick={handleSave}>
                                        💾 Сохранить
                                    </button>
                                    <button type="button" className="ap-btn-secondary" onClick={() => setShowModal(false)}>
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesManager;