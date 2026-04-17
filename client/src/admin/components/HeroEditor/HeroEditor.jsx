// src/admin/components/HeroEditor.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './HeroEditor.css';

const HeroEditor = () => {
    const [heroData, setHeroData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);

    useEffect(() => {
        fetchHeroData();
    }, []);

    const fetchHeroData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/hero/content`);
            setHeroData(response.data.data);
        } catch (error) {
            console.error('Error fetching hero data:', error);
            toast.error('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`${process.env.REACT_APP_API_URL}/hero/content`, heroData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Изменения сохранены');
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Ошибка сохранения');
        } finally {
            setSaving(false);
        }
    };

    const handleSlideChange = (index, field, value) => {
        const newSlides = [...heroData.slides];
        newSlides[index] = { ...newSlides[index], [field]: value };
        setHeroData({ ...heroData, slides: newSlides });
    };

    const addSlide = () => {
        const newSlides = [...heroData.slides];
        newSlides.push({
            title: 'Новый слайд',
            titleHighlight: 'мечты',
            description: 'Описание нового слайда',
            buttonText: 'Подробнее',
            buttonLink: '/projects',
            contentPosition: 'center',
            bgType: 'gradient',
            bgValue: 'linear-gradient(135deg, #0a1a0f 0%, #1a3a2a 100%)',
            gradientConfig: { angle: 135, color1: '#0a1a0f', color2: '#1a3a2a' },
            altText: '',
            showStats: true,
            stats: [
                { number: '150+', label: 'Построенных домов' },
                { number: '98%', label: 'Довольных клиентов' },
                { number: '12 лет', label: 'На рынке' }
            ],
            active: true,
            order: newSlides.length
        });
        setHeroData({ ...heroData, slides: newSlides });
        setActiveSlideIndex(newSlides.length - 1);
    };

    const removeSlide = (index) => {
        const newSlides = heroData.slides.filter((_, i) => i !== index);
        setHeroData({ ...heroData, slides: newSlides });
        if (activeSlideIndex >= newSlides.length) {
            setActiveSlideIndex(Math.max(0, newSlides.length - 1));
        }
    };

    const moveSlide = (index, direction) => {
        const newSlides = [...heroData.slides];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newSlides.length) return;
        [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
        setHeroData({ ...heroData, slides: newSlides });
        if (activeSlideIndex === index) setActiveSlideIndex(newIndex);
        else if (activeSlideIndex === newIndex) setActiveSlideIndex(index);
    };

    const handleImageUpload = async (index, file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/hero/slides/${index}/image`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            const newSlides = [...heroData.slides];
            newSlides[index] = response.data.data.slides[index];
            setHeroData({ ...heroData, slides: newSlides });
            toast.success('Изображение загружено');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Ошибка загрузки изображения');
        }
    };

    const handleDeleteImage = async (index) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.delete(
                `${process.env.REACT_APP_API_URL}/hero/slides/${index}/image`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const newSlides = [...heroData.slides];
            newSlides[index] = response.data.data.slides[index];
            setHeroData({ ...heroData, slides: newSlides });
            toast.success('Изображение удалено');
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('Ошибка удаления изображения');
        }
    };

    const handleGradientChange = (index, color1, color2, angle) => {
        const gradient = `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
        handleSlideChange(index, 'bgValue', gradient);
        handleSlideChange(index, 'gradientConfig', { angle, color1, color2 });
    };

    if (loading) {
        return <div className="he-loading">Загрузка редактора...</div>;
    }

    if (!heroData) {
        return <div className="he-error">Ошибка загрузки данных</div>;
    }

    const currentSlide = heroData.slides[activeSlideIndex];

    return (
        <div className="hero-editor">
            <div className="he-header">
                <h2>Редактор главного баннера</h2>
                <button
                    className="he-save-btn"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Сохранение...' : '💾 Сохранить изменения'}
                </button>
            </div>

            <div className="he-preview">
                <h3>Предпросмотр</h3>
                <div className="he-preview-slide" style={{
                    background: currentSlide.bgType === 'url' || currentSlide.bgType === 'file'
                        ? `url(${currentSlide.bgValue}) center/cover no-repeat`
                        : currentSlide.bgValue,
                    textAlign: currentSlide.contentPosition
                }}>
                    <div className="he-preview-overlay"></div>
                    <div className="he-preview-content">
                        <h1>
                            {currentSlide.title}<br />
                            <span className="he-gradient-text">{currentSlide.titleHighlight}</span>
                        </h1>
                        <p>{currentSlide.description}</p>
                        <button className="he-preview-btn">{currentSlide.buttonText}</button>
                    </div>
                </div>
            </div>

            <div className="he-slides-list">
                <div className="he-slides-header">
                    <h3>Слайды</h3>
                    <button className="he-add-slide-btn" onClick={addSlide}>
                        + Добавить слайд
                    </button>
                </div>
                <div className="he-slides-tabs">
                    {heroData.slides.map((slide, idx) => (
                        <div
                            key={idx}
                            className={`he-slide-tab ${activeSlideIndex === idx ? 'active' : ''}`}
                            onClick={() => setActiveSlideIndex(idx)}
                        >
                            <span>Слайд {idx + 1}</span>
                            <div className="he-slide-tab-actions">
                                <button
                                    className="he-move-up"
                                    onClick={(e) => { e.stopPropagation(); moveSlide(idx, 'up'); }}
                                    disabled={idx === 0}
                                >
                                    ↑
                                </button>
                                <button
                                    className="he-move-down"
                                    onClick={(e) => { e.stopPropagation(); moveSlide(idx, 'down'); }}
                                    disabled={idx === heroData.slides.length - 1}
                                >
                                    ↓
                                </button>
                                <button
                                    className="he-delete-slide"
                                    onClick={(e) => { e.stopPropagation(); removeSlide(idx); }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="he-editor-form">
                <h3>Редактирование слайда {activeSlideIndex + 1}</h3>

                <div className="he-form-group">
                    <label>Заголовок (первая часть)</label>
                    <input
                        type="text"
                        value={currentSlide.title}
                        onChange={(e) => handleSlideChange(activeSlideIndex, 'title', e.target.value)}
                        placeholder="Строим дома вашей"
                    />
                </div>

                <div className="he-form-group">
                    <label>Заголовок (выделенная часть)</label>
                    <input
                        type="text"
                        value={currentSlide.titleHighlight}
                        onChange={(e) => handleSlideChange(activeSlideIndex, 'titleHighlight', e.target.value)}
                        placeholder="мечты в Алматы"
                    />
                </div>

                <div className="he-form-group">
                    <label>Описание</label>
                    <textarea
                        value={currentSlide.description}
                        onChange={(e) => handleSlideChange(activeSlideIndex, 'description', e.target.value)}
                        rows="3"
                    />
                </div>

                <div className="he-form-row">
                    <div className="he-form-group">
                        <label>Текст кнопки</label>
                        <input
                            type="text"
                            value={currentSlide.buttonText}
                            onChange={(e) => handleSlideChange(activeSlideIndex, 'buttonText', e.target.value)}
                        />
                    </div>
                    <div className="he-form-group">
                        <label>Ссылка кнопки</label>
                        <input
                            type="text"
                            value={currentSlide.buttonLink}
                            onChange={(e) => handleSlideChange(activeSlideIndex, 'buttonLink', e.target.value)}
                        />
                    </div>
                </div>

                <div className="he-form-group">
                    <label>Позиция контента</label>
                    <div className="he-position-buttons">
                        <button
                            className={`he-pos-btn ${currentSlide.contentPosition === 'left' ? 'active' : ''}`}
                            onClick={() => handleSlideChange(activeSlideIndex, 'contentPosition', 'left')}
                        >
                            ◀ Слева
                        </button>
                        <button
                            className={`he-pos-btn ${currentSlide.contentPosition === 'center' ? 'active' : ''}`}
                            onClick={() => handleSlideChange(activeSlideIndex, 'contentPosition', 'center')}
                        >
                            ● По центру
                        </button>
                        <button
                            className={`he-pos-btn ${currentSlide.contentPosition === 'right' ? 'active' : ''}`}
                            onClick={() => handleSlideChange(activeSlideIndex, 'contentPosition', 'right')}
                        >
                            Справа ▶
                        </button>
                    </div>
                </div>

                <div className="he-form-group">
                    <label>Тип фона</label>
                    <div className="he-bg-type-buttons">
                        <button
                            className={`he-bg-type-btn ${currentSlide.bgType === 'gradient' ? 'active' : ''}`}
                            onClick={() => handleSlideChange(activeSlideIndex, 'bgType', 'gradient')}
                        >
                            🎨 Градиент
                        </button>
                        <button
                            className={`he-bg-type-btn ${currentSlide.bgType === 'url' ? 'active' : ''}`}
                            onClick={() => handleSlideChange(activeSlideIndex, 'bgType', 'url')}
                        >
                            🔗 URL изображения
                        </button>
                        <button
                            className={`he-bg-type-btn ${currentSlide.bgType === 'file' ? 'active' : ''}`}
                            onClick={() => handleSlideChange(activeSlideIndex, 'bgType', 'file')}
                        >
                            📁 Загрузить файл
                        </button>
                    </div>
                </div>

                {currentSlide.bgType === 'gradient' && (
                    <div className="he-gradient-editor">
                        <div className="he-form-row">
                            <div className="he-form-group">
                                <label>Угол градиента</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={currentSlide.gradientConfig?.angle || 135}
                                    onChange={(e) => handleGradientChange(
                                        activeSlideIndex,
                                        currentSlide.gradientConfig?.color1 || '#0a1a0f',
                                        currentSlide.gradientConfig?.color2 || '#1a3a2a',
                                        parseInt(e.target.value)
                                    )}
                                />
                                <span>{currentSlide.gradientConfig?.angle || 135}°</span>
                            </div>
                        </div>
                        <div className="he-form-row">
                            <div className="he-form-group">
                                <label>Цвет 1</label>
                                <input
                                    type="color"
                                    value={currentSlide.gradientConfig?.color1 || '#0a1a0f'}
                                    onChange={(e) => handleGradientChange(
                                        activeSlideIndex,
                                        e.target.value,
                                        currentSlide.gradientConfig?.color2 || '#1a3a2a',
                                        currentSlide.gradientConfig?.angle || 135
                                    )}
                                />
                            </div>
                            <div className="he-form-group">
                                <label>Цвет 2</label>
                                <input
                                    type="color"
                                    value={currentSlide.gradientConfig?.color2 || '#1a3a2a'}
                                    onChange={(e) => handleGradientChange(
                                        activeSlideIndex,
                                        currentSlide.gradientConfig?.color1 || '#0a1a0f',
                                        e.target.value,
                                        currentSlide.gradientConfig?.angle || 135
                                    )}
                                />
                            </div>
                        </div>
                        <div className="he-gradient-preview" style={{
                            background: `linear-gradient(${currentSlide.gradientConfig?.angle || 135}deg, ${currentSlide.gradientConfig?.color1 || '#0a1a0f'} 0%, ${currentSlide.gradientConfig?.color2 || '#1a3a2a'} 100%)`
                        }} />
                    </div>
                )}

                {currentSlide.bgType === 'url' && (
                    <div className="he-url-editor">
                        <div className="he-form-group">
                            <label>URL изображения</label>
                            <input
                                type="url"
                                value={currentSlide.bgValue}
                                onChange={(e) => handleSlideChange(activeSlideIndex, 'bgValue', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div className="he-form-group">
                            <label>Alt текст</label>
                            <input
                                type="text"
                                value={currentSlide.altText || ''}
                                onChange={(e) => handleSlideChange(activeSlideIndex, 'altText', e.target.value)}
                                placeholder="Описание изображения"
                            />
                        </div>
                        {currentSlide.bgValue && !currentSlide.bgValue.includes('linear-gradient') && (
                            <div className="he-image-preview">
                                <img src={currentSlide.bgValue} alt="Preview" />
                            </div>
                        )}
                    </div>
                )}

                {currentSlide.bgType === 'file' && (
                    <div className="he-file-editor">
                        {currentSlide.bgValue && !currentSlide.bgValue.includes('linear-gradient') && (
                            <div className="he-image-preview">
                                <img src={currentSlide.bgValue} alt="Preview" />
                                <button
                                    className="he-delete-image"
                                    onClick={() => handleDeleteImage(activeSlideIndex)}
                                >
                                    ✕ Удалить
                                </button>
                            </div>
                        )}
                        <div className="he-file-upload">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files[0]) {
                                        handleImageUpload(activeSlideIndex, e.target.files[0]);
                                    }
                                }}
                                id="slide-image-upload"
                            />
                            <label htmlFor="slide-image-upload" className="he-upload-label">
                                📁 {currentSlide.bgValue && !currentSlide.bgValue.includes('linear-gradient') ? 'Заменить изображение' : 'Выбрать изображение'}
                            </label>
                        </div>
                        <div className="he-form-group">
                            <label>Alt текст</label>
                            <input
                                type="text"
                                value={currentSlide.altText || ''}
                                onChange={(e) => handleSlideChange(activeSlideIndex, 'altText', e.target.value)}
                                placeholder="Описание изображения"
                            />
                        </div>
                    </div>
                )}

                <div className="he-form-group">
                    <label className="he-checkbox-label">
                        <input
                            type="checkbox"
                            checked={currentSlide.showStats}
                            onChange={(e) => handleSlideChange(activeSlideIndex, 'showStats', e.target.checked)}
                        />
                        Показывать статистику
                    </label>
                </div>

                <div className="he-form-group">
                    <label>Активен</label>
                    <label className="he-checkbox-label">
                        <input
                            type="checkbox"
                            checked={currentSlide.active}
                            onChange={(e) => handleSlideChange(activeSlideIndex, 'active', e.target.checked)}
                        />
                        Показывать этот слайд
                    </label>
                </div>
            </div>
        </div>
    );
};

export default HeroEditor;