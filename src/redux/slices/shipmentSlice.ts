import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ShipmentState {
  formData: any;
}

const initialState: ShipmentState = {
  formData: {},
};

const shipmentSlice = createSlice({
  name: "shipment",
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<any>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetFormData: (state) => {
      state.formData = {};
    },
  },
});

export const { setFormData, resetFormData } = shipmentSlice.actions;
export default shipmentSlice.reducer;
