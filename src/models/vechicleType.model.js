const mongoose = require('mongoose');

const vechicleTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    volume: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Vechicle = mongoose.model('VechicleType', vechicleTypeSchema);

module.exports = Vechicle;