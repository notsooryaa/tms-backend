const Tranport = require('../models/tranportType.model');

class TransportTypeService {
    async getAllTransportTypes() {
        return await Tranport.find();
    }

    async getTransportTypeById(id) {
        return await Tranport.findById(id);
    }
    
    async createTransportType(data) {
        const transportType = new Tranport(data);
        return await transportType.save();
    }

    async updateTransportType(id, data) {
        return await Tranport.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteTransportType(id) {
        return await Tranport.findByIdAndDelete(id);
    }
}

module.exports = new TransportTypeService();