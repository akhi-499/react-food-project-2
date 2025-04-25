import { configureStore } from "@reduxjs/toolkit";
import cartslice from "../component/Dashboard/cart/cartslice";
import orderReducer from "./orderSlice";

export default configureStore({
    reducer: {
        cart: cartslice,
        orders: orderReducer
    }
});
