import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, getLoggedInUser } from '../api/authApi';

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const res = await loginUser(credentials);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', res.data.user.role);
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (data, thunkAPI) => {
  try {
    await registerUser(data);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, thunkAPI) => {
  try {
    const res = await getLoggedInUser();
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetch profile failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Register
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state) => { state.loading = false; })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchProfile.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(fetchProfile.rejected, (state) => { state.loading = false; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
