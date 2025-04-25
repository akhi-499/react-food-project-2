import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./VendorLogin.css";
import "../register/register.css";
import axios from "axios";

const VendorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("https://react-food-project-2.onrender.com/api/vendor/login", {
        email: email,
        password: password
      });

      if (response.status === 200) {
        // Store vendor info in session storage
        sessionStorage.setItem("vendorInfo", JSON.stringify(response.data.vendor));
        toast.success("Login successful!");
        history.push("/vendor/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    history.push("/login");
  };

  return (
    <div className="vendor-login-container">
      <div className="system-header">University Food Ordering System</div>
      <div className="vendor-login-card">
        <h2>Vendor Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="demo-credentials">
          <p>Demo Credentials:</p>
          <p>Email: vendor@example.com</p>
          <p>Password: vendor123</p>
        </div>
        <button onClick={handleBackToLogin} className="back-button">
          Back to User Login
        </button>
      </div>
    </div>
  );
};

export default VendorLogin; 