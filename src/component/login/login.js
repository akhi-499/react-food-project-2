import React, { useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import "../register/register.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginEmailErr, setLoginEmailErr] = useState(false);
  const [loginPasswordErr, setLoginPasswordErr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  async function Loginvalidation() {
    setLoginEmailErr(!loginEmail);
    setLoginPasswordErr(!loginPassword);

    if (!loginEmail || !loginPassword) return;

    try {
      setIsLoading(true);
      const response = await axios.post("https://react-food-project-2.onrender.com/login", {
        email: loginEmail,
        password: loginPassword,
      });

      if (response.status === 200) {
        // Store user data in session storage
        sessionStorage.setItem('user', JSON.stringify(response.data));
        toast.success("Login successful!");
        history.push("/home");
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        toast.error(error.response.data.message || "Login failed");
      } else {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-body">
      <div className="system-header">University Food Ordering System</div>
      <div className="login-main">
        <h1>Login</h1>
        <br />
        <p>Email</p>
        <input
          type="email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          placeholder="Enter your email"
        />
        {loginEmailErr && (
          <small style={{ color: "#d3521d" }}>Please enter your email</small>
        )}
        <br />
        <p>Password</p>
        <input
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          placeholder="Enter your password"
        />
        {loginPasswordErr && (
          <small style={{ color: "#d3521d" }}>Please enter your password</small>
        )}
        <br />
        <button 
          onClick={Loginvalidation} 
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.7 : 1 }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <br />
        <p style={{ fontSize: "15px" }}>
          Don't have an account? <Link to={"/"}>Sign up</Link>
        </p>
        <div className="vendor-login-section">
          <p style={{ fontSize: "15px", marginTop: "20px" }}>
            Are you a vendor? <Link to="/vendor/login" style={{ color: "#4a90e2" }}>Login here</Link>
          </p>
          <p style={{ fontSize: "15px", marginTop: "10px" }}>
            Are you an admin? <Link to="/admin/login" style={{ color: "#4a90e2" }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
