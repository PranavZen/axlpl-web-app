import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setUserData, clearUserData, getUserData } from "../../utils/authUtils";
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


          // Check if the user has the role "messenger"
          // Try different paths to find the role
          const userRole = (
            response.data?.Customerdetail?.role ||
            response.data?.customerdetail?.role ||
            response.data?.user?.role ||
            response.data?.role ||
            ''
          ).toString().toLowerCase();

          // Check for variations of "messenger"
          if (userRole === "messenger" || userRole === "messanger" || userRole.includes("mess")) {
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

// Async thunk for logout API call
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Get user data from session storage
      const userData = JSON.parse(sessionStorage.getItem('user') || '{}');

      // Extract m_id, role, and token from user data
      const m_id = userData?.Customerdetail?.id || userData?.id || '';
      const role = userData?.Customerdetail?.role || userData?.role || '';
      const token = userData?.Customerdetail?.token || userData?.token || '';



      // Check if we have required data
      if (!m_id || !role) {
        return rejectWithValue("Missing user ID or role for logout");
      }

      if (!token) {
        return rejectWithValue("Missing authentication token");
      }

      // Create FormData for the logout API
      const formData = new FormData();
      formData.append("m_id", m_id);
      formData.append("role", role);



      // Call the logout API with authentication token
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL || 'https://new.axlpl.com/messenger/services_v6'}/logout`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`, // Add authentication token
          },
        }
      );



      // Check if logout was successful
      if (response.data.status === "success") {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "Logout failed");
      }
    } catch (error: any) {
      // Even if API fails, we should still log out locally
      return rejectWithValue(error.response?.data?.message || error.message || "Logout API failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Restore user data from sessionStorage
    restoreUser: (state) => {
      const userData = getUserData();
      if (userData) {
        state.user = userData;
        state.loading = false;
        state.error = null;
      }
    },
    // Synchronous logout (for immediate local logout)
    logoutLocal: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
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
      })
      // Logout API cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = null;
        // Clear user data from session storage
        clearUserData();
        // Toast message will be shown in the component
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        // Even if API fails, we should still log out locally
        state.user = null;
        // Clear user data from session storage
        clearUserData();
        // Don't set error for logout failures - just log them
      });
  },
});

export const { restoreUser, logoutLocal } = authSlice.actions;
export default authSlice.reducer;
