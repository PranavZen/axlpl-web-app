import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import shipmentReducer from "./slices/shipmentSlice";
import activeShipmentReducer from "./slices/activeShipmentSlice";
import addressReducer from "./slices/addressSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shipment: shipmentReducer,
    activeShipment: activeShipmentReducer,
    address: addressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
