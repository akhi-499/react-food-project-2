import { configureStore } from "@reduxjs/toolkit";
import cartslice from "../component/Dashboard/cart/cartslice";
import orderReducer from "./orderSlice";
import foodItemReducer from "./foodItemSlice";

export default configureStore({
    reducer: {
        cart: cartslice,
        orders: orderReducer,
        foodItems: foodItemReducer
    }
});
