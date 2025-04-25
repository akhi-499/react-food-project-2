import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders: [],
    loading: false,
    error: null
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        addOrder: (state, action) => {
            state.orders.unshift(action.payload);
        },
        setOrders: (state, action) => {
            state.orders = action.payload;
        },
        updateOrderStatus: (state, action) => {
            const { orderId, status } = action.payload;
            const order = state.orders.find(order => order._id === orderId);
            if (order) {
                order.status = status;
            }
        },
        removeOrder: (state, action) => {
            console.log('Removing order with ID:', action.payload);
            console.log('Current orders:', state.orders);
            state.orders = state.orders.filter(order => {
                console.log('Comparing order._id:', order._id, 'with action.payload:', action.payload);
                return order._id !== action.payload;
            });
            console.log('Orders after removal:', state.orders);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { addOrder, setOrders, updateOrderStatus, removeOrder, setLoading, setError } = orderSlice.actions;

export default orderSlice.reducer; 