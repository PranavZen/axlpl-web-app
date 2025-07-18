import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getUserData } from "../../utils/authUtils";
import { API_BASE_URL } from "../../config";

interface Shipment {
  shipment_id: string;
  shipment_status: string;
  [key: string]: any;
}

interface ShipmentState {
  shipments: Shipment[];
  loading: boolean;
  error: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
}

const initialState: ShipmentState = {
  shipments: [],
  loading: false,
  error: null,
  deleteLoading: false,
  deleteError: null,
};

export const fetchAllShipments = createAsyncThunk(
    "shipments/fetchAll",
    async (shipment_status: string | undefined, { rejectWithValue }) => {
      try {
        const userData = getUserData();
        const token = userData?.Customerdetail?.token;
        const user_id = userData?.Customerdetail?.id;
        const next_id = sessionStorage.getItem("next_id") || "0";

        const formData = new FormData();
        formData.append("shipment_id", "");
        formData.append("sender_company_name", "");
        formData.append("receiver_company_name", "");
        formData.append("origin", "");
        formData.append("destination", "");
        formData.append("sender_areaname", "");
        formData.append("receiver_areaname", "");
        formData.append("sender_gst_no", "");
        formData.append("shipment_status", shipment_status || "");
        formData.append("receiver_gst_no", "");
        formData.append("user_id", user_id);
        formData.append("next_id", next_id);
        

        const response = await axios.post(
          `${API_BASE_URL}/shipmentactivelist`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const shipmentData = response?.data?.shipment?.[0]?.shipmentData;
        return Array.isArray(shipmentData) ? shipmentData : [];
      } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || error.message);
      }
    }
  );

// New action specifically for fetching all shipments for charts (tries multiple statuses)
export const fetchAllShipmentsForCharts = createAsyncThunk(
    "shipments/fetchAllForCharts",
    async (_, { rejectWithValue }) => {
      try {
        const userData = getUserData();
        const token = userData?.Customerdetail?.token;
        const user_id = userData?.Customerdetail?.id;
        const next_id = sessionStorage.getItem("next_id") || "0";

        // Try different approaches to get all shipments
        const statusesToTry = [
          "", // Empty string
          "all", // Try "all" keyword
          "pending", // Try specific statuses
          "approved",
          "hold",
          "delivered",
          "cancelled"
        ];

        let allShipments: any[] = [];
        let bestResult: any[] = [];

        // Try each status to see which gives us the most comprehensive data
        for (const status of statusesToTry) {
          try {
            const formData = new FormData();
            formData.append("shipment_id", "");
            formData.append("sender_company_name", "");
            formData.append("receiver_company_name", "");
            formData.append("origin", "");
            formData.append("destination", "");
            formData.append("sender_areaname", "");
            formData.append("receiver_areaname", "");
            formData.append("sender_gst_no", "");
            formData.append("shipment_status", status);
            formData.append("receiver_gst_no", "");
            formData.append("user_id", user_id);
            formData.append("next_id", next_id);

            const response = await axios.post(
              `${API_BASE_URL}/shipmentactivelist`,
              formData,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const shipmentData = response?.data?.shipment?.[0]?.shipmentData;
            if (Array.isArray(shipmentData) && shipmentData.length > 0) {
              // If this result has more shipments than our current best, use it
              if (shipmentData.length > bestResult.length) {
                bestResult = shipmentData;
              }
              
              // If this is empty string or "all", and we got data, use it immediately
              if ((status === "" || status === "all") && shipmentData.length > 0) {
                allShipments = shipmentData;
                break;
              }
            }
          } catch (error) {
            console.warn(`Failed to fetch with status "${status}":`, error);
          }
        }

        // Use the best result we found
        const finalResult = allShipments.length > 0 ? allShipments : bestResult;
        
        console.log(`📊 Fetched ${finalResult.length} shipments for charts`);
        return finalResult;
      } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || error.message);
      }
    }
  );

export const deleteShipment = createAsyncThunk(
  "shipments/delete",
  async (shipment_id: string, { rejectWithValue }) => {
    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;

      const formData = new FormData();
      formData.append("shipment_id", shipment_id);

      const response = await axios.post(
        "https://new.axlpl.com/messenger/services_v6/delete_shipment",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return { shipment_id, response: response.data };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

const activeShipmentSlice = createSlice({
  name: "activeShipment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllShipments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.shipments = [];
      })
      .addCase(fetchAllShipments.fulfilled, (state, action) => {
        state.loading = false;
        state.shipments = action.payload;
      })
      .addCase(fetchAllShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // New action for fetching all shipments for charts
      .addCase(fetchAllShipmentsForCharts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllShipmentsForCharts.fulfilled, (state, action) => {
        state.loading = false;
        state.shipments = action.payload;
      })
      .addCase(fetchAllShipmentsForCharts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteShipment.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteShipment.fulfilled, (state, action) => {
        state.deleteLoading = false;
        // Remove the deleted shipment from the state
        state.shipments = state.shipments.filter(
          shipment => shipment.shipment_id !== action.payload.shipment_id
        );
      })
      .addCase(deleteShipment.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload as string;
      });
  },
});

export default activeShipmentSlice.reducer;
