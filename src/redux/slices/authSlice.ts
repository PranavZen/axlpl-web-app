import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setUserData, clearUserData } from "../../utils/authUtils";
import { API_BASE_URL } from "../../config";

interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
    "auth/login",
    async ({ mobile, password, fcm_token }: { mobile: string; password: string; fcm_token: string }, { rejectWithValue }) => {
      try {
        const formData = new FormData();
        formData.append("mobile", mobile);
        formData.append("password", password);
        formData.append("fcm_token", fcm_token);

        const response = await axios.post(`${API_BASE_URL}/login`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.status === "success") {
          // Log the response data to understand its structure
          console.log('Login response data:', JSON.stringify(response.data, null, 2));

          // Check if the user has the role "messenger"
          // Try different paths to find the role
          const userRole = (
            response.data?.Customerdetail?.role ||
            response.data?.customerdetail?.role ||
            response.data?.user?.role ||
            response.data?.role ||
            ''
          ).toString().toLowerCase();

          // console.log('User role:', userRole);

          // Check for variations of "messenger"
          if (userRole === "messenger" || userRole === "messanger" || userRole.includes("mess")) {
            // console.log('Blocking messenger account');
            return rejectWithValue("Messenger accounts are not allowed to access this application. Please contact support.");
          }

          return response.data;
        } else {
          return rejectWithValue(response.data.message || "Login failed");
        }
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message || "Login failed");
      }
    }
  );

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      // Clear user data from session storage using the utility function
      clearUserData();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        // Double-check the role before storing the user data
        const userRole = (
          action.payload?.Customerdetail?.role ||
          action.payload?.customerdetail?.role ||
          action.payload?.user?.role ||
          action.payload?.role ||
          ''
        ).toString().toLowerCase();

        // If the user is a messenger, reject the login
        if (userRole === "messenger" || userRole === "messanger" || userRole.includes("mess")) {
          state.error = "Messenger accounts are not allowed to access this application. Please contact support.";
          state.user = null;
          return;
        }

        // Store user data in session storage using the utility function
        const dataStored = setUserData(action.payload);

        // Only set the user in state if the data was stored successfully
        if (dataStored) {
          state.user = action.payload;
        } else {
          // If the data was not stored (e.g., messenger account), set an error
          state.error = "Messenger accounts are not allowed to access this application. Please contact support.";
          state.user = null;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
