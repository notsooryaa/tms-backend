const joi = require('joi');

const materialCategorySchema = joi.object({
    id: joi.string(),
});

const createMaterialCategorySchema = joi.object({
    name: joi.string().required(),
    description: joi.string().required()
});

const updateMaterialCategorySchema = joi.object({
    name: joi.string(),
    description: joi.string(),
});

async function validateMaterialCategory(data) {
    return materialCategorySchema.validateAsync(data);
}

async function validateCreate(data) {
    console.log(data)
    return createMaterialCategorySchema.validateAsync(data);
}

async function validateUpdate(data) {
    return updateMaterialCategorySchema.validateAsync(data);
}

module.exports = {
    validateMaterialCategory,
    validateCreate,
    validateUpdate,
};