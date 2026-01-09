const mongoose = require('mongoose');

const tranoportTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    vehicle_number: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

const Tranport = mongoose.model('TranportType', tranoportTypeSchema);

module.exports = Tranport;