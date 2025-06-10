import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getUserData } from "../../utils/authUtils";
import { API_BASE_URL } from "../../config";

interface Customer {
  id: string;
  full_name: string;
  company_name: string;
  pincode: string;
  state_name: string;
  city_name: string;
  area_name: string;
  gst_no: string;
  address1: string;
  address2: string;
  mobile_no: string;
  email: string;
  [key: string]: any;
}

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  "customers/fetchAll",
  async (params: { branch_id: string; m_id: string; next_id: string; search_query?: string }, { rejectWithValue }) => {
    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const { branch_id, m_id, next_id, search_query } = params;

      if (!branch_id || !m_id || !next_id) {
        return rejectWithValue("branch_id, m_id, and next_id are required");
      }

      // Build params object, only include search_query if it's provided
      const requestParams: any = {
        branch_id,
        m_id,
        next_id,
      };

      if (search_query && search_query.trim() !== '') {
        requestParams.search_query = search_query.trim();
      }

      console.log('🔍 Fetching customers with params:', requestParams);

      const response = await axios.get(
        `${API_BASE_URL}/getCustomers`,
        {
          params: requestParams,
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Handle different response formats
      if (response.data && response.data.status === "success") {
        if (response.data.Customers && Array.isArray(response.data.Customers)) {
          return response.data.Customers;
        } else if (response.data.customers && Array.isArray(response.data.customers)) {
          return response.data.customers;
        } else {
          return [];
        }
      } else {
        return rejectWithValue(response.data?.message || "Failed to fetch customers");
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

// New async thunk for searching customers
export const searchCustomers = createAsyncThunk(
  "customers/search",
  async (params: { branch_id: string; m_id: string; next_id: string; search_query: string }, { rejectWithValue }) => {
    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const { branch_id, m_id, next_id, search_query } = params;

      if (!branch_id || !m_id || !next_id) {
        return rejectWithValue("branch_id, m_id, and next_id are required");
      }

      if (!search_query || search_query.trim() === '') {
        return rejectWithValue("search_query is required");
      }

      console.log('🔍 Searching customers with query:', search_query);

      const response = await axios.get(
        `${API_BASE_URL}/getCustomers`,
        {
          params: {
            branch_id,
            m_id,
            next_id,
            search_query: search_query.trim(),
          },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Handle different response formats
      if (response.data && response.data.status === "success") {
        if (response.data.Customers && Array.isArray(response.data.Customers)) {
          console.log('✅ Found customers:', response.data.Customers.length);
          return response.data.Customers;
        } else if (response.data.customers && Array.isArray(response.data.customers)) {
          console.log('✅ Found customers:', response.data.customers.length);
          return response.data.customers;
        } else {
          console.log('⚠️ No customers found in response');
          return [];
        }
      } else {
        return rejectWithValue(response.data?.message || "Failed to search customers");
      }
    } catch (error: any) {
      console.error('❌ Error searching customers:', error);
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    clearCustomers: (state) => {
      state.customers = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(searchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCustomers } = customerSlice.actions;
export default customerSlice.reducer;
