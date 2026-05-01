import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { chatApi } from '../../api/index.js';

export const fetchMessages = createAsyncThunk('chat/list', async (partnerId) => {
  const { data } = await chatApi.list(partnerId);
  return { partnerId, messages: data };
});

export const sendMessageAsync = createAsyncThunk('chat/send', async (payload) => {
  const { data } = await chatApi.send(payload);
  return data;
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    byUser: {},
    activePartner: null
  },
  reducers: {
    setActivePartner(state, action) {
      state.activePartner = action.payload;
    },
    receiveSocketMessage(state, action) {
      const { partnerId, message } = action.payload;
      if (!state.byUser[partnerId]) state.byUser[partnerId] = [];
      state.byUser[partnerId].push(message);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.byUser[action.payload.partnerId] = action.payload.messages;
      })
      .addCase(sendMessageAsync.fulfilled, (state, action) => {
        const partnerId = action.payload.to;
        if (!state.byUser[partnerId]) state.byUser[partnerId] = [];
        state.byUser[partnerId].push(action.payload);
      });
  }
});

export const { setActivePartner, receiveSocketMessage } = chatSlice.actions;
export default chatSlice.reducer;
