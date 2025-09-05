// src/store/slices/registerCategorySlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config";

export interface ApiRegisterCategory {
  name: string;
  value: string;
}

interface RegisterCategoryState {
  categories: ApiRegisterCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: RegisterCategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchRegisterCategories = createAsyncThunk<
  ApiRegisterCategory[],
  void,
  { rejectValue: string }
>("registerCategories/fetchAll", async (_, { rejectWithValue }) => {
  try {
    // NOTE: remove double slash and match your API response keys
    const response = await axios.get(`${API_BASE_URL}/get_categories`);

    // API RESPONSE SHAPE (as you shared):
    // { status, message, categories: [{ name, value }, ...] }
    if (response.data && Array.isArray(response.data.categories)) {
      return response.data.categories as ApiRegisterCategory[];
    }
    return rejectWithValue("Invalid response format");
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || error.message);
  }
});

const registerCategorySlice = createSlice({
  name: "registerCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegisterCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchRegisterCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load categories";
      });
  },
});

export default registerCategorySlice.reducer;
