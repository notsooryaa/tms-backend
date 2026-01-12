const joi = require('joi');

const shipmentSchema = joi.object({
    id: joi.string(),
});

const createShipmentSchema = joi.object({
    source: joi.array().items(joi.string().required()).min(1).required(),
    destination: joi.array().items(joi.string().required()).min(1).required(),
    transportType: joi.string().hex().length(24).required(),
    vehicleType: joi.string().hex().length(24).required(),
    materials: joi.array().items(joi.object({
        materialId: joi.string().hex().length(24).required(),
        quantity: joi.number().greater(0).required()
    })).min(1).required(),
    orderNumber: joi.array().items(joi.number().greater(0)).required(),
    groupId: joi.number().greater(0).required(),
});

const updateShipmentSchema = joi.object({
    transportType: joi.string().hex().length(24),
    vehicleType: joi.string().hex().length(24),
    groupId: joi.number().greater(0),
    additionalSources: joi.array().items(joi.object({
        location: joi.string().required(),
        orderNumber: joi.number().greater(0).required()
    })),
    additionalDestinations: joi.array().items(joi.object({
        location: joi.string().required(),
        orderNumber: joi.number().greater(0).required()
    })),
    additionalMaterials: joi.array().items(joi.object({
        materialId: joi.string().hex().length(24).required(),
        quantity: joi.number().greater(0).required(),
        orderNumber: joi.number().greater(0).required()
    }))
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