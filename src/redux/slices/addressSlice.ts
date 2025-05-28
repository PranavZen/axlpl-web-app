import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getUserData } from "../../utils/authUtils";
import { API_BASE_URL } from "../../config";

interface Address {
  id: string;
  cust_id: string;
  name: string;
  company_name: string;
  country_id: string;
  country_name: string;
  state_id: string;
  state_name: string;
  city_id: string;
  city_name: string;
  area_id: string;
  area_name: string;
  zip_code: string;
  address1: string;
  address2: string;
  mobile_no: string;
  email: string;
  sender_gst_no: string;
  receiver_gst_no: string;
}

interface AddressState {
  addresses: Address[];
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  loading: false,
  error: null,
};

export const fetchAddresses = createAsyncThunk(
  "addresses/fetchAll",
  async (searchQuery: string = "", { rejectWithValue }) => {
    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;
      const cust_id = userData?.Customerdetail?.id;

      if (!token || !cust_id) {
        return rejectWithValue("Authentication required");
      }

      const formData = new FormData();
      formData.append("cust_id", cust_id);
      formData.append("search_query", searchQuery);
      formData.append("next_id", "0");

      const response = await axios.post(
        `${API_BASE_URL}/getSenderAddresses`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "success") {
        return response.data.addressData || [];
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch addresses");
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const addAddress = createAsyncThunk(
  "addresses/add",
  async (addressData: any, { rejectWithValue, dispatch }) => {
    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;
      const cust_id = userData?.Customerdetail?.id;

      if (!token || !cust_id) {
        return rejectWithValue("Authentication required");
      }

      const formData = new FormData();
      formData.append("cust_id", cust_id);

      // Append all address data to formData
      Object.keys(addressData).forEach(key => {
        formData.append(key, addressData[key]);
      });

      const response = await axios.post(
        `${API_BASE_URL}/addSenderAddress`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "success") {
        // Refresh the address list after adding
        dispatch(fetchAddresses(""));
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to add address");
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const updateAddress = createAsyncThunk(
  "addresses/update",
  async ({ id, ...addressData }: any, { rejectWithValue, dispatch }) => {
    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;
      const cust_id = userData?.Customerdetail?.id;

      if (!token || !cust_id) {
        return rejectWithValue("Authentication required");
      }

      const formData = new FormData();
      formData.append("id", id);
      formData.append("cust_id", cust_id);

      // Append all address data to formData
      Object.keys(addressData).forEach(key => {
        formData.append(key, addressData[key]);
      });

      const response = await axios.post(
        `${API_BASE_URL}/updateSenderAddress`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "success") {
        // Refresh the address list after updating
        dispatch(fetchAddresses(""));
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to update address");
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "addresses/delete",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;
      const cust_id = userData?.Customerdetail?.id;

      if (!token || !cust_id) {
        return rejectWithValue("Authentication required");
      }

      const formData = new FormData();
      formData.append("id", id);
      formData.append("cust_id", cust_id);

      const response = await axios.post(
        `${API_BASE_URL}/deleteSenderAddress`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "success") {
        // Refresh the address list after deleting
        dispatch(fetchAddresses(""));
        return id;
      } else {
        return rejectWithValue(response.data.message || "Failed to delete address");
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add address
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update address
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete address
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default addressSlice.reducer;
