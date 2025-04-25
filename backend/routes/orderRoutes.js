const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const orderSchema = require('../models/Order');

module.exports = (mongoose) => {
    // Create the Order model using mongoose
    const Order = mongoose.model('Order', orderSchema);

    // Create a new order
    router.post('/create', async (req, res) => {
        try {
            console.log('Received order creation request:', req.body);
            const { userId, items, totalAmount } = req.body;
            
            // Validate required fields
            if (!userId || !items || !totalAmount) {
                console.log('Missing required fields:', { userId, items, totalAmount });
                return res.status(400).json({ message: 'Missing required fields' });
            }
            
            // Create new order
            const newOrder = new Order({
                userId,
                items,
                totalAmount
            });
            
            console.log('Attempting to save order:', newOrder);
            // Save order to database
            const savedOrder = await newOrder.save();
            console.log('Order saved successfully:', savedOrder);
            
            res.status(201).json({ 
                message: 'Order created successfully', 
                order: savedOrder 
            });
        } catch (error) {
            console.error('Error creating order:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });

    // Get all orders for a user
    router.get('/user/:userId', async (req, res) => {
        try {
            console.log('Fetching orders for user:', req.params.userId);
            const { userId } = req.params;
            
            // Special case: if userId is 'all', return all orders (for vendor dashboard)
            if (userId === 'all') {
                console.log('Fetching all orders for vendor dashboard');
                const orders = await Order.find().sort({ orderDate: -1 });
                console.log(`Found ${orders.length} orders`);
                return res.status(200).json(orders);
            }
            
            // For specific user, validate userId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                console.log('Invalid userId format:', userId);
                return res.status(400).json({ message: 'Invalid user ID format' });
            }
            
            // Find all orders for the user
            const orders = await Order.find({ userId }).sort({ orderDate: -1 });
            console.log('Found orders:', orders);
            
            res.status(200).json(orders);
        } catch (error) {
            console.error('Error fetching orders:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });

    // Get a single order by ID
    router.get('/:orderId', async (req, res) => {
        try {
            const { orderId } = req.params;
            
            // Find the order
            const order = await Order.findById(orderId);
            
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            
            res.status(200).json(order);
        } catch (error) {
            console.error('Error fetching order:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    // Update order status
    router.patch('/:orderId/status', async (req, res) => {
        try {
            const { orderId } = req.params;
            const { status } = req.body;
            
            // Validate status
            const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
            if (!validStatuses.includes(status.toLowerCase())) {
                return res.status(400).json({ message: 'Invalid status' });
            }
            
            // Find and update the order
            const updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                { status: status.toLowerCase() },
                { new: true }
            );
            
            if (!updatedOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }
            
            res.status(200).json({ 
                message: 'Order status updated successfully', 
                order: updatedOrder 
            });
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    // Delete an order
    router.delete('/:orderId', async (req, res) => {
        try {
            const { orderId } = req.params;
            console.log('Attempting to delete order:', orderId);
            console.log('Order ID type:', typeof orderId);
            
            // Validate orderId format
            if (!mongoose.Types.ObjectId.isValid(orderId)) {
                console.log('Invalid order ID format:', orderId);
                return res.status(400).json({ message: 'Invalid order ID format' });
            }
            
            // Find and delete the order
            console.log('Finding order with ID:', orderId);
            const deletedOrder = await Order.findByIdAndDelete(orderId);
            
            if (!deletedOrder) {
                console.log('Order not found with ID:', orderId);
                return res.status(404).json({ message: 'Order not found' });
            }
            
            console.log('Order deleted successfully:', deletedOrder);
            res.status(200).json({ 
                message: 'Order deleted successfully',
                order: deletedOrder
            });
        } catch (error) {
            console.error('Error deleting order:', error);
            console.error('Error stack:', error.stack);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });

    return router;
}; 