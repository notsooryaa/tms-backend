const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
    transportType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TranportType',
        required: true
    },
    vehicleType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VechicleType',
        required: true
    },
    material: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Material',
        required: true
    },
    orderNumber: {
        type: [Number],
        required: true,
        unique: true
    },
    weight: {
        type: [Number],
        required: true
    },
    volume: {
        type: [Number],
        required: true
    },
    quantity: {
        type: [Number],
        required: true
    },
    groupId: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Shipment = mongoose.model('Shipment', shipmentSchema);

module.exports = Shipment;