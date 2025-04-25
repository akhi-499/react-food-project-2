import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    loading: false,
    error: null
};

const foodItemSlice = createSlice({
    name: 'foodItems',
    initialState,
    reducers: {
        setFoodItems: (state, action) => {
            state.items = action.payload;
        },
        updateFoodItemAvailability: (state, action) => {
            const { id, isAvailable } = action.payload;
            const item = state.items.find(item => item._id === id);
            if (item) {
                item.isAvailable = isAvailable;
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { setFoodItems, updateFoodItemAvailability, setLoading, setError } = foodItemSlice.actions;

export default foodItemSlice.reducer; 