const express = require('express')
const router = express.Router()
const TransportTypeController = require('../controllers/transportType.controller');

router.get('/', (req, res) => TransportTypeController.getAllTransportTypes(req, res));
router.get('/:id', (req, res) => TransportTypeController.getTransportTypeById(req, res));
router.post('/', (req, res) => TransportTypeController.createTransportType(req, res));
router.put('/:id', (req, res) => TransportTypeController.updateTransportType(req, res));
router.delete('/:id', (req, res) => TransportTypeController.deleteTransportType(req, res));

module.exports = router;