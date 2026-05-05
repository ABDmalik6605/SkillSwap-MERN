import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient.js';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async () => {
  const { data } = await axiosClient.get('/api/notifications');
  return data;
});

export const markAsReadAsync = createAsyncThunk('notifications/markRead', async (id) => {
  const { data } = await axiosClient.patch(`/api/notifications/${id}/read`);
  return data;
});

export const markAllReadAsync = createAsyncThunk('notifications/markAllRead', async () => {
  await axiosClient.post('/api/notifications/read-all');
  return true;
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
    status: 'idle'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
      })
      .addCase(markAsReadAsync.fulfilled, (state, action) => {
        state.items = state.items.map(n => n._id === action.payload._id ? action.payload : n);
        state.unreadCount = state.items.filter(n => !n.isRead).length;
      })
      .addCase(markAllReadAsync.fulfilled, (state) => {
        state.items = state.items.map(n => ({ ...n, isRead: true }));
        state.unreadCount = 0;
      });
  }
});

export default notificationsSlice.reducer;
