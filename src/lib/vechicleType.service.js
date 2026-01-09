const Vechicle = require('../models/vechicleType.model');

class VechicleTypeService {
    async getAllVechicleTypes() {
        return await Vechicle.find();
    }

    async getVechicleTypeById(id) {
        return await Vechicle.findById(id);
    }
    
    async createVechicleType(data) {
        const vechicleType = new Vechicle(data);
        return await vechicleType.save();
    }

    async updateVechicleType(id, data) {
        return await Vechicle.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteVechicleType(id) {
        return await Vechicle.findByIdAndDelete(id);
    }
}

module.exports = new VechicleTypeService();