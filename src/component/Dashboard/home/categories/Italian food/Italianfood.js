import React, { useEffect, useState } from "react";
import '../categories.css'
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addTocart } from "../../../cart/cartslice";
import Food from "../../../../component/foodimage";

function Italianfood(){
    const dispatch = useDispatch();
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    let history = useHistory();

    useEffect(() => {
        loadFoodItems();
    }, []);

    const loadFoodItems = () => {
        try {
            // Filter lunch items from static data
            const lunchItems = Food.filter(item => item.titlename === 'Lunch');
            setFoodItems(lunchItems);
        } catch (error) {
            console.error('Error loading food items:', error);
        } finally {
            setLoading(false);
        }
    };

    function prevImage(){
        let box=document.querySelector('.itali-card-image')
        let width = box.clientWidth;
        box.scrollLeft = box.scrollLeft - width;
    }
    function nextImage(){
        let box=document.querySelector('.itali-card-image')
        let width=box.clientWidth;
        box.scrollLeft=box.scrollLeft+width;
    }
    function detailed(id){
        history.push(`/singledish?id=${id}`)
    }
    function Alldish(titleId){
        history.push(`/alldish?id=${titleId}`)
    }
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
    function order(){
        history.push('/cart')
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return(
        <div className="indi-css">
            <h3>Lunch</h3>
            <div className="main-image">
                
        {/* <button className="leftImageArrowStyles" onClick={()=>prevImage()}> ❰❰ </button>

            <button className="rightImageArrowStyles" onClick={()=>nextImage()}> ❱❱</button> */}
        <div className="itali-card-image" >
            {
                foodItems.map((item) => (
                    <div key={item.id} className='Perslide'>
                        <img src={item.url} alt={item.title} onClick={() => detailed(item.id)}></img>
                        <p>{item.title} [{item.quantity}]</p>
                        <span style={{display:'block'}}>₹{item.rate}</span>
                        <button className="slide-cart-button" onClick={order}>Order</button>{'  '}
                        <button 
                            className="slide-cart-button" 
                            onClick={() => AddtoCart(item)}
                        >
                            +Add toCart
                        </button>
                    </div>
                ))
            }
    <button onClick={()=>Alldish(2) } className='imsa' >See more</button>
        </div>
        </div>
        </div>
    )
}
export default Italianfood