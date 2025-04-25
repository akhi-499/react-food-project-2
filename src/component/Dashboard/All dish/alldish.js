import React, { useState, useEffect } from "react";
import Footer from "../footer/footer";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../header/header";
import { addTocart } from "../cart/cartslice";
import { useDispatch, useSelector } from "react-redux";
import { getTotals } from "../cart/cartslice";
import axios from 'axios';

function Alldish() {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const [detail, setDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const cart = useSelector((state) => state.cart);
    
    useEffect(() => {
        fetchFoodItems();
    }, [location.search]);
    
    useEffect(() => {
        dispatch(getTotals());
    }, [cart, dispatch]);
    
    const fetchFoodItems = async () => {
        try {
            const query = new URLSearchParams(location.search);
            const categoryId = query.get('id');
            const response = await axios.get('https://react-food-project-2.onrender.com/api/food-items');
            const categoryItems = response.data.filter(item => {
                if (categoryId === '1') return item.category === 'Breakfast';
                if (categoryId === '2') return item.category === 'Lunch';
                return false;
            });
            setDetail(categoryItems);
        } catch (error) {
            console.error('Error fetching food items:', error);
        } finally {
            setLoading(false);
        }
    };
    
    function detailed(id) {
        history.push(`/singledish?id=${id}`);
    }
    
    function order() {
        history.push('/cart');
    }
    
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
    
    const getImageUrl = (imagePath) => {
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        return `https://react-food-project-2.onrender.com${imagePath}`;
    };
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    return (
        <div className="sfp-bg">
            <Header />
            <div className="All-dish-card">
                {detail.map((item) => (
                    <div key={item._id} className='Perslide'>
                        <img 
                            src={getImageUrl(item.image)} 
                            alt={item.name} 
                            onClick={() => detailed(item._id)}
                        />
                        <p>{item.name} [1 serve]</p>
                        <span style={{display:'block'}}>₹{item.price}</span>
                        <button 
                            className="slide-cart-button" 
                            onClick={order}
                            disabled={!item.isAvailable}
                        >
                            Order
                        </button>
                        <button 
                            className="slide-cart-button" 
                            onClick={() => AddtoCart(item)}
                            disabled={!item.isAvailable}
                        >
                            {item.isAvailable ? '+Add toCart' : 'Unavailable'}
                        </button>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default Alldish;