import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getUserData } from "../../utils/authUtils";
import { API_BASE_URL } from "../../config";
import { TrackingState, TrackingResponse, TrackingData } from "../../types";

const initialState: TrackingState = {
  trackingData: null,
  loading: false,
  error: null,
  searchedShipmentId: null,
};

// Async thunk for tracking shipment
export const trackShipment = createAsyncThunk(
  "tracking/trackShipment",
  async (shipmentId: string, { rejectWithValue }) => {
    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const formData = new FormData();
      formData.append("shipment_id", shipmentId);

      const response = await axios.post(
        `${API_BASE_URL}/track`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: TrackingResponse = response.data;

      if (data.error) {
        return rejectWithValue(data.message || "Failed to track shipment");
      }

      if (!data.tracking || data.tracking.length === 0) {
        return rejectWithValue("No tracking data found for this shipment");
      }

      // Process the tracking data to combine all sections
      const trackingData: TrackingData = {
        TrackingStatus: [],
        SenderData: undefined,
        ReceiverData: undefined,
        ShipmentDetails: undefined,
      };

      data.tracking.forEach((item) => {
        if (item.TrackingStatus) {
          trackingData.TrackingStatus = item.TrackingStatus;
        }
        if (item.SenderData) {
          trackingData.SenderData = item.SenderData;
        }
        if (item.ReceiverData) {
          trackingData.ReceiverData = item.ReceiverData;
        }
        if (item.ShipmentDetails) {
          trackingData.ShipmentDetails = item.ShipmentDetails;
        }
      });

      return { trackingData, shipmentId };
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 
        error.message || 
        "Failed to track shipment"
      );
    }
  }
);

const trackingSlice = createSlice({
  name: "tracking",
  initialState,
  reducers: {
    clearTrackingData: (state) => {
      state.trackingData = null;
      state.error = null;
      state.searchedShipmentId = null;
    },
    clearTrackingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(trackShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(trackShipment.fulfilled, (state, action) => {
        state.loading = false;
        state.trackingData = action.payload.trackingData;
        state.searchedShipmentId = action.payload.shipmentId;
        state.error = null;
      })
      .addCase(trackShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.trackingData = null;
      });
  },
});

export const { clearTrackingData, clearTrackingError } = trackingSlice.actions;
export default trackingSlice.reducer;
