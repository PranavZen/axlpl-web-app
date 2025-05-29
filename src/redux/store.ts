import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import shipmentReducer from "./slices/shipmentSlice";
import activeShipmentReducer from "./slices/activeShipmentSlice";
import addressReducer from "./slices/addressSlice";
import categoryReducer from "./slices/categorySlice";
import commodityReducer from "./slices/commoditySlice";
import paymentModeReducer from "./slices/paymentModeSlice";
import serviceTypeReducer from "./slices/serviceTypeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shipment: shipmentReducer,
    activeShipment: activeShipmentReducer,
    address: addressReducer,
    category: categoryReducer,
    commodity: commodityReducer,
    paymentMode: paymentModeReducer,
    serviceType: serviceTypeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
