import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../header/header";
import Footer from "../../footer/footer";
import '../categories/categories.css';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { addTocart, getTotals } from "../../cart/cartslice";
import axios from 'axios';

function Singledish() {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const cart = useSelector((state) => state.cart);
    
    useEffect(() => {
        fetchFoodItem();
    }, [location.search]);
    
    useEffect(() => {
        dispatch(getTotals());
    }, [cart, dispatch]);
    
    const fetchFoodItem = async () => {
        try {
            const query = new URLSearchParams(location.search);
            const id = query.get('id');
            const response = await axios.get(`https://react-food-project-2.onrender.com/api/food-items/${id}`);
            setDetail(response.data);
        } catch (error) {
            console.error('Error fetching food item:', error);
        } finally {
            setLoading(false);
        }
    };
    
    function AddtoCart(item) {
        dispatch(addTocart({
            id: item._id,
            title: item.name,
            rate: item.price,
            url: item.image,
            quantity: '1 serve',
            isAvailable: item.isAvailable
        }));
    }
    
    function order() {
        history.push('/cart');
    }
    
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        // Remove any leading slash if present
        const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
        return `https://react-food-project-2.onrender.com/images/${cleanPath}`;
    };
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (!detail) {
        return <div>Food item not found</div>;
    }
    
    return (
        <div className="sfp-bg">
            <Header />
            <div className="sfp-main">
                <div className="sfp-first">
                    <img src={getImageUrl(detail.image)} alt={detail.name} />
                </div>
                <div className="spf-second">
                    <h1>{detail.name}</h1>
                    <h3>[1 serve]</h3>
                    <br />
                    <h1>₹{detail.price}</h1>
                    <p>
                        <span>Description:</span><br />
                        {detail.description}
                    </p>
                    <div>
                        <span>Available Only At:</span>
                        <p>9am to 9pm</p>
                    </div>
                    <br />
                    <button 
                        onClick={() => AddtoCart(detail)}
                        disabled={!detail.isAvailable}
                    >
                        {detail.isAvailable ? '+ Add to Cart' : 'Unavailable'}
                    </button>
                    <button 
                        style={{marginLeft:'20px'}} 
                        onClick={order}
                        disabled={!detail.isAvailable}
                    >
                        Order
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Singledish;