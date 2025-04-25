const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Breakfast', 'Lunch']
    },
    image: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    vendorId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = foodItemSchema; 