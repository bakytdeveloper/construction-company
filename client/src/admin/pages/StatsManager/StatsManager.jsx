// src/admin/pages/StatsManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { iconComponents, iconInfo } from '../../components/iconLibrary.js';
import './StatsManager.css';

const StatsManager = () => {
    const [stats, setStats] = useState([]);
    const [settings, setSettings] = useState({
        bgImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        overlayOpacity: 0.15,
        bgType: 'url',
        gradientColors: { color1: '#1a472a', color2: '#0e2a1a', angle: 135 }
    });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [editingStat, setEditingStat] = useState(null);
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [iconSearch, setIconSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const [formData, setFormData] = useState({
        icon: '🏗️',
        iconType: 'emoji',
        reactIconName: '',
        label: '',
        value: 0,
        order: 0,
        active: true
    });

    const iconCategories = ['all', 'Сантехника', 'Инструменты', 'Общие', 'Скорость', 'Качество', 'Цена', 'Коммуникация'];

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/stats/admin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data.data.stats || []);
            setSettings(response.data.data.settings || {
                bgImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                overlayOpacity: 0.15,
                bgType: 'url',
                gradientColors: { color1: '#1a472a', color2: '#0e2a1a', angle: 135 }
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/stats/settings`, settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Настройки сохранены');
            setShowSettingsModal(false);
            fetchStats();
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Ошибка сохранения настроек');
        }
    };

    const handleResetSettings = async () => {
        if (window.confirm('Сбросить настройки к дефолтным значениям?')) {
            const token = localStorage.getItem('adminToken');
            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/stats/settings/reset`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Настройки сброшены');
                setShowSettingsModal(false);
                fetchStats();
            } catch (error) {
                console.error('Error resetting settings:', error);
                toast.error('Ошибка сброса настроек');
            }
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('adminToken');

        try {
            if (editingStat) {
                await axios.put(`${process.env.REACT_APP_API_URL}/stats/${editingStat._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Элемент обновлен');
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/stats`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Элемент создан');
            }
            setShowModal(false);
            resetForm();
            fetchStats();
        } catch (error) {
            console.error('Error saving stat:', error);
            toast.error(error.response?.data?.error || 'Ошибка сохранения');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Удалить элемент статистики?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`${process.env.REACT_APP_API_URL}/stats/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Элемент удален');
                fetchStats();
            } catch (error) {
                toast.error('Ошибка при удалении');
            }
        }
    };

    const handleReorder = async (id, direction) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(`${process.env.REACT_APP_API_URL}/stats/${id}/reorder/${direction}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Порядок изменен');
            fetchStats();
        } catch (error) {
            console.error('Error reordering:', error);
            toast.error('Ошибка при изменении порядка');
        }
    };

    const handleCreateDefault = async () => {
        if (window.confirm('Это действие перезапишет все существующие элементы статистики дефолтными. Продолжить?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.post(`${process.env.REACT_APP_API_URL}/stats/default/create`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Дефолтные элементы созданы');
                fetchStats();
            } catch (error) {
                toast.error('Ошибка при создании дефолтных элементов');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            icon: '🏗️',
            iconType: 'emoji',
            reactIconName: '',
            label: '',
            value: 0,
            order: 0,
            active: true
        });
        setEditingStat(null);
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
            return <span className="sm-icon-preview">{formData.icon || '🏗️'}</span>;
        } else if (formData.iconType === 'react-icon' && formData.reactIconName) {
            const IconComponent = iconComponents[formData.reactIconName];
            return IconComponent ? <IconComponent className="sm-icon-preview" /> : <span>🏗️</span>;
        }
        return <span>🏗️</span>;
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

    const getBackgroundStyle = () => {
        if (settings.bgType === 'gradient') {
            return {
                background: `linear-gradient(${settings.gradientColors.angle}deg, ${settings.gradientColors.color1} 0%, ${settings.gradientColors.color2} 100%)`
            };
        }
        return {
            backgroundImage: `url(${settings.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        };
    };

    const renderPreviewCard = () => {
        return (
            <div className="sm-preview-card">
                <h4>Предпросмотр статистики</h4>
                <div className="sm-preview-wrapper">
                    <div className="sm-preview-stat">
                        <div className="sm-preview-icon">{getIconPreview()}</div>
                        <div className="sm-preview-number">{formData.value || 0}+</div>
                        <div className="sm-preview-label">{formData.label || 'Название'}</div>
                        <div className="sm-preview-bar">
                            <div className="sm-preview-bar-fill" style={{ width: '70%' }}></div>
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
        <div className="sm-manager-page">
            <div className="sm-manager-header">
                <h2>Управление статистикой</h2>
                <div className="sm-header-buttons">
                    <button className="ap-create-btn" onClick={() => setShowSettingsModal(true)}>
                        ⚙️ Настройки секции
                    </button>
                    {stats.length > 0 && (
                        <button className="ap-create-btn" onClick={handleCreateDefault}>
                            🔄 Восстановить дефолтные
                        </button>
                    )}
                    <button className="ap-create-btn" onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}>
                        + Добавить элемент
                    </button>
                </div>
            </div>

            {stats.length === 0 ? (
                <div className="sm-empty-state">
                    <span>📊</span>
                    <h3>Нет добавленных элементов статистики</h3>
                    <p>Нажмите "Восстановить дефолтные" чтобы создать стандартные элементы, или добавьте свои.</p>
                    <button className="ap-create-btn" onClick={handleCreateDefault}>
                        Восстановить дефолтные элементы
                    </button>
                </div>
            ) : (
                <div className="sm-items-grid">
                    {stats.map((stat, index) => (
                        <div key={stat._id} className="sm-stat-card">
                            <div className="sm-stat-icon">
                                {stat.iconType === 'emoji' ? (
                                    <span>{stat.icon}</span>
                                ) : stat.reactIconName && iconComponents[stat.reactIconName] ? (
                                    React.createElement(iconComponents[stat.reactIconName])
                                ) : (
                                    <span>🏗️</span>
                                )}
                            </div>
                            <div className="sm-stat-content">
                                <div className="sm-stat-label">{stat.label}</div>
                                <div className="sm-stat-value">{stat.value}+</div>
                                <div className="sm-stat-meta">
                                    <span className="sm-stat-order">Порядок: {stat.order}</span>
                                    <span className={`sm-stat-status ${stat.active ? 'active' : 'inactive'}`}>
                                        {stat.active ? 'Активен' : 'Неактивен'}
                                    </span>
                                </div>
                            </div>
                            <div className="sm-stat-actions">
                                <button
                                    className="sm-move-up"
                                    onClick={() => handleReorder(stat._id, 'up')}
                                    disabled={index === 0}
                                    title="Переместить вверх"
                                >
                                    ↑
                                </button>
                                <button
                                    className="sm-move-down"
                                    onClick={() => handleReorder(stat._id, 'down')}
                                    disabled={index === stats.length - 1}
                                    title="Переместить вниз"
                                >
                                    ↓
                                </button>
                                <button
                                    className="sm-edit-btn"
                                    onClick={() => {
                                        setEditingStat(stat);
                                        setFormData({
                                            icon: stat.icon || '🏗️',
                                            iconType: stat.iconType || 'emoji',
                                            reactIconName: stat.reactIconName || '',
                                            label: stat.label || '',
                                            value: stat.value || 0,
                                            order: stat.order || 0,
                                            active: stat.active !== false
                                        });
                                        setShowModal(true);
                                    }}
                                    title="Редактировать"
                                >
                                    ✏️
                                </button>
                                <button
                                    className="sm-delete-btn"
                                    onClick={() => handleDelete(stat._id)}
                                    title="Удалить"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal для настроек секции */}
            {showSettingsModal && (
                <div className="ap-modal-overlay" onClick={() => setShowSettingsModal(false)}>
                    <div className="ap-modal ap-modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="ap-modal-header">
                            <h2>Настройки секции статистики</h2>
                            <button className="ap-modal-close" onClick={() => setShowSettingsModal(false)}>✕</button>
                        </div>
                        <div className="ap-modal-body">
                            <div className="ap-dynamic-form">
                                <div className="ap-form-group">
                                    <label>Тип фона</label>
                                    <div className="sm-bg-type-buttons">
                                        <button
                                            className={`sm-bg-type-btn ${settings.bgType === 'url' ? 'active' : ''}`}
                                            onClick={() => setSettings({ ...settings, bgType: 'url' })}
                                        >
                                            🔗 URL изображения
                                        </button>
                                        <button
                                            className={`sm-bg-type-btn ${settings.bgType === 'gradient' ? 'active' : ''}`}
                                            onClick={() => setSettings({ ...settings, bgType: 'gradient' })}
                                        >
                                            🎨 Градиент
                                        </button>
                                    </div>
                                </div>

                                {settings.bgType === 'url' && (
                                    <div className="ap-form-group">
                                        <label>URL фонового изображения</label>
                                        <input
                                            type="url"
                                            value={settings.bgImage}
                                            onChange={(e) => setSettings({ ...settings, bgImage: e.target.value })}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                        {settings.bgImage && (
                                            <div className="sm-image-preview">
                                                <img src={settings.bgImage} alt="Background preview" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {settings.bgType === 'gradient' && (
                                    <>
                                        <div className="ap-form-row">
                                            <div className="ap-form-group">
                                                <label>Цвет 1</label>
                                                <input
                                                    type="color"
                                                    value={settings.gradientColors.color1}
                                                    onChange={(e) => setSettings({
                                                        ...settings,
                                                        gradientColors: { ...settings.gradientColors, color1: e.target.value }
                                                    })}
                                                />
                                            </div>
                                            <div className="ap-form-group">
                                                <label>Цвет 2</label>
                                                <input
                                                    type="color"
                                                    value={settings.gradientColors.color2}
                                                    onChange={(e) => setSettings({
                                                        ...settings,
                                                        gradientColors: { ...settings.gradientColors, color2: e.target.value }
                                                    })}
                                                />
                                            </div>
                                        </div>
                                        <div className="ap-form-group">
                                            <label>Угол градиента</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="360"
                                                value={settings.gradientColors.angle}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    gradientColors: { ...settings.gradientColors, angle: parseInt(e.target.value) }
                                                })}
                                            />
                                            <span>{settings.gradientColors.angle}°</span>
                                        </div>
                                        <div className="sm-gradient-preview" style={{
                                            background: `linear-gradient(${settings.gradientColors.angle}deg, ${settings.gradientColors.color1} 0%, ${settings.gradientColors.color2} 100%)`,
                                            height: '60px',
                                            borderRadius: '8px'
                                        }} />
                                    </>
                                )}

                                <div className="ap-form-group">
                                    <label>Прозрачность оверлея (0-1)</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={settings.overlayOpacity}
                                        onChange={(e) => setSettings({ ...settings, overlayOpacity: parseFloat(e.target.value) })}
                                    />
                                    <span>{Math.round(settings.overlayOpacity * 100)}%</span>
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

            {/* Modal для создания/редактирования элемента статистики */}
            {showModal && (
                <div className="ap-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="ap-modal ap-modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="ap-modal-header">
                            <h2>{editingStat ? 'Редактировать элемент' : 'Создать элемент'}</h2>
                            <button className="ap-modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="ap-modal-body">
                            <div className="ap-dynamic-form">
                                {/* Выбор иконки */}
                                <div className="ap-form-group">
                                    <label>Иконка</label>
                                    <div className="sm-icon-selector">
                                        <div className="sm-icon-preview">
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
                                    <div className="sm-icon-picker">
                                        <div className="sm-icon-picker-header">
                                            <button
                                                className={`sm-icon-type-btn ${formData.iconType === 'emoji' ? 'active' : ''}`}
                                                onClick={() => setFormData({ ...formData, iconType: 'emoji', icon: '🏗️', reactIconName: '' })}
                                            >
                                                😀 Emoji
                                            </button>
                                            <button
                                                className={`sm-icon-type-btn ${formData.iconType === 'react-icon' ? 'active' : ''}`}
                                                onClick={() => setFormData({ ...formData, iconType: 'react-icon' })}
                                            >
                                                🎨 React Icons
                                            </button>
                                        </div>

                                        {formData.iconType === 'emoji' ? (
                                            <div className="sm-emojis-grid">
                                                {['🏗️', '👨‍👩‍👧‍👦', '📅', '🏆', '⭐', '🎯', '💪', '🚀', '🎨', '🔧', '🏠', '🏢', '🏭', '🔨', '🛠️'].map(emoji => (
                                                    <button
                                                        key={emoji}
                                                        className="sm-emoji-btn"
                                                        onClick={() => selectEmoji(emoji)}
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <>
                                                <div className="sm-icon-search">
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
                                                <div className="sm-icons-grid">
                                                    {getFilteredIcons().map(([iconName, info]) => {
                                                        const IconComponent = iconComponents[iconName];
                                                        return (
                                                            <button
                                                                key={iconName}
                                                                className="sm-icon-item"
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

                                <div className="ap-form-group">
                                    <label>Название</label>
                                    <input
                                        type="text"
                                        value={formData.label}
                                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                        placeholder="Построенных объектов"
                                        required
                                    />
                                </div>

                                <div className="ap-form-group">
                                    <label>Значение</label>
                                    <input
                                        type="number"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) })}
                                        placeholder="156"
                                        required
                                    />
                                </div>

                                <div className="ap-form-group">
                                    <label className="ap-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                        />
                                        Активен
                                    </label>
                                </div>

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

export default StatsManager;