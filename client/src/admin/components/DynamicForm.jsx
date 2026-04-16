// // src/admin/components/DynamicForm.jsx
// import React, { useState } from 'react';
// import ImageUploader from './ImageUploader';
//
// const DynamicForm = ({
//                          type,
//                          initialData = {},
//                          onSubmit,
//                          onCancel,
//                          complexes = []
//                      }) => {
//     const [formData, setFormData] = useState(initialData);
//     const [features, setFeatures] = useState(initialData.features || []);
//     const [featureInput, setFeatureInput] = useState('');
//     const [infrastructure, setInfrastructure] = useState(initialData.infrastructure || []);
//     const [infraInput, setInfraInput] = useState('');
//     const [images, setImages] = useState(() => {
//         // Инициализация изображений
//         if (initialData.images && Array.isArray(initialData.images) && initialData.images.length > 0) {
//             return initialData.images.map((img, idx) => {
//                 if (typeof img === 'object' && img.url) {
//                     return img;
//                 }
//                 if (typeof img === 'string') {
//                     return {
//                         id: `existing-${idx}-${Date.now()}`,
//                         url: img,
//                         type: 'url',
//                         isNew: false
//                     };
//                 }
//                 return null;
//             }).filter(Boolean);
//         }
//
//         if (initialData.mainImage) {
//             return [{
//                 id: `main-${Date.now()}`,
//                 url: initialData.mainImage,
//                 type: 'url',
//                 isNew: false
//             }];
//         }
//
//         return [];
//     });
//
//     const handleSubmit = (e) => {
//         e.preventDefault();
//
//         // Разделяем файлы и URL для отправки
//         const fileImages = images.filter(img => img.file);
//         const urlImages = images.filter(img => !img.file);
//
//         const submitData = {
//             ...formData,
//             features,
//             images: urlImages.map(img => img.url), // Только URL изображения
//             ...(type === 'complex' && { infrastructure })
//         };
//
//         // Добавляем файлы в отдельное поле для отправки через FormData
//         onSubmit(submitData, fileImages);
//     };
//
//     const handleChange = (field, value) => {
//         setFormData(prev => ({ ...prev, [field]: value }));
//     };
//
//     const addFeature = () => {
//         if (featureInput.trim()) {
//             setFeatures([...features, featureInput.trim()]);
//             setFeatureInput('');
//         }
//     };
//
//     const removeFeature = (index) => {
//         setFeatures(features.filter((_, i) => i !== index));
//     };
//
//     const addInfrastructure = () => {
//         if (infraInput.trim()) {
//             setInfrastructure([...infrastructure, infraInput.trim()]);
//             setInfraInput('');
//         }
//     };
//
//     const removeInfrastructure = (index) => {
//         setInfrastructure(infrastructure.filter((_, i) => i !== index));
//     };
//
//     const renderComplexForm = () => (
//         <>
//             <div className="ap-form-group">
//                 <label>Название Жилого комплекса *</label>
//                 <input
//                     type="text"
//                     value={formData.title || ''}
//                     onChange={(e) => handleChange('title', e.target.value)}
//                     placeholder="Например: ЖК «Алматы Тауэрс»"
//                     required
//                 />
//             </div>
//
//             <div className="ap-form-group">
//                 <label>Адрес / Локация *</label>
//                 <input
//                     type="text"
//                     value={formData.location || ''}
//                     onChange={(e) => handleChange('location', e.target.value)}
//                     placeholder="г. Алматы, мкр. Самал, ул. Абая 150"
//                     required
//                 />
//             </div>
//
//             <div className="ap-form-group">
//                 <label>Описание *</label>
//                 <textarea
//                     value={formData.description || ''}
//                     onChange={(e) => handleChange('description', e.target.value)}
//                     placeholder="Подробное описание жилого комплекса..."
//                     rows="4"
//                     required
//                 />
//             </div>
//
//             <div className="ap-form-row">
//                 <div className="ap-form-group">
//                     <label>Статус строительства</label>
//                     <select
//                         value={formData.status || 'completed'}
//                         onChange={(e) => handleChange('status', e.target.value)}
//                     >
//                         <option value="completed">✅ Построен</option>
//                         <option value="under_construction">🔨 Строится</option>
//                         <option value="planned">📋 Планируется</option>
//                     </select>
//                 </div>
//             </div>
//
//             <div className="ap-form-section">
//                 <h4>Технические характеристики</h4>
//                 <div className="ap-form-row ap-specs-grid">
//                     <div className="ap-form-group">
//                         <label>Количество этажей</label>
//                         <input
//                             type="number"
//                             value={formData.specifications?.floors || ''}
//                             onChange={(e) => handleChange('specifications', { ...formData.specifications, floors: e.target.value })}
//                             placeholder="25"
//                         />
//                     </div>
//                     <div className="ap-form-group">
//                         <label>Количество квартир</label>
//                         <input
//                             type="number"
//                             value={formData.specifications?.apartments || ''}
//                             onChange={(e) => handleChange('specifications', { ...formData.specifications, apartments: e.target.value })}
//                             placeholder="320"
//                         />
//                     </div>
//                     <div className="ap-form-group">
//                         <label>Парковочные места</label>
//                         <input
//                             type="number"
//                             value={formData.specifications?.parking || ''}
//                             onChange={(e) => handleChange('specifications', { ...formData.specifications, parking: e.target.value })}
//                             placeholder="400"
//                         />
//                     </div>
//                     <div className="ap-form-group">
//                         <label>Год постройки</label>
//                         <input
//                             type="number"
//                             value={formData.specifications?.buildYear || ''}
//                             onChange={(e) => handleChange('specifications', { ...formData.specifications, buildYear: e.target.value })}
//                             placeholder="2022"
//                         />
//                     </div>
//                 </div>
//             </div>
//
//             <div className="ap-form-section">
//                 <h4>Особенности ЖК</h4>
//                 <div className="ap-tags-input">
//                     <input
//                         type="text"
//                         value={featureInput}
//                         onChange={(e) => setFeatureInput(e.target.value)}
//                         placeholder="Например: Охраняемая территория"
//                         onKeyPress={(e) => e.key === 'Enter' && addFeature()}
//                     />
//                     <button type="button" onClick={addFeature}>+ Добавить</button>
//                 </div>
//                 <div className="ap-tags-list">
//                     {features.map((feature, index) => (
//                         <span key={index} className="ap-tag">
//                             {feature}
//                             <button type="button" onClick={() => removeFeature(index)}>×</button>
//                         </span>
//                     ))}
//                 </div>
//             </div>
//
//             <div className="ap-form-section">
//                 <h4>Инфраструктура рядом</h4>
//                 <div className="ap-tags-input">
//                     <input
//                         type="text"
//                         value={infraInput}
//                         onChange={(e) => setInfraInput(e.target.value)}
//                         placeholder="Например: Школа, Супермаркет"
//                         onKeyPress={(e) => e.key === 'Enter' && addInfrastructure()}
//                     />
//                     <button type="button" onClick={addInfrastructure}>+ Добавить</button>
//                 </div>
//                 <div className="ap-tags-list">
//                     {infrastructure.map((item, index) => (
//                         <span key={index} className="ap-tag">
//                             {item}
//                             <button type="button" onClick={() => removeInfrastructure(index)}>×</button>
//                         </span>
//                     ))}
//                 </div>
//             </div>
//         </>
//     );
//
//     const renderPropertyForm = () => (
//         <>
//             <div className="ap-form-group">
//                 <label>Название объекта *</label>
//                 <input
//                     type="text"
//                     value={formData.title || ''}
//                     onChange={(e) => handleChange('title', e.target.value)}
//                     placeholder="3-комнатная квартира в ЖК «Алматы Тауэрс»"
//                     required
//                 />
//             </div>
//
//             <div className="ap-form-group">
//                 <label>Локация / Адрес *</label>
//                 <input
//                     type="text"
//                     value={formData.location || ''}
//                     onChange={(e) => handleChange('location', e.target.value)}
//                     placeholder="г. Алматы, мкр. Самал"
//                     required
//                 />
//             </div>
//
//             <div className="ap-form-group">
//                 <label>Описание *</label>
//                 <textarea
//                     value={formData.description || ''}
//                     onChange={(e) => handleChange('description', e.target.value)}
//                     placeholder="Подробное описание объекта недвижимости..."
//                     rows="4"
//                     required
//                 />
//             </div>
//
//             <div className="ap-form-row">
//                 <div className="ap-form-group">
//                     <label>Тип недвижимости</label>
//                     <select
//                         value={formData.propertyType || 'apartment'}
//                         onChange={(e) => handleChange('propertyType', e.target.value)}
//                     >
//                         <option value="apartment">🏢 Квартира</option>
//                         <option value="commercial">🏭 Коммерческая</option>
//                         <option value="house">🏡 Частный дом</option>
//                         <option value="parking">🅿️ Парковка</option>
//                         <option value="storage">📦 Кладовая</option>
//                     </select>
//                 </div>
//
//                 <div className="ap-form-group">
//                     <label>Статус</label>
//                     <select
//                         value={formData.status || 'ready'}
//                         onChange={(e) => handleChange('status', e.target.value)}
//                     >
//                         <option value="ready">✅ Готовая</option>
//                         <option value="under_construction">🔨 Строится</option>
//                         <option value="planned">📋 Планируется</option>
//                         <option value="sold">🔴 Продана</option>
//                     </select>
//                 </div>
//             </div>
//
//             <div className="ap-form-row">
//                 <div className="ap-form-group">
//                     <label>Площадь (м²) *</label>
//                     <input
//                         type="number"
//                         value={formData.area || ''}
//                         onChange={(e) => handleChange('area', e.target.value)}
//                         placeholder="125"
//                         required
//                     />
//                 </div>
//
//                 <div className="ap-form-group">
//                     <label>Цена (₸) *</label>
//                     <input
//                         type="number"
//                         value={formData.price || ''}
//                         onChange={(e) => handleChange('price', e.target.value)}
//                         placeholder="45 000 000"
//                         required
//                     />
//                 </div>
//             </div>
//
//             <div className="ap-form-row">
//                 <div className="ap-form-group">
//                     <label>Количество комнат</label>
//                     <input
//                         type="number"
//                         value={formData.rooms || ''}
//                         onChange={(e) => handleChange('rooms', e.target.value)}
//                         placeholder="3"
//                     />
//                 </div>
//
//                 <div className="ap-form-group">
//                     <label>Этаж</label>
//                     <input
//                         type="text"
//                         value={formData.floor || ''}
//                         onChange={(e) => handleChange('floor', e.target.value)}
//                         placeholder="15/25"
//                     />
//                 </div>
//             </div>
//
//             {complexes.length > 0 && (
//                 <div className="ap-form-group">
//                     <label>Привязать к Жилому комплексу</label>
//                     <select
//                         value={formData.residentialComplex || ''}
//                         onChange={(e) => handleChange('residentialComplex', e.target.value)}
//                     >
//                         <option value="">Не привязан к ЖК</option>
//                         {complexes.map(complex => (
//                             <option key={complex._id} value={complex._id}>
//                                 {complex.title}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             )}
//
//             <div className="ap-form-section">
//                 <h4>Особенности объекта</h4>
//                 <div className="ap-tags-input">
//                     <input
//                         type="text"
//                         value={featureInput}
//                         onChange={(e) => setFeatureInput(e.target.value)}
//                         placeholder="Например: Панорамные окна"
//                         onKeyPress={(e) => e.key === 'Enter' && addFeature()}
//                     />
//                     <button type="button" onClick={addFeature}>+ Добавить</button>
//                 </div>
//                 <div className="ap-tags-list">
//                     {features.map((feature, index) => (
//                         <span key={index} className="ap-tag">
//                             {feature}
//                             <button type="button" onClick={() => removeFeature(index)}>×</button>
//                         </span>
//                     ))}
//                 </div>
//             </div>
//         </>
//     );
//
//     return (
//         <form onSubmit={handleSubmit} className="ap-dynamic-form">
//             {type === 'complex' ? renderComplexForm() : renderPropertyForm()}
//
//             <div className="ap-form-section">
//                 <h4>Изображения</h4>
//                 <ImageUploader
//                     images={images}
//                     onImagesChange={setImages}
//                     multiple={true}
//                 />
//             </div>
//
//             <div className="ap-form-actions">
//                 <button type="submit" className="ap-btn-primary">
//                     💾 Сохранить
//                 </button>
//                 <button type="button" className="ap-btn-secondary" onClick={onCancel}>
//                     Отмена
//                 </button>
//             </div>
//         </form>
//     );
// };
//
// export default DynamicForm;




// src/admin/components/DynamicForm.jsx
import React, { useState } from 'react';
import ImageUploader from './ImageUploader';

const DynamicForm = ({
                         type,
                         initialData = {},
                         onSubmit,
                         onCancel,
                         complexes = []
                     }) => {
    const [formData, setFormData] = useState(initialData);
    const [features, setFeatures] = useState(initialData.features || []);
    const [featureInput, setFeatureInput] = useState('');
    const [infrastructure, setInfrastructure] = useState(initialData.infrastructure || []);
    const [infraInput, setInfraInput] = useState('');
    const [images, setImages] = useState(() => {
        // Инициализация изображений
        if (initialData.images && Array.isArray(initialData.images) && initialData.images.length > 0) {
            return initialData.images.map((img, idx) => {
                if (typeof img === 'object' && img.url) {
                    return img;
                }
                if (typeof img === 'string') {
                    // Проверяем, является ли строка полным URL или путем
                    let imageUrl = img;
                    if (img.startsWith('/uploads') && !img.startsWith('http')) {
                        imageUrl = `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${img}`;
                    }
                    return {
                        id: `existing-${idx}-${Date.now()}`,
                        url: imageUrl,
                        originalUrl: img, // Сохраняем оригинальный путь для отправки на сервер
                        type: 'url',
                        isNew: false
                    };
                }
                return null;
            }).filter(Boolean);
        }

        if (initialData.mainImage) {
            let imageUrl = initialData.mainImage;
            if (initialData.mainImage.startsWith('/uploads') && !initialData.mainImage.startsWith('http')) {
                imageUrl = `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${initialData.mainImage}`;
            }
            return [{
                id: `main-${Date.now()}`,
                url: imageUrl,
                originalUrl: initialData.mainImage,
                type: 'url',
                isNew: false
            }];
        }

        return [];
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Разделяем файлы и URL для отправки
        const fileImages = images.filter(img => img.file);
        const urlImages = images.filter(img => !img.file);

        const submitData = {
            ...formData,
            features,
            // Для URL изображений используем originalUrl (если есть) или url
            images: urlImages.map(img => img.originalUrl || img.url),
            ...(type === 'complex' && { infrastructure })
        };

        // Добавляем файлы в отдельное поле для отправки через FormData
        onSubmit(submitData, fileImages);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setFeatures([...features, featureInput.trim()]);
            setFeatureInput('');
        }
    };

    const removeFeature = (index) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    const addInfrastructure = () => {
        if (infraInput.trim()) {
            setInfrastructure([...infrastructure, infraInput.trim()]);
            setInfraInput('');
        }
    };

    const removeInfrastructure = (index) => {
        setInfrastructure(infrastructure.filter((_, i) => i !== index));
    };

    const renderComplexForm = () => (
        // ... (остальной код формы ЖК без изменений)
        <>
            <div className="ap-form-group">
                <label>Название Жилого комплекса *</label>
                <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Например: ЖК «Алматы Тауэрс»"
                    required
                />
            </div>

            <div className="ap-form-group">
                <label>Адрес / Локация *</label>
                <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="г. Алматы, мкр. Самал, ул. Абая 150"
                    required
                />
            </div>

            <div className="ap-form-group">
                <label>Описание *</label>
                <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Подробное описание жилого комплекса..."
                    rows="4"
                    required
                />
            </div>

            <div className="ap-form-row">
                <div className="ap-form-group">
                    <label>Статус строительства</label>
                    <select
                        value={formData.status || 'completed'}
                        onChange={(e) => handleChange('status', e.target.value)}
                    >
                        <option value="completed">✅ Построен</option>
                        <option value="under_construction">🔨 Строится</option>
                        <option value="planned">📋 Планируется</option>
                    </select>
                </div>
            </div>

            <div className="ap-form-section">
                <h4>Технические характеристики</h4>
                <div className="ap-form-row ap-specs-grid">
                    <div className="ap-form-group">
                        <label>Количество этажей</label>
                        <input
                            type="number"
                            value={formData.specifications?.floors || ''}
                            onChange={(e) => handleChange('specifications', { ...formData.specifications, floors: e.target.value })}
                            placeholder="25"
                        />
                    </div>
                    <div className="ap-form-group">
                        <label>Количество квартир</label>
                        <input
                            type="number"
                            value={formData.specifications?.apartments || ''}
                            onChange={(e) => handleChange('specifications', { ...formData.specifications, apartments: e.target.value })}
                            placeholder="320"
                        />
                    </div>
                    <div className="ap-form-group">
                        <label>Парковочные места</label>
                        <input
                            type="number"
                            value={formData.specifications?.parking || ''}
                            onChange={(e) => handleChange('specifications', { ...formData.specifications, parking: e.target.value })}
                            placeholder="400"
                        />
                    </div>
                    <div className="ap-form-group">
                        <label>Год постройки</label>
                        <input
                            type="number"
                            value={formData.specifications?.buildYear || ''}
                            onChange={(e) => handleChange('specifications', { ...formData.specifications, buildYear: e.target.value })}
                            placeholder="2022"
                        />
                    </div>
                </div>
            </div>

            <div className="ap-form-section">
                <h4>Особенности ЖК</h4>
                <div className="ap-tags-input">
                    <input
                        type="text"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        placeholder="Например: Охраняемая территория"
                        onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    />
                    <button type="button" onClick={addFeature}>+ Добавить</button>
                </div>
                <div className="ap-tags-list">
                    {features.map((feature, index) => (
                        <span key={index} className="ap-tag">
                            {feature}
                            <button type="button" onClick={() => removeFeature(index)}>×</button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="ap-form-section">
                <h4>Инфраструктура рядом</h4>
                <div className="ap-tags-input">
                    <input
                        type="text"
                        value={infraInput}
                        onChange={(e) => setInfraInput(e.target.value)}
                        placeholder="Например: Школа, Супермаркет"
                        onKeyPress={(e) => e.key === 'Enter' && addInfrastructure()}
                    />
                    <button type="button" onClick={addInfrastructure}>+ Добавить</button>
                </div>
                <div className="ap-tags-list">
                    {infrastructure.map((item, index) => (
                        <span key={index} className="ap-tag">
                            {item}
                            <button type="button" onClick={() => removeInfrastructure(index)}>×</button>
                        </span>
                    ))}
                </div>
            </div>
        </>
    );

    const renderPropertyForm = () => (
        // ... (форма недвижимости без изменений)
        <>
            <div className="ap-form-group">
                <label>Название объекта *</label>
                <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="3-комнатная квартира в ЖК «Алматы Тауэрс»"
                    required
                />
            </div>

            <div className="ap-form-group">
                <label>Локация / Адрес *</label>
                <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="г. Алматы, мкр. Самал"
                    required
                />
            </div>

            <div className="ap-form-group">
                <label>Описание *</label>
                <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Подробное описание объекта недвижимости..."
                    rows="4"
                    required
                />
            </div>

            <div className="ap-form-row">
                <div className="ap-form-group">
                    <label>Тип недвижимости</label>
                    <select
                        value={formData.propertyType || 'apartment'}
                        onChange={(e) => handleChange('propertyType', e.target.value)}
                    >
                        <option value="apartment">🏢 Квартира</option>
                        <option value="commercial">🏭 Коммерческая</option>
                        <option value="house">🏡 Частный дом</option>
                        <option value="parking">🅿️ Парковка</option>
                        <option value="storage">📦 Кладовая</option>
                    </select>
                </div>

                <div className="ap-form-group">
                    <label>Статус</label>
                    <select
                        value={formData.status || 'ready'}
                        onChange={(e) => handleChange('status', e.target.value)}
                    >
                        <option value="ready">✅ Готовая</option>
                        <option value="under_construction">🔨 Строится</option>
                        <option value="planned">📋 Планируется</option>
                        <option value="sold">🔴 Продана</option>
                    </select>
                </div>
            </div>

            <div className="ap-form-row">
                <div className="ap-form-group">
                    <label>Площадь (м²) *</label>
                    <input
                        type="number"
                        value={formData.area || ''}
                        onChange={(e) => handleChange('area', e.target.value)}
                        placeholder="125"
                        required
                    />
                </div>

                <div className="ap-form-group">
                    <label>Цена (₸) *</label>
                    <input
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => handleChange('price', e.target.value)}
                        placeholder="45 000 000"
                        required
                    />
                </div>
            </div>

            <div className="ap-form-row">
                <div className="ap-form-group">
                    <label>Количество комнат</label>
                    <input
                        type="number"
                        value={formData.rooms || ''}
                        onChange={(e) => handleChange('rooms', e.target.value)}
                        placeholder="3"
                    />
                </div>

                <div className="ap-form-group">
                    <label>Этаж</label>
                    <input
                        type="text"
                        value={formData.floor || ''}
                        onChange={(e) => handleChange('floor', e.target.value)}
                        placeholder="15/25"
                    />
                </div>
            </div>

            {complexes.length > 0 && (
                <div className="ap-form-group">
                    <label>Привязать к Жилому комплексу</label>
                    <select
                        value={formData.residentialComplex || ''}
                        onChange={(e) => handleChange('residentialComplex', e.target.value)}
                    >
                        <option value="">Не привязан к ЖК</option>
                        {complexes.map(complex => (
                            <option key={complex._id} value={complex._id}>
                                {complex.title}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="ap-form-section">
                <h4>Особенности объекта</h4>
                <div className="ap-tags-input">
                    <input
                        type="text"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        placeholder="Например: Панорамные окна"
                        onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    />
                    <button type="button" onClick={addFeature}>+ Добавить</button>
                </div>
                <div className="ap-tags-list">
                    {features.map((feature, index) => (
                        <span key={index} className="ap-tag">
                            {feature}
                            <button type="button" onClick={() => removeFeature(index)}>×</button>
                        </span>
                    ))}
                </div>
            </div>
        </>
    );

    return (
        <form onSubmit={handleSubmit} className="ap-dynamic-form">
            {type === 'complex' ? renderComplexForm() : renderPropertyForm()}

            <div className="ap-form-section">
                <h4>Изображения</h4>
                <ImageUploader
                    images={images}
                    onImagesChange={setImages}
                    multiple={true}
                />
            </div>

            <div className="ap-form-actions">
                <button type="submit" className="ap-btn-primary">
                    💾 Сохранить
                </button>
                <button type="button" className="ap-btn-secondary" onClick={onCancel}>
                    Отмена
                </button>
            </div>
        </form>
    );
};

export default DynamicForm;