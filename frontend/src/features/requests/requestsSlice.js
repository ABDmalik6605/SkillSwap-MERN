import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { requestsApi } from '../../api/index.js';

export const fetchRequests = createAsyncThunk('requests/list', async () => {
  const { data } = await requestsApi.list();
  return data;
});

export const createRequestAsync = createAsyncThunk('requests/create', async (payload) => {
  const { data } = await requestsApi.create(payload);
  return data;
});

export const respondRequestAsync = createAsyncThunk('requests/respond', async ({ id, body }) => {
  const { data } = await requestsApi.respond(id, body);
  return data;
});

const requestsSlice = createSlice({
  name: 'requests',
  initialState: {
    items: [],
    status: 'idle'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(createRequestAsync.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(respondRequestAsync.fulfilled, (state, action) => {
        state.items = state.items.map((req) => (req._id === action.payload._id ? action.payload : req));
      });
  }
});

export default requestsSlice.reducer;
