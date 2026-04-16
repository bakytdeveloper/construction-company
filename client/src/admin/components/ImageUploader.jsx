// // src/admin/components/ImageUploader.jsx
// import React, { useState, useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
//
// const ImageUploader = ({ images = [], onImagesChange, multiple = true }) => {
//     const [uploadType, setUploadType] = useState('file');
//     const [urlInput, setUrlInput] = useState('');
//     const [draggedIndex, setDraggedIndex] = useState(null);
//
//     const onDrop = useCallback((acceptedFiles) => {
//         const newImages = acceptedFiles.map(file => ({
//             id: `temp-${Date.now()}-${Math.random()}`,
//             file: file,
//             url: URL.createObjectURL(file),
//             type: 'file',
//             isNew: true
//         }));
//         onImagesChange([...images, ...newImages]);
//     }, [images, onImagesChange]);
//
//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//         onDrop,
//         accept: { 'image/*': [] },
//         multiple
//     });
//
//     const handleUrlAdd = () => {
//         if (urlInput.trim()) {
//             const newImage = {
//                 id: `url-${Date.now()}-${Math.random()}`,
//                 url: urlInput.trim(),
//                 type: 'url',
//                 isNew: true
//             };
//             onImagesChange([...images, newImage]);
//             setUrlInput('');
//         }
//     };
//
//     const handleRemoveImage = (index) => {
//         const newImages = images.filter((_, i) => i !== index);
//         onImagesChange(newImages);
//     };
//
//     const handleSetMainImage = (index) => {
//         const newImages = [images[index], ...images.filter((_, i) => i !== index)];
//         onImagesChange(newImages);
//     };
//
//     const handleDragStart = (e, index) => {
//         setDraggedIndex(index);
//         e.dataTransfer.effectAllowed = 'move';
//     };
//
//     const handleDragOver = (e, index) => {
//         e.preventDefault();
//         if (draggedIndex === null) return;
//
//         if (draggedIndex !== index) {
//             const newImages = [...images];
//             const draggedItem = newImages[draggedIndex];
//             newImages.splice(draggedIndex, 1);
//             newImages.splice(index, 0, draggedItem);
//             onImagesChange(newImages);
//             setDraggedIndex(index);
//         }
//     };
//
//     const handleDragEnd = () => {
//         setDraggedIndex(null);
//     };
//
//     // Функция для получения URL изображения
//     const getImageUrl = (image) => {
//         if (!image) return '';
//         if (image.url) return image.url;
//         if (typeof image === 'string') return image;
//         return '';
//     };
//
//     return (
//         <div className="ap-image-uploader">
//             <div className="ap-upload-type-selector">
//                 <button
//                     type="button"
//                     className={`ap-type-btn ${uploadType === 'file' ? 'ap-active' : ''}`}
//                     onClick={() => setUploadType('file')}
//                 >
//                     📁 Загрузить файлы
//                 </button>
//                 <button
//                     type="button"
//                     className={`ap-type-btn ${uploadType === 'url' ? 'ap-active' : ''}`}
//                     onClick={() => setUploadType('url')}
//                 >
//                     🔗 Добавить по URL
//                 </button>
//             </div>
//
//             {uploadType === 'file' && (
//                 <div {...getRootProps()} className={`ap-dropzone ${isDragActive ? 'ap-drag-active' : ''}`}>
//                     <input {...getInputProps()} />
//                     <div className="ap-dropzone-content">
//                         <span className="ap-dropzone-icon">📸</span>
//                         <p>Перетащите изображения сюда или кликните для выбора</p>
//                         <small>Поддерживаются JPG, PNG, GIF, WEBP (макс. 10MB)</small>
//                     </div>
//                 </div>
//             )}
//
//             {uploadType === 'url' && (
//                 <div className="ap-url-input">
//                     <input
//                         type="text"
//                         placeholder="Вставьте URL изображения..."
//                         value={urlInput}
//                         onChange={(e) => setUrlInput(e.target.value)}
//                         onKeyPress={(e) => e.key === 'Enter' && handleUrlAdd()}
//                     />
//                     <button type="button" onClick={handleUrlAdd}>➕ Добавить</button>
//                 </div>
//             )}
//
//             {images && images.length > 0 && (
//                 <div className="ap-images-gallery">
//                     <div className="ap-gallery-header">
//                         <span>Галерея изображений ({images.length})</span>
//                         <small>Перетащите для изменения порядка</small>
//                     </div>
//                     <div className="ap-images-grid">
//                         {images.map((image, index) => (
//                             <div
//                                 key={image.id || index}
//                                 className={`ap-image-item ${index === 0 ? 'ap-main' : ''}`}
//                                 draggable
//                                 onDragStart={(e) => handleDragStart(e, index)}
//                                 onDragOver={(e) => handleDragOver(e, index)}
//                                 onDragEnd={handleDragEnd}
//                             >
//                                 <img
//                                     src={getImageUrl(image)}
//                                     alt={`Изображение ${index + 1}`}
//                                     onError={(e) => {
//                                         e.target.onerror = null;
//                                         e.target.src = '/placeholder-image.jpg';
//                                     }}
//                                 />
//                                 {index === 0 && <span className="ap-main-badge">Главное</span>}
//                                 <div className="ap-image-actions">
//                                     {index !== 0 && (
//                                         <button
//                                             type="button"
//                                             className="ap-set-main"
//                                             onClick={() => handleSetMainImage(index)}
//                                             title="Сделать главным"
//                                         >
//                                             ⭐
//                                         </button>
//                                     )}
//                                     <button
//                                         type="button"
//                                         className="ap-remove-image"
//                                         onClick={() => handleRemoveImage(index)}
//                                         title="Удалить"
//                                     >
//                                         ✕
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default ImageUploader;

// src/admin/components/ImageUploader.jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';

const ImageUploader = ({ images = [], onImagesChange, multiple = true, entityId, entityType, onImageDeleted }) => {
    const [uploadType, setUploadType] = useState('file');
    const [urlInput, setUrlInput] = useState('');
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        const newImages = acceptedFiles.map(file => ({
            id: `temp-${Date.now()}-${Math.random()}`,
            file: file,
            url: URL.createObjectURL(file),
            type: 'file',
            isNew: true
        }));
        onImagesChange([...images, ...newImages]);
    }, [images, onImagesChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple
    });

    const handleUrlAdd = () => {
        if (urlInput.trim()) {
            const newImage = {
                id: `url-${Date.now()}-${Math.random()}`,
                url: urlInput.trim(),
                type: 'url',
                isNew: true
            };
            onImagesChange([...images, newImage]);
            setUrlInput('');
        }
    };

    const handleRemoveImage = async (index) => {
        const imageToRemove = images[index];

        // Если это существующее изображение (не новое) и есть entityId, удаляем с сервера
        if (!imageToRemove.isNew && entityId && imageToRemove.originalUrl) {
            setDeleting(true);
            try {
                const token = localStorage.getItem('adminToken');
                const endpoint = entityType === 'complex'
                    ? `${process.env.REACT_APP_API_URL}/admin/complexes/${entityId}/images`
                    : `${process.env.REACT_APP_API_URL}/admin/properties/${entityId}/images`;

                await axios.delete(endpoint, {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { imageUrl: imageToRemove.originalUrl }
                });

                toast.success('Изображение удалено');

                // Вызываем callback для обновления данных
                if (onImageDeleted) {
                    onImageDeleted();
                }
            } catch (error) {
                console.error('Error deleting image:', error);
                toast.error('Ошибка при удалении изображения');
                setDeleting(false);
                return;
            }
            setDeleting(false);
        }

        // Удаляем из локального состояния
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    const handleSetMainImage = (index) => {
        const newImages = [images[index], ...images.filter((_, i) => i !== index)];
        onImagesChange(newImages);
    };

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null) return;

        if (draggedIndex !== index) {
            const newImages = [...images];
            const draggedItem = newImages[draggedIndex];
            newImages.splice(draggedIndex, 1);
            newImages.splice(index, 0, draggedItem);
            onImagesChange(newImages);
            setDraggedIndex(index);
        }
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    // Функция для получения URL изображения
    const getImageUrl = (image) => {
        if (!image) return '';
        if (image.url) return image.url;
        if (typeof image === 'string') return image;
        return '';
    };

    return (
        <div className="ap-image-uploader">
            <div className="ap-upload-type-selector">
                <button
                    type="button"
                    className={`ap-type-btn ${uploadType === 'file' ? 'ap-active' : ''}`}
                    onClick={() => setUploadType('file')}
                >
                    📁 Загрузить файлы
                </button>
                <button
                    type="button"
                    className={`ap-type-btn ${uploadType === 'url' ? 'ap-active' : ''}`}
                    onClick={() => setUploadType('url')}
                >
                    🔗 Добавить по URL
                </button>
            </div>

            {uploadType === 'file' && (
                <div {...getRootProps()} className={`ap-dropzone ${isDragActive ? 'ap-drag-active' : ''}`}>
                    <input {...getInputProps()} />
                    <div className="ap-dropzone-content">
                        <span className="ap-dropzone-icon">📸</span>
                        <p>Перетащите изображения сюда или кликните для выбора</p>
                        <small>Поддерживаются JPG, PNG, GIF, WEBP (макс. 10MB)</small>
                    </div>
                </div>
            )}

            {uploadType === 'url' && (
                <div className="ap-url-input">
                    <input
                        type="text"
                        placeholder="Вставьте URL изображения..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleUrlAdd()}
                    />
                    <button type="button" onClick={handleUrlAdd}>➕ Добавить</button>
                </div>
            )}

            {images && images.length > 0 && (
                <div className="ap-images-gallery">
                    <div className="ap-gallery-header">
                        <span>Галерея изображений ({images.length})</span>
                        <small>Перетащите для изменения порядка</small>
                    </div>
                    <div className="ap-images-grid">
                        {images.map((image, index) => (
                            <div
                                key={image.id || index}
                                className={`ap-image-item ${index === 0 ? 'ap-main' : ''}`}
                                draggable={!deleting}
                                onDragStart={(e) => !deleting && handleDragStart(e, index)}
                                onDragOver={(e) => !deleting && handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                            >
                                <img
                                    src={getImageUrl(image)}
                                    alt={`Изображение ${index + 1}`}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder-image.jpg';
                                    }}
                                />
                                {index === 0 && <span className="ap-main-badge">Главное</span>}
                                <div className="ap-image-actions">
                                    {index !== 0 && (
                                        <button
                                            type="button"
                                            className="ap-set-main"
                                            onClick={() => handleSetMainImage(index)}
                                            title="Сделать главным"
                                            disabled={deleting}
                                        >
                                            ⭐
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="ap-remove-image"
                                        onClick={() => handleRemoveImage(index)}
                                        title="Удалить"
                                        disabled={deleting}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;