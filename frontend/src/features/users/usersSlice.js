import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { usersApi } from '../../api/index.js';

export const fetchUsers = createAsyncThunk('users/list', async (params) => {
  const { data } = await usersApi.list(params);
  return data;
});

export const fetchProfile = createAsyncThunk('users/profile', async (id) => {
  const { data } = await usersApi.getProfile(id);
  return data;
});

export const updateProfileAsync = createAsyncThunk('users/update', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await usersApi.updateProfile(payload);
    return data;
  } catch (error) {
    console.error('usersSlice: Update profile error:', error.response?.data || error);
    return rejectWithValue(error.response?.data || { message: error.message });
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    selected: null,
    status: 'idle'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.selected = action.payload;
      });
  }
});

export default usersSlice.reducer;
