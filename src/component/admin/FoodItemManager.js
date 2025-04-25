import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './FoodItemManager.css';

const FoodItemManager = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Breakfast',
    isAvailable: true,
    vendorId: 'vendor123'
  });

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await axios.get('https://react-food-project-2.onrender.com/api/food-items');
      setFoodItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching food items:', error);
      toast.error('Failed to load food items');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://react-food-project-2.onrender.com/api/food-items',
        formData
      );
      toast.success('Food item added successfully!');
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Breakfast',
        isAvailable: true,
        vendorId: 'vendor123'
      });
      fetchFoodItems();
    } catch (error) {
      console.error('Error adding food item:', error);
      toast.error('Failed to add food item');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://react-food-project-2.onrender.com/api/food-items/${id}`);
      toast.success('Food item deleted successfully!');
      fetchFoodItems();
    } catch (error) {
      console.error('Error deleting food item:', error);
      toast.error('Failed to delete food item');
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      await axios.patch(`https://react-food-project-2.onrender.com/api/food-items/${id}`, {
        isAvailable: !currentStatus,
      });
      toast.success('Food item availability updated!');
      fetchFoodItems();
    } catch (error) {
      console.error('Error updating food item:', error);
      toast.error('Failed to update food item availability');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="food-item-manager">
      <h2>Manage Food Items</h2>
      <form onSubmit={handleSubmit} className="food-item-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <select name="category" value={formData.category} onChange={handleInputChange}>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
          </select>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleInputChange}
            />
            Available
          </label>
        </div>
        <button type="submit">Add Food Item</button>
      </form>

      <div className="food-items-list">
        <h3>Current Food Items</h3>
        {foodItems.map((item) => (
          <div key={item._id} className="food-item-card">
            <div className="food-item-info">
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <p>Price: ₹{item.price}</p>
              <p>Category: {item.category}</p>
              <p>Status: {item.isAvailable ? "Available" : "Unavailable"}</p>
            </div>
            <div className="food-item-actions">
              <button
                onClick={() => handleToggleAvailability(item._id, item.isAvailable)}
                className={item.isAvailable ? "unavailable" : "available"}
              >
                {item.isAvailable ? "Mark Unavailable" : "Mark Available"}
              </button>
              <button onClick={() => handleDelete(item._id)} className="delete">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodItemManager; 