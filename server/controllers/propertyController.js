// controllers/propertyController.js
import Property from '../models/Property.js';
import ResidentialComplex from '../models/ResidentialComplex.js';

// Получить все объекты недвижимости
export const getAllProperties = async (req, res) => {
    try {
        const { type, complex, status, search } = req.query;
        let filter = { isActive: true };

        if (type && type !== 'all') {
            filter.propertyType = type;
        }
        if (complex && complex !== 'all') {
            filter.residentialComplex = complex;
        }
        if (status && status !== 'all') {
            filter.status = status;
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        const properties = await Property.find(filter)
            .populate('residentialComplex', 'title location')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: properties
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Получить объект по ID
export const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate('residentialComplex', 'title location mainImage specifications');

        if (!property) {
            return res.status(404).json({ error: 'Объект не найден' });
        }

        res.json({
            success: true,
            data: property
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Создать объект недвижимости
export const createProperty = async (req, res) => {
    try {
        console.log('📦 Начало создания объекта недвижимости');
        console.log('Files received:', req.files?.length || 0);
        console.log('Body data:', req.body.data);

        let propertyData;
        try {
            propertyData = JSON.parse(req.body.data);
        } catch (parseError) {
            console.error('Ошибка парсинга JSON:', parseError);
            return res.status(400).json({
                success: false,
                error: 'Неверный формат данных'
            });
        }

        // Обработка изображений
        let imagePaths = [];

        // Добавляем загруженные файлы
        if (req.files && req.files.length > 0) {
            console.log(`📸 Получено ${req.files.length} файлов`);
            imagePaths = req.files.map(file => `/uploads/properties/${file.filename}`);
            propertyData.images = [...(propertyData.images || []), ...imagePaths];
        }

        // Если нет images массива, создаем
        if (!propertyData.images) {
            propertyData.images = [];
        }

        // Устанавливаем mainImage: сначала из загруженных файлов, потом из URL, потом первое изображение
        if (imagePaths.length > 0) {
            propertyData.mainImage = imagePaths[0];
        } else if (propertyData.images && propertyData.images.length > 0) {
            propertyData.mainImage = propertyData.images[0];
        } else {
            // Если нет ни одного изображения, возвращаем ошибку
            return res.status(400).json({
                success: false,
                error: 'Необходимо добавить хотя бы одно изображение'
            });
        }

        // Конвертация числовых полей
        if (propertyData.area) propertyData.area = Number(propertyData.area);
        if (propertyData.price) propertyData.price = Number(propertyData.price);
        if (propertyData.rooms) propertyData.rooms = Number(propertyData.rooms);

        // Убеждаемся, что features - это массив
        if (!propertyData.features) propertyData.features = [];

        // Устанавливаем isActive по умолчанию
        if (propertyData.isActive === undefined) propertyData.isActive = true;

        const property = new Property(propertyData);
        await property.save();

        console.log('✅ Объект недвижимости успешно создан с ID:', property._id);
        console.log('   Изображений сохранено:', property.images.length);
        console.log('   Главное изображение:', property.mainImage);

        res.status(201).json({
            success: true,
            data: property
        });
    } catch (error) {
        console.error('❌ Ошибка в createProperty:', error);

        // Возвращаем детальную ошибку валидации
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: errors.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Обновить объект
export const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Объект не найден' });
        }

        console.log('📦 Начало обновления объекта недвижимости');
        console.log('Files received:', req.files?.length || 0);

        let updateData;
        try {
            updateData = JSON.parse(req.body.data);
        } catch (parseError) {
            return res.status(400).json({ error: 'Неверный формат данных' });
        }

        // Обработка новых изображений
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/properties/${file.filename}`);
            updateData.images = [...(property.images || []), ...newImages];
            if (!updateData.mainImage && updateData.images.length > 0) {
                updateData.mainImage = updateData.images[0];
            }
        }

        // Конвертация числовых полей
        if (updateData.area) updateData.area = Number(updateData.area);
        if (updateData.price) updateData.price = Number(updateData.price);
        if (updateData.rooms) updateData.rooms = Number(updateData.rooms);

        Object.assign(property, updateData);
        await property.save();

        console.log('✅ Объект недвижимости успешно обновлен:', property._id);

        res.json({
            success: true,
            data: property
        });
    } catch (error) {
        console.error('Error in updateProperty:', error);
        res.status(500).json({ error: error.message });
    }
};

// Удалить объект
export const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Объект не найден' });
        }

        res.json({
            success: true,
            message: 'Объект удален'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Получить объекты по ЖК
export const getPropertiesByComplex = async (req, res) => {
    try {
        const properties = await Property.find({
            residentialComplex: req.params.complexId,
            isActive: true
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: properties
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};