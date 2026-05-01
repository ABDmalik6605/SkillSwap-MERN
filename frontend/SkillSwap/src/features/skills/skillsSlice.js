import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { skillsApi } from '../../api/index.js';

export const fetchSkills = createAsyncThunk('skills/list', async () => {
  const { data } = await skillsApi.list();
  return data;
});

const skillsSlice = createSlice({
  name: 'skills',
  initialState: {
    items: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSkills.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  }
});

export default skillsSlice.reducer;
