const express = require('express');
const router = express.Router();
const materialCategoryController = require('../controllers/materialCategory.controller');


router.get('/', materialCategoryController.getAllMaterialCategories);
router.get('/:id', materialCategoryController.getMaterialCategoryById);
router.post('/', materialCategoryController.createMaterialCategory);
router.put('/:id', materialCategoryController.updateMaterialCategory);
router.delete('/:id', materialCategoryController.deleteMaterialCategory);

module.exports = router;