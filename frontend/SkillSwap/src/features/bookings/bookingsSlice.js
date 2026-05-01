import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { bookingsApi } from '../../api/index.js';

export const fetchBookings = createAsyncThunk('bookings/list', async () => {
  const { data } = await bookingsApi.list();
  return data;
});

export const createBookingAsync = createAsyncThunk('bookings/create', async (payload) => {
  const { data } = await bookingsApi.create(payload);
  return data;
});

export const completeBookingAsync = createAsyncThunk('bookings/complete', async (id) => {
  const { data } = await bookingsApi.complete(id);
  return data;
});

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    items: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(createBookingAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(completeBookingAsync.fulfilled, (state, action) => {
        state.items = state.items.map((booking) => (booking._id === action.payload._id ? action.payload : booking));
      });
  }
});

export default bookingsSlice.reducer;
