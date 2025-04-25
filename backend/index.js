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

// Import routes and pass the dbConnection
const orderRoutes = require('./routes/orderRoutes')(mongoose);
const foodItemRoutes = require('./routes/foodItemRoutes')(mongoose);

// Initialize food items
const initializeFoodItems = async () => {
    try {
        console.log('Starting food items initialization...');
        const FoodItem = mongoose.model('FoodItem', require('./models/FoodItem'));
        console.log('FoodItem model created');
        
        const existingItems = await FoodItem.find();
        console.log('Existing items count:', existingItems.length);
        
        if (existingItems.length === 0) {
            console.log('No existing items found, starting insertion...');
            const vendorId = '65f1a1b1c4d5e6f7a8b9c0d1e';  // Hardcoded vendorId
            console.log('Using vendorId:', vendorId);
            
            const foodItems = [
                {
                    name: 'Idly',
                    description: 'Soft and fluffy steamed rice cakes, a perfect healthy South Indian breakfast.',
                    price: 50,
                    image: '/images/Indfood-1.jpg',
                    category: 'Breakfast',
                    isAvailable: true,
                    vendorId: vendorId
                },
                {
                    name: 'Dosa',
                    description: 'Crispy and golden rice crepe, served with chutney and sambar for a flavorful bite.',
                    price: 100,
                    image: '/images/Indfood-2.jpg',
                    category: 'Breakfast',
                    isAvailable: true,
                    vendorId: vendorId
                },
                {
                    name: 'Puri',
                    description: 'Deep-fried, puffy Indian bread, best enjoyed with potato curry or chickpea masala.',
                    price: 100,
                    image: '/images/Indfood-3.jpg',
                    category: 'Breakfast',
                    isAvailable: true,
                    vendorId: vendorId
                },
                {
                    name: 'Upma',
                    description: 'A warm and savory semolina dish, cooked with vegetables and spices for a comforting meal.',
                    price: 100,
                    image: '/images/Indfood-4.jpg',
                    category: 'Breakfast',
                    isAvailable: true,
                    vendorId: vendorId
                },
                {
                    name: 'Dal Rice',
                    description: 'A comforting combination of lentil curry and steamed rice, packed with flavor and nutrition.',
                    price: 100,
                    image: '/images/dal_rice.png',
                    category: 'Lunch',
                    isAvailable: true,
                    vendorId: vendorId
                },
                {
                    name: 'Fried Rice',
                    description: 'A delicious stir-fried rice dish with veggies, spices, and aromatic seasonings.',
                    price: 150,
                    image: '/images/fried_rice.jpg',
                    category: 'Lunch',
                    isAvailable: true,
                    vendorId: vendorId
                },
                {
                    name: 'Roti Sabji',
                    description: 'Soft whole wheat flatbread served with a flavorful vegetable curry.',
                    price: 100,
                    image: '/images/roti_sabji.jpeg',
                    category: 'Lunch',
                    isAvailable: true,
                    vendorId: vendorId
                },
                {
                    name: 'Pulav',
                    description: 'Fragrant and mildly spiced rice cooked with vegetables and aromatic spices.',
                    price: 175,
                    image: '/images/pulao.jpg',
                    category: 'Lunch',
                    isAvailable: true,
                    vendorId: vendorId
                }
            ];
            
            const result = await FoodItem.insertMany(foodItems);
            console.log('Food items initialized successfully:', result.length, 'items inserted');
        } else {
            console.log('Food items already exist in the database');
        }
    } catch (error) {
        console.error('Error initializing food items:', error);
        console.error('Error details:', error.message);
        if (error.errors) {
            console.error('Validation errors:', error.errors);
        }
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
    // Initialize food items and admin account after connection is established
    return Promise.all([initializeFoodItems(), initializeAdmin()]);
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
