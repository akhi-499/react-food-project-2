import React, { useState, useEffect } from "react";
import Footer from "../footer/footer";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../header/header";
import { addTocart } from "../cart/cartslice";
import { useDispatch, useSelector } from "react-redux";
import { getTotals } from "../cart/cartslice";
import Food from "../../../component/foodimage";

function Alldish() {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const [detail, setDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const cart = useSelector((state) => state.cart);
    
    useEffect(() => {
        loadFoodItems();
    }, [location.search]);
    
    useEffect(() => {
        dispatch(getTotals());
    }, [cart, dispatch]);
    
    const loadFoodItems = () => {
        try {
            const query = new URLSearchParams(location.search);
            const categoryId = query.get('id');
            
            // Filter food items based on category
            let categoryItems = [];
            if (categoryId === '1') {
                categoryItems = Food.filter(item => item.titlename === 'Breakfast');
            } else if (categoryId === '2') {
                categoryItems = Food.filter(item => item.titlename === 'Lunch');
            }
            
            setDetail(categoryItems);
        } catch (error) {
            console.error('Error loading food items:', error);
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
    
    return (
        <div className="sfp-bg">
            <Header />
            <div className="All-dish-card">
                {detail.map((item) => (
                    <div key={item.id} className='Perslide'>
                        <img 
                            src={item.url} 
                            alt={item.title} 
                            onClick={() => detailed(item.id)}
                        />
                        <p>{item.title} [{item.quantity}]</p>
                        <span style={{display:'block'}}>₹{item.rate}</span>
                        <button 
                            className="slide-cart-button" 
                            onClick={order}
                        >
                            Order
                        </button>
                        <button 
                            className="slide-cart-button" 
                            onClick={() => AddtoCart(item)}
                        >
                            +Add toCart
                        </button>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default Alldish;