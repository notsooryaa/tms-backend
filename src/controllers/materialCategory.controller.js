const MaterialCategoryService = require("../lib/materialCategory.service");
const {
  validateMaterialCategory,
  validateCreate,
  validateUpdate,
} = require("../validation/materialCategory.validate");

class MaterialCategoryController {
    async getAllMaterialCategories(req, res, next) {
        try {
            const categories = await MaterialCategoryService.listMaterialCategories();
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    }

    async getMaterialCategoryById(req, res, next) {
        try {
            await validateMaterialCategory(req.params);
            const category = await MaterialCategoryService.getMaterialCategoryById(req.params.id);
            if (!category) {
                return res.status(404).json({ message: "Material Category not found" });
            }
            res.status(200).json(category);
        } catch (error) {
            next(error);
        }
    }

    async createMaterialCategory(req, res, next) {
        try {
            const validatedData = await validateCreate(req.body);
            const newCategory = await MaterialCategoryService.createMaterialCategory(validatedData);
            res.status(201).json(newCategory);
        } catch (error) {
            next(error);
        }
    } 

    async updateMaterialCategory(req, res, next) {
        try {
            await validateMaterialCategory(req.params);
            const validatedData = await validateUpdate(req.body);
            const updatedCategory = await MaterialCategoryService.updateMaterialCategory(req.params.id, validatedData);
            if (!updatedCategory) {
                return res.status(404).json({ message: "Material Category not found" });
            }
            res.status(200).json(updatedCategory);
        } catch (error) {
            next(error);
        }
    }

    async deleteMaterialCategory(req, res, next) {
        try {
            await validateMaterialCategory(req.params);
            const deletedCategory = await MaterialCategoryService.deleteMaterialCategory(req.params.id);
            if (!deletedCategory) {
                return res.status(404).json({ message: "Material Category not found" });
            }
            res.status(200).json({ message: "Material Category deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MaterialCategoryController();
