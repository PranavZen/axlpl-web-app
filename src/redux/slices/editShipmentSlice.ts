import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config";

export const fetchShipmentById = createAsyncThunk(
  "editShipment/fetchShipmentById",
  async (shipment_id: string, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const formData = new FormData();
      formData.append("shipment_id", String(Number(shipment_id)));
      const response = await axios.post(
        `${API_BASE_URL}/getShipmentById`,
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
      console.log("API response for getShipmentById:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateShipment = createAsyncThunk(
  "editShipment/updateShipment",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/updateShipment`,
        formData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const editShipmentSlice = createSlice({
  name: "editShipment",
  initialState: {
    shipment: null,
    loading: false,
    error: null as string | null,
    updateSuccess: false,
  },
  reducers: {
    resetUpdateSuccess(state) {
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.shipment = null;
      })
      .addCase(fetchShipmentById.fulfilled, (state, action) => {
        state.loading = false;
        // Set shipment from correct API response shape
        state.shipment = action.payload?.Shipment || null;
      })
      .addCase(fetchShipmentById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to fetch shipment";
      })
      .addCase(updateShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateShipment.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
      })
      .addCase(updateShipment.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to update shipment";
      });
  },
});

export const { resetUpdateSuccess } = editShipmentSlice.actions;
export default editShipmentSlice.reducer;
