import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminLogin.css";
import "../register/register.css";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Attempting admin login...");
      
      const response = await axios.post("https://react-food-project-2.onrender.com/api/admin/login", credentials);
      
      console.log("Login response:", response);
      
      if (response.status === 200) {
        // Store admin info in session storage
        sessionStorage.setItem("adminInfo", JSON.stringify(response.data.admin));
        toast.success("Login successful!");
        history.push("/admin/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : 'No response'
      });
      
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToUserLogin = () => {
    history.push("/login");
  };

  return (
    <div className="admin-login-container">
      <div className="system-header">University Food Ordering System</div>
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>Admin Login</h1>
          <p>Access the admin dashboard to manage food items</p>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="admin-login-footer">
          <button 
            onClick={handleBackToUserLogin}
            className="back-button"
          >
            Back to User Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 