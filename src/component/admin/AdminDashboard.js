import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminDashboard.css";
import FoodItemManager from "./FoodItemManager";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const history = useHistory();

  useEffect(() => {
    const adminInfo = sessionStorage.getItem("adminInfo");
    if (!adminInfo) {
      history.push("/admin/login");
      return;
    }
    fetchOrders();
    fetchFoodItems();
  }, [history]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("https://react-food-project-2.onrender.com/api/orders/user/all");
      setOrders(response.data);
      console.log("Fetched orders from test database:", response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : 'No response',
        request: error.request ? 'Request made but no response' : 'No request made'
      });
      toast.error("Failed to load orders: " + (error.response?.data?.message || error.message));
      setOrders([]); // Reset orders on error
      setLoading(false);
    }
  };

  const fetchFoodItems = async () => {
    try {
      const response = await axios.get("https://react-food-project-2.onrender.com/api/food-items");
      setFoodItems(response.data);
      console.log("Fetched food items from test database:", response.data);
    } catch (error) {
      console.error("Error fetching food items:", error);
      toast.error("Failed to load food items. Please try again later.");
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.patch(`https://react-food-project-2.onrender.com/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      toast.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminInfo");
    history.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
          <button 
            className={`tab-button ${activeTab === "food-items" ? "active" : ""}`}
            onClick={() => setActiveTab("food-items")}
          >
            Food Items
          </button>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {activeTab === "orders" && (
        <div className="orders-container">
          <h2>All Orders</h2>
          {orders.length === 0 ? (
            <p className="no-orders">No orders found</p>
          ) : (
            <div className="orders-grid">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <h3>Order #{order._id.slice(-6)}</h3>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="order-details">
                    <p>
                      <strong>Customer:</strong> {order.userId}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(order.orderDate).toLocaleString()}
                    </p>
                    <p>
                      <strong>Total Amount:</strong> ₹{order.totalAmount}
                    </p>
                  </div>
                  <div className="order-items">
                    <h4>Order Items:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <p>{item.name}</p>
                        <p>
                          {item.quantity} x ₹{item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="order-actions">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order._id, e.target.value)
                      }
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "food-items" && (
        <div className="food-items-container">
          <h2>Food Items</h2>
          {foodItems.length === 0 ? (
            <p className="no-food-items">No food items found</p>
          ) : (
            <div className="food-items-grid">
              {foodItems.map((item) => (
                <div key={item._id} className="food-item-card">
                  <div className="food-item-image">
                    <img src={item.imageUrl} alt={item.name} />
                  </div>
                  <div className="food-item-details">
                    <h3>{item.name}</h3>
                    <p className="food-item-category">{item.category}</p>
                    <p className="food-item-price">₹{item.price}</p>
                    <p className="food-item-quantity">{item.quantity}</p>
                    <div className="food-item-rating">
                      <span className="star">★</span> {item.star}
                    </div>
                    <p className="food-item-description">{item.description}</p>
                    <div className="food-item-status">
                      <span className={`status-badge ${item.isAvailable ? 'available' : 'unavailable'}`}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 