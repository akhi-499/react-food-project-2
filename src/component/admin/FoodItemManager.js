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
    image: '',
    isAvailable: true,
    vendorId: '65f1a1b1c4d5e6f7a8b9c0d1e' // Using the vendorId from the logs
  });

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await axios.get('https://react-food-project-2.onrender.com/api/food-items');
      setFoodItems(response.data);
    } catch (error) {
      console.error('Error fetching food items:', error);
      toast.error('Failed to fetch food items');
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
      // Ensure image URL is absolute
      const imageUrl = formData.image.startsWith('http') 
        ? formData.image 
        : `https://react-food-project-2.onrender.com${formData.image}`;

      const updatedFormData = {
        ...formData,
        image: imageUrl
      };

      if (editingItem) {
        await axios.put(`https://react-food-project-2.onrender.com/api/food-items/${editingItem._id}`, updatedFormData);
        toast.success('Food item updated successfully');
      } else {
        await axios.post('https://react-food-project-2.onrender.com/api/food-items', updatedFormData);
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
      image: item.image,
      isAvailable: item.isAvailable,
      vendorId: item.vendorId
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await axios.delete(`https://react-food-project-2.onrender.com/api/food-items/${id}`);
        toast.success('Food item deleted successfully');
        fetchFoodItems();
      } catch (error) {
        console.error('Error deleting food item:', error);
        toast.error('Failed to delete food item');
      }
    }
  };

  const toggleAvailability = async (itemId, currentStatus) => {
    try {
      await axios.patch(`https://react-food-project-2.onrender.com/api/food-items/${itemId}/availability`, {
        isAvailable: !currentStatus
      });
      setFoodItems(items => 
        items.map(item => 
          item._id === itemId 
            ? { ...item, isAvailable: !currentStatus }
            : item
        )
      );
      toast.success('Food item availability updated successfully');
    } catch (error) {
      console.error('Error updating food item:', error);
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
      image: '',
      isAvailable: true,
      vendorId: '65f1a1b1c4d5e6f7a8b9c0d1e'
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
          <label htmlFor="image">Image URL:</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            required
            placeholder="Enter full URL or just the filename (e.g., Indfood-1.jpg)"
          />
          <small className="form-text text-muted">
            You can enter a full URL or just the filename. If you enter just the filename, it will be automatically converted to a full URL.
          </small>
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
              <img src={item.image} alt={item.name} />
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
                <button onClick={() => toggleAvailability(item._id, item.isAvailable)} className="toggle-button">
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