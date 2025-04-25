import axios from 'axios';

const API_URL = 'https://react-food-project-2.onrender.com/api/orders';

// Create a new order
export const createOrder = async (orderData) => {
    try {
        console.log('Sending order data to API:', orderData);
        const response = await axios.post(`${API_URL}/create`, orderData);
        console.log('Order creation response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error.response?.data || error.message);
        throw error;
    }
};

// Get all orders for a user
export const getUserOrders = async (userId) => {
    try {
        console.log('Fetching orders for user:', userId);
        const response = await axios.get(`${API_URL}/user/${userId}`);
        console.log('Fetched orders:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching user orders:', error.response?.data || error.message);
        throw error;
    }
};

// Get a single order by ID
export const getOrderById = async (orderId) => {
    try {
        console.log('Fetching order by ID:', orderId);
        const response = await axios.get(`${API_URL}/${orderId}`);
        console.log('Fetched order:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching order:', error.response?.data || error.message);
        throw error;
    }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
    try {
        console.log('Updating order status:', { orderId, status });
        const response = await axios.patch(`${API_URL}/${orderId}/status`, { status });
        console.log('Order status update response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating order status:', error.response?.data || error.message);
        throw error;
    }
};

// Delete an order
export const deleteOrder = async (orderId) => {
    try {
        console.log('Deleting order with ID:', orderId);
        console.log('Delete request URL:', `${API_URL}/${orderId}`);
        
        const response = await axios.delete(`${API_URL}/${orderId}`);
        console.log('Order deletion response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting order:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        throw error;
    }
}; 