import { createSlice } from '@reduxjs/toolkit';

const discoverSlice = createSlice({
  name: 'discover',
  initialState: {
    search: '',
    location: ''
  },
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    setLocation(state, action) {
      state.location = action.payload;
    }
  }
});

export const { setSearch, setLocation } = discoverSlice.actions;
export default discoverSlice.reducer;
