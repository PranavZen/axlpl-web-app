import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getUserData } from "../../utils/authUtils";
import { API_BASE_URL } from "../../config";

interface PaymentMode {
  id: string;
  name: string;
}

interface PaymentModeState {
  paymentModes: PaymentMode[];
  loading: boolean;
  error: string | null;
}

const initialState: PaymentModeState = {
  paymentModes: [],
  loading: false,
  error: null,
};

export const fetchPaymentModes = createAsyncThunk(
  "paymentModes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await axios.get(
        `${API_BASE_URL}/get_payment_modes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Handle different response formats
      if (response.data && response.data.data && response.data.data.payment_modes) {
        return response.data.data.payment_modes;
      } else if (response.data && response.data.payment_modes) {
        return response.data.payment_modes;
      } else {
        return rejectWithValue("Invalid response format");
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

const paymentModeSlice = createSlice({
  name: "paymentMode",
  initialState,
  reducers: {
    clearPaymentModes: (state) => {
      state.paymentModes = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentModes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentModes.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentModes = action.payload;
      })
      .addCase(fetchPaymentModes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPaymentModes } = paymentModeSlice.actions;
export default paymentModeSlice.reducer;
