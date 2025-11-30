import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getEmployeeDashboard, getManagerDashboard } from '../api/dashboardApi';

export const fetchEmployeeDashboard = createAsyncThunk('dashboard/fetchEmployee', async (_, thunkAPI) => {
  try {
    const res = await getEmployeeDashboard();
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetch dashboard failed');
  }
});

export const fetchManagerDashboard = createAsyncThunk('dashboard/fetchManager', async (_, thunkAPI) => {
  try {
    const res = await getManagerDashboard();
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetch dashboard failed');
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    data: {},
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeDashboard.pending, (state) => { state.loading = true; })
      .addCase(fetchEmployeeDashboard.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchEmployeeDashboard.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchManagerDashboard.pending, (state) => { state.loading = true; })
      .addCase(fetchManagerDashboard.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchManagerDashboard.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default dashboardSlice.reducer;
