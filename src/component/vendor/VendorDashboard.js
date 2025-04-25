import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./VendorDashboard.css";

const VendorDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    // Check if vendor is logged in
    const vendorInfo = sessionStorage.getItem("vendorInfo");
    if (!vendorInfo) {
      toast.error("Please login to access the dashboard");
      history.push("/vendor/login");
      return;
    }

    fetchOrders();
  }, [history]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log("Attempting to fetch orders from test database...");
      
      const response = await axios.get("https://react-food-project-2.onrender.com/api/orders/user/all");
      
      console.log("API Response:", response);
      
      if (response.data && Array.isArray(response.data)) {
        console.log(`Successfully fetched ${response.data.length} orders from test database`);
        setOrders(response.data);
      } else {
        throw new Error("Invalid response format received from server");
      }
    } catch (error) {
      console.error("Error fetching orders:", {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : 'No response',
        request: error.request ? 'Request made but no response' : 'No request made'
      });
      toast.error(`Failed to load orders: ${error.message}`);
      setOrders([]); // Reset orders on error
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      console.log(`Updating order ${orderId} status to ${newStatus}...`);
      
      const response = await axios.patch(`https://react-food-project-2.onrender.com/api/orders/${orderId}/status`, {
        status: newStatus
      });
      
      console.log("Status update response:", response);
      
      if (response.status === 200) {
        toast.success("Order status updated successfully!");
        // Refresh orders list
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : 'No response'
      });
      toast.error(`Failed to update order status: ${error.message}`);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("vendorInfo");
    history.push("/vendor/login");
  };

  if (loading) {
    return (
      <div className="vendor-dashboard-loading">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="vendor-dashboard">
      <div className="vendor-dashboard-header">
        <h1>Vendor Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found</p>
        </div>
      ) : (
        <div className="orders-container">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order #{order._id.toString().slice(-6)}</h3>
                <span className={`order-status ${order.status}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="order-details">
                <p>Date: {new Date(order.orderDate).toLocaleString()}</p>
                <p>Total Amount: ₹{order.totalAmount}</p>
              </div>
              <div className="order-items">
                <h4>Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="order-item-details">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-actions">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
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
  );
};

export default VendorDashboard; 