const joi = require('joi');

const shipmentSchema = joi.object({
    id: joi.string(),
});

const createShipmentSchema = joi.object({
    source: joi.array().items(joi.string().required()).min(1).required(),
    destination: joi.array().items(joi.string().required()).min(1).required(),
    transportType: joi.string().hex().length(24).required(),
    vehicleType: joi.string().hex().length(24).required(),
    material: joi.array().items(joi.string().hex().length(24)).required(),
    orderNumber: joi.array().items(joi.number().greater(0)).required(),
    weight: joi.array().items(joi.number().greater(0)).required(),
    volume: joi.array().items(joi.number().greater(0)).required(),
    quantity: joi.array().items(joi.number().greater(0)).required(),
    groupId: joi.number().greater(0).required(),
});

const updateShipmentSchema = joi.object({
    transportType: joi.string().hex().length(24).required(),
    vehicleType: joi.string().hex().length(24).required(),
    material: joi.array().items(joi.string().hex().length(24)).required(),
    weight: joi.array().items(joi.number().greater(0)),
    volume: joi.array().items(joi.number().greater(0)),
    quantity: joi.array().items(joi.number().greater(0)),
});

async function validateShipment(data) {
    return shipmentSchema.validateAsync(data);
}

async function validateCreate(data) {
    return createShipmentSchema.validateAsync(data);
}

async function validateUpdate(data) {
    return updateShipmentSchema.validateAsync(data);
}

module.exports = {
    validateShipment,
    validateCreate,
    validateUpdate,
};