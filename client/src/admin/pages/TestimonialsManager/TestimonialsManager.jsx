// src/admin/pages/TestimonialsManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './TestimonialsManager.css';

const TestimonialsManager = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [settings, setSettings] = useState({
        subtitle: 'Отзывы клиентов',
        title: 'Что говорят о нас',
        description: 'Более 98% наших клиентов рекомендуют нас своим друзьям и знакомым',
        statsValue: 4.9,
        statsStars: 5,
        statsReviews: 127
    });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        position: '',
        rating: 5,
        text: '',
        image: '',
        imageType: 'initials',
        project: '',
        order: 0,
        active: true
    });

    // Функция для получения корректного URL изображения
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        if (imagePath.startsWith('/uploads')) {
            return `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${imagePath}`;
        }
        return imagePath;
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/testimonials/admin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTestimonials(response.data.data.testimonials || []);
            setSettings(response.data.data.settings || {
                subtitle: 'Отзывы клиентов',
                title: 'Что говорят о нас',
                description: 'Более 98% наших клиентов рекомендуют нас своим друзьям и знакомым',
                statsValue: 4.9,
                statsStars: 5,
                statsReviews: 127
            });
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            toast.error('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/testimonials/settings`, settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Настройки сохранены');
            setShowSettingsModal(false);
            fetchTestimonials();
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Ошибка сохранения настроек');
        }
    };

    const handleResetSettings = async () => {
        if (window.confirm('Сбросить настройки к дефолтным значениям?')) {
            const token = localStorage.getItem('adminToken');
            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/testimonials/settings/reset`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Настройки сброшены');
                setShowSettingsModal(false);
                fetchTestimonials();
            } catch (error) {
                console.error('Error resetting settings:', error);
                toast.error('Ошибка сброса настроек');
            }
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('adminToken');
        const formDataToSend = new FormData();

        formDataToSend.append('name', formData.name);
        formDataToSend.append('position', formData.position);
        formDataToSend.append('rating', formData.rating);
        formDataToSend.append('text', formData.text);
        formDataToSend.append('project', formData.project);
        formDataToSend.append('order', formData.order);
        formDataToSend.append('active', formData.active);
        formDataToSend.append('imageType', formData.imageType);

        if (imageFile) {
            formDataToSend.append('image', imageFile);
        } else if (formData.image && formData.imageType === 'url') {
            formDataToSend.append('image', formData.image);
        }

        try {
            if (editingTestimonial) {
                await axios.put(`${process.env.REACT_APP_API_URL}/testimonials/${editingTestimonial._id}`, formDataToSend, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Отзыв обновлен');
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/testimonials`, formDataToSend, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Отзыв создан');
            }
            setShowModal(false);
            resetForm();
            fetchTestimonials();
        } catch (error) {
            console.error('Error saving testimonial:', error);
            toast.error(error.response?.data?.error || 'Ошибка сохранения');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Удалить отзыв?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`${process.env.REACT_APP_API_URL}/testimonials/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Отзыв удален');
                fetchTestimonials();
            } catch (error) {
                toast.error('Ошибка при удалении');
            }
        }
    };

    const handleReorder = async (id, direction) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(`${process.env.REACT_APP_API_URL}/testimonials/${id}/reorder/${direction}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Порядок изменен');
            fetchTestimonials();
        } catch (error) {
            console.error('Error reordering:', error);
            toast.error('Ошибка при изменении порядка');
        }
    };

    const handleCreateDefault = async () => {
        if (window.confirm('Это действие перезапишет все существующие отзывы дефолтными. Продолжить?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.post(`${process.env.REACT_APP_API_URL}/testimonials/default/create`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Дефолтные отзывы созданы');
                fetchTestimonials();
            } catch (error) {
                toast.error('Ошибка при создании дефолтных отзывов');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            position: '',
            rating: 5,
            text: '',
            image: '',
            imageType: 'initials',
            project: '',
            order: 0,
            active: true
        });
        setImageFile(null);
        setImagePreview('');
        setEditingTestimonial(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setFormData({ ...formData, imageType: 'file', image: '' });
        }
    };

    const handleUrlImageChange = (e) => {
        const url = e.target.value;
        setFormData({ ...formData, imageType: 'url', image: url, imageFile: null });
        setImagePreview(url);
        setImageFile(null);
    };

    const handleInitialsImage = () => {
        setFormData({ ...formData, imageType: 'initials', image: '' });
        setImagePreview('');
        setImageFile(null);
    };

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const renderPreviewCard = () => {
        const previewName = formData.name || 'Имя клиента';
        const previewInitials = getInitials(previewName);
        const previewImageUrl = imagePreview || formData.image;

        return (
            <div className="tm-preview-card">
                <h4>Предпросмотр отзыва</h4>
                <div className="tm-preview-wrapper">
                    <div className="tm-preview-testimonial">
                        <div className="tm-preview-quote">“</div>
                        <div className="tm-preview-content">
                            <p className="tm-preview-text">
                                {formData.text || 'Текст отзыва...'}
                            </p>
                            <div className="tm-preview-rating">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`tm-preview-star ${i < formData.rating ? 'filled' : ''}`}>★</span>
                                ))}
                            </div>
                            <div className="tm-preview-author">
                                {formData.imageType === 'initials' ? (
                                    <div className="tm-preview-initials">{previewInitials}</div>
                                ) : (
                                    <img src={getImageUrl(previewImageUrl)} alt={previewName} />
                                )}
                                <div className="tm-preview-author-info">
                                    <h4>{previewName}</h4>
                                    <p>{formData.position || 'Должность'}</p>
                                    <span>{formData.project || 'Проект'}</span>
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
        <div className="tm-manager-page">
            <div className="tm-manager-header">
                <h2>Управление отзывами</h2>
                <div className="tm-header-buttons">
                    <button className="ap-create-btn" onClick={() => setShowSettingsModal(true)}>
                        ⚙️ Настройки секции
                    </button>
                    {testimonials.length > 0 && (
                        <button className="ap-create-btn" onClick={handleCreateDefault}>
                            🔄 Восстановить дефолтные
                        </button>
                    )}
                    <button className="ap-create-btn" onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}>
                        + Добавить отзыв
                    </button>
                </div>
            </div>

            {testimonials.length === 0 ? (
                <div className="tm-empty-state">
                    <span>💬</span>
                    <h3>Нет добавленных отзывов</h3>
                    <p>Нажмите "Восстановить дефолтные" чтобы создать стандартные отзывы, или добавьте свои.</p>
                    <button className="ap-create-btn" onClick={handleCreateDefault}>
                        Восстановить дефолтные отзывы
                    </button>
                </div>
            ) : (
                <div className="tm-items-grid">
                    {testimonials.map((testimonial, index) => (
                        <div key={testimonial._id} className="tm-testimonial-card">
                            <div className="tm-card-header">
                                <div className="tm-card-avatar">
                                    {testimonial.imageType === 'initials' ? (
                                        <div className="tm-initials">{getInitials(testimonial.name)}</div>
                                    ) : (
                                        <img src={getImageUrl(testimonial.image)} alt={testimonial.name} />
                                    )}
                                </div>
                                <div className="tm-card-info">
                                    <h3>{testimonial.name}</h3>
                                    <p>{testimonial.position}</p>
                                    <span>{testimonial.project}</span>
                                </div>
                            </div>
                            <div className="tm-card-rating">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < testimonial.rating ? 'filled' : ''}>★</span>
                                ))}
                            </div>
                            <p className="tm-card-text">{testimonial.text.substring(0, 100)}...</p>
                            <div className="tm-card-meta">
                                <span className="tm-card-order">Порядок: {testimonial.order}</span>
                                <span className={`tm-card-status ${testimonial.active ? 'active' : 'inactive'}`}>
                                    {testimonial.active ? 'Активен' : 'Неактивен'}
                                </span>
                            </div>
                            <div className="tm-card-actions">
                                <button
                                    className="tm-move-up"
                                    onClick={() => handleReorder(testimonial._id, 'up')}
                                    disabled={index === 0}
                                    title="Переместить вверх"
                                >
                                    ↑
                                </button>
                                <button
                                    className="tm-move-down"
                                    onClick={() => handleReorder(testimonial._id, 'down')}
                                    disabled={index === testimonials.length - 1}
                                    title="Переместить вниз"
                                >
                                    ↓
                                </button>
                                <button
                                    className="tm-edit-btn"
                                    onClick={() => {
                                        setEditingTestimonial(testimonial);
                                        setFormData({
                                            name: testimonial.name,
                                            position: testimonial.position,
                                            rating: testimonial.rating,
                                            text: testimonial.text,
                                            image: testimonial.image || '',
                                            imageType: testimonial.imageType || 'initials',
                                            project: testimonial.project,
                                            order: testimonial.order,
                                            active: testimonial.active
                                        });
                                        setImagePreview(testimonial.imageType === 'url' ? testimonial.image : '');
                                        setImageFile(null);
                                        setShowModal(true);
                                    }}
                                    title="Редактировать"
                                >
                                    ✏️
                                </button>
                                <button
                                    className="tm-delete-btn"
                                    onClick={() => handleDelete(testimonial._id)}
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
                            <h2>Настройки секции отзывов</h2>
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
                                        placeholder="Отзывы клиентов"
                                    />
                                </div>
                                <div className="ap-form-group">
                                    <label>Заголовок</label>
                                    <input
                                        type="text"
                                        value={settings.title}
                                        onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                                        placeholder="Что говорят о нас"
                                    />
                                </div>
                                <div className="ap-form-group">
                                    <label>Описание</label>
                                    <textarea
                                        value={settings.description}
                                        onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                                        rows="2"
                                        placeholder="Более 98% наших клиентов рекомендуют нас своим друзьям и знакомым"
                                    />
                                </div>
                                <div className="ap-form-row">
                                    <div className="ap-form-group">
                                        <label>Рейтинг (значение)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={settings.statsValue}
                                            onChange={(e) => setSettings({ ...settings, statsValue: parseFloat(e.target.value) })}
                                            placeholder="4.9"
                                        />
                                    </div>
                                    <div className="ap-form-group">
                                        <label>Количество отзывов</label>
                                        <input
                                            type="number"
                                            value={settings.statsReviews}
                                            onChange={(e) => setSettings({ ...settings, statsReviews: parseInt(e.target.value) })}
                                            placeholder="127"
                                        />
                                    </div>
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

            {/* Modal для создания/редактирования отзыва */}
            {showModal && (
                <div className="ap-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="ap-modal ap-modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="ap-modal-header">
                            <h2>{editingTestimonial ? 'Редактировать отзыв' : 'Создать отзыв'}</h2>
                            <button className="ap-modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="ap-modal-body">
                            <div className="ap-dynamic-form">
                                <div className="ap-form-group">
                                    <label>Имя клиента</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Аскар Нуржанов"
                                        required
                                    />
                                </div>

                                <div className="ap-form-group">
                                    <label>Должность / Локация</label>
                                    <input
                                        type="text"
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        placeholder="Владелец дома, мкр. Нурсая"
                                        required
                                    />
                                </div>

                                <div className="ap-form-group">
                                    <label>Проект</label>
                                    <input
                                        type="text"
                                        value={formData.project}
                                        onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                                        placeholder="Коттедж 350 м²"
                                        required
                                    />
                                </div>

                                <div className="ap-form-group">
                                    <label>Рейтинг</label>
                                    <div className="tm-rating-selector">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                className={`tm-star-btn ${formData.rating >= star ? 'active' : ''}`}
                                                onClick={() => setFormData({ ...formData, rating: star })}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="ap-form-group">
                                    <label>Текст отзыва</label>
                                    <textarea
                                        value={formData.text}
                                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                        rows="5"
                                        placeholder="Текст отзыва..."
                                        required
                                    />
                                </div>

                                <div className="ap-form-group">
                                    <label>Изображение клиента</label>
                                    <div className="tm-image-options">
                                        <button
                                            type="button"
                                            className={`tm-image-option ${formData.imageType === 'initials' ? 'active' : ''}`}
                                            onClick={handleInitialsImage}
                                        >
                                            🅰️ Инициалы
                                        </button>
                                        <button
                                            type="button"
                                            className={`tm-image-option ${formData.imageType === 'url' ? 'active' : ''}`}
                                            onClick={() => setFormData({ ...formData, imageType: 'url' })}
                                        >
                                            🔗 URL
                                        </button>
                                        <button
                                            type="button"
                                            className={`tm-image-option ${formData.imageType === 'file' ? 'active' : ''}`}
                                            onClick={() => setFormData({ ...formData, imageType: 'file' })}
                                        >
                                            📁 Загрузить файл
                                        </button>
                                    </div>
                                </div>

                                {formData.imageType === 'url' && (
                                    <div className="ap-form-group">
                                        <label>URL изображения</label>
                                        <input
                                            type="url"
                                            value={formData.image}
                                            onChange={handleUrlImageChange}
                                            placeholder="https://randomuser.me/api/portraits/men/1.jpg"
                                        />
                                    </div>
                                )}

                                {formData.imageType === 'file' && (
                                    <div className="ap-form-group">
                                        <label>Загрузить изображение</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        <small className="tm-file-hint">Рекомендуемый размер: 200x200px</small>
                                    </div>
                                )}

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
                                            Активен
                                        </label>
                                    </div>
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

export default TestimonialsManager;