const MaterialCategory = require('../models/materialCategory.model');

class MaterialCategoryService {
    async createMaterialCategory(data) {
        const materialCategory = new MaterialCategory(data);
        return materialCategory.save();
    }

    async getMaterialCategoryById(id) {
        return MaterialCategory.findById(id);
    }

    async updateMaterialCategory(id, data) {
        return MaterialCategory.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteMaterialCategory(id) {
        return MaterialCategory.findByIdAndDelete(id);
    }

    async listMaterialCategories(filter = {}) {
        return MaterialCategory.find(filter);
    }
}

module.exports = new MaterialCategoryService();