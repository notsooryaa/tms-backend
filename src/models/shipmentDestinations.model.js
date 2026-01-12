const mongoose = require('mongoose');

const shipmentDestinationsSchema = new mongoose.Schema({
    shipmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipment',
        required: true
    },
    destinationLocation: {
        type: String,
        required: true
    },
    orderNumber: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-transit', 'delivered', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const ShipmentDestinations = mongoose.model('ShipmentDestinations', shipmentDestinationsSchema);

module.exports = ShipmentDestinations;