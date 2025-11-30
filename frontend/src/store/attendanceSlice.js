import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMyHistory, checkIn, checkOut, getTodayStatus } from '../api/attendanceApi';

export const fetchHistory = createAsyncThunk('attendance/fetchHistory', async (_, thunkAPI) => {
  try {
    const res = await getMyHistory();
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetch history failed');
  }
});

export const fetchTodayStatus = createAsyncThunk('attendance/fetchTodayStatus', async (_, thunkAPI) => {
  try {
    const res = await getTodayStatus();
    return res.data.status;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetch status failed');
  }
});

export const markCheckIn = createAsyncThunk('attendance/checkIn', async (_, thunkAPI) => {
  try {
    await checkIn();
    return 'present';
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Check-in failed');
  }
});

export const markCheckOut = createAsyncThunk('attendance/checkOut', async (_, thunkAPI) => {
  try {
    await checkOut();
    return 'checkedOut';
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Check-out failed');
  }
});

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    history: [],
    todayStatus: '',
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => { state.loading = true; })
      .addCase(fetchHistory.fulfilled, (state, action) => { state.loading = false; state.history = action.payload; })
      .addCase(fetchHistory.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchTodayStatus.fulfilled, (state, action) => { state.todayStatus = action.payload; })
      .addCase(markCheckIn.fulfilled, (state, action) => { state.todayStatus = action.payload; })
      .addCase(markCheckOut.fulfilled, (state) => { state.todayStatus = 'checkedOut'; });
  },
});

export default attendanceSlice.reducer;
