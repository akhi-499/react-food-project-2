import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { updateOrderStatus, setOrders, removeOrder } from '../../../redux/orderSlice';
import { toast } from 'react-toastify';
import { getUserOrders, updateOrderStatus as updateOrderStatusApi, deleteOrder } from '../../../services/orderService';
import './MyOrders.css';

const MyOrders = () => {
    const orders = useSelector((state) => state.orders.orders);
    const dispatch = useDispatch();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            
            // Get user from session storage
            const userStr = sessionStorage.getItem('user');
            if (!userStr) {
                toast.error("Please login to view your orders");
                history.push('/login');
                return;
            }
            
            const user = JSON.parse(userStr);
            
            // Fetch orders from API
            const fetchedOrders = await getUserOrders(user.user._id);
            
            // Update Redux store with fetched orders
            dispatch(setOrders(fetchedOrders));
            
            setError(null);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders. Please try again later.');
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const goBackToHome = () => {
        history.push('/home');
    };

    const cancelOrder = async (orderId) => {
        // Only allow cancellation of pending orders
        const order = orders.find(order => order._id === orderId);
        console.log('Attempting to cancel order:', orderId, 'Order found:', order);
        
        if (order && order.status === 'Pending') {
            try {
                console.log('Sending delete request for order:', orderId);
                // Delete order from database
                const response = await deleteOrder(orderId);
                console.log('Delete response:', response);
                
                // Remove order from Redux store
                dispatch(removeOrder(orderId));
                
                toast.success('Order cancelled successfully!');
            } catch (error) {
                console.error('Error cancelling order:', error);
                console.error('Error details:', error.response?.data || error.message);
                toast.error('Failed to cancel order. Please try again.');
            }
        } else {
            console.log('Cannot cancel order - status is not Pending:', order?.status);
            toast.error('Only pending orders can be cancelled.');
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        // Remove any leading slash if present
        const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
        return `https://react-food-project-2.onrender.com/images/${cleanPath}`;
    };

    if (loading) {
        return (
            <Container className="my-orders-container">
                <div className="text-center">
                    <h2>Loading your orders...</h2>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-orders-container">
                <div className="text-center">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <Button variant="primary" onClick={fetchOrders}>Try Again</Button>
                </div>
            </Container>
        );
    }

    return (
        <Container className="my-orders-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Orders</h2>
                <Button variant="outline-primary" onClick={goBackToHome}>
                    Back to Home
                </Button>
            </div>
            {orders && orders.length > 0 ? (
                <Row>
                    {orders.map((order) => (
                        <Col key={order._id} xs={12} md={6} lg={4} className="mb-4">
                            <Card className="order-card">
                                <Card.Header>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Order #{order._id.slice(-6)}</span>
                                        <div className="d-flex align-items-center">
                                            <span className={`status ${order.status.toLowerCase()}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                            {order.status.toLowerCase() === 'pending' && (
                                                <Button 
                                                    variant="link" 
                                                    className="cancel-order-btn"
                                                    onClick={() => cancelOrder(order._id)}
                                                    title="Cancel Order"
                                                >
                                                    <FaTimes />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div className="order-items">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="order-item">
                                                <img src={getImageUrl(item.image)} alt={item.name} className="item-image" />
                                                <div className="item-details">
                                                    <h6>{item.name}</h6>
                                                    <p>Quantity: {item.quantity}</p>
                                                    <p>Price: ₹{item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="order-summary mt-3">
                                        <div className="d-flex justify-content-between">
                                            <span>Total Amount:</span>
                                            <span>₹{order.totalAmount}</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span>Order Date:</span>
                                            <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="text-center">
                    <p>No orders found. Start ordering some delicious food!</p>
                </div>
            )}
        </Container>
    );
};

export default MyOrders; 