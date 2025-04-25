const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require('dotenv').config();

const app = express();
app.use(cors({ 
    origin: "*",  // Allow all origins for now
    credentials: true 
}));
app.use(express.json());

// Connect to MongoDB with detailed error logging
console.log("Attempting to connect to MongoDB...");

if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
}

// Create a single connection to the test database
const dbConnection = mongoose.createConnection(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Handle database connection
dbConnection.on('connected', () => {
    console.log("Successfully connected to MongoDB (test database)");
});

dbConnection.on('error', (err) => {
    console.error("Database connection error:", err);
});

// Define User Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed password
});

const User = dbConnection.model("User", userSchema);

// Define Admin Schema
const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed password
});

const Admin = dbConnection.model("Admin", adminSchema);

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
const orderRoutes = require('./routes/orderRoutes')(dbConnection);
const foodItemRoutes = require('./routes/foodItemRoutes')(dbConnection);

// Initialize food items
const initializeFoodItems = async () => {
    try {
        const FoodItem = dbConnection.model('FoodItem', require('./models/FoodItem'));
        const existingItems = await FoodItem.find();
        
        if (existingItems.length === 0) {
            const foodItems = [
                {
                    name: 'Idly',
                    description: 'Soft and fluffy steamed rice cakes, a perfect healthy South Indian breakfast.',
                    price: 50,
                    image: '/src/component/Dashboard/image/Indfood-1.jpg',
                    category: 'Breakfast',
                    isAvailable: true,
                    vendorId: '65f1a1b1c4d5e6f7g8h9i0j1'
                },
                {
                    name: 'Dosa',
                    description: 'Crispy and golden rice crepe, served with chutney and sambar for a flavorful bite.',
                    price: 100,
                    image: '/src/component/Dashboard/image/Indfood-2.jpg',
                    category: 'Breakfast',
                    isAvailable: true,
                    vendorId: '65f1a1b1c4d5e6f7g8h9i0j1'
                },
                {
                    name: 'Puri',
                    description: 'Deep-fried, puffy Indian bread, best enjoyed with potato curry or chickpea masala.',
                    price: 100,
                    image: '/src/component/Dashboard/image/Indfood-3.jpg',
                    category: 'Breakfast',
                    isAvailable: true,
                    vendorId: '65f1a1b1c4d5e6f7g8h9i0j1'
                },
                {
                    name: 'Upma',
                    description: 'A warm and savory semolina dish, cooked with vegetables and spices for a comforting meal.',
                    price: 100,
                    image: '/src/component/Dashboard/image/Indfood-4.jpg',
                    category: 'Breakfast',
                    isAvailable: true,
                    vendorId: '65f1a1b1c4d5e6f7g8h9i0j1'
                },
                {
                    name: 'Dal Rice',
                    description: 'A comforting combination of lentil curry and steamed rice, packed with flavor and nutrition.',
                    price: 100,
                    image: '/src/component/Dashboard/image/dal_rice.png',
                    category: 'Lunch',
                    isAvailable: true,
                    vendorId: '65f1a1b1c4d5e6f7g8h9i0j1'
                },
                {
                    name: 'Fried Rice',
                    description: 'A delicious stir-fried rice dish with veggies, spices, and aromatic seasonings.',
                    price: 150,
                    image: '/src/component/Dashboard/image/fried_rice.jpg',
                    category: 'Lunch',
                    isAvailable: true,
                    vendorId: '65f1a1b1c4d5e6f7g8h9i0j1'
                },
                {
                    name: 'Roti Sabji',
                    description: 'Soft whole wheat flatbread served with a flavorful vegetable curry.',
                    price: 100,
                    image: '/src/component/Dashboard/image/roti_sabji.jpeg',
                    category: 'Lunch',
                    isAvailable: true,
                    vendorId: '65f1a1b1c4d5e6f7g8h9i0j1'
                },
                {
                    name: 'Pulav',
                    description: 'Fragrant and mildly spiced rice cooked with vegetables and aromatic spices.',
                    price: 175,
                    image: '/src/component/Dashboard/image/pulao.jpg',
                    category: 'Lunch',
                    isAvailable: true,
                    vendorId: '65f1a1b1c4d5e6f7g8h9i0j1'
                }
            ];
            
            await FoodItem.insertMany(foodItems);
            console.log('Food items initialized successfully');
        } else {
            console.log('Food items already exist in the database');
        }
    } catch (error) {
        console.error('Error initializing food items:', error);
    }
};

// Call initializeFoodItems after database connection is established
dbConnection.once('open', () => {
    console.log('Connected to MongoDB');
    initializeFoodItems();
});

// Use routes
app.use("/", router);
app.use("/api/orders", orderRoutes);
app.use("/api/food-items", foodItemRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
