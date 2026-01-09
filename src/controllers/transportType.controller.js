const TransportTypeService = require('../lib/transportType.service');
const { validateTransportType, validateCreate, validateUpdate } = require('../validation/transport.validate');

class TransportTypeController {
    constructor() {
        this.getAllTransportTypes = this.getAllTransportTypes.bind(this);
        this.getTransportTypeById = this.getTransportTypeById.bind(this);
        this.createTransportType = this.createTransportType.bind(this);
        this.updateTransportType = this.updateTransportType.bind(this);
        this.deleteTransportType = this.deleteTransportType.bind(this);
    }

    async getAllTransportTypes(req, res) {
        try {
            const transportTypes = await TransportTypeService.getAllTransportTypes();
            res.status(200).json(transportTypes);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching transport types', error });
        }
    }

    async getTransportTypeById(req, res) {
        try {
            const validId = await validateTransportType(req.params);
            const transportType = await TransportTypeService.getTransportTypeById(validId.id);
            if (!transportType) {
                return res.status(404).json({ message: 'Transport type not found' });
            }
            res.status(200).json(transportType);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching transport type', error });
        }
    }

    async createTransportType(req, res) {
        try {
            const data = await validateCreate(req.body);
            const newTransportType = await TransportTypeService.createTransportType(data);
            res.status(201).json(newTransportType);
        } catch (error) {
            res.status(500).json({ message: 'Error creating transport type', error });
        }
    }

    async updateTransportType(req, res) {
        try {
            const validId = await validateTransportType(req.params);
            const data = await validateUpdate(req.body);
            const updatedTransportType = await TransportTypeService.updateTransportType(validId.id, data);
            if (!updatedTransportType) {
                return res.status(404).json({ message: 'Transport type not found' });
            }
            res.status(200).json(updatedTransportType);
        } catch (error) {
            res.status(500).json({ message: 'Error updating transport type', error });
        }
    }

    async deleteTransportType(req, res) {
        try {
            const validId = await validateTransportType(req.params);
            const deletedTransportType = await TransportTypeService.deleteTransportType(validId.id);
            if (!deletedTransportType) {
                return res.status(404).json({ message: 'Transport type not found' });
            }
            res.status(200).json({ message: 'Transport type deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting transport type', error });
        }
    }
}

module.exports = new TransportTypeController();