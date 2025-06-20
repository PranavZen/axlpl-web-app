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
}

const initialState: ShipmentState = {
  shipments: [],
  loading: false,
  error: null,
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
      });
  },
});

export default activeShipmentSlice.reducer;
