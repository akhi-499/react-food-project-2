import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
    cartTotalQUantity: 0,
    totalAmount: 0
};

const cartslice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addTocart(state, action) {
            // Check if item is available
            if (!action.payload.isAvailable) {
                return; // Don't add unavailable items
            }

            const itemIndex = state.cartItems.findIndex((item) => item.id === action.payload.id);
            if (itemIndex >= 0) {
                state.cartItems[itemIndex].cartQuantity += 1;
            } else {
                const tempProduct = { ...action.payload, cartQuantity: 1 };
                state.cartItems.push(tempProduct);
            }
        },
        removeCartItem(state, action) {
            const newCart = state.cartItems.filter(
                item => item.id !== action.payload.id
            );
            state.cartItems = newCart;
        },
        decreaseCart(state, action) {
            const itemIndex = state.cartItems.findIndex((item) => item.id === action.payload.id);
            if (state.cartItems[itemIndex].cartQuantity > 1) {
                state.cartItems[itemIndex].cartQuantity -= 1;
            }
        },
        clearCartItem(state) {
            state.cartItems = [];
        },
        getTotals(state) {
            let { total, quantity } = state.cartItems.reduce((cartTotal, item) => {
                const { rate, cartQuantity } = item;
                const itemTotal = rate * cartQuantity;

                cartTotal.total += itemTotal;
                cartTotal.quantity += cartQuantity;

                return cartTotal;
            }, {
                total: 0,
                quantity: 0
            });
            state.totalAmount = total;
            state.cartTotalQUantity = quantity;
        },
        // Remove unavailable items from cart
        removeUnavailableItems(state) {
            state.cartItems = state.cartItems.filter(item => item.isAvailable);
        }
    }
});

export const {
    addTocart,
    removeCartItem,
    decreaseCart,
    clearCartItem,
    getTotals,
    removeUnavailableItems
} = cartslice.actions;

export default cartslice.reducer;