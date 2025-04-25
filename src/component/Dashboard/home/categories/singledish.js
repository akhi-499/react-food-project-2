import React, { useState, useEffect } from "react";
import Footer from "../../footer/footer";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../../header/header";
import { addTocart } from "../../cart/cartslice";
import { useDispatch, useSelector } from "react-redux";
import { getTotals } from "../../cart/cartslice";
import Food from "../../../component/foodimage";

function Singledish() {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const cart = useSelector((state) => state.cart);
    
    useEffect(() => {
        loadFoodItem();
    }, [location.search]);
    
    useEffect(() => {
        dispatch(getTotals());
    }, [cart, dispatch]);
    
    const loadFoodItem = () => {
        try {
            const query = new URLSearchParams(location.search);
            const itemId = query.get('id');
            
            // Find the food item from static data
            const foodItem = Food.find(item => item.id === parseInt(itemId));
            setDetail(foodItem);
        } catch (error) {
            console.error('Error loading food item:', error);
        } finally {
            setLoading(false);
        }
    };
    
    function order() {
        history.push('/cart');
    }
    
    function AddtoCart(item) {
        dispatch(addTocart({
            id: item.id,
            title: item.title,
            rate: item.rate,
            url: item.url,
            quantity: item.quantity,
            isAvailable: true
        }));
    }
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (!detail) {
        return <div>Item not found</div>;
    }
    
    return (
        <div className="sfp-bg">
            <Header />
            <div className="single-dish-container">
                <div className="single-dish-card">
                    <img 
                        src={detail.url} 
                        alt={detail.title} 
                    />
                    <div className="single-dish-details">
                        <h2>{detail.title}</h2>
                        <p className="quantity">Quantity: {detail.quantity}</p>
                        <p className="price">₹{detail.rate}</p>
                        <p className="description">{detail.description}</p>
                        <div className="button-container">
                            <button 
                                className="order-button" 
                                onClick={order}
                            >
                                Order Now
                            </button>
                            <button 
                                className="add-to-cart-button" 
                                onClick={() => AddtoCart(detail)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Singledish;