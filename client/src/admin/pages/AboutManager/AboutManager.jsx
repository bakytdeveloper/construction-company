// // src/admin/pages/AboutManager.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import './AboutManager.css';
//
// const AboutManager = () => {
//     const [settings, setSettings] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [showSettingsModal, setShowSettingsModal] = useState(false);
//     const [editingValueCard, setEditingValueCard] = useState(null);
//     const [editingTeamMember, setEditingTeamMember] = useState(null);
//     const [imageFile, setImageFile] = useState(null);
//     const [imagePreview, setImagePreview] = useState('');
//
//     const [valueCardForm, setValueCardForm] = useState({
//         icon: '',
//         title: '',
//         description: '',
//         active: true
//     });
//
//     const [teamMemberForm, setTeamMemberForm] = useState({
//         name: '',
//         position: '',
//         experience: '',
//         image: '',
//         imageType: 'initials',
//         active: true
//     });
//
//     useEffect(() => {
//         fetchSettings();
//     }, []);
//
//     const fetchSettings = async () => {
//         setLoading(true);
//         try {
//             const token = localStorage.getItem('adminToken');
//             const response = await axios.get(`${process.env.REACT_APP_API_URL}/about`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setSettings(response.data.data);
//         } catch (error) {
//             console.error('Error fetching settings:', error);
//             toast.error('Ошибка загрузки данных');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleSaveSettings = async () => {
//         const token = localStorage.getItem('adminToken');
//         try {
//             await axios.put(`${process.env.REACT_APP_API_URL}/about`, settings, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             toast.success('Настройки сохранены');
//             setShowSettingsModal(false);
//             fetchSettings();
//         } catch (error) {
//             console.error('Error saving settings:', error);
//             toast.error('Ошибка сохранения настроек');
//         }
//     };
//
//     const handleResetSettings = async () => {
//         if (window.confirm('Сбросить все настройки к дефолтным значениям?')) {
//             const token = localStorage.getItem('adminToken');
//             try {
//                 await axios.post(`${process.env.REACT_APP_API_URL}/about/reset`, {}, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 toast.success('Настройки сброшены');
//                 setShowSettingsModal(false);
//                 fetchSettings();
//             } catch (error) {
//                 console.error('Error resetting settings:', error);
//                 toast.error('Ошибка сброса настроек');
//             }
//         }
//     };
//
//     const handleAddValueCard = async () => {
//         const newCard = {
//             ...valueCardForm,
//             order: settings.valueCards.length,
//             active: true
//         };
//
//         const updatedCards = [...settings.valueCards, newCard];
//         setSettings({ ...settings, valueCards: updatedCards });
//         setEditingValueCard(null);
//         setValueCardForm({ icon: '', title: '', description: '', active: true });
//         toast.success('Карточка добавлена');
//     };
//
//     const handleUpdateValueCard = async () => {
//         const updatedCards = settings.valueCards.map((card, idx) =>
//             idx === editingValueCard ? { ...card, ...valueCardForm } : card
//         );
//         setSettings({ ...settings, valueCards: updatedCards });
//         setEditingValueCard(null);
//         setValueCardForm({ icon: '', title: '', description: '', active: true });
//         toast.success('Карточка обновлена');
//     };
//
//     const handleDeleteValueCard = async (index) => {
//         if (window.confirm('Удалить карточку ценности?')) {
//             const updatedCards = settings.valueCards.filter((_, idx) => idx !== index);
//             setSettings({ ...settings, valueCards: updatedCards });
//             toast.success('Карточка удалена');
//         }
//     };
//
//     const handleAddTeamMember = async () => {
//         const newMember = {
//             ...teamMemberForm,
//             order: settings.teamMembers.length,
//             active: true
//         };
//
//         const updatedMembers = [...settings.teamMembers, newMember];
//         setSettings({ ...settings, teamMembers: updatedMembers });
//         setEditingTeamMember(null);
//         setTeamMemberForm({ name: '', position: '', experience: '', image: '', imageType: 'initials', active: true });
//         setImageFile(null);
//         setImagePreview('');
//         toast.success('Член команды добавлен');
//     };
//
//     const handleUpdateTeamMember = async () => {
//         const updatedMembers = settings.teamMembers.map((member, idx) =>
//             idx === editingTeamMember ? { ...member, ...teamMemberForm } : member
//         );
//         setSettings({ ...settings, teamMembers: updatedMembers });
//         setEditingTeamMember(null);
//         setTeamMemberForm({ name: '', position: '', experience: '', image: '', imageType: 'initials', active: true });
//         setImageFile(null);
//         setImagePreview('');
//         toast.success('Член команды обновлен');
//     };
//
//     const handleDeleteTeamMember = async (index) => {
//         if (window.confirm('Удалить члена команды?')) {
//             const updatedMembers = settings.teamMembers.filter((_, idx) => idx !== index);
//             setSettings({ ...settings, teamMembers: updatedMembers });
//             toast.success('Член команды удален');
//         }
//     };
//
//     const handleReorder = async (type, id, direction) => {
//         try {
//             const token = localStorage.getItem('adminToken');
//             await axios.post(`${process.env.REACT_APP_API_URL}/about/reorder/${type}/${id}/${direction}`, {}, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             toast.success('Порядок изменен');
//             fetchSettings();
//         } catch (error) {
//             console.error('Error reordering:', error);
//             toast.error('Ошибка при изменении порядка');
//         }
//     };
//
//     const handleTeamMemberImageUpload = async (index, file) => {
//         const formData = new FormData();
//         formData.append('image', file);
//
//         try {
//             const token = localStorage.getItem('adminToken');
//             const response = await axios.post(
//                 `${process.env.REACT_APP_API_URL}/about/upload/team-member/${index}`,
//                 formData,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'multipart/form-data'
//                     }
//                 }
//             );
//
//             setSettings(response.data.data);
//             toast.success('Изображение загружено');
//         } catch (error) {
//             console.error('Error uploading image:', error);
//             toast.error('Ошибка загрузки изображения');
//         }
//     };
//
//     const handleDeleteTeamMemberImage = async (index) => {
//         try {
//             const token = localStorage.getItem('adminToken');
//             const response = await axios.delete(
//                 `${process.env.REACT_APP_API_URL}/about/team-member/${index}/image`,
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//
//             setSettings(response.data.data);
//             toast.success('Изображение удалено');
//         } catch (error) {
//             console.error('Error deleting image:', error);
//             toast.error('Ошибка удаления изображения');
//         }
//     };
//
//     const getInitials = (name) => {
//         if (!name) return '?';
//         const parts = name.trim().split(' ');
//         if (parts.length === 1) {
//             return parts[0].substring(0, 2).toUpperCase();
//         }
//         return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
//     };
//
//     const getImageUrl = (imagePath) => {
//         if (!imagePath) return '';
//         if (imagePath.startsWith('http')) return imagePath;
//         if (imagePath.startsWith('/uploads')) {
//             return `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${imagePath}`;
//         }
//         return imagePath;
//     };
//
//     if (loading || !settings) {
//         return <div className="ap-loading">Загрузка...</div>;
//     }
//
//     return (
//         <div className="ab-manager-page">
//             <div className="ab-manager-header">
//                 <h2>Управление страницей "О компании"</h2>
//                 <div className="ab-header-buttons">
//                     <button className="ap-create-btn" onClick={() => setShowSettingsModal(true)}>
//                         ⚙️ Настройки секций
//                     </button>
//                     <button className="ap-create-btn" onClick={handleResetSettings}>
//                         🔄 Сбросить к дефолтным
//                     </button>
//                 </div>
//             </div>
//
//             {/* Предпросмотр и управление карточками ценностей */}
//             <div className="ab-section">
//                 <div className="ab-section-header">
//                     <h3>Карточки ценностей</h3>
//                     <button
//                         className="ap-create-btn"
//                         onClick={() => {
//                             setValueCardForm({ icon: '', title: '', description: '', active: true });
//                             setEditingValueCard(null);
//                         }}
//                     >
//                         + Добавить ценность
//                     </button>
//                 </div>
//
//                 {(editingValueCard !== null || (valueCardForm.title && !valueCardForm.title.includes('Редактировать'))) && (
//                     <div className="ab-edit-form">
//                         <h4>{editingValueCard !== null ? 'Редактировать ценность' : 'Новая ценность'}</h4>
//                         <div className="ab-form-row">
//                             <div className="ab-form-group">
//                                 <label>Иконка (emoji)</label>
//                                 <input
//                                     type="text"
//                                     value={valueCardForm.icon}
//                                     onChange={(e) => setValueCardForm({ ...valueCardForm, icon: e.target.value })}
//                                     placeholder="🔧"
//                                     maxLength={2}
//                                 />
//                             </div>
//                             <div className="ab-form-group">
//                                 <label>Название</label>
//                                 <input
//                                     type="text"
//                                     value={valueCardForm.title}
//                                     onChange={(e) => setValueCardForm({ ...valueCardForm, title: e.target.value })}
//                                     placeholder="Качество"
//                                 />
//                             </div>
//                         </div>
//                         <div className="ab-form-group">
//                             <label>Описание</label>
//                             <textarea
//                                 value={valueCardForm.description}
//                                 onChange={(e) => setValueCardForm({ ...valueCardForm, description: e.target.value })}
//                                 rows="2"
//                                 placeholder="Описание ценности..."
//                             />
//                         </div>
//                         <div className="ab-form-group">
//                             <label className="ab-checkbox-label">
//                                 <input
//                                     type="checkbox"
//                                     checked={valueCardForm.active}
//                                     onChange={(e) => setValueCardForm({ ...valueCardForm, active: e.target.checked })}
//                                 />
//                                 Активна
//                             </label>
//                         </div>
//                         <div className="ab-form-actions">
//                             <button
//                                 className="ab-save-btn"
//                                 onClick={editingValueCard !== null ? handleUpdateValueCard : handleAddValueCard}
//                             >
//                                 💾 Сохранить
//                             </button>
//                             <button
//                                 className="ab-cancel-btn"
//                                 onClick={() => {
//                                     setEditingValueCard(null);
//                                     setValueCardForm({ icon: '', title: '', description: '', active: true });
//                                 }}
//                             >
//                                 Отмена
//                             </button>
//                         </div>
//                     </div>
//                 )}
//
//                 <div className="ab-items-grid">
//                     {settings.valueCards.map((card, index) => (
//                         <div key={index} className="ab-card">
//                             <div className="ab-card-icon">{card.icon || '🔧'}</div>
//                             <div className="ab-card-content">
//                                 <h4>{card.title}</h4>
//                                 <p>{card.description}</p>
//                                 <span className={`ab-card-status ${card.active ? 'active' : 'inactive'}`}>
//                                     {card.active ? 'Активна' : 'Неактивна'}
//                                 </span>
//                             </div>
//                             <div className="ab-card-actions">
//                                 <button
//                                     className="ab-move-up"
//                                     onClick={() => handleReorder('value-card', index, 'up')}
//                                     disabled={index === 0}
//                                 >
//                                     ←
//                                 </button>
//                                 <button
//                                     className="ab-move-down"
//                                     onClick={() => handleReorder('value-card', index, 'down')}
//                                     disabled={index === settings.valueCards.length - 1}
//                                 >
//                                     →
//                                 </button>
//                                 <button
//                                     className="ab-edit-btn"
//                                     onClick={() => {
//                                         setEditingValueCard(index);
//                                         setValueCardForm({
//                                             icon: card.icon,
//                                             title: card.title,
//                                             description: card.description,
//                                             active: card.active
//                                         });
//                                     }}
//                                 >
//                                     ✏️
//                                 </button>
//                                 <button
//                                     className="ab-delete-btn"
//                                     onClick={() => handleDeleteValueCard(index)}
//                                 >
//                                     🗑️
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//
//             {/* Управление членами команды */}
//             <div className="ab-section">
//                 <div className="ab-section-header">
//                     <h3>Члены команды</h3>
//                     <button
//                         className="ap-create-btn"
//                         onClick={() => {
//                             setTeamMemberForm({ name: '', position: '', experience: '', image: '', imageType: 'initials', active: true });
//                             setEditingTeamMember(null);
//                             setImageFile(null);
//                             setImagePreview('');
//                         }}
//                     >
//                         + Добавить члена команды
//                     </button>
//                 </div>
//
//                 {(editingTeamMember !== null || (teamMemberForm.name && !teamMemberForm.name.includes('Редактировать'))) && (
//                     <div className="ab-edit-form">
//                         <h4>{editingTeamMember !== null ? 'Редактировать члена команды' : 'Новый член команды'}</h4>
//                         <div className="ab-form-row">
//                             <div className="ab-form-group">
//                                 <label>Имя</label>
//                                 <input
//                                     type="text"
//                                     value={teamMemberForm.name}
//                                     onChange={(e) => setTeamMemberForm({ ...teamMemberForm, name: e.target.value })}
//                                     placeholder="Азат Нуржанов"
//                                 />
//                             </div>
//                             <div className="ab-form-group">
//                                 <label>Должность</label>
//                                 <input
//                                     type="text"
//                                     value={teamMemberForm.position}
//                                     onChange={(e) => setTeamMemberForm({ ...teamMemberForm, position: e.target.value })}
//                                     placeholder="Генеральный директор"
//                                 />
//                             </div>
//                         </div>
//                         <div className="ab-form-row">
//                             <div className="ab-form-group">
//                                 <label>Опыт</label>
//                                 <input
//                                     type="text"
//                                     value={teamMemberForm.experience}
//                                     onChange={(e) => setTeamMemberForm({ ...teamMemberForm, experience: e.target.value })}
//                                     placeholder="15 лет"
//                                 />
//                             </div>
//                             <div className="ab-form-group">
//                                 <label className="ab-checkbox-label">
//                                     <input
//                                         type="checkbox"
//                                         checked={teamMemberForm.active}
//                                         onChange={(e) => setTeamMemberForm({ ...teamMemberForm, active: e.target.checked })}
//                                     />
//                                     Активен
//                                 </label>
//                             </div>
//                         </div>
//                         <div className="ab-form-group">
//                             <label>Тип изображения</label>
//                             <div className="ab-image-options">
//                                 <button
//                                     type="button"
//                                     className={`ab-image-option ${teamMemberForm.imageType === 'initials' ? 'active' : ''}`}
//                                     onClick={() => setTeamMemberForm({ ...teamMemberForm, imageType: 'initials', image: '' })}
//                                 >
//                                     🅰️ Инициалы
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className={`ab-image-option ${teamMemberForm.imageType === 'url' ? 'active' : ''}`}
//                                     onClick={() => setTeamMemberForm({ ...teamMemberForm, imageType: 'url' })}
//                                 >
//                                     🔗 URL
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className={`ab-image-option ${teamMemberForm.imageType === 'file' ? 'active' : ''}`}
//                                     onClick={() => setTeamMemberForm({ ...teamMemberForm, imageType: 'file' })}
//                                 >
//                                     📁 Загрузить файл
//                                 </button>
//                             </div>
//                         </div>
//
//                         {teamMemberForm.imageType === 'url' && (
//                             <div className="ab-form-group">
//                                 <label>URL изображения</label>
//                                 <input
//                                     type="url"
//                                     value={teamMemberForm.image}
//                                     onChange={(e) => setTeamMemberForm({ ...teamMemberForm, image: e.target.value })}
//                                     placeholder="https://randomuser.me/api/portraits/men/10.jpg"
//                                 />
//                             </div>
//                         )}
//
//                         {teamMemberForm.imageType === 'file' && (
//                             <div className="ab-form-group">
//                                 <label>Загрузить изображение</label>
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={(e) => {
//                                         const file = e.target.files[0];
//                                         if (file) {
//                                             setImageFile(file);
//                                             setImagePreview(URL.createObjectURL(file));
//                                         }
//                                     }}
//                                 />
//                                 <small className="ab-file-hint">Рекомендуемый размер: 400x400px</small>
//                             </div>
//                         )}
//
//                         {imagePreview && (
//                             <div className="ab-image-preview">
//                                 <img src={imagePreview} alt="Preview" />
//                             </div>
//                         )}
//
//                         <div className="ab-form-actions">
//                             <button
//                                 className="ab-save-btn"
//                                 onClick={async () => {
//                                     if (editingTeamMember !== null) {
//                                         await handleUpdateTeamMember();
//                                         if (imageFile) {
//                                             await handleTeamMemberImageUpload(editingTeamMember, imageFile);
//                                         }
//                                     } else {
//                                         await handleAddTeamMember();
//                                         if (imageFile && teamMemberForm.imageType === 'file') {
//                                             const newIndex = settings.teamMembers.length;
//                                             await handleTeamMemberImageUpload(newIndex, imageFile);
//                                         }
//                                     }
//                                 }}
//                             >
//                                 💾 Сохранить
//                             </button>
//                             <button
//                                 className="ab-cancel-btn"
//                                 onClick={() => {
//                                     setEditingTeamMember(null);
//                                     setTeamMemberForm({ name: '', position: '', experience: '', image: '', imageType: 'initials', active: true });
//                                     setImageFile(null);
//                                     setImagePreview('');
//                                 }}
//                             >
//                                 Отмена
//                             </button>
//                         </div>
//                     </div>
//                 )}
//
//                 <div className="ab-team-grid">
//                     {settings.teamMembers.map((member, index) => (
//                         <div key={index} className="ab-team-card">
//                             <div className="ab-team-image">
//                                 {member.imageType === 'initials' ? (
//                                     <div className="ab-team-initials">{getInitials(member.name)}</div>
//                                 ) : (
//                                     <img src={getImageUrl(member.image)} alt={member.name} />
//                                 )}
//                                 {member.imageType === 'file' && member.image && (
//                                     <button
//                                         className="ab-delete-image"
//                                         onClick={() => handleDeleteTeamMemberImage(index)}
//                                     >
//                                         ✕
//                                     </button>
//                                 )}
//                             </div>
//                             <div className="ab-team-info">
//                                 <h4>{member.name}</h4>
//                                 <p>{member.position}</p>
//                                 <span className="ab-team-exp">{member.experience}</span>
//                                 <span className={`ab-card-status ${member.active ? 'active' : 'inactive'}`}>
//                                     {member.active ? 'Активен' : 'Неактивен'}
//                                 </span>
//                             </div>
//                             <div className="ab-team-actions">
//                                 <button
//                                     className="ab-move-up"
//                                     onClick={() => handleReorder('team-member', index, 'up')}
//                                     disabled={index === 0}
//                                 >
//                                     ←
//                                 </button>
//                                 <button
//                                     className="ab-move-down"
//                                     onClick={() => handleReorder('team-member', index, 'down')}
//                                     disabled={index === settings.teamMembers.length - 1}
//                                 >
//                                     →
//                                 </button>
//                                 <button
//                                     className="ab-edit-btn"
//                                     onClick={() => {
//                                         setEditingTeamMember(index);
//                                         setTeamMemberForm({
//                                             name: member.name,
//                                             position: member.position,
//                                             experience: member.experience,
//                                             image: member.image,
//                                             imageType: member.imageType,
//                                             active: member.active
//                                         });
//                                         setImagePreview(member.imageType === 'url' ? member.image : '');
//                                         setImageFile(null);
//                                     }}
//                                 >
//                                     ✏️
//                                 </button>
//                                 <button
//                                     className="ab-delete-btn"
//                                     onClick={() => handleDeleteTeamMember(index)}
//                                 >
//                                     🗑️
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//
//             {/* Modal для настроек секций */}
//             {showSettingsModal && (
//                 <div className="ap-modal-overlay" onClick={() => setShowSettingsModal(false)}>
//                     <div className="ap-modal ap-modal-large" onClick={(e) => e.stopPropagation()}>
//                         <div className="ap-modal-header">
//                             <h2>Настройки секций страницы "О компании"</h2>
//                             <button className="ap-modal-close" onClick={() => setShowSettingsModal(false)}>✕</button>
//                         </div>
//                         <div className="ap-modal-body">
//                             <div className="ab-dynamic-form">
//                                 {/* Hero секция */}
//                                 <div className="ab-form-section">
//                                     <h3>Hero секция</h3>
//                                     <div className="ab-form-group">
//                                         <label>Заголовок</label>
//                                         <input
//                                             type="text"
//                                             value={settings.hero.title}
//                                             onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, title: e.target.value } })}
//                                         />
//                                     </div>
//                                     <div className="ab-form-group">
//                                         <label>Подзаголовок</label>
//                                         <input
//                                             type="text"
//                                             value={settings.hero.subtitle}
//                                             onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, subtitle: e.target.value } })}
//                                         />
//                                     </div>
//                                     <div className="ab-form-group">
//                                         <label>URL фонового изображения</label>
//                                         <input
//                                             type="text"
//                                             value={settings.hero.bgImage}
//                                             onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, bgImage: e.target.value, bgImageType: 'url' } })}
//                                         />
//                                     </div>
//                                     <div className="ab-form-group">
//                                         <label>Прозрачность оверлея</label>
//                                         <input
//                                             type="range"
//                                             min="0"
//                                             max="1"
//                                             step="0.01"
//                                             value={settings.hero.overlayOpacity}
//                                             onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, overlayOpacity: parseFloat(e.target.value) } })}
//                                         />
//                                         <span>{Math.round(settings.hero.overlayOpacity * 100)}%</span>
//                                     </div>
//                                 </div>
//
//                                 {/* Миссия секция */}
//                                 <div className="ab-form-section">
//                                     <h3>Миссия секция</h3>
//                                     <div className="ab-form-group">
//                                         <label>Подзаголовок</label>
//                                         <input
//                                             type="text"
//                                             value={settings.mission.subtitle}
//                                             onChange={(e) => setSettings({ ...settings, mission: { ...settings.mission, subtitle: e.target.value } })}
//                                         />
//                                     </div>
//                                     <div className="ab-form-group">
//                                         <label>Заголовок</label>
//                                         <input
//                                             type="text"
//                                             value={settings.mission.title}
//                                             onChange={(e) => setSettings({ ...settings, mission: { ...settings.mission, title: e.target.value } })}
//                                         />
//                                     </div>
//                                     <div className="ab-form-group">
//                                         <label>Описание</label>
//                                         <textarea
//                                             value={settings.mission.description}
//                                             onChange={(e) => setSettings({ ...settings, mission: { ...settings.mission, description: e.target.value } })}
//                                             rows="4"
//                                         />
//                                     </div>
//                                     <div className="ab-form-group">
//                                         <label>URL изображения</label>
//                                         <input
//                                             type="text"
//                                             value={settings.mission.image}
//                                             onChange={(e) => setSettings({ ...settings, mission: { ...settings.mission, image: e.target.value, imageType: 'url' } })}
//                                         />
//                                     </div>
//                                     <div className="ab-form-group">
//                                         <label>Текст бейджа</label>
//                                         <input
//                                             type="text"
//                                             value={settings.mission.badgeText}
//                                             onChange={(e) => setSettings({ ...settings, mission: { ...settings.mission, badgeText: e.target.value } })}
//                                         />
//                                     </div>
//                                 </div>
//
//                                 {/* Ценности секция */}
//                                 <div className="ab-form-section">
//                                     <h3>Ценности секция</h3>
//                                     <div className="ab-form-group">
//                                         <label>Подзаголовок</label>
//                                         <input
//                                             type="text"
//                                             value={settings.values.subtitle}
//                                             onChange={(e) => setSettings({ ...settings, values: { ...settings.values, subtitle: e.target.value } })}
//                                         />
//                                     </div>
//                                     <div className="ab-form-group">
//                                         <label>Заголовок</label>
//                                         <input
//                                             type="text"
//                                             value={settings.values.title}
//                                             onChange={(e) => setSettings({ ...settings, values: { ...settings.values, title: e.target.value } })}
//                                         />
//                                     </div>
//                                 </div>
//
//                                 {/* Команда секция */}
//                                 <div className="ab-form-section">
//                                     <h3>Команда секция</h3>
//                                     <div className="ab-form-group">
//                                         <label>Подзаголовок</label>
//                                         <input
//                                             type="text"
//                                             value={settings.team.subtitle}
//                                             onChange={(e) => setSettings({ ...settings, team: { ...settings.team, subtitle: e.target.value } })}
//                                         />
//                                     </div>
//                                     <div className="ab-form-group">
//                                         <label>Заголовок</label>
//                                         <input
//                                             type="text"
//                                             value={settings.team.title}
//                                             onChange={(e) => setSettings({ ...settings, team: { ...settings.team, title: e.target.value } })}
//                                         />
//                                     </div>
//                                 </div>
//
//                                 <div className="ab-form-actions">
//                                     <button type="button" className="ap-btn-primary" onClick={handleSaveSettings}>
//                                         💾 Сохранить все настройки
//                                     </button>
//                                     <button type="button" className="ap-btn-secondary" onClick={() => setShowSettingsModal(false)}>
//                                         Отмена
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default AboutManager;

// src/admin/pages/AboutManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AboutManager.css';

const AboutManager = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [editingValueCard, setEditingValueCard] = useState(null);
    const [editingTeamMember, setEditingTeamMember] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [heroBgImageFile, setHeroBgImageFile] = useState(null);
    const [heroBgImagePreview, setHeroBgImagePreview] = useState('');
    const [missionImageFile, setMissionImageFile] = useState(null);
    const [missionImagePreview, setMissionImagePreview] = useState('');

    const [valueCardForm, setValueCardForm] = useState({
        icon: '',
        title: '',
        description: '',
        active: true
    });

    const [teamMemberForm, setTeamMemberForm] = useState({
        name: '',
        position: '',
        experience: '',
        image: '',
        imageType: 'initials',
        active: true
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/about`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSettings(response.data.data);
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            // Загружаем фоновое изображение hero если есть
            if (heroBgImageFile) {
                const formData = new FormData();
                formData.append('image', heroBgImageFile);
                await axios.post(`${process.env.REACT_APP_API_URL}/about/upload/hero-bg`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setHeroBgImageFile(null);
                setHeroBgImagePreview('');
            }

            // Загружаем изображение миссии если есть
            if (missionImageFile) {
                const formData = new FormData();
                formData.append('image', missionImageFile);
                await axios.post(`${process.env.REACT_APP_API_URL}/about/upload/mission-image`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setMissionImageFile(null);
                setMissionImagePreview('');
            }

            await axios.put(`${process.env.REACT_APP_API_URL}/about`, settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Настройки сохранены');
            setShowSettingsModal(false);
            fetchSettings();
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Ошибка сохранения настроек');
        }
    };

    const handleResetSettings = async () => {
        if (window.confirm('Сбросить все настройки к дефолтным значениям?')) {
            const token = localStorage.getItem('adminToken');
            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/about/reset`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Настройки сброшены');
                setShowSettingsModal(false);
                fetchSettings();
            } catch (error) {
                console.error('Error resetting settings:', error);
                toast.error('Ошибка сброса настроек');
            }
        }
    };

    const handleAddValueCard = async () => {
        // Проверяем лимит в 5 карточек
        if (settings.valueCards.length >= 5) {
            toast.error('Нельзя добавить более 5 карточек ценностей');
            return;
        }

        const newCard = {
            ...valueCardForm,
            order: settings.valueCards.length,
            active: true
        };

        const token = localStorage.getItem('adminToken');
        try {
            const updatedCards = [...settings.valueCards, newCard];
            await axios.put(`${process.env.REACT_APP_API_URL}/about`,
                { ...settings, valueCards: updatedCards },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSettings({ ...settings, valueCards: updatedCards });
            setEditingValueCard(null);
            setValueCardForm({ icon: '', title: '', description: '', active: true });
            toast.success('Карточка добавлена');
        } catch (error) {
            console.error('Error adding card:', error);
            toast.error('Ошибка добавления карточки');
        }
    };

    const handleUpdateValueCard = async () => {
        const updatedCards = settings.valueCards.map((card, idx) =>
            idx === editingValueCard ? { ...card, ...valueCardForm } : card
        );

        const token = localStorage.getItem('adminToken');
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/about`,
                { ...settings, valueCards: updatedCards },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSettings({ ...settings, valueCards: updatedCards });
            setEditingValueCard(null);
            setValueCardForm({ icon: '', title: '', description: '', active: true });
            toast.success('Карточка обновлена');
        } catch (error) {
            console.error('Error updating card:', error);
            toast.error('Ошибка обновления карточки');
        }
    };

    const handleDeleteValueCard = async (index) => {
        if (window.confirm('Удалить карточку ценности?')) {
            const token = localStorage.getItem('adminToken');
            try {
                const updatedCards = settings.valueCards.filter((_, idx) => idx !== index);
                await axios.put(`${process.env.REACT_APP_API_URL}/about`,
                    { ...settings, valueCards: updatedCards },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSettings({ ...settings, valueCards: updatedCards });
                toast.success('Карточка удалена');
            } catch (error) {
                console.error('Error deleting card:', error);
                toast.error('Ошибка удаления карточки');
            }
        }
    };

    const handleAddTeamMember = async () => {
        // Проверяем лимит в 5 членов команды
        if (settings.teamMembers.length >= 5) {
            toast.error('Нельзя добавить более 5 членов команды');
            return;
        }

        const newMember = {
            ...teamMemberForm,
            order: settings.teamMembers.length,
            active: true
        };

        const token = localStorage.getItem('adminToken');
        try {
            const updatedMembers = [...settings.teamMembers, newMember];
            await axios.put(`${process.env.REACT_APP_API_URL}/about`,
                { ...settings, teamMembers: updatedMembers },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSettings({ ...settings, teamMembers: updatedMembers });

            // Если есть файл для загрузки, загружаем его
            if (imageFile && teamMemberForm.imageType === 'file') {
                const formData = new FormData();
                formData.append('image', imageFile);
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/about/upload/team-member/${updatedMembers.length - 1}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                setSettings(response.data.data);
            }

            setEditingTeamMember(null);
            setTeamMemberForm({ name: '', position: '', experience: '', image: '', imageType: 'initials', active: true });
            setImageFile(null);
            setImagePreview('');
            toast.success('Член команды добавлен');
        } catch (error) {
            console.error('Error adding team member:', error);
            toast.error('Ошибка добавления члена команды');
        }
    };

    const handleUpdateTeamMember = async () => {
        const updatedMembers = settings.teamMembers.map((member, idx) =>
            idx === editingTeamMember ? { ...member, ...teamMemberForm } : member
        );

        const token = localStorage.getItem('adminToken');
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/about`,
                { ...settings, teamMembers: updatedMembers },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSettings({ ...settings, teamMembers: updatedMembers });

            // Если есть новый файл для загрузки
            if (imageFile && teamMemberForm.imageType === 'file') {
                const formData = new FormData();
                formData.append('image', imageFile);
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/about/upload/team-member/${editingTeamMember}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                setSettings(response.data.data);
            }

            setEditingTeamMember(null);
            setTeamMemberForm({ name: '', position: '', experience: '', image: '', imageType: 'initials', active: true });
            setImageFile(null);
            setImagePreview('');
            toast.success('Член команды обновлен');
        } catch (error) {
            console.error('Error updating team member:', error);
            toast.error('Ошибка обновления члена команды');
        }
    };

    const handleDeleteTeamMember = async (index) => {
        if (window.confirm('Удалить члена команды?')) {
            const token = localStorage.getItem('adminToken');
            try {
                // Сначала удаляем изображение с сервера если оно есть
                const member = settings.teamMembers[index];
                if (member.imageType === 'file' && member.image) {
                    await axios.delete(
                        `${process.env.REACT_APP_API_URL}/about/team-member/${index}/image`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                }

                const updatedMembers = settings.teamMembers.filter((_, idx) => idx !== index);
                await axios.put(`${process.env.REACT_APP_API_URL}/about`,
                    { ...settings, teamMembers: updatedMembers },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSettings({ ...settings, teamMembers: updatedMembers });
                toast.success('Член команды удален');
            } catch (error) {
                console.error('Error deleting team member:', error);
                toast.error('Ошибка удаления члена команды');
            }
        }
    };

    const handleReorder = async (type, id, direction) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(`${process.env.REACT_APP_API_URL}/about/reorder/${type}/${id}/${direction}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Порядок изменен');
            fetchSettings();
        } catch (error) {
            console.error('Error reordering:', error);
            toast.error('Ошибка при изменении порядка');
        }
    };

    const handleTeamMemberImageUpload = async (index, file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/about/upload/team-member/${index}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setSettings(response.data.data);
            toast.success('Изображение загружено');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Ошибка загрузки изображения');
        }
    };

    const handleDeleteTeamMemberImage = async (index) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.delete(
                `${process.env.REACT_APP_API_URL}/about/team-member/${index}/image`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSettings(response.data.data);
            toast.success('Изображение удалено');
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('Ошибка удаления изображения');
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        if (imagePath.startsWith('/uploads')) {
            return `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${imagePath}`;
        }
        return imagePath;
    };

    if (loading || !settings) {
        return <div className="ap-loading">Загрузка...</div>;
    }

    return (
        <div className="ab-manager-page">
            <div className="ab-manager-header">
                <h2>Управление страницей "О компании"</h2>
                <div className="ab-header-buttons">
                    <button className="ap-create-btn" onClick={() => setShowSettingsModal(true)}>
                        ⚙️ Настройки секций
                    </button>
                    <button className="ap-create-btn" onClick={handleResetSettings}>
                        🔄 Сбросить к дефолтным
                    </button>
                </div>
            </div>

            {/* Предпросмотр и управление карточками ценностей */}
            <div className="ab-section">
                <div className="ab-section-header">
                    <h3>Карточки ценностей ({settings.valueCards.length}/5)</h3>
                    <button
                        className="ap-create-btn"
                        onClick={() => {
                            setValueCardForm({ icon: '', title: '', description: '', active: true });
                            setEditingValueCard(null);
                        }}
                        disabled={settings.valueCards.length >= 5}
                    >
                        + Добавить ценность
                    </button>
                </div>

                {(editingValueCard !== null || (valueCardForm.title && !valueCardForm.title.includes('Редактировать'))) && (
                    <div className="ab-edit-form">
                        <h4>{editingValueCard !== null ? 'Редактировать ценность' : 'Новая ценность'}</h4>
                        <div className="ab-form-row">
                            <div className="ab-form-group">
                                <label>Иконка (emoji)</label>
                                <input
                                    type="text"
                                    value={valueCardForm.icon}
                                    onChange={(e) => setValueCardForm({ ...valueCardForm, icon: e.target.value })}
                                    placeholder="🔧"
                                    maxLength={2}
                                />
                            </div>
                            <div className="ab-form-group">
                                <label>Название</label>
                                <input
                                    type="text"
                                    value={valueCardForm.title}
                                    onChange={(e) => setValueCardForm({ ...valueCardForm, title: e.target.value })}
                                    placeholder="Качество"
                                />
                            </div>
                        </div>
                        <div className="ab-form-group">
                            <label>Описание</label>
                            <textarea
                                value={valueCardForm.description}
                                onChange={(e) => setValueCardForm({ ...valueCardForm, description: e.target.value })}
                                rows="2"
                                placeholder="Описание ценности..."
                            />
                        </div>
                        <div className="ab-form-group">
                            <label className="ab-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={valueCardForm.active}
                                    onChange={(e) => setValueCardForm({ ...valueCardForm, active: e.target.checked })}
                                />
                                Активна
                            </label>
                        </div>
                        <div className="ab-form-actions">
                            <button
                                className="ab-save-btn"
                                onClick={editingValueCard !== null ? handleUpdateValueCard : handleAddValueCard}
                            >
                                💾 Сохранить
                            </button>
                            <button
                                className="ab-cancel-btn"
                                onClick={() => {
                                    setEditingValueCard(null);
                                    setValueCardForm({ icon: '', title: '', description: '', active: true });
                                }}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                )}

                <div className="ab-items-grid">
                    {settings.valueCards.map((card, index) => (
                        <div key={index} className="ab-card">
                            <div className="ab-card-icon">{card.icon || '🔧'}</div>
                            <div className="ab-card-content">
                                <h4>{card.title}</h4>
                                <p>{card.description}</p>
                                <span className={`ab-card-status ${card.active ? 'active' : 'inactive'}`}>
                                    {card.active ? 'Активна' : 'Неактивна'}
                                </span>
                            </div>
                            <div className="ab-card-actions">
                                <button
                                    className="ab-move-up"
                                    onClick={() => handleReorder('value-card', index, 'up')}
                                    disabled={index === 0}
                                >
                                    ←
                                </button>
                                <button
                                    className="ab-move-down"
                                    onClick={() => handleReorder('value-card', index, 'down')}
                                    disabled={index === settings.valueCards.length - 1}
                                >
                                    →
                                </button>
                                <button
                                    className="ab-edit-btn"
                                    onClick={() => {
                                        setEditingValueCard(index);
                                        setValueCardForm({
                                            icon: card.icon,
                                            title: card.title,
                                            description: card.description,
                                            active: card.active
                                        });
                                    }}
                                >
                                    ✏️
                                </button>
                                <button
                                    className="ab-delete-btn"
                                    onClick={() => handleDeleteValueCard(index)}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Управление членами команды */}
            <div className="ab-section">
                <div className="ab-section-header">
                    <h3>Члены команды ({settings.teamMembers.length}/5)</h3>
                    <button
                        className="ap-create-btn"
                        onClick={() => {
                            setTeamMemberForm({ name: '', position: '', experience: '', image: '', imageType: 'initials', active: true });
                            setEditingTeamMember(null);
                            setImageFile(null);
                            setImagePreview('');
                        }}
                        disabled={settings.teamMembers.length >= 5}
                    >
                        + Добавить члена команды
                    </button>
                </div>

                {(editingTeamMember !== null || (teamMemberForm.name && !teamMemberForm.name.includes('Редактировать'))) && (
                    <div className="ab-edit-form">
                        <h4>{editingTeamMember !== null ? 'Редактировать члена команды' : 'Новый член команды'}</h4>
                        <div className="ab-form-row">
                            <div className="ab-form-group">
                                <label>Имя</label>
                                <input
                                    type="text"
                                    value={teamMemberForm.name}
                                    onChange={(e) => setTeamMemberForm({ ...teamMemberForm, name: e.target.value })}
                                    placeholder="Азат Нуржанов"
                                />
                            </div>
                            <div className="ab-form-group">
                                <label>Должность</label>
                                <input
                                    type="text"
                                    value={teamMemberForm.position}
                                    onChange={(e) => setTeamMemberForm({ ...teamMemberForm, position: e.target.value })}
                                    placeholder="Генеральный директор"
                                />
                            </div>
                        </div>
                        <div className="ab-form-row">
                            <div className="ab-form-group">
                                <label>Опыт</label>
                                <input
                                    type="text"
                                    value={teamMemberForm.experience}
                                    onChange={(e) => setTeamMemberForm({ ...teamMemberForm, experience: e.target.value })}
                                    placeholder="15 лет"
                                />
                            </div>
                            <div className="ab-form-group">
                                <label className="ab-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={teamMemberForm.active}
                                        onChange={(e) => setTeamMemberForm({ ...teamMemberForm, active: e.target.checked })}
                                    />
                                    Активен
                                </label>
                            </div>
                        </div>
                        <div className="ab-form-group">
                            <label>Тип изображения</label>
                            <div className="ab-image-options">
                                <button
                                    type="button"
                                    className={`ab-image-option ${teamMemberForm.imageType === 'initials' ? 'active' : ''}`}
                                    onClick={() => setTeamMemberForm({ ...teamMemberForm, imageType: 'initials', image: '' })}
                                >
                                    🅰️ Инициалы
                                </button>
                                <button
                                    type="button"
                                    className={`ab-image-option ${teamMemberForm.imageType === 'url' ? 'active' : ''}`}
                                    onClick={() => setTeamMemberForm({ ...teamMemberForm, imageType: 'url' })}
                                >
                                    🔗 URL
                                </button>
                                <button
                                    type="button"
                                    className={`ab-image-option ${teamMemberForm.imageType === 'file' ? 'active' : ''}`}
                                    onClick={() => setTeamMemberForm({ ...teamMemberForm, imageType: 'file' })}
                                >
                                    📁 Загрузить файл
                                </button>
                            </div>
                        </div>

                        {teamMemberForm.imageType === 'url' && (
                            <div className="ab-form-group">
                                <label>URL изображения</label>
                                <input
                                    type="url"
                                    value={teamMemberForm.image}
                                    onChange={(e) => setTeamMemberForm({ ...teamMemberForm, image: e.target.value })}
                                    placeholder="https://randomuser.me/api/portraits/men/10.jpg"
                                />
                            </div>
                        )}

                        {teamMemberForm.imageType === 'file' && (
                            <div className="ab-form-group">
                                <label>Загрузить изображение</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setImageFile(file);
                                            setImagePreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                                <small className="ab-file-hint">Рекомендуемый размер: 400x400px</small>
                            </div>
                        )}

                        {imagePreview && (
                            <div className="ab-image-preview">
                                <img src={imagePreview} alt="Preview" />
                            </div>
                        )}

                        <div className="ab-form-actions">
                            <button
                                className="ab-save-btn"
                                onClick={editingTeamMember !== null ? handleUpdateTeamMember : handleAddTeamMember}
                            >
                                💾 Сохранить
                            </button>
                            <button
                                className="ab-cancel-btn"
                                onClick={() => {
                                    setEditingTeamMember(null);
                                    setTeamMemberForm({ name: '', position: '', experience: '', image: '', imageType: 'initials', active: true });
                                    setImageFile(null);
                                    setImagePreview('');
                                }}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                )}

                <div className="ab-team-grid">
                    {settings.teamMembers.map((member, index) => (
                        <div key={index} className="ab-team-card">
                            <div className="ab-team-image">
                                {member.imageType === 'initials' ? (
                                    <div className="ab-team-initials">{getInitials(member.name)}</div>
                                ) : (
                                    <img src={getImageUrl(member.image)} alt={member.name} />
                                )}
                                {member.imageType === 'file' && member.image && (
                                    <button
                                        className="ab-delete-image"
                                        onClick={() => handleDeleteTeamMemberImage(index)}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            <div className="ab-team-info">
                                <h4>{member.name}</h4>
                                <p>{member.position}</p>
                                <span className="ab-team-exp">{member.experience}</span>
                                <span className={`ab-card-status ${member.active ? 'active' : 'inactive'}`}>
                                    {member.active ? 'Активен' : 'Неактивен'}
                                </span>
                            </div>
                            <div className="ab-team-actions">
                                <button
                                    className="ab-move-up"
                                    onClick={() => handleReorder('team-member', index, 'up')}
                                    disabled={index === 0}
                                >
                                    ←
                                </button>
                                <button
                                    className="ab-move-down"
                                    onClick={() => handleReorder('team-member', index, 'down')}
                                    disabled={index === settings.teamMembers.length - 1}
                                >
                                    →
                                </button>
                                <button
                                    className="ab-edit-btn"
                                    onClick={() => {
                                        setEditingTeamMember(index);
                                        setTeamMemberForm({
                                            name: member.name,
                                            position: member.position,
                                            experience: member.experience,
                                            image: member.image,
                                            imageType: member.imageType,
                                            active: member.active
                                        });
                                        setImagePreview(member.imageType === 'url' ? member.image : '');
                                        setImageFile(null);
                                    }}
                                >
                                    ✏️
                                </button>
                                <button
                                    className="ab-delete-btn"
                                    onClick={() => handleDeleteTeamMember(index)}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal для настроек секций */}
            {showSettingsModal && (
                <div className="ap-modal-overlay" onClick={() => setShowSettingsModal(false)}>
                    <div className="ap-modal ap-modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="ap-modal-header">
                            <h2>Настройки секций страницы "О компании"</h2>
                            <button className="ap-modal-close" onClick={() => setShowSettingsModal(false)}>✕</button>
                        </div>
                        <div className="ap-modal-body">
                            <div className="ab-dynamic-form">
                                {/* Hero секция */}
                                <div className="ab-form-section">
                                    <h3>Hero секция</h3>
                                    <div className="ab-form-group">
                                        <label>Заголовок</label>
                                        <input
                                            type="text"
                                            value={settings.hero.title}
                                            onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, title: e.target.value } })}
                                        />
                                    </div>
                                    <div className="ab-form-group">
                                        <label>Подзаголовок</label>
                                        <input
                                            type="text"
                                            value={settings.hero.subtitle}
                                            onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, subtitle: e.target.value } })}
                                        />
                                    </div>
                                    <div className="ab-form-group">
                                        <label>Фоновое изображение</label>
                                        <div className="ab-image-input-group">
                                            <input
                                                type="text"
                                                value={settings.hero.bgImage}
                                                onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, bgImage: e.target.value, bgImageType: 'url' } })}
                                                placeholder="URL изображения"
                                            />
                                            <label className="ab-file-upload-label">
                                                Или загрузить файл
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setHeroBgImageFile(file);
                                                            setHeroBgImagePreview(URL.createObjectURL(file));
                                                            setSettings({ ...settings, hero: { ...settings.hero, bgImageType: 'file' } });
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        {(heroBgImagePreview || (settings.hero.bgImage && settings.hero.bgImageType === 'url')) && (
                                            <div className="ab-image-preview">
                                                <img
                                                    src={heroBgImagePreview || settings.hero.bgImage}
                                                    alt="Hero background preview"
                                                />
                                                {heroBgImagePreview && (
                                                    <button
                                                        className="ab-remove-preview"
                                                        onClick={() => {
                                                            setHeroBgImageFile(null);
                                                            setHeroBgImagePreview('');
                                                        }}
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="ab-form-group">
                                        <label>Прозрачность оверлея</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={settings.hero.overlayOpacity}
                                            onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, overlayOpacity: parseFloat(e.target.value) } })}
                                        />
                                        <span>{Math.round(settings.hero.overlayOpacity * 100)}%</span>
                                    </div>
                                </div>

                                {/* Миссия секция */}
                                <div className="ab-form-section">
                                    <h3>Миссия секция</h3>
                                    <div className="ab-form-group">
                                        <label>Подзаголовок</label>
                                        <input
                                            type="text"
                                            value={settings.mission.subtitle}
                                            onChange={(e) => setSettings({ ...settings, mission: { ...settings.mission, subtitle: e.target.value } })}
                                        />
                                    </div>
                                    <div className="ab-form-group">
                                        <label>Заголовок</label>
                                        <input
                                            type="text"
                                            value={settings.mission.title}
                                            onChange={(e) => setSettings({ ...settings, mission: { ...settings.mission, title: e.target.value } })}
                                        />
                                    </div>
                                    <div className="ab-form-group">
                                        <label>Описание</label>
                                        <textarea
                                            value={settings.mission.description}
                                            onChange={(e) => setSettings({ ...settings, mission: { ...settings.mission, description: e.target.value } })}
                                            rows="4"
                                        />
                                    </div>
                                    <div className="ab-form-group">
                                        <label>Изображение миссии</label>
                                        <div className="ab-image-input-group">
                                            <input
                                                type="text"
                                                value={settings.mission.image}
                                                onChange={(e) => setSettings({ ...settings, mission: { ...settings.mission, image: e.target.value, imageType: 'url' } })}
                                                placeholder="URL изображения"
                                            />
                                            <label className="ab-file-upload-label">
                                                Или загрузить файл
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setMissionImageFile(file);
                                                            setMissionImagePreview(URL.createObjectURL(file));
                                                            setSettings({ ...settings, mission: { ...settings.mission, imageType: 'file' } });
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        {(missionImagePreview || (settings.mission.image && settings.mission.imageType === 'url')) && (
                                            <div className="ab-image-preview">
                                                <img
                                                    src={missionImagePreview || settings.mission.image}
                                                    alt="Mission preview"
                                                />
                                                {missionImagePreview && (
                                                    <button
                                                        className="ab-remove-preview"
                                                        onClick={() => {
                                                            setMissionImageFile(null);
                                                            setMissionImagePreview('');
                                                        }}
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="ab-form-group">
                                        <label>Текст бейджа</label>
                                        <input
                                            type="text"
                                            value={settings.mission.badgeText}
                                            onChange={(e) => setSettings({ ...settings, mission: { ...settings.mission, badgeText: e.target.value } })}
                                        />
                                    </div>
                                </div>

                                {/* Ценности секция */}
                                <div className="ab-form-section">
                                    <h3>Ценности секция</h3>
                                    <div className="ab-form-group">
                                        <label>Подзаголовок</label>
                                        <input
                                            type="text"
                                            value={settings.values.subtitle}
                                            onChange={(e) => setSettings({ ...settings, values: { ...settings.values, subtitle: e.target.value } })}
                                        />
                                    </div>
                                    <div className="ab-form-group">
                                        <label>Заголовок</label>
                                        <input
                                            type="text"
                                            value={settings.values.title}
                                            onChange={(e) => setSettings({ ...settings, values: { ...settings.values, title: e.target.value } })}
                                        />
                                    </div>
                                </div>

                                {/* Команда секция */}
                                <div className="ab-form-section">
                                    <h3>Команда секция</h3>
                                    <div className="ab-form-group">
                                        <label>Подзаголовок</label>
                                        <input
                                            type="text"
                                            value={settings.team.subtitle}
                                            onChange={(e) => setSettings({ ...settings, team: { ...settings.team, subtitle: e.target.value } })}
                                        />
                                    </div>
                                    <div className="ab-form-group">
                                        <label>Заголовок</label>
                                        <input
                                            type="text"
                                            value={settings.team.title}
                                            onChange={(e) => setSettings({ ...settings, team: { ...settings.team, title: e.target.value } })}
                                        />
                                    </div>
                                </div>

                                <div className="ab-form-actions">
                                    <button type="button" className="ap-btn-primary" onClick={handleSaveSettings}>
                                        💾 Сохранить все настройки
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
        </div>
    );
};

export default AboutManager;