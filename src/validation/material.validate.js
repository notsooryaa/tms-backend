const joi = require('joi');

const materialSchema = joi.object({
    id: joi.string(),
});

const createMaterialSchema = joi.object({
    name: joi.string().required(),
    description: joi.string().required(),
    category: joi.string().hex().length(24).required(),
    weightPerUnit: joi.number().min(0).required(),
    volumePerUnit: joi.number().min(0).required(),
});

const updateMaterialSchema = joi.object({
    name: joi.string(),
    description: joi.string(),
    category: joi.string().hex().length(24),
    weightPerUnit: joi.number().min(0),
    volumePerUnit: joi.number().min(0),
});

async function validateMaterial(data) {
    return materialSchema.validateAsync(data);
}

async function validateCreate(data) {
    return createMaterialSchema.validateAsync(data);
}

async function validateUpdate(data) {
    return updateMaterialSchema.validateAsync(data);
}

module.exports = {
    validateMaterial,
    validateCreate,
    validateUpdate,
};