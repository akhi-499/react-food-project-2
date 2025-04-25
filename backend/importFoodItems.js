const mongoose = require('mongoose');
require('dotenv').config();

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

const foodItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
});

async function importFoodItems() {
    try {
        // Connect to MongoDB
        const dbConnection = mongoose.createConnection(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Create the FoodItem model
        const FoodItem = dbConnection.model('FoodItem', foodItemSchema);

        // Clear existing food items
        await FoodItem.deleteMany({});
        console.log('Cleared existing food items');

        // Insert new food items
        const result = await FoodItem.insertMany(foodItems);
        console.log(`Successfully imported ${result.length} food items`);

        // Close the connection
        await dbConnection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error importing food items:', error);
    }
}

importFoodItems(); 