import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getUserData } from "../../utils/authUtils";
import { API_BASE_URL } from "../../config";

interface Commodity {
  id: string;
  name: string;
  category_id: string;
}

interface CommodityState {
  commodities: Commodity[];
  loading: boolean;
  error: string | null;
}

const initialState: CommodityState = {
  commodities: [],
  loading: false,
  error: null,
};

export const fetchCommodities = createAsyncThunk(
  "commodities/fetchByCategory",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      if (!categoryId) {
        return rejectWithValue("Category ID is required");
      }

      const formData = new FormData();
      formData.append("category_id", categoryId);

      const response = await axios.post(
        `${API_BASE_URL}/getCommodity`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Handle different response formats
      if (response.status === 204 || !response.data) {
        return []; // Return empty array for no content
      }

      if (response.data && response.data.Commodity) {
        return response.data.Commodity;
      } else if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else {
        return []; // Return empty array for unexpected format
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

const commoditySlice = createSlice({
  name: "commodity",
  initialState,
  reducers: {
    clearCommodities: (state) => {
      state.commodities = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommodities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommodities.fulfilled, (state, action) => {
        state.loading = false;
        state.commodities = action.payload;
      })
      .addCase(fetchCommodities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCommodities } = commoditySlice.actions;
export default commoditySlice.reducer;
