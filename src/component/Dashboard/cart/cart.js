import React, { useState, useEffect } from "react";
import Header from "../header/header";
import '../cart/cart.css'
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Footer from "../footer/footer";
import { addTocart, clearCartItem, decreaseCart, getTotals, removeCartItem } from "./cartslice";
import { addOrder } from "../../../redux/orderSlice";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createOrder } from '../../../services/orderService';

function Cart(){
    const history=useHistory()
    const cart=useSelector((state)=>state.cart)
    const dispatch=useDispatch()
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    useEffect(()=>{
        dispatch(getTotals())
    },[cart,dispatch])
    
    function detail(id){
        history.push(`/singledish?id=${id}`)
    }
    
    function remove(ele){
        dispatch(removeCartItem(ele))
    }
    
    function decrease(cartitem){
        dispatch(decreaseCart(cartitem))
    }
    
    function increase(cartItem){
        dispatch(addTocart(cartItem))
    }
    
    function clearcart(){
        dispatch(clearCartItem())
    }
    
    async function order(){
        if (cart.cartItems.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }
        
        try {
            setIsSubmitting(true);
            
            // Get user from session storage
            const userStr = sessionStorage.getItem('user');
            if (!userStr) {
                toast.error("Please login to place an order");
                history.push('/login');
                return;
            }
            
            const userData = JSON.parse(userStr);
            if (!userData.user || !userData.user._id) {
                toast.error("Invalid user data. Please login again.");
                sessionStorage.removeItem('user');
                history.push('/login');
                return;
            }
            
            // Create order data for API
            const orderData = {
                userId: userData.user._id,
                items: cart.cartItems.map(item => ({
                    id: item.id,
                    name: item.title,
                    price: item.rate,
                    quantity: item.cartQuantity,
                    image: item.url
                })),
                totalAmount: cart.totalAmount
            };
            
            console.log('Creating order with data:', orderData);
            
            // Create order in database
            const response = await createOrder(orderData);
            console.log('Order creation response:', response);
            
            // Create a new order object for Redux store
            const newOrder = {
                _id: response.order._id,
                items: orderData.items,
                totalAmount: orderData.totalAmount,
                status: response.order.status,
                orderDate: response.order.orderDate
            };
            
            // Add the order to Redux store
            dispatch(addOrder(newOrder));
            
            // Clear the cart
            dispatch(clearCartItem());
            
            // Show success message
            toast.success("Order placed successfully!");
            
            // Redirect to My Orders page
            history.push('/my-orders');
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }
    
    return(
        <div className="cart-bg">
            <Header />
            <div className="cart"><h1 style={{padding:'10px'}}>Shopping cart</h1>
            {
                cart.cartItems.length===0 ?(
                    <div style={{marginBottom:'165px',padding:'10px'}}>
                        <p>Your cart is currently empty</p>
                        
                    </div>
                ) :(
                    <div className="cart-main">
                        <div className="cart-main-head">
                            <h3 className="cart-main-head-h3">Product</h3>
                            <h3>Price</h3>
                            <h3>Quantity</h3>
                            <h3>Total</h3>
                       </div>

                        {
                            cart.cartItems?.map(cartItems=>(
                                    <div key={cartItems.id} className="cart-main-body">

                                     <div className="cart-main-body-div">
                                        <img src={cartItems.url}   alt={cartItems.title} onClick={()=>detail(cartItems.id)} /> 
                                     <div style={{paddingLeft:'5px'}}>
                                     <h3 >{cartItems.title}</h3>
                                     <button onClick={()=>remove(cartItems)}>Delete</button>
                                     </div>
                                     </div>

                                     <div className="cart-main-body-div2"><h5>₹{cartItems.rate}</h5></div>

                                     <div className="quantity">
                                        <button onClick={()=>decrease(cartItems)}>-</button><span>{cartItems.cartQuantity}</span>
                                        <button onClick={()=>increase(cartItems)}>+</button>
                                     </div>

                                     <div className="cart-main-body-div2">
                                        <div style={{color:'green',fontSize:'23px'}}>₹{cartItems.cartQuantity*cartItems.rate} </div>
                                     </div>
                                    </div>
                            ))
                        }
                        <div style={{display:'flex',justifyContent:'space-between',width:'1100px',marginLeft:'10px'}}>
                            <div>
                               <button className="clearCart-button" onClick={()=>clearcart()}> Clear cart </button>
                            </div>
                            <div>
                                <p>Subtotal <span style={{fontSize:'12px'}}>*including all taxes*</span>: <b><span style={{fontSize:'23px'}}> ₹{cart.totalAmount}/-</span></b></p>
                               
                                <button 
                                    className="Order-button" 
                                    onClick={order}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Processing...' : 'Order'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            </div>
            <Footer />
        </div>
    )
}
export default Cart