const joi = require('joi');

const transportTypeSchema = joi.object({
    id: joi.string(),
});

const createTransportTypeSchema = joi.object({
    name: joi.string().min(1).max(100).required(),
    vehicle_number: joi.string().min(10).max(10).required(),
    address: joi.string().min(1).max(255).required(),
    emailId: joi.string().email().required()
});

const updateTransportTypeSchema = joi.object({
    name: joi.string().min(1).max(100),
    vehicle_number: joi.string().min(1).max(50),
    address: joi.string().min(1).max(255),
    emailId: joi.string().email()
});

async function validateTransportType(data) {
    return transportTypeSchema.validateAsync(data);
}

async function validateCreate(data) {
    return createTransportTypeSchema.validateAsync(data);
}

async function validateUpdate(data) {
    return updateTransportTypeSchema.validateAsync(data);
}
module.exports = {
    validateTransportType,
    validateCreate,
    validateUpdate,
};