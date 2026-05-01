import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { creditsApi } from '../../api/index.js';

export const fetchCredits = createAsyncThunk('credits/get', async () => {
  const { data } = await creditsApi.get();
  return data;
});

export const addTransaction = createAsyncThunk('credits/add', async (payload) => {
  const { data } = await creditsApi.add(payload);
  return data;
});

const creditsSlice = createSlice({
  name: 'credits',
  initialState: {
    balance: 0,
    transactions: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCredits.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCredits.fulfilled, (state, action) => {
        state.status = 'idle';
        state.balance = action.payload.balance;
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchCredits.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
        state.balance = action.payload.balance;
      });
  }
});

export default creditsSlice.reducer;
