import React, { useState } from "react";
import { useHistory } from "react-router-dom";
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
      // Hardcoded admin credentials
      if (credentials.email === "admin@example.com" && credentials.password === "admin123") {
        // Store admin info in session storage
        sessionStorage.setItem("adminInfo", JSON.stringify({ email: credentials.email }));
        toast.success("Login successful!");
        history.push("/admin/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
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