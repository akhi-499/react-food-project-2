const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");
require('dotenv').config();

const app = express();
app.use(cors({ 
    origin: "*",  // Allow all origins for now
    credentials: true 
}));
app.use(express.json());

// Serve static files from the public directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Connect to MongoDB with detailed error logging
console.log("Attempting to connect to MongoDB...");

if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
}

// Define User Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed password
});

const User = mongoose.model("User", userSchema);

// Define Admin Schema
const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed password
});

const Admin = mongoose.model("Admin", adminSchema);

// Define Vendor Schema
const vendorSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true }
});

const Vendor = mongoose.model("Vendor", vendorSchema);

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

// Initialize vendor account
const initializeVendor = async () => {
    try {
        console.log('Checking for vendor account...');
        const existingVendor = await Vendor.findOne({ email: 'vendor@example.com' });
        
        if (!existingVendor) {
            console.log('No vendor account found, creating default vendor...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('vendor123', salt);
            
            const vendor = new Vendor({
                email: 'vendor@example.com',
                password: hashedPassword,
                name: 'Default Vendor'
            });
            
            await vendor.save();
            console.log('Default vendor account created successfully');
        } else {
            console.log('Vendor account already exists');
        }
    } catch (error) {
        console.error('Error initializing vendor account:', error);
    }
};

// Vendor Login API
router.post("/api/vendor/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the vendor exists
        const vendor = await Vendor.findOne({ email: email });
        if (!vendor) {
            return res.status(400).json({ message: "Vendor not found" });
        }

        // Compare hashed passwords
        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Send vendor data without password
        const vendorData = {
            _id: vendor._id,
            email: vendor.email,
            name: vendor.name
        };

        res.status(200).json({ message: "Login successful", vendor: vendorData });
    } catch (error) {
        console.error("Vendor login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Import routes and pass the dbConnection
const orderRoutes = require('./routes/orderRoutes')(mongoose);
const foodItemRoutes = require('./routes/foodItemRoutes')(mongoose);

// Initialize food items
const initializeFoodItems = async () => {
    try {
        const count = await FoodItem.countDocuments();
        if (count === 0) {
            const defaultItems = [
                {
                    name: 'Idli',
                    description: 'Soft and fluffy rice cakes served with sambar and chutney',
                    price: 40,
                    category: 'Breakfast',
                    image: '/images/Indfood-1.jpg',
                    isAvailable: true,
                    vendorId: 'vendor123'
                },
                {
                    name: 'Dosa',
                    description: 'Crispy rice crepe served with sambar and chutney',
                    price: 50,
                    category: 'Breakfast',
                    image: '/images/Indfood-2.jpg',
                    isAvailable: true,
                    vendorId: 'vendor123'
                },
                {
                    name: 'Vada',
                    description: 'Crispy lentil donut served with sambar and chutney',
                    price: 30,
                    category: 'Breakfast',
                    image: '/images/Indfood-3.jpg',
                    isAvailable: true,
                    vendorId: 'vendor123'
                },
                {
                    name: 'Rice Plate',
                    description: 'Steamed rice served with sambar, rasam, and curd',
                    price: 80,
                    category: 'Lunch',
                    image: '/images/Indfood-4.jpg',
                    isAvailable: true,
                    vendorId: 'vendor123'
                },
                {
                    name: 'Biryani',
                    description: 'Aromatic rice dish with spices and vegetables',
                    price: 120,
                    category: 'Lunch',
                    image: '/images/Indfood-5.jpg',
                    isAvailable: true,
                    vendorId: 'vendor123'
                }
            ];
            await FoodItem.insertMany(defaultItems);
            console.log('Default food items initialized');
        }
    } catch (error) {
        console.error('Error initializing food items:', error);
    }
};

// Initialize admin account
const initializeAdmin = async () => {
    try {
        console.log('Checking for admin account...');
        const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
        
        if (!existingAdmin) {
            console.log('No admin account found, creating default admin...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            
            const admin = new Admin({
                email: 'admin@example.com',
                password: hashedPassword
            });
            
            await admin.save();
            console.log('Default admin account created successfully');
        } else {
            console.log('Admin account already exists');
        }
    } catch (error) {
        console.error('Error initializing admin account:', error);
    }
};

// Create a single connection to the test database
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Successfully connected to MongoDB (test database)");
    // Initialize food items, admin account, and vendor account after connection is established
    return Promise.all([initializeFoodItems(), initializeAdmin(), initializeVendor()]);
})
.catch(err => {
    console.error("Database connection error:", err);
    process.exit(1);
});

// Use routes
app.use("/", router);
app.use("/api/orders", orderRoutes);
app.use("/api/food-items", foodItemRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
