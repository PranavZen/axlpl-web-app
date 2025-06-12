import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import shipmentReducer from "./slices/shipmentSlice";
import activeShipmentReducer from "./slices/activeShipmentSlice";
import addressReducer from "./slices/addressSlice";
import categoryReducer from "./slices/categorySlice";
import commodityReducer from "./slices/commoditySlice";
import paymentModeReducer from "./slices/paymentModeSlice";
import serviceTypeReducer from "./slices/serviceTypeSlice";
import customerReducer from "./slices/customerSlice";
import pincodeReducer from "./slices/pincodeSlice";
import changePasswordReducer from "./slices/changePasswordSlice";

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
    customer: customerReducer,
    pincode: pincodeReducer,
    changePassword: changePasswordReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
