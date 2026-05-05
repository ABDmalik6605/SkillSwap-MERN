import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi } from '../../api/index.js';

const storage =
  typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function'
    ? window.localStorage
    : null;
const tokenFromStorage = storage?.getItem('skillswap_token');

const persistToken = (token) => {
  if (!storage) return;
  if (token) {
    storage.setItem('skillswap_token', token);
  } else {
    storage.removeItem('skillswap_token');
  }
};

export const registerUser = createAsyncThunk('auth/register', async (payload) => {
  const { data } = await authApi.register(payload);
  return data;
});

export const loginUser = createAsyncThunk('auth/login', async (payload) => {
  const { data } = await authApi.login(payload);
  return data;
});

export const fetchCurrentUser = createAsyncThunk('auth/me', async () => {
  const { data } = await authApi.me();
  return data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: tokenFromStorage,
    status: 'idle'
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      persistToken(null);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        persistToken(state.token);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        persistToken(state.token);
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = { ...action.payload, id: action.payload._id };
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.token = null;
        state.user = null;
        persistToken(null);
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
