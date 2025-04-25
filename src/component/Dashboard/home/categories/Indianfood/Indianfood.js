import React, { useEffect, useState } from "react";
import '../categories.css';
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addTocart } from "../../../cart/cartslice";
import '../../../header/header.css';
import axios from 'axios';

function Indianfood(){
    const dispatch = useDispatch();
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    let history = useHistory();
    
    useEffect(() => {
        fetchFoodItems();
    }, []);

    const fetchFoodItems = async () => {
        try {
            const response = await axios.get('https://react-food-project-2.onrender.com/api/food-items');
            const breakfastItems = response.data.filter(item => item.category === 'Breakfast');
            setFoodItems(breakfastItems);
        } catch (error) {
            console.error('Error fetching food items:', error);
        } finally {
            setLoading(false);
        }
    };
    
    function AddtoCart(item){
        dispatch(addTocart({
            id: item._id,
            title: item.name,
            rate: item.price,
            url: item.image,
            quantity: '1 serve',
            isAvailable: item.isAvailable
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
                            <div key={item._id} className='Perslide'>
                                <img src={item.image} alt={item.name} onClick={() => detail(item._id)} />
                                <p>{item.name} [1 serve]</p>
                                <span style={{display:'block'}}>₹{item.price}</span>
                                <button className="slide-cart-button" onClick={order}>Order</button>
                                <button 
                                    className="slide-cart-button" 
                                    onClick={() => AddtoCart(item)}
                                    disabled={!item.isAvailable}
                                >
                                    {item.isAvailable ? '+Add toCart' : 'Unavailable'}
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