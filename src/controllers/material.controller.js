const MaterialService = require('../lib/material.service');
const { validateMaterial, validateCreate, validateUpdate } = require('../validation/material.validate');

class MaterialController {
    constructor() {
        this.getAllMaterials = this.getAllMaterials.bind(this);
        this.getMaterialById = this.getMaterialById.bind(this);
        this.createMaterial = this.createMaterial.bind(this);
        this.updateMaterial = this.updateMaterial.bind(this);
        this.deleteMaterial = this.deleteMaterial.bind(this);
    }

    async getAllMaterials(req, res) {
        try {
            const materials = await MaterialService.listMaterials();
            res.status(200).json(materials);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching materials', error });
        }
    }

    async getMaterialById(req, res) {
        try {
            const validId = await validateMaterial(req.params);
            const material = await MaterialService.getMaterialById(validId.id);
            if (!material) {
                return res.status(404).json({ message: 'Material not found' });
            }
            res.status(200).json(material);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching material', error });
        }
    }

    async createMaterial(req, res) {
        try {
            const data = await validateCreate(req.body);
            const newMaterial = await MaterialService.createMaterial(data);
            res.status(201).json(newMaterial);
        } catch (error) {
            res.status(500).json({ message: 'Error creating material', error });
        }
    }

    async updateMaterial(req, res) {
        try {
            const validId = await validateMaterial(req.params);
            const data = await validateUpdate(req.body);
            const updatedMaterial = await MaterialService.updateMaterial(validId.id, data);
            if (!updatedMaterial) {
                return res.status(404).json({ message: 'Material not found' });
            }
            res.status(200).json(updatedMaterial);
        } catch (error) {
            res.status(500).json({ message: 'Error updating material', error });
        }
    }

    async deleteMaterial(req, res) {
        try {
            const validId = await validateMaterial(req.params);
            const deletedMaterial = await MaterialService.deleteMaterial(validId.id);
            if (!deletedMaterial) {
                return res.status(404).json({ message: 'Material not found' });
            }
            res.status(200).json({ message: 'Material deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting material', error });
        }
    }
}

module.exports = new MaterialController();