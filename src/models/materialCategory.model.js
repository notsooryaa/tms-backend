const mongoose = require('mongoose');

const materialCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

const MaterialCategory = mongoose.model('MaterialCategory', materialCategorySchema);

module.exports = MaterialCategory;