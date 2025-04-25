import React, { useEffect, useState } from "react";
import '../categories.css';
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addTocart } from "../../../cart/cartslice";
import '../../../header/header.css';
import Food from "../../../../../data/foodimage";

function Indianfood(){
    const dispatch = useDispatch();
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    let history = useHistory();
    
    useEffect(() => {
        loadFoodItems();
    }, []);

    const loadFoodItems = () => {
        try {
            // Filter breakfast items from static data
            const breakfastItems = Food.filter(item => item.titlename === 'Breakfast');
            setFoodItems(breakfastItems);
        } catch (error) {
            console.error('Error loading food items:', error);
        } finally {
            setLoading(false);
        }
    };
    
    function AddtoCart(item){
        dispatch(addTocart({
            id: item.id,
            title: item.title,
            rate: item.rate,
            url: item.url,
            quantity: item.quantity,
            isAvailable: true
        }));
    }

    function detail(id){
        history.push(`/singledish?id=${id}`);
    }

    function Alldish(titleId){
        history.push(`/alldish?id=${titleId}`);
    }

    function order(){
        history.push('/cart');
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return(
        <div className="indi-css">
            <h3>Breakfast</h3>
            <div className="main-image">
                <div className="card-image">
                    {  
                        foodItems.map((item) => (
                            <div key={item.id} className='Perslide'>
                                <img src={item.url} alt={item.title} onClick={() => detail(item.id)} />
                                <p>{item.title} [{item.quantity}]</p>
                                <span style={{display:'block'}}>₹{item.rate}</span>
                                <button className="slide-cart-button" onClick={order}>Order</button>
                                <button 
                                    className="slide-cart-button" 
                                    onClick={() => AddtoCart(item)}
                                >
                                    +Add toCart
                                </button>
                            </div>
                        ))
                    }
                    <button onClick={() => Alldish(1)} className='imsa'>See more</button>
                </div>
            </div>
        </div>
    );
}

export default Indianfood;