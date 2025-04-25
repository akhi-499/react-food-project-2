const express = require('express');
const router = express.Router();
const foodItemSchema = require('../models/FoodItem');

module.exports = (mongoose) => {
    const FoodItem = mongoose.model('FoodItem', foodItemSchema);

    // Get all food items
    router.get('/', async (req, res) => {
        try {
            const foodItems = await FoodItem.find();
            res.status(200).json(foodItems);
        } catch (error) {
            console.error('Error fetching food items:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    // Get food items by category
    router.get('/category/:category', async (req, res) => {
        try {
            const foodItems = await FoodItem.find({ category: req.params.category });
            res.status(200).json(foodItems);
        } catch (error) {
            console.error('Error fetching food items by category:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    // Create new food item (Admin/Vendor only)
    router.post('/', async (req, res) => {
        try {
            const newFoodItem = new FoodItem(req.body);
            const savedFoodItem = await newFoodItem.save();
            res.status(201).json(savedFoodItem);
        } catch (error) {
            console.error('Error creating food item:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    // Update food item availability (Admin only)
    router.patch('/:id/availability', async (req, res) => {
        try {
            const { isAvailable } = req.body;
            const updatedFoodItem = await FoodItem.findByIdAndUpdate(
                req.params.id,
                { isAvailable },
                { new: true }
            );
            
            if (!updatedFoodItem) {
                return res.status(404).json({ message: 'Food item not found' });
            }
            
            res.status(200).json(updatedFoodItem);
        } catch (error) {
            console.error('Error updating food item availability:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    // Update food item (Admin/Vendor only)
    router.put('/:id', async (req, res) => {
        try {
            const updatedFoodItem = await FoodItem.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            
            if (!updatedFoodItem) {
                return res.status(404).json({ message: 'Food item not found' });
            }
            
            res.status(200).json(updatedFoodItem);
        } catch (error) {
            console.error('Error updating food item:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    // Delete food item (Admin/Vendor only)
    router.delete('/:id', async (req, res) => {
        try {
            const deletedFoodItem = await FoodItem.findByIdAndDelete(req.params.id);
            
            if (!deletedFoodItem) {
                return res.status(404).json({ message: 'Food item not found' });
            }
            
            res.status(200).json({ message: 'Food item deleted successfully' });
        } catch (error) {
            console.error('Error deleting food item:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    return router;
}; 