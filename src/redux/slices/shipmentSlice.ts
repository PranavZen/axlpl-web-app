import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getUserData } from "../../utils/authUtils";
import { API_BASE_URL } from "../../config";

/**
 * Helper function to safely extract value from form field
 * Handles both string values and object values with .value property
 */
const getFieldValue = (field: any, defaultValue: string = ""): string => {
  if (field === null || field === undefined) {
    return defaultValue;
  }

  if (typeof field === 'object' && field.value !== undefined) {
    return String(field.value);
  }

  return String(field);
};

/**
 * Helper function to convert boolean or string boolean to "1" or "0"
 */
const getBooleanValue = (value: any): string => {
  return (value === true || value === "true" || value === "1") ? "1" : "0";
};

interface ShipmentState {
  formData: any;
  submitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
  submittedShipmentId: string | null;
}

const initialState: ShipmentState = {
  formData: {},
  submitting: false,
  submitError: null,
  submitSuccess: false,
  submittedShipmentId: null,
};

// Async thunk for submitting shipment
export const submitShipment = createAsyncThunk(
  "shipment/submit",
  async (formValues: any, { rejectWithValue }) => {
    console.log("🔄 submitShipment thunk called with form values:");
    console.log("📋 Raw form values:", JSON.stringify(formValues, null, 2));

    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;
      const userId = userData?.Customerdetail?.id;

      console.log("🔐 Auth check - Token:", !!token, "UserId:", userId);

      if (!token || !userId) {
        console.log("❌ Authentication failed");
        return rejectWithValue("Authentication required");
      }

      console.log("🔄 Building dynamic FormData from form values...");

      // Transform form data to match API requirements dynamically
      const formData = new FormData();

      // Dynamic shipment details from form values
      formData.append("customer_id", String(userId)); // Use logged-in user ID
      formData.append("category_id", getFieldValue(formValues.category));

      // Handle commodity - extract product IDs from selected commodities
      const commodityIds = Array.isArray(formValues.commodity)
        ? formValues.commodity.map((item: any) => getFieldValue(item)).join(",")
        : getFieldValue(formValues.commodity);
      formData.append("product_id", commodityIds);

      formData.append("net_weight", getFieldValue(formValues.netWeight));
      formData.append("gross_weight", getFieldValue(formValues.grossWeight));
      formData.append("payment_mode", getFieldValue(formValues.paymentMode));
      formData.append("service_id", getFieldValue(formValues.serviceType));
      formData.append("invoice_value", getFieldValue(formValues.invoiceValue));

      // Insurance handling
      formData.append("axlpl_insurance", getBooleanValue(formValues.insurance));
      formData.append("policy_no", getFieldValue(formValues.policyNumber));
      formData.append("exp_date", getFieldValue(formValues.expiryDate));
      formData.append("insurance_value", getFieldValue(formValues.insuranceValue));

      formData.append("remark", getFieldValue(formValues.remark));

      // Bill to handling - convert to numeric value
      const billToValue = formValues.billTo === "sender" ? "1" : "2";
      formData.append("bill_to", billToValue);

      formData.append("number_of_parcel", getFieldValue(formValues.numberOfParcel, "1"));
      formData.append("additional_axlpl_insurance", "0.00");
      formData.append("shipment_status", "Pending");
      formData.append("calculation_status", "custom");
      formData.append("added_by", String(userId));
      formData.append("added_by_type", "1");
      formData.append("pre_alert_shipment", "0");
      formData.append("shipment_invoice_no", "1");
      formData.append("is_amt_edited_by_user", "0");
      formData.append("shipment_id", "");

      // Sender details - dynamic values from form
      formData.append("sender_name", getFieldValue(formValues.senderName));
      formData.append("sender_company_name", getFieldValue(formValues.senderCompanyName));
      formData.append("sender_country", "1"); // Default to India (1)
      formData.append("sender_state", getFieldValue(formValues.senderState));
      formData.append("sender_city", getFieldValue(formValues.senderCity));
      formData.append("sender_area", getFieldValue(formValues.senderArea));
      formData.append("sender_pincode", getFieldValue(formValues.senderZipCode));
      formData.append("sender_address1", getFieldValue(formValues.senderAddressLine1));
      formData.append("sender_address2", getFieldValue(formValues.senderAddressLine2));
      formData.append("sender_mobile", getFieldValue(formValues.senderMobile));
      formData.append("sender_email", getFieldValue(formValues.senderEmail));

      // Handle address saving preference
      formData.append("sender_save_address", getBooleanValue(formValues.senderSaveAddress));

      // Determine if this is a new address or existing one
      const isNewSenderAddress = formValues.senderAddressType === "new" ? "1" : "0";
      formData.append("sender_is_new_sender_address", isNewSenderAddress);

      formData.append("sender_gst_no", getFieldValue(formValues.senderGstNo));
      formData.append("sender_customer_id", getFieldValue(formValues.senderCustomerId, String(userId)));

      // Receiver details - dynamic values from form
      formData.append("receiver_name", getFieldValue(formValues.receiverName));
      formData.append("receiver_company_name", getFieldValue(formValues.receiverCompanyName));
      formData.append("receiver_country", "1"); // Default to India (1)
      formData.append("receiver_state", getFieldValue(formValues.receiverState));
      formData.append("receiver_city", getFieldValue(formValues.receiverCity));
      formData.append("receiver_area", getFieldValue(formValues.receiverArea));
      formData.append("receiver_pincode", getFieldValue(formValues.receiverZipCode));
      formData.append("receiver_address1", getFieldValue(formValues.receiverAddressLine1));
      formData.append("receiver_address2", getFieldValue(formValues.receiverAddressLine2));
      formData.append("receiver_mobile", getFieldValue(formValues.receiverMobile));
      formData.append("receiver_email", getFieldValue(formValues.receiverEmail));

      // Handle address saving preference
      formData.append("receiver_save_address", getBooleanValue(formValues.receiverSaveAddress));

      // Determine if this is a new address or existing one
      const isNewReceiverAddress = formValues.receiverAddressType === "new" ? "1" : "0";
      formData.append("receiver_is_new_receiver_address", isNewReceiverAddress);

      formData.append("receiver_gst_no", getFieldValue(formValues.receiverGstNo));
      formData.append("receiver_customer_id", getFieldValue(formValues.receiverCustomerId));

      // Different delivery address - dynamic values from form
      const isDifferentDeliveryAddress = getBooleanValue(formValues.isDifferentDeliveryAddress) === "1";
      formData.append("is_diff_add", getBooleanValue(formValues.isDifferentDeliveryAddress));

      if (isDifferentDeliveryAddress) {
        formData.append("diff_receiver_country", "1"); // Default to India (1)
        formData.append("diff_receiver_state", getFieldValue(formValues.deliveryState));
        formData.append("diff_receiver_city", getFieldValue(formValues.deliveryCity));
        formData.append("diff_receiver_area", getFieldValue(formValues.deliveryArea));
        formData.append("diff_receiver_pincode", getFieldValue(formValues.deliveryZipCode));
        formData.append("diff_receiver_address1", getFieldValue(formValues.deliveryAddressLine1));
        formData.append("diff_receiver_address2", getFieldValue(formValues.deliveryAddressLine2));
      } else {
        // Set default values for API compatibility when not using different delivery address
        formData.append("diff_receiver_country", "1");
        formData.append("diff_receiver_state", "");
        formData.append("diff_receiver_city", "");
        formData.append("diff_receiver_area", "");
        formData.append("diff_receiver_pincode", "");
        formData.append("diff_receiver_address1", "");
        formData.append("diff_receiver_address2", "");
      }

      // Charges - dynamic values from form
      formData.append("shipment_charges", getFieldValue(formValues.shipmentCharges, "0"));
      formData.append("insurance_charges", getFieldValue(formValues.insuranceCharges, "0.00"));
      formData.append("invoice_charges", getFieldValue(formValues.invoiceCharges, "0"));
      formData.append("handling_charges", getFieldValue(formValues.handlingCharges, "0.00"));
      formData.append("tax", getFieldValue(formValues.tax, "0"));
      formData.append("total_charges", getFieldValue(formValues.totalCharges, "0"));
      formData.append("grand_total", getFieldValue(formValues.grandTotal, "0"));
      formData.append("docket_no", getFieldValue(formValues.docketNo));

      // Use current date if shipment date not provided
      const currentDate = new Date().toISOString().split('T')[0];
      formData.append("shipment_date", getFieldValue(formValues.shipmentDate, currentDate));

      console.log("✅ Dynamic FormData built successfully!");
      console.log("📊 Key dynamic values extracted:");
      console.log("  - Category:", getFieldValue(formValues.category));
      console.log("  - Commodity:", commodityIds);
      console.log("  - Payment Mode:", getFieldValue(formValues.paymentMode));
      console.log("  - Service Type:", getFieldValue(formValues.serviceType));
      console.log("  - Insurance:", getBooleanValue(formValues.insurance));
      console.log("  - Sender Name:", getFieldValue(formValues.senderName));
      console.log("  - Receiver Name:", getFieldValue(formValues.receiverName));
      console.log("  - Different Delivery:", getBooleanValue(formValues.isDifferentDeliveryAddress));
      console.log("  - Grand Total:", getFieldValue(formValues.grandTotal, "0"));

      console.log("📋 Making API call to:", `${API_BASE_URL}/insertShipment`);

      // Log ALL form data for debugging
      console.log("📊 Complete FormData contents:");
      const formDataEntries = Array.from(formData.entries());
      formDataEntries.forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });

      // Try both FormData and JSON approaches
      console.log("📤 Attempting API call...");

      let response;
      try {
        // First try with FormData (like Postman form-data)
        console.log("🔄 Trying FormData approach...");
        response = await axios.post(
          `${API_BASE_URL}/insertShipment`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Let browser set Content-Type for FormData
            }
          }
        );
        console.log("✅ FormData approach succeeded");
      } catch (formDataError: any) {
        console.log("❌ FormData approach failed:", formDataError?.response?.status);
        console.log("� FormData Error Response:", formDataError?.response?.data);

        try {
          console.log("🔄 Trying URLSearchParams approach...");

          // Convert FormData to URLSearchParams (application/x-www-form-urlencoded)
          const urlParams = new URLSearchParams();
          formDataEntries.forEach(([key, value]) => {
            urlParams.append(key, String(value));
          });

          console.log("📤 Sending URLSearchParams data");

          response = await axios.post(
            `${API_BASE_URL}/insertShipment`,
            urlParams,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
          );
          console.log("✅ URLSearchParams approach succeeded");
        } catch (urlParamsError: any) {
          console.log("❌ URLSearchParams approach failed:", urlParamsError?.response?.status);
          console.log("💥 URLSearchParams Error Response:", urlParamsError?.response?.data);
          console.log("�🔄 Trying JSON approach...");

          // Convert FormData to regular object for JSON
          const postData: Record<string, any> = {};
          formDataEntries.forEach(([key, value]) => {
            postData[key] = value;
          });

          console.log("📤 Sending JSON data:", postData);

          response = await axios.post(
            `${API_BASE_URL}/insertShipment`,
            postData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          console.log("✅ JSON approach succeeded");
        }
      }

      console.log("📥 API Response:", response.data);

      if (response.data && response.data.status === "success") {
        return {
          success: true,
          message: response.data.message || "Shipment submitted successfully",
          shipmentId: response.data.shipment_id || response.data.data?.shipment_id,
          data: response.data
        };
      } else {
        console.log("❌ API returned non-success status:", response.data);
        return rejectWithValue(response.data?.message || "Failed to submit shipment");
      }
    } catch (error: any) {
      console.log("💥 API Error:", error);
      console.log("💥 Error Response:", error?.response?.data);
      console.log("💥 Error Status:", error?.response?.status);
      return rejectWithValue(error?.response?.data?.message || error.message || "Failed to submit shipment");
    }
  }
);

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
    clearSubmitState: (state) => {
      state.submitting = false;
      state.submitError = null;
      state.submitSuccess = false;
      state.submittedShipmentId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitShipment.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
        state.submitSuccess = false;
      })
      .addCase(submitShipment.fulfilled, (state, action) => {
        state.submitting = false;
        state.submitSuccess = true;
        state.submittedShipmentId = action.payload.shipmentId;
      })
      .addCase(submitShipment.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload as string;
        state.submitSuccess = false;
      });
  },
});

export const { setFormData, resetFormData, clearSubmitState } = shipmentSlice.actions;
export default shipmentSlice.reducer;
