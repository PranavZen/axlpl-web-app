import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getUserData } from "../../utils/authUtils";
import { API_BASE_URL } from "../../config";

interface ServiceType {
  id: string;
  name: string;
  price: string;
  hsn_sac_value: string;
}

interface ServiceTypeState {
  serviceTypes: ServiceType[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceTypeState = {
  serviceTypes: [],
  loading: false,
  error: null,
};

export const fetchServiceTypes = createAsyncThunk(
  "serviceTypes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await axios.post(
        `${API_BASE_URL}/getServices`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Handle different response formats
      if (response.data && response.data.Services) {
        return response.data.Services;
      } else if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else {
        return rejectWithValue("Invalid response format");
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

const serviceTypeSlice = createSlice({
  name: "serviceType",
  initialState,
  reducers: {
    clearServiceTypes: (state) => {
      state.serviceTypes = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceTypes = action.payload;
      })
      .addCase(fetchServiceTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearServiceTypes } = serviceTypeSlice.actions;
export default serviceTypeSlice.reducer;
