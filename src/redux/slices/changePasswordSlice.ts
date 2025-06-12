import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { getUserData } from "../../utils/authUtils";

interface ChangePasswordState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ChangePasswordState = {
  loading: false,
  error: null,
  success: false,
};

// Async thunk for changing password
export const changePassword = createAsyncThunk(
  "changePassword/changePassword",
  async (
    {
      id,
      old_password,
      new_password,
      user_type,
    }: {
      id: string;
      old_password: string;
      new_password: string;
      user_type: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // Get authentication token from user data
      const userData = getUserData();
      const token = userData?.Customerdetail?.token || userData?.token;

      if (!token) {
        return rejectWithValue("Authentication token not found. Please login again.");
      }

      const formData = new FormData();
      formData.append("id", id);
      formData.append("old_password", old_password);
      formData.append("new_password", new_password);
      formData.append("user_type", user_type);

      console.log('🔄 Change Password API - Sending request with token:', token ? '***' + token.slice(-4) : 'missing');

      const response = await axios.post(
        `${API_BASE_URL}/changePassword`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to change password");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred while changing password"
      );
    }
  }
);

const changePasswordSlice = createSlice({
  name: "changePassword",
  initialState,
  reducers: {
    clearChangePasswordState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { clearChangePasswordState } = changePasswordSlice.actions;

// Selectors
export const selectChangePasswordLoading = (state: any) => state.changePassword.loading;
export const selectChangePasswordError = (state: any) => state.changePassword.error;
export const selectChangePasswordSuccess = (state: any) => state.changePassword.success;

export default changePasswordSlice.reducer;
