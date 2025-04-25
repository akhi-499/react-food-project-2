const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require('dotenv').config();

const app = express();
app.use(cors({ 
    origin: [
        "http://localhost:3000", 
        "https://mini-project-ten-tan.vercel.app"  // Your actual Vercel domain
    ], 
    credentials: true 
}));
app.use(express.json());

// Connect to MongoDB with detailed error logging
console.log("Attempting to connect to MongoDB...");

if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
}

// Create two separate connections with SSL configuration
const authConnection = mongoose.createConnection(process.env.MONGODB_URI + "/authDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    retryWrites: true,
    w: 'majority',
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false
});

const orderConnection = mongoose.createConnection(process.env.MONGODB_URI + "/foodOrderDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    retryWrites: true,
    w: 'majority',
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false
});

// Handle authDB connection
authConnection.on('connected', () => {
    console.log("Successfully connected to MongoDB (authDB)");
});

authConnection.on('error', (err) => {
    console.error("AuthDB connection error:", err);
});

// Handle foodOrderDB connection
orderConnection.on('connected', () => {
    console.log("Successfully connected to MongoDB (foodOrderDB)");
});

orderConnection.on('error', (err) => {
    console.error("FoodOrderDB connection error:", err);
});

// Define User Schema using authConnection
const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed password
});

const User = authConnection.model("User", userSchema);

// Define Admin Schema using authConnection
const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed password
});

const Admin = authConnection.model("Admin", adminSchema);

// ✅ Register API (Ensure password is hashed)
const router = express.Router();

// Registration API
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // 🔹 Check if the user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists. Please log in." });
        }

        // 🔹 Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 🔹 Save the new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // 🔹 Check if the user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "User not found. Please register first." });
        }

        // 🔹 Compare hashed passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Send user data without password
        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email
        };

        res.status(200).json({ message: "Login successful", user: userData });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Admin Login API
router.post("/api/admin/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the admin exists
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(400).json({ message: "Admin not found" });
        }

        // Compare hashed passwords
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Send admin data without password
        const adminData = {
            _id: admin._id,
            email: admin.email
        };

        res.status(200).json({ message: "Login successful", admin: adminData });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Create initial admin account
router.post("/api/admin/create", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin
        const admin = new Admin({
            email: email,
            password: hashedPassword
        });

        await admin.save();

        // Send admin data without password
        const adminData = {
            _id: admin._id,
            email: admin.email
        };

        res.status(201).json({ message: "Admin created successfully", admin: adminData });
    } catch (error) {
        console.error("Admin creation error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Import order routes and pass the orderConnection
const orderRoutes = require('./routes/orderRoutes')(orderConnection);

// Use routes
app.use("/", router);
app.use("/api/orders", orderRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
