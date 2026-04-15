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
        const propertyData = JSON.parse(req.body.data);

        if (req.files && req.files.length > 0) {
            const imagePaths = req.files.map(file => `/uploads/properties/${file.filename}`);
            propertyData.images = imagePaths;
            propertyData.mainImage = imagePaths[0] || '';
        }

        const property = new Property(propertyData);
        await property.save();

        res.status(201).json({
            success: true,
            data: property
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Обновить объект
export const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Объект не найден' });
        }

        const updateData = JSON.parse(req.body.data);

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/properties/${file.filename}`);
            updateData.images = [...property.images, ...newImages];
            if (!updateData.mainImage) {
                updateData.mainImage = updateData.images[0];
            }
        }

        Object.assign(property, updateData);
        await property.save();

        res.json({
            success: true,
            data: property
        });
    } catch (error) {
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