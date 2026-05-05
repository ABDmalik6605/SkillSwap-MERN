import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { blogsApi } from '../../api/index.js';

export const fetchBlogs = createAsyncThunk('blogs/list', async (params) => {
  const { data } = await blogsApi.list(params);
  return data;
});

export const fetchBlog = createAsyncThunk('blogs/get', async (id) => {
  const { data } = await blogsApi.get(id);
  return data;
});

export const createBlog = createAsyncThunk('blogs/create', async (payload) => {
  const { data } = await blogsApi.create(payload);
  return data;
});

export const updateBlog = createAsyncThunk('blogs/update', async ({ id, body }) => {
  const { data } = await blogsApi.update(id, body);
  return data;
});

export const deleteBlog = createAsyncThunk('blogs/delete', async (id) => {
  await blogsApi.remove(id);
  return id;
});

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: {
    list: [],
    selected: null,
    status: 'idle',
    error: null
  },
  reducers: {
    clearSelected: (state) => { state.selected = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = 'idle';
        state.list = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message;
      })
      .addCase(fetchBlog.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.list = state.list.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
        state.selected = action.payload;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.list = state.list.filter((b) => b._id !== action.payload);
        state.selected = null;
      });
  }
});

export const { clearSelected } = blogsSlice.actions;
export default blogsSlice.reducer;
