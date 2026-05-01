import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { reviewsApi } from '../../api/index.js';

export const fetchReviews = createAsyncThunk('reviews/list', async (userId) => {
  const { data } = await reviewsApi.list(userId);
  return data;
});

export const createReviewAsync = createAsyncThunk('reviews/create', async (payload) => {
  const { data } = await reviewsApi.create(payload);
  return data;
});

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    items: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(createReviewAsync.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  }
});

export default reviewsSlice.reducer;
