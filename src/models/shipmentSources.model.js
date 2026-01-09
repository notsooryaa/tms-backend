const mongoose = require('mongoose');

const shipmentSourcesSchema = new mongoose.Schema({
    shipmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipment',
        required: true
    },
    sourceLocation: {
        type: String,
        required: true
    },
    orderNumber: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const ShipmentSources = mongoose.model('ShipmentSources', shipmentSourcesSchema);

module.exports = ShipmentSources;