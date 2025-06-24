import { createSlice } from "@reduxjs/toolkit";
import { fetchShipmentPaymentInformation } from "./shipmentPaymentSlice";

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

const shipmentPaymentSlice = createSlice({
  name: "shipmentPayment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipmentPaymentInformation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShipmentPaymentInformation.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentInfo = action.payload;
      })
      .addCase(fetchShipmentPaymentInformation.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || null;
      });
  },
});

export default shipmentPaymentSlice.reducer;
