import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getUserData } from "../../utils/authUtils";

interface PaymentState {
  paymentInfo: any;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  paymentInfo: null,
  loading: false,
  error: null,
};

export const fetchShipmentPaymentInformation = createAsyncThunk(
  "shipmentPayment/fetchPaymentInformation",
  async (payload: any, { rejectWithValue }) => {
    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;
      if (!token) return rejectWithValue("Authentication required");

      const formData = new FormData();
      // Required fields
      formData.append("customer_id", payload.customer_id);
      formData.append("commodity_id", payload.commodity_id);
      formData.append("category_id", payload.category_id);
      formData.append("net_weight", payload.net_weight);
      formData.append("gross_weight", payload.gross_weight);
      formData.append("payment_mode", payload.payment_mode);
      formData.append("invoice_value", payload.invoice_value);
      formData.append("insurance_by_AXLPL", payload.insurance_by_AXLPL);
      formData.append("number_of_parcel", payload.number_of_parcel);
      formData.append("sender_zipcode", payload.sender_zipcode);
      formData.append("receiver_zipcode", payload.receiver_zipcode);
      formData.append("tax", payload.tax);
      
      if (payload.insurance_by_AXLPL === "1") {
        formData.append("policy_no", payload.policy_no);
        formData.append("policy_expirydate", payload.policy_expirydate);
        formData.append("policy_value", payload.policy_value);
      } else {
        formData.append("policy_no", "0");
        formData.append("policy_expirydate", "0");
        formData.append("policy_value", "0");
      }
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL || 'https://new.axlpl.com/messenger/services_v6'}/getShipmentPaymentInformation`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data && response.data.status === "success") {
        return response.data.payment_information[0];
      } else {
        return rejectWithValue(response.data?.message || "Failed to fetch payment information");
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || "Failed to fetch payment information");
    }
  }
);

const shipmentPaymentSlice = createSlice({
  name: "shipmentPayment",
  initialState,
  reducers: {
    clearPaymentInfo: (state) => {
      state.paymentInfo = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipmentPaymentInformation.pending, (state) => {
        console.log("fetchShipmentPaymentInformation: PENDING");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShipmentPaymentInformation.fulfilled, (state, action) => {
        console.log("fetchShipmentPaymentInformation: FULFILLED", action.payload);
        state.loading = false;
        state.paymentInfo = action.payload;
        state.error = null;
      })
      .addCase(fetchShipmentPaymentInformation.rejected, (state, action) => {
        console.log("fetchShipmentPaymentInformation: REJECTED", action.payload);
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch payment information";
      });
  },
});

export const { clearPaymentInfo } = shipmentPaymentSlice.actions;
export default shipmentPaymentSlice.reducer;