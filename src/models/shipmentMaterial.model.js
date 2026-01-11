const mongoose = require('mongoose');

const shipmentMaterialSchema = new mongoose.Schema({
    materialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material',
        required: true
    },
    shipmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipment',
        required: true
    },
    weight: {
        type: Number,
        required: true,
        min: 0
    },
    volume: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
}, {
    timestamps: true
});

const ShipmentMaterial = mongoose.model('ShipmentMaterial', shipmentMaterialSchema);

module.exports = ShipmentMaterial;