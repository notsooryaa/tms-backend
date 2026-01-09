const express = require('express');
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const ShipmentController = require('../controllers/shipment.controller');

router.get('/', (req, res) => ShipmentController.getAllShipments(req, res));
router.get('/:id', (req, res) => ShipmentController.getShipmentById(req, res));
router.post('/upload', upload.single("xlsx"), (req, res) => ShipmentController.uploadXL(req, res));
router.post('/', (req, res) => ShipmentController.createShipment(req, res));
router.put('/:id', (req, res) => ShipmentController.updateShipment(req, res));
router.delete('/:id', (req, res) => ShipmentController.deleteShipment(req, res));

module.exports = router;