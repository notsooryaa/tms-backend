const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaterialCategory',
        required: true
    },
    weightPerUnit: {
        type: Number,
        required: true,
        min: 0
    },
    volumePerUnit: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

const Material = mongoose.model('Material', materialSchema);

module.exports = Material;