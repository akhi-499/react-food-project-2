import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminDashboard.css';

const FoodItemManager = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    isAvailable: true
  });

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/food-items');
      setFoodItems(response.data);
    } catch (error) {
      console.error('Error fetching food items:', error);
      toast.error('Failed to load food items');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.patch(`http://localhost:5000/api/food-items/${editingItem._id}`, formData);
        toast.success('Food item updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/food-items', formData);
        toast.success('Food item added successfully');
      }
      fetchFoodItems();
      resetForm();
    } catch (error) {
      console.error('Error saving food item:', error);
      toast.error('Failed to save food item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/food-items/${id}`);
        toast.success('Food item deleted successfully');
        fetchFoodItems();
      } catch (error) {
        console.error('Error deleting food item:', error);
        toast.error('Failed to delete food item');
      }
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/food-items/${id}`, {
        isAvailable: !currentStatus
      });
      toast.success('Food item availability updated');
      fetchFoodItems();
    } catch (error) {
      console.error('Error updating food item availability:', error);
      toast.error('Failed to update food item availability');
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      imageUrl: '',
      isAvailable: true
    });
  };

  if (loading) {
    return <div className="loading">Loading food items...</div>;
  }

  return (
    <div className="food-items-container">
      <h2>{editingItem ? 'Edit Food Item' : 'Add New Food Item'}</h2>
      <form onSubmit={handleSubmit} className="food-item-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="isAvailable">
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleInputChange}
            />
            Available
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">
            {editingItem ? 'Update' : 'Add'} Food Item
          </button>
          {editingItem && (
            <button type="button" onClick={resetForm} className="cancel-button">
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2>Food Items</h2>
      <div className="food-items-grid">
        {foodItems.map((item) => (
          <div key={item._id} className="food-item-card">
            <div className="food-item-image">
              <img src={item.imageUrl} alt={item.name} />
            </div>
            <div className="food-item-details">
              <h3>{item.name}</h3>
              <p className="food-item-category">{item.category}</p>
              <p className="food-item-price">₹{item.price}</p>
              <p className="food-item-description">{item.description}</p>
              <div className="food-item-status">
                <span className={`status-badge ${item.isAvailable ? 'available' : 'unavailable'}`}>
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="food-item-actions">
                <button onClick={() => handleEdit(item)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => handleToggleAvailability(item._id, item.isAvailable)} className="toggle-button">
                  {item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                </button>
                <button onClick={() => handleDelete(item._id)} className="delete-button">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodItemManager; 