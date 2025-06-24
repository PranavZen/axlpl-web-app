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
import profileReducer from "./slices/profileSlice";
import trackingReducer from "./slices/trackingSlice";
import shipmentPaymentReducer from "./slices/shipmentPaymentStore";
import { authMiddleware, securityMiddleware, rateLimitMiddleware } from "../middleware/authMiddleware";

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
    profile: profileReducer,
    tracking: trackingReducer,
    shipmentPayment: shipmentPaymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(authMiddleware, securityMiddleware, rateLimitMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
