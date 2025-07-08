// src/redux/slices/addressSubmitSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const submitNewAddress = createAsyncThunk(
  'addressSubmit/submitNewAddress',
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://new.axlpl.com/messenger/services_v6/add_customer_save_address',
        formData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const addressSubmitSlice = createSlice({
  name: 'addressSubmit',
  initialState: {
    loading: false,
    success: false,
    error: null as string | null,
  },
  reducers: {
    resetAddressSubmitState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitNewAddress.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitNewAddress.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(submitNewAddress.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAddressSubmitState } = addressSubmitSlice.actions;
export default addressSubmitSlice.reducer;
