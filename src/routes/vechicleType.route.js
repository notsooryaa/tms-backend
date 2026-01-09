const express = require('express')
const router = express.Router()
const VechicleTypeController = require('../controllers/vechicleType.controller');

router.get('/', (req, res) => VechicleTypeController.getAllVechicleTypes(req, res));
router.get('/:id', (req, res) => VechicleTypeController.getVechicleTypeById(req, res));
router.post('/', (req, res) => VechicleTypeController.createVechicleType(req, res));
router.put('/:id', (req, res) => VechicleTypeController.updateVechicleType(req, res));
router.delete('/:id', (req, res) => VechicleTypeController.deleteVechicleType(req, res));

module.exports = router;