const VechicleTypeServices = require('../lib/vechicleType.service');
const { validateVechicleType, validateCreate, validateUpdate } = require('../validation/vechicle.validate');

class VechicleTypeController {
    constructor() {
        this.getAllVechicleTypes = this.getAllVechicleTypes.bind(this);
        this.getVechicleTypeById = this.getVechicleTypeById.bind(this);
        this.createVechicleType = this.createVechicleType.bind(this);
        this.updateVechicleType = this.updateVechicleType.bind(this);
        this.deleteVechicleType = this.deleteVechicleType.bind(this);
    }

    async getAllVechicleTypes(req, res) {
        try {
            const vechicleTypes = await VechicleTypeServices.getAllVechicleTypes();
            res.status(200).json(vechicleTypes);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching vechicle types', error });
        }
    }

    async getVechicleTypeById(req, res) {
        try {
            const validateParams = await validateVechicleType(req.params);
            const vechicleType = await VechicleTypeServices.getVechicleTypeById(validateParams.id);
            if (!vechicleType) {
                return res.status(404).json({ message: 'Vechicle type not found' });
            }
            res.status(200).json(vechicleType);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching vechicle type', error });
        }
    }

    async createVechicleType(req, res) {
        try {
            const validatedData = await validateCreate(req.body);
            const newVechicleType = await VechicleTypeServices.createVechicleType(validatedData);
            res.status(201).json(newVechicleType);
        } catch (error) {
            res.status(500).json({ message: 'Error creating vechicle type', error });
        }
    }

    async updateVechicleType(req, res) {
        try {
            const validId = await validateVechicleType(req.params);
            const validatedData = await validateUpdate(req.body);
            const updatedVechicleType = await VechicleTypeServices.updateVechicleType(validId.id, validatedData);
            if (!updatedVechicleType) {
                return res.status(404).json({ message: 'Vechicle type not found' });
            }
            res.status(200).json(updatedVechicleType);
        } catch (error) {
            res.status(500).json({ message: 'Error updating vechicle type', error });
        }
    }

    async deleteVechicleType(req, res) {
        try {
            const validId = await validateVechicleType(req.params);
            const deletedVechicleType = await VechicleTypeServices.deleteVechicleType(validId.id);
            if (!deletedVechicleType) {
                return res.status(404).json({ message: 'Vechicle type not found' });
            }
            res.status(200).json({ message: 'Vechicle type deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting vechicle type', error });
        }
    }
}

module.exports = new VechicleTypeController();