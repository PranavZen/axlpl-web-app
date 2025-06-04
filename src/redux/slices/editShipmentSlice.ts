import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getUserData } from "../../utils/authUtils";
import { API_BASE_URL } from "../../config";

interface EditShipmentState {
  shipment: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: EditShipmentState = {
  shipment: null,
  loading: false,
  error: null,
};

// Async thunk for fetching shipment by ID using the existing shipmentactivelist API
export const fetchShipmentById = createAsyncThunk(
  "editShipment/fetchById",
  async (shipmentId: string, { rejectWithValue }) => {
    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;
      const user_id = userData?.Customerdetail?.id;
      const next_id = sessionStorage.getItem("next_id") || "1";

      if (!token || !user_id) {
        return rejectWithValue("Authentication required");
      }

      const formData = new FormData();
      formData.append("shipment_id", shipmentId); // Search for specific shipment
      formData.append("sender_company_name", "");
      formData.append("receiver_company_name", "");
      formData.append("origin", "");
      formData.append("destination", "");
      formData.append("sender_areaname", "");
      formData.append("receiver_areaname", "");
      formData.append("sender_gst_no", "");
      formData.append("receiver_gst_no", "");
      formData.append("user_id", user_id);
      formData.append("next_id", next_id);

      const response = await axios.post(
        `${API_BASE_URL}/shipmentactivelist`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("API Response for shipment fetch:", response.data);

      const shipmentData = response?.data?.shipment?.[0]?.shipmentData;
      const shipments = Array.isArray(shipmentData) ? shipmentData : [];

      console.log("Shipments found:", shipments.length);
      console.log("Looking for shipment ID:", shipmentId);

      // Find the specific shipment by ID
      const foundShipment = shipments.find(
        (shipment: any) => shipment.shipment_id === shipmentId
      );

      console.log("Found shipment:", foundShipment);

      if (foundShipment) {
        return foundShipment;
      } else {
        return rejectWithValue(`Shipment with ID ${shipmentId} not found in ${shipments.length} shipments`);
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

// Async thunk for updating shipment
export const updateShipment = createAsyncThunk(
  "editShipment/update",
  async ({ shipmentId, shipmentData }: { shipmentId: string; shipmentData: any }, { rejectWithValue }) => {
    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;
      const user_id = userData?.Customerdetail?.id;

      if (!token || !user_id) {
        return rejectWithValue("Authentication required");
      }

      const formData = new FormData();
      formData.append("shipment_id", shipmentId);
      formData.append("user_id", user_id);

      // Append all shipment data to formData
      Object.keys(shipmentData).forEach(key => {
        if (shipmentData[key] !== null && shipmentData[key] !== undefined) {
          formData.append(key, shipmentData[key]);
        }
      });

      const response = await axios.post(
        `${API_BASE_URL}/updateShipment`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

const editShipmentSlice = createSlice({
  name: "editShipment",
  initialState,
  reducers: {
    setShipment: (state, action) => {
      state.shipment = action.payload;
      state.error = null;
      state.loading = false;
    },
    clearShipment: (state) => {
      state.shipment = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch shipment by ID
      .addCase(fetchShipmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShipmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.shipment = action.payload;
      })
      .addCase(fetchShipmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update shipment
      .addCase(updateShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShipment.fulfilled, (state, action) => {
        state.loading = false;
        // Update the shipment data with the response
        if (action.payload && action.payload.shipment) {
          state.shipment = action.payload.shipment;
        }
      })
      .addCase(updateShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setShipment, clearShipment, clearError } = editShipmentSlice.actions;
export default editShipmentSlice.reducer;
