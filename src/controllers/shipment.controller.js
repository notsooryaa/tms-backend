const ShipmentService = require('../lib/shipment.service');
const { validateShipment, validateCreate, validateUpdate } = require('../validation/shipment.validate');
const { uploadXLSX } = require('../utils/shipment.util.js');

class ShipmentController {
    constructor() {
        this.getAllShipments = this.getAllShipments.bind(this);
        this.getShipmentById = this.getShipmentById.bind(this);
        this.getShipmentStatusSummary = this.getShipmentStatusSummary.bind(this);
        this.createShipment = this.createShipment.bind(this);
        this.updateShipment = this.updateShipment.bind(this);
        this.deleteShipment = this.deleteShipment.bind(this);
    }

    async getAllShipments(req, res) {
        try {
            const shipments = await ShipmentService.getAllShipments();
            res.status(200).json(shipments);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Error fetching shipments', error });
        }
    }

    async getShipmentById(req, res) {
        try {
            const validId = await validateShipment(req.params);
            const shipment = await ShipmentService.getShipmentById(validId.id);
            if (!shipment) {
                return res.status(404).json({ message: 'Shipment not found' });
            }
            res.status(200).json(shipment);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching shipment', error });
        }
    }

    async getShipmentStatusSummary(req, res) {
        try {
            const validId = await validateShipment(req.params);
            const summary = await ShipmentService.getShipmentStatusSummary(validId.id);
            res.status(200).json(summary);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching shipment status summary', error: error.message });
        }
    }

    async createShipment(req, res) {
        try {
            const data = await validateCreate(req.body);
            const newShipment = await ShipmentService.createShipment(data);
            res.status(201).json(newShipment);
        } catch (error) {
            res.status(500).json({ message: 'Error creating shipment', error: error.message });
        }
    }

    async uploadXL(req, res) {
        try {
            const data = await uploadXLSX(req, res);
            const newShipment = await ShipmentService.createShipment(data);
            res.status(201).json(newShipment);
        } catch (error) {
            res.status(500).json({ message: 'Error uploading XLSX', error: error.message });
        }
    }

    async updateShipment(req, res) {
        try {
            const validId = await validateShipment(req.params);
            const data = await validateUpdate(req.body);
            const updatedShipment = await ShipmentService.updateShipment(validId.id, data);
            if (!updatedShipment) {
                return res.status(404).json({ message: 'Shipment not found' });
            }
            res.status(200).json(updatedShipment);
        } catch (error) {
            res.status(500).json({ message: 'Error updating shipment', error });
        }
    }

    async deleteShipment(req, res) {
        try {
            const validId = await validateShipment(req.params);
            const deletedShipment = await ShipmentService.deleteShipment(validId.id);
            if (!deletedShipment) {
                return res.status(404).json({ message: 'Shipment not found' });
            }
            res.status(200).json({ message: 'Shipment deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting shipment', error });
        }
    }
}

module.exports = new ShipmentController();