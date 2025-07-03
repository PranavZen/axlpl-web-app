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

// Async thunk for tracking shipment with user authorization
export const trackShipment = createAsyncThunk(
  "tracking/trackShipment",
  async (shipmentId: string, { rejectWithValue }) => {
    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;
      const userId = userData?.Customerdetail?.id;

      if (!token) {
        return rejectWithValue(
          "Authentication required. Please log in to track your shipments."
        );
      }

      if (!userId) {
        return rejectWithValue(
          "User information not found. Please log in again."
        );
      }

      const formData = new FormData();
      formData.append("shipment_id", shipmentId);
      formData.append("user_id", userId); // Add user ID for server-side validation

      const response = await axios.post(`${API_BASE_URL}/track`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const data: TrackingResponse = response.data;

      // Handle various error scenarios
      if (data.error) {
        const errorMessage = data.message || "Failed to track shipment";

        // Check for specific authorization errors
        if (
          errorMessage.toLowerCase().includes("unauthorized") ||
          errorMessage.toLowerCase().includes("access denied") ||
          errorMessage.toLowerCase().includes("not found") ||
          errorMessage.toLowerCase().includes("invalid shipment")
        ) {
          return rejectWithValue(
            "You are not authorized to track this shipment. You can only track shipments that belong to your account."
          );
        }

        return rejectWithValue(errorMessage);
      }

      if (!data.tracking || data.tracking.length === 0) {
        return rejectWithValue(
          "No tracking data found for this shipment. Please verify the shipment ID and ensure it belongs to your account."
        );
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

      // Normalize GST and Tax fields in ShipmentDetails
      if (trackingData.ShipmentDetails) {
        // If backend uses alternate field names, map them here
        const details = trackingData.ShipmentDetails as any;
        trackingData.ShipmentDetails.gst_amount =
          details.gst_amount || details.gst || "0";
        trackingData.ShipmentDetails.tax =
          details.tax || details.gst_amount || details.gst || "0";
      }

      // STRICT SECURITY: Validate shipment ownership - Users can ONLY track their own shipments
      if (trackingData.ShipmentDetails) {
        const shipmentUserId =
          trackingData.ShipmentDetails.user_id ||
          trackingData.ShipmentDetails.customer_id ||
          trackingData.ShipmentDetails.sender_id ||
          trackingData.ShipmentDetails.cust_id; // Using cust_id from the interface

        // CRITICAL SECURITY CHECK: Ensure shipment belongs to current user
        if (
          !shipmentUserId ||
          shipmentUserId.toString() !== userId.toString()
        ) {
          // Log security violation attempt
          console.warn(
            `SECURITY VIOLATION: User ${userId} attempted to access shipment ${shipmentId} owned by ${
              shipmentUserId || "unknown"
            }`
          );

          // Log the security event for audit
          const securityEvent = {
            type: "UNAUTHORIZED_SHIPMENT_ACCESS",
            userId: userId,
            attemptedShipmentId: shipmentId,
            shipmentOwnerId: shipmentUserId || "unknown",
            timestamp: new Date().toISOString(),
            userAgent:
              typeof navigator !== "undefined"
                ? navigator.userAgent
                : "unknown",
          };
          console.error("[SECURITY AUDIT]", securityEvent);

          return rejectWithValue(
            "UNAUTHORIZED ACCESS: You can only track shipments that belong to your account. This security violation has been logged for audit purposes."
          );
        }
      } else {
        // If no shipment details, deny access - this is suspicious
        console.warn(
          `SECURITY WARNING: No shipment details found for shipment ${shipmentId} requested by user ${userId}`
        );
        return rejectWithValue(
          "Access denied. Unable to verify shipment ownership. Please ensure the shipment ID is correct and belongs to your account."
        );
      }

      // ADDITIONAL SECURITY: Cross-validate with customer ID if available
      if (
        trackingData.ShipmentDetails.cust_id &&
        trackingData.ShipmentDetails.cust_id.toString() !== userId.toString()
      ) {
        console.warn(
          `SECURITY VIOLATION: Customer ID mismatch for user ${userId} accessing shipment ${shipmentId}`
        );
        return rejectWithValue(
          "UNAUTHORIZED ACCESS: Customer verification failed. This shipment does not belong to your account."
        );
      }

      return { trackingData, shipmentId, userId };
    } catch (error: any) {
      // Handle specific HTTP error codes
      const errorData = error?.response?.data;

      if (error?.response?.status === 400 && errorData?.tracking) {
        // Pass raw JSON string to allow parsing later
        return rejectWithValue(JSON.stringify(errorData));
      }

      if (error?.response?.status === 401) {
        return rejectWithValue(
          "Your session has expired. Please log in again to track your shipments."
        );
      }

      if (error?.response?.status === 403) {
        return rejectWithValue(
          "You are not authorized to track this shipment. You can only track shipments that belong to your account."
        );
      }

      if (error?.response?.status === 404) {
        return rejectWithValue(
          "Shipment not found or you don't have permission to access it."
        );
      }

      return rejectWithValue(
        errorData?.message ||
          error.message ||
          "Failed to track shipment. Please try again."
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
