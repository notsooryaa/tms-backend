const Material = require('../models/material.model');

class MaterialService {
    async createMaterial(data) {
        const material = new Material(data);
        return material.save();
    }

    async getMaterialById(id) {
        return Material.findById(id);
    }

    async updateMaterial(id, data) {
        return Material.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteMaterial(id) {
        return Material.findByIdAndDelete(id);
    }

    async listMaterials(filter = {}) {
        return (await Material.find(filter).populate('category'));
    }
}

module.exports = new MaterialService();