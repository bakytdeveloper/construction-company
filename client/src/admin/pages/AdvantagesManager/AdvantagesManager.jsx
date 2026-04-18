// src/admin/pages/AdvantagesManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AdvantagesManager.css';
import {iconComponents, iconInfo} from "../../components/iconLibrary"; // Импорт отдельного файла стилей

const AdvantagesManager = () => {
    const [advantages, setAdvantages] = useState([]);
    const [settings, setSettings] = useState({
        subtitle: 'Почему выбирают нас',
        title: 'Наши преимущества',
        description: 'Более 150 семей доверили нам строительство своего дома'
    });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [editingAdvantage, setEditingAdvantage] = useState(null);
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [iconSearch, setIconSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const [formData, setFormData] = useState({
        icon: '⚡',
        iconType: 'emoji',
        reactIconName: '',
        title: '',
        description: '',
        color: '#1a472a',
        order: 0,
        active: true
    });

    const iconCategories = ['all', 'Сантехника', 'Инструменты', 'Общие', 'Скорость', 'Качество', 'Цена', 'Коммуникация'];

    useEffect(() => {
        fetchAdvantages();
    }, []);

    const fetchAdvantages = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/advantages/admin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAdvantages(response.data.data.advantages || []);
            setSettings(response.data.data.settings || {
                subtitle: 'Почему выбирают нас',
                title: 'Наши преимущества',
                description: 'Более 150 семей доверили нам строительство своего дома'
            });
        } catch (error) {
            console.error('Error fetching advantages:', error);
            toast.error('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/advantages/settings`, settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Настройки сохранены');
            setShowSettingsModal(false);
            fetchAdvantages();
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Ошибка сохранения настроек');
        }
    };

    const handleResetSettings = async () => {
        if (window.confirm('Сбросить настройки к дефолтным значениям?')) {
            const token = localStorage.getItem('adminToken');
            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/advantages/settings/reset`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Настройки сброшены');
                setShowSettingsModal(false);
                fetchAdvantages();
            } catch (error) {
                console.error('Error resetting settings:', error);
                toast.error('Ошибка сброса настроек');
            }
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('adminToken');

        try {
            if (editingAdvantage) {
                await axios.put(`${process.env.REACT_APP_API_URL}/advantages/${editingAdvantage._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Преимущество обновлено');
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/advantages`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Преимущество создано');
            }
            setShowModal(false);
            resetForm();
            fetchAdvantages();
        } catch (error) {
            console.error('Error saving advantage:', error);
            toast.error(error.response?.data?.error || 'Ошибка сохранения');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Удалить преимущество?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`${process.env.REACT_APP_API_URL}/advantages/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Преимущество удалено');
                fetchAdvantages();
            } catch (error) {
                toast.error('Ошибка при удалении');
            }
        }
    };

    const handleCreateDefault = async () => {
        if (window.confirm('Это действие перезапишет все существующие преимущества дефолтными. Продолжить?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.post(`${process.env.REACT_APP_API_URL}/advantages/default/create`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Дефолтные преимущества созданы');
                fetchAdvantages();
            } catch (error) {
                toast.error('Ошибка при создании дефолтных преимуществ');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            icon: '⚡',
            iconType: 'emoji',
            reactIconName: '',
            title: '',
            description: '',
            color: '#1a472a',
            order: 0,
            active: true
        });
        setEditingAdvantage(null);
        setShowIconPicker(false);
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
            return <span>{formData.icon || '⚡'}</span>;
        } else if (formData.iconType === 'react-icon' && formData.reactIconName) {
            const IconComponent = iconComponents[formData.reactIconName];
            return IconComponent ? <IconComponent /> : <span>⚡</span>;
        }
        return <span>⚡</span>;
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

    // Функция для рендера предпросмотра карточки с фоном как на фронтенде
    const renderPreviewCard = () => {
        return (
            <div className="adv-preview-card">
                <h4>Предпросмотр карточки преимущества</h4>
                <div className="adv-preview-wrapper">
                    <div className="adv-preview-card-item">
                        <div className="adv-preview-inner">
                            <div className="adv-preview-icon" style={{
                                background: `linear-gradient(135deg, ${formData.color}20, ${formData.color}40)`
                            }}>
                                {getIconPreview()}
                            </div>
                            <h3>{formData.title || 'Название преимущества'}</h3>
                            <p>{formData.description || 'Описание преимущества...'}</p>
                            <div className="adv-preview-shine"></div>
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
        <div className="adv-manager-page">
            <div className="adv-manager-header">
                <h2>Управление преимуществами</h2>
                <div className="adv-header-buttons">
                    <button className="ap-create-btn" onClick={() => setShowSettingsModal(true)}>
                        ⚙️ Настройки секции
                    </button>
                    {advantages.length > 0 && (
                        <button className="ap-create-btn" onClick={handleCreateDefault}>
                            🔄 Восстановить дефолтные
                        </button>
                    )}
                    <button className="ap-create-btn" onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}>
                        + Добавить преимущество
                    </button>
                </div>
            </div>

            {advantages.length === 0 ? (
                <div className="adv-empty-state">
                    <span>⭐</span>
                    <h3>Нет добавленных преимуществ</h3>
                    <p>Нажмите "Восстановить дефолтные" чтобы создать стандартные преимущества, или добавьте свои.</p>
                    <button className="ap-create-btn" onClick={handleCreateDefault}>
                        Восстановить дефолтные преимущества
                    </button>
                </div>
            ) : (
                <div className="adv-items-grid">
                    {advantages.map((advantage) => (
                        <div key={advantage._id} className="adv-item-card">
                            <div className="adv-card-image" style={{
                                background: `linear-gradient(135deg, ${advantage.color}20, ${advantage.color}40)`
                            }}>
                                <div>
                                    {advantage.iconType === 'emoji' ? (
                                        <span>{advantage.icon}</span>
                                    ) : advantage.reactIconName && iconComponents[advantage.reactIconName] ? (
                                        React.createElement(iconComponents[advantage.reactIconName], { style: { fontSize: '3rem' } })
                                    ) : (
                                        <span>⭐</span>
                                    )}
                                </div>
                            </div>
                            <div className="adv-card-content">
                                <h3>{advantage.title}</h3>
                                <p className="adv-card-description">{advantage.description}</p>
                                <div className="adv-card-actions">
                                    <button
                                        className="adv-edit-btn"
                                        onClick={() => {
                                            setEditingAdvantage(advantage);
                                            setFormData({
                                                icon: advantage.icon || '⚡',
                                                iconType: advantage.iconType || 'emoji',
                                                reactIconName: advantage.reactIconName || '',
                                                title: advantage.title || '',
                                                description: advantage.description || '',
                                                color: advantage.color || '#1a472a',
                                                order: advantage.order || 0,
                                                active: advantage.active !== false
                                            });
                                            setShowModal(true);
                                        }}
                                    >
                                        ✏️ Редактировать
                                    </button>
                                    <button
                                        className="adv-delete-btn"
                                        onClick={() => handleDelete(advantage._id)}
                                    >
                                        🗑️ Удалить
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal для настроек секции - используем общие стили модального окна */}
            {showSettingsModal && (
                <div className="ap-modal-overlay" onClick={() => setShowSettingsModal(false)}>
                    <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="ap-modal-header">
                            <h2>Настройки секции "Преимущества"</h2>
                            <button className="ap-modal-close" onClick={() => setShowSettingsModal(false)}>✕</button>
                        </div>
                        <div className="ap-modal-body">
                            <div className="ap-dynamic-form">
                                <div className="ap-form-group">
                                    <label>Подзаголовок</label>
                                    <input
                                        type="text"
                                        value={settings.subtitle}
                                        onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                                        placeholder="Почему выбирают нас"
                                    />
                                </div>
                                <div className="ap-form-group">
                                    <label>Заголовок</label>
                                    <input
                                        type="text"
                                        value={settings.title}
                                        onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                                        placeholder="Наши преимущества"
                                    />
                                </div>
                                <div className="ap-form-group">
                                    <label>Описание</label>
                                    <textarea
                                        value={settings.description}
                                        onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                                        rows="3"
                                        placeholder="Более 150 семей доверили нам строительство своего дома"
                                    />
                                </div>
                                <div className="ap-form-actions">
                                    <button type="button" className="ap-btn-primary" onClick={handleSaveSettings}>
                                        💾 Сохранить
                                    </button>
                                    <button type="button" className="ap-btn-secondary" onClick={handleResetSettings}>
                                        🔄 Сбросить
                                    </button>
                                    <button type="button" className="ap-btn-secondary" onClick={() => setShowSettingsModal(false)}>
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal для создания/редактирования преимущества */}
            {showModal && (
                <div className="ap-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="ap-modal ap-modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="ap-modal-header">
                            <h2>{editingAdvantage ? 'Редактировать преимущество' : 'Создать преимущество'}</h2>
                            <button className="ap-modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="ap-modal-body">
                            <div className="ap-dynamic-form">
                                {/* Выбор иконки */}
                                <div className="ap-form-group">
                                    <label>Иконка</label>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div className="adv-icon-preview" style={{
                                            width: '60px',
                                            height: '60px',
                                            background: `linear-gradient(135deg, ${formData.color}20, ${formData.color}40)`,
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '2rem'
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
                                    <div className="adv-icon-picker">
                                        <div className="adv-icon-picker-header">
                                            <button
                                                className={`adv-icon-type-btn ${formData.iconType === 'emoji' ? 'active' : ''}`}
                                                onClick={() => setFormData({ ...formData, iconType: 'emoji', icon: '⚡', reactIconName: '' })}
                                            >
                                                😀 Emoji
                                            </button>
                                            <button
                                                className={`adv-icon-type-btn ${formData.iconType === 'react-icon' ? 'active' : ''}`}
                                                onClick={() => setFormData({ ...formData, iconType: 'react-icon' })}
                                            >
                                                🎨 React Icons
                                            </button>
                                        </div>

                                        {formData.iconType === 'emoji' ? (
                                            <div className="adv-emojis-grid">
                                                {['⚡', '💎', '👥', '📋', '🏆', '⭐', '🎯', '💪', '🚀', '🎨', '🔧', '🏠', '🏢', '🏭', '🔨', '🛠️'].map(emoji => (
                                                    <button
                                                        key={emoji}
                                                        className="adv-emoji-btn"
                                                        onClick={() => selectEmoji(emoji)}
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <>
                                                <div className="adv-icon-search">
                                                    <input
                                                        type="text"
                                                        placeholder="Поиск иконок..."
                                                        value={iconSearch}
                                                        onChange={(e) => setIconSearch(e.target.value)}
                                                    />
                                                    <select
                                                        value={selectedCategory}
                                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                                    >
                                                        {iconCategories.map(cat => (
                                                            <option key={cat} value={cat}>{cat === 'all' ? 'Все категории' : cat}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="adv-icons-grid">
                                                    {getFilteredIcons().map(([iconName, info]) => {
                                                        const IconComponent = iconComponents[iconName];
                                                        return (
                                                            <button
                                                                key={iconName}
                                                                className="adv-icon-item"
                                                                onClick={() => selectIcon(iconName)}
                                                            >
                                                                {IconComponent && <IconComponent />}
                                                                <span>{info.name}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                <div className="adv-form-group">
                                    <label>Название</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Соблюдение сроков"
                                        required
                                    />
                                </div>

                                <div className="adv-form-group">
                                    <label>Описание</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows="3"
                                        placeholder="Точное соблюдение сроков строительства"
                                        required
                                    />
                                </div>

                                <div className="adv-form-group">
                                    <label>Цвет иконки</label>
                                    <input
                                        style={{padding:"0", width:"100px"}}
                                        type="color"
                                        className="adv-color-input"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    />
                                </div>

                                <div className="adv-form-row">
                                    <div className="adv-form-group">
                                        <label>Порядок сортировки</label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="adv-form-group">
                                        <label className="adv-checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.active}
                                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            />
                                            Активно
                                        </label>
                                    </div>
                                </div>

                                {/* Предпросмотр карточки */}
                                {renderPreviewCard()}

                                <div className="adv-form-actions">
                                    <button type="button" className="adv-btn-primary" onClick={handleSave}>
                                        💾 Сохранить
                                    </button>
                                    <button type="button" className="adv-btn-secondary" onClick={() => setShowModal(false)}>
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

export default AdvantagesManager;