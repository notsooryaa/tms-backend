const joi = require('joi');

const vechicleTypeSchema = joi.object({
    id: joi.string(),
});

const createVechicleTypeSchema = joi.object({
    name: joi.string().min(1).max(100).required(),
    weight: joi.number().greater(0).required(),
    volume: joi.number().greater(0).required()
});

const updateVechicleTypeSchema = joi.object({
    name: joi.string().min(1).max(100),
    weight: joi.number().greater(0),
    volume: joi.number().greater(0)
});

async function validateVechicleType(data) {
    return vechicleTypeSchema.validateAsync(data);
}

async function validateCreate(data) {
    return createVechicleTypeSchema.validateAsync(data);
}

async function validateUpdate(data) {
    return updateVechicleTypeSchema.validateAsync(data);
}
module.exports = {
    validateVechicleType,
    validateCreate,
    validateUpdate,
};