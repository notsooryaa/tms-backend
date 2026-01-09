const express = require('express');
const router = express.Router();
const materialController = require('../controllers/material.controller');


router.get('/', materialController.getAllMaterials);
router.get('/:id', materialController.getMaterialById);
router.post('/', materialController.createMaterial);
router.put('/:id', materialController.updateMaterial);
router.delete('/:id', materialController.deleteMaterial);

module.exports = router;