// import ResidentialComplex from '../models/ResidentialComplex.js';
// import Property from '../models/Property.js';
//
// // Получить все ЖК
// export const getAllComplexes = async (req, res) => {
//     try {
//         const token = req.headers.authorization?.split(' ')[1];
//         let filter = {};
//
//         if (!token) {
//             filter.isActive = true;
//         }
//
//         const complexes = await ResidentialComplex.find(filter).sort({ createdAt: -1 });
//         res.json({
//             success: true,
//             data: complexes
//         });
//     } catch (error) {
//         console.error('Error in getAllComplexes:', error);
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// };
//
// // Получить ЖК по ID с его недвижимостью
// export const getComplexById = async (req, res) => {
//     try {
//         const complex = await ResidentialComplex.findById(req.params.id);
//         if (!complex) {
//             return res.status(404).json({ error: 'Жилой комплекс не найден' });
//         }
//
//         const properties = await Property.find({
//             residentialComplex: req.params.id,
//             isActive: true
//         }).populate('residentialComplex', 'title location').sort({ createdAt: -1 });
//
//         res.json({
//             success: true,
//             data: { complex, properties }
//         });
//     } catch (error) {
//         console.error('Error in getComplexById:', error);
//         res.status(500).json({ error: error.message });
//     }
// };
//
// // Создать ЖК (только для админа)
// export const createComplex = async (req, res) => {
//     try {
//         console.log('📦 Начало создания ЖК');
//         console.log('Files received:', req.files?.length || 0);
//
//         let complexData;
//         try {
//             complexData = JSON.parse(req.body.data);
//         } catch (parseError) {
//             console.error('Ошибка парсинга JSON:', parseError);
//             return res.status(400).json({
//                 success: false,
//                 error: 'Неверный формат данных'
//             });
//         }
//
//         // Обработка изображений - сохраняем ВСЕ файлы
//         if (req.files && req.files.length > 0) {
//             console.log(`📸 Получено ${req.files.length} файлов`);
//             const imagePaths = req.files.map(file => `/uploads/complexes/${file.filename}`);
//             complexData.images = imagePaths;
//             // Если нет mainImage, берем первое изображение
//             if (!complexData.mainImage && imagePaths.length > 0) {
//                 complexData.mainImage = imagePaths[0];
//             }
//         }
//
//         // Конвертация числовых полей в specifications
//         if (complexData.specifications) {
//             if (complexData.specifications.floors) complexData.specifications.floors = Number(complexData.specifications.floors);
//             if (complexData.specifications.apartments) complexData.specifications.apartments = Number(complexData.specifications.apartments);
//             if (complexData.specifications.parking) complexData.specifications.parking = Number(complexData.specifications.parking);
//             if (complexData.specifications.buildYear) complexData.specifications.buildYear = Number(complexData.specifications.buildYear);
//         }
//
//         // Убеждаемся, что features и infrastructure - это массивы
//         if (!complexData.features) complexData.features = [];
//         if (!complexData.infrastructure) complexData.infrastructure = [];
//         if (!complexData.images) complexData.images = [];
//
//         // Устанавливаем isActive по умолчанию
//         if (complexData.isActive === undefined) complexData.isActive = true;
//
//         // Проверяем уникальность названия
//         const existingComplex = await ResidentialComplex.findOne({ title: complexData.title });
//         if (existingComplex) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Жилой комплекс с таким названием уже существует'
//             });
//         }
//
//         const complex = new ResidentialComplex(complexData);
//         await complex.save();
//
//         console.log('✅ ЖК успешно создан с ID:', complex._id);
//         console.log('   Изображений сохранено:', complex.images.length);
//
//         res.status(201).json({
//             success: true,
//             data: complex
//         });
//     } catch (error) {
//         console.error('❌ Ошибка в createComplex:', error);
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// };
//
// // Обновить ЖК
// export const updateComplex = async (req, res) => {
//     try {
//         const complex = await ResidentialComplex.findById(req.params.id);
//         if (!complex) {
//             return res.status(404).json({ error: 'Жилой комплекс не найден' });
//         }
//
//         let updateData;
//         try {
//             updateData = JSON.parse(req.body.data);
//         } catch (parseError) {
//             return res.status(400).json({ error: 'Неверный формат данных' });
//         }
//
//         // Добавляем новые изображения к существующим
//         if (req.files && req.files.length > 0) {
//             const newImages = req.files.map(file => `/uploads/complexes/${file.filename}`);
//             updateData.images = [...(complex.images || []), ...newImages];
//             if (!updateData.mainImage && updateData.images.length > 0) {
//                 updateData.mainImage = updateData.images[0];
//             }
//         }
//
//         // Конвертация числовых полей
//         if (updateData.specifications) {
//             if (updateData.specifications.floors) updateData.specifications.floors = Number(updateData.specifications.floors);
//             if (updateData.specifications.apartments) updateData.specifications.apartments = Number(updateData.specifications.apartments);
//             if (updateData.specifications.parking) updateData.specifications.parking = Number(updateData.specifications.parking);
//             if (updateData.specifications.buildYear) updateData.specifications.buildYear = Number(updateData.specifications.buildYear);
//         }
//
//         Object.assign(complex, updateData);
//         await complex.save();
//
//         res.json({
//             success: true,
//             data: complex
//         });
//     } catch (error) {
//         console.error('Error in updateComplex:', error);
//         res.status(500).json({ error: error.message });
//     }
// };
//
// // Удалить ЖК
// export const deleteComplex = async (req, res) => {
//     try {
//         const complex = await ResidentialComplex.findById(req.params.id);
//         if (!complex) {
//             return res.status(404).json({ error: 'Жилой комплекс не найден' });
//         }
//
//         await Property.updateMany(
//             { residentialComplex: req.params.id },
//             { $set: { residentialComplex: null } }
//         );
//
//         await complex.deleteOne();
//
//         res.json({
//             success: true,
//             message: 'Жилой комплекс удален'
//         });
//     } catch (error) {
//         console.error('Error in deleteComplex:', error);
//         res.status(500).json({ error: error.message });
//     }
// };








// controllers/residentialComplexController.js
import ResidentialComplex from '../models/ResidentialComplex.js';
import Property from '../models/Property.js';

// Получить все ЖК (публичные)
export const getAllComplexes = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        let filter = {};

        if (!token) {
            filter.isActive = true;
        }

        const complexes = await ResidentialComplex.find(filter).sort({ createdAt: -1 });
        res.json({
            success: true,
            data: complexes
        });
    } catch (error) {
        console.error('Error in getAllComplexes:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Получить ЖК по ID (публичный)
export const getComplexById = async (req, res) => {
    try {
        const complex = await ResidentialComplex.findById(req.params.id);
        if (!complex) {
            return res.status(404).json({ error: 'Жилой комплекс не найден' });
        }

        // Проверяем, нужно ли показывать неактивные
        const token = req.headers.authorization?.split(' ')[1];
        if (!token && !complex.isActive) {
            return res.status(404).json({ error: 'Жилой комплекс не найден' });
        }

        const properties = await Property.find({
            residentialComplex: req.params.id,
            ...(!token && { isActive: true })
        }).populate('residentialComplex', 'title location').sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { complex, properties }
        });
    } catch (error) {
        console.error('Error in getComplexById:', error);
        res.status(500).json({ error: error.message });
    }
};

// Создать ЖК (только для админа)
export const createComplex = async (req, res) => {
    try {
        console.log('📦 Начало создания ЖК');
        console.log('Files received:', req.files?.length || 0);

        let complexData;
        try {
            complexData = JSON.parse(req.body.data);
        } catch (parseError) {
            console.error('Ошибка парсинга JSON:', parseError);
            return res.status(400).json({
                success: false,
                error: 'Неверный формат данных'
            });
        }

        // Обработка изображений
        if (req.files && req.files.length > 0) {
            console.log(`📸 Получено ${req.files.length} файлов`);
            const imagePaths = req.files.map(file => `/uploads/complexes/${file.filename}`);
            complexData.images = imagePaths;
            if (!complexData.mainImage && imagePaths.length > 0) {
                complexData.mainImage = imagePaths[0];
            }
        }

        // Конвертация числовых полей
        if (complexData.specifications) {
            if (complexData.specifications.floors) complexData.specifications.floors = Number(complexData.specifications.floors);
            if (complexData.specifications.apartments) complexData.specifications.apartments = Number(complexData.specifications.apartments);
            if (complexData.specifications.parking) complexData.specifications.parking = Number(complexData.specifications.parking);
            if (complexData.specifications.buildYear) complexData.specifications.buildYear = Number(complexData.specifications.buildYear);
        }

        if (!complexData.features) complexData.features = [];
        if (!complexData.infrastructure) complexData.infrastructure = [];
        if (!complexData.images) complexData.images = [];
        if (complexData.isActive === undefined) complexData.isActive = true;

        // Проверяем уникальность названия
        const existingComplex = await ResidentialComplex.findOne({ title: complexData.title });
        if (existingComplex) {
            return res.status(400).json({
                success: false,
                error: 'Жилой комплекс с таким названием уже существует'
            });
        }

        const complex = new ResidentialComplex(complexData);
        await complex.save();

        console.log('✅ ЖК успешно создан с ID:', complex._id);

        res.status(201).json({
            success: true,
            data: complex
        });
    } catch (error) {
        console.error('❌ Ошибка в createComplex:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Обновить ЖК
export const updateComplex = async (req, res) => {
    try {
        const complex = await ResidentialComplex.findById(req.params.id);
        if (!complex) {
            return res.status(404).json({ error: 'Жилой комплекс не найден' });
        }

        let updateData;
        try {
            updateData = JSON.parse(req.body.data);
        } catch (parseError) {
            return res.status(400).json({ error: 'Неверный формат данных' });
        }

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/complexes/${file.filename}`);
            updateData.images = [...(complex.images || []), ...newImages];
            if (!updateData.mainImage && updateData.images.length > 0) {
                updateData.mainImage = updateData.images[0];
            }
        }

        if (updateData.specifications) {
            if (updateData.specifications.floors) updateData.specifications.floors = Number(updateData.specifications.floors);
            if (updateData.specifications.apartments) updateData.specifications.apartments = Number(updateData.specifications.apartments);
            if (updateData.specifications.parking) updateData.specifications.parking = Number(updateData.specifications.parking);
            if (updateData.specifications.buildYear) updateData.specifications.buildYear = Number(updateData.specifications.buildYear);
        }

        Object.assign(complex, updateData);
        await complex.save();

        res.json({
            success: true,
            data: complex
        });
    } catch (error) {
        console.error('Error in updateComplex:', error);
        res.status(500).json({ error: error.message });
    }
};

// Удалить ЖК
export const deleteComplex = async (req, res) => {
    try {
        const complex = await ResidentialComplex.findById(req.params.id);
        if (!complex) {
            return res.status(404).json({ error: 'Жилой комплекс не найден' });
        }

        await Property.updateMany(
            { residentialComplex: req.params.id },
            { $set: { residentialComplex: null } }
        );

        await complex.deleteOne();

        res.json({
            success: true,
            message: 'Жилой комплекс удален'
        });
    } catch (error) {
        console.error('Error in deleteComplex:', error);
        res.status(500).json({ error: error.message });
    }
};