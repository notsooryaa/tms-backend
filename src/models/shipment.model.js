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
    totalWeight: {
        type: Number,
        required: true,
        min: 0
    },
    totalVolume: {
        type: Number,
        required: true,
        min: 0
    },
    totalQuantity: {
        type: Number,
        required: true,
        min: 0
    },
    groupId: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-transit', 'completed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

const Shipment = mongoose.model('Shipment', shipmentSchema);

module.exports = Shipment;