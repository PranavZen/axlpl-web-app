import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getUserData } from "../../utils/authUtils";
import { API_BASE_URL } from "../../config";
import { extractLocationId } from "../../utils/locationUtils";

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
      formData.append("customer_id", getFieldValue(formValues.customerId, String(userId))); // Use form value or logged-in user ID
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

      // Insurance handling - all dynamic
      formData.append("axlpl_insurance", getBooleanValue(formValues.insurance));
      formData.append("policy_no", getFieldValue(formValues.policyNumber));
      formData.append("exp_date", getFieldValue(formValues.expiryDate));
      formData.append("insurance_value", getFieldValue(formValues.insuranceValue));

      formData.append("remark", getFieldValue(formValues.remark));

      // Bill to handling - dynamic conversion
      const billToValue = formValues.billTo === "sender" ? "1" :
                         formValues.billTo === "receiver" ? "2" :
                         getFieldValue(formValues.billTo, "1");
      formData.append("bill_to", billToValue);

      // Dynamic values with fallbacks
      formData.append("number_of_parcel", getFieldValue(formValues.numberOfParcel, "1"));
      formData.append("additional_axlpl_insurance", getFieldValue(formValues.additionalAxlplInsurance, "0.00"));
      formData.append("shipment_status", getFieldValue(formValues.shipmentStatus, "Pending"));
      formData.append("calculation_status", getFieldValue(formValues.calculationStatus, "custom"));
      formData.append("added_by", getFieldValue(formValues.addedBy, String(userId)));
      formData.append("added_by_type", getFieldValue(formValues.addedByType, "1"));
      formData.append("pre_alert_shipment", getBooleanValue(formValues.preAlertShipment || false));
      formData.append("shipment_invoice_no", getFieldValue(formValues.shipmentInvoiceNo, "1"));
      formData.append("is_amt_edited_by_user", getBooleanValue(formValues.isAmtEditedByUser || false));

      // Generate dynamic shipment ID or use provided one
      const dynamicShipmentId = getFieldValue(formValues.shipmentId) ||
                               String(Date.now() + Math.floor(Math.random() * 100000000000));
      console.log("dynamicShipmentId", dynamicShipmentId);
      formData.append("shipment_id", dynamicShipmentId);

      // Sender details - dynamic values from form
      formData.append("sender_name", getFieldValue(formValues.senderName));
      formData.append("sender_company_name", getFieldValue(formValues.senderCompanyName));
      formData.append("sender_country", getFieldValue(formValues.senderCountry, "1")); // Dynamic with India (1) as default
      formData.append("sender_state", extractLocationId(formValues.senderState, "sender_state", "state", "21")); // Default to Maharashtra ID
      formData.append("sender_city", extractLocationId(formValues.senderCity, "sender_city", "city", "817")); // Default to Mumbai ID
      formData.append("sender_area", extractLocationId(formValues.senderArea, "sender_area", "area", "1")); // Default area ID
      formData.append("sender_pincode", getFieldValue(formValues.senderZipCode));
      formData.append("sender_address1", getFieldValue(formValues.senderAddressLine1));
      formData.append("sender_address2", getFieldValue(formValues.senderAddressLine2));
      formData.append("sender_mobile", getFieldValue(formValues.senderMobile));
      formData.append("sender_email", getFieldValue(formValues.senderEmail));

      // Handle address saving preference - dynamic
      formData.append("sender_save_address", getBooleanValue(formValues.senderSaveAddress || false));

      // Determine if this is a new address or existing one - dynamic
      const isNewSenderAddress = formValues.senderAddressType === "new" ? "1" :
                                formValues.senderAddressType === "existing" ? "0" :
                                getBooleanValue(formValues.senderIsNewAddress || false);
      formData.append("sender_is_new_sender_address", isNewSenderAddress);

      formData.append("sender_gst_no", getFieldValue(formValues.senderGstNo));
      formData.append("sender_customer_id", getFieldValue(formValues.senderCustomerId, String(userId)));

      // Receiver details - dynamic values from form
      formData.append("receiver_name", getFieldValue(formValues.receiverName));
      formData.append("receiver_company_name", getFieldValue(formValues.receiverCompanyName));
      formData.append("receiver_country", getFieldValue(formValues.receiverCountry, "1")); // Dynamic with India (1) as default
      formData.append("receiver_state", extractLocationId(formValues.receiverState, "receiver_state", "state", "21")); // Default to Maharashtra ID
      formData.append("receiver_city", extractLocationId(formValues.receiverCity, "receiver_city", "city", "817")); // Default to Mumbai ID
      formData.append("receiver_area", extractLocationId(formValues.receiverArea, "receiver_area", "area", "1")); // Default area ID
      formData.append("receiver_pincode", getFieldValue(formValues.receiverZipCode));
      formData.append("receiver_address1", getFieldValue(formValues.receiverAddressLine1));
      formData.append("receiver_address2", getFieldValue(formValues.receiverAddressLine2));
      formData.append("receiver_mobile", getFieldValue(formValues.receiverMobile));
      formData.append("receiver_email", getFieldValue(formValues.receiverEmail));

      // Handle address saving preference - dynamic
      formData.append("receiver_save_address", getBooleanValue(formValues.receiverSaveAddress || false));

      // Determine if this is a new address or existing one - dynamic
      const isNewReceiverAddress = formValues.receiverAddressType === "new" ? "1" :
                                  formValues.receiverAddressType === "existing" ? "0" :
                                  getBooleanValue(formValues.receiverIsNewAddress || false);
      formData.append("receiver_is_new_receiver_address", isNewReceiverAddress);

      formData.append("receiver_gst_no", getFieldValue(formValues.receiverGstNo));
      formData.append("receiver_customer_id", getFieldValue(formValues.receiverCustomerId));

      // Different delivery address - dynamic values from form
      const isDifferentDeliveryAddress = getBooleanValue(formValues.isDifferentDeliveryAddress) === "1";
      formData.append("is_diff_add", getBooleanValue(formValues.isDifferentDeliveryAddress));

      if (isDifferentDeliveryAddress) {
        formData.append("diff_receiver_country", getFieldValue(formValues.deliveryCountry, "1")); // Dynamic with India (1) as default
        formData.append("diff_receiver_state", extractLocationId(formValues.deliveryState, "diff_receiver_state", "state", "21")); // Default to Maharashtra ID
        formData.append("diff_receiver_city", extractLocationId(formValues.deliveryCity, "diff_receiver_city", "city", "817")); // Default to Mumbai ID
        formData.append("diff_receiver_area", extractLocationId(formValues.deliveryArea, "diff_receiver_area", "area", "1")); // Default area ID
        formData.append("diff_receiver_pincode", getFieldValue(formValues.deliveryZipCode));
        formData.append("diff_receiver_address1", getFieldValue(formValues.deliveryAddressLine1));
        formData.append("diff_receiver_address2", getFieldValue(formValues.deliveryAddressLine2));
      } else {
        // Set dynamic default values for API compatibility when not using different delivery address
        formData.append("diff_receiver_country", getFieldValue(formValues.deliveryCountry, "1"));
        formData.append("diff_receiver_state", extractLocationId(formValues.deliveryState, "diff_receiver_state", "state", "21")); // Default to Maharashtra ID
        formData.append("diff_receiver_city", extractLocationId(formValues.deliveryCity, "diff_receiver_city", "city", "817")); // Default to Mumbai ID
        formData.append("diff_receiver_area", extractLocationId(formValues.deliveryArea, "diff_receiver_area", "area", "1")); // Default area ID
        formData.append("diff_receiver_pincode", getFieldValue(formValues.deliveryZipCode, ""));
        formData.append("diff_receiver_address1", getFieldValue(formValues.deliveryAddressLine1, ""));
        formData.append("diff_receiver_address2", getFieldValue(formValues.deliveryAddressLine2, ""));
      }

      // Charges - dynamic values from form
      formData.append("shipment_charges", getFieldValue(formValues.shipmentCharges, "0"));
      formData.append("insurance_charges", getFieldValue(formValues.insuranceCharges, "0.00"));
      formData.append("invoice_charges", getFieldValue(formValues.invoiceCharges, "0"));
      formData.append("handling_charges", getFieldValue(formValues.handlingCharges, "0.00"));
      formData.append("tax", getFieldValue(formValues.tax, "0"));
      formData.append("gst_amount", getFieldValue(formValues.gstAmount, "0"));
      formData.append("total_charges", getFieldValue(formValues.totalCharges, "0"));
      formData.append("grand_total", getFieldValue(formValues.grandTotal, "0"));
      formData.append("docket_no", getFieldValue(formValues.docketNo));

      // Additional dynamic fields that might be present
      formData.append("fuel_surcharge", getFieldValue(formValues.fuelSurcharge, "0"));
      formData.append("cod_charges", getFieldValue(formValues.codCharges, "0"));
      formData.append("pickup_charges", getFieldValue(formValues.pickupCharges, "0"));
      formData.append("delivery_charges", getFieldValue(formValues.deliveryCharges, "0"));
      formData.append("other_charges", getFieldValue(formValues.otherCharges, "0"));

      // Date fields - dynamic with fallbacks
      const currentDate = new Date().toISOString().split('T')[0];
      formData.append("shipment_date", getFieldValue(formValues.shipmentDate, currentDate));
      formData.append("expected_delivery_date", getFieldValue(formValues.expectedDeliveryDate, ""));
      formData.append("pickup_date", getFieldValue(formValues.pickupDate, ""));

      // Additional dynamic metadata
      formData.append("special_instructions", getFieldValue(formValues.specialInstructions, ""));
      formData.append("reference_number", getFieldValue(formValues.referenceNumber, ""));
      formData.append("customer_reference", getFieldValue(formValues.customerReference, ""));
      formData.append("priority", getFieldValue(formValues.priority, "normal"));
      formData.append("fragile", getBooleanValue(formValues.fragile || false));
      formData.append("dangerous_goods", getBooleanValue(formValues.dangerousGoods || false));

      console.log("✅ Fully Dynamic FormData built successfully!");

      // Debug: Log raw form values for location fields
      console.log("🔍 RAW FORM VALUES DEBUG:");
      console.log("  - formValues.senderState:", formValues.senderState, "(type:", typeof formValues.senderState, ")");
      console.log("  - formValues.senderCity:", formValues.senderCity, "(type:", typeof formValues.senderCity, ")");
      console.log("  - formValues.senderArea:", formValues.senderArea, "(type:", typeof formValues.senderArea, ")");
      console.log("  - formValues.receiverState:", formValues.receiverState, "(type:", typeof formValues.receiverState, ")");
      console.log("  - formValues.receiverCity:", formValues.receiverCity, "(type:", typeof formValues.receiverCity, ")");
      console.log("  - formValues.receiverArea:", formValues.receiverArea, "(type:", typeof formValues.receiverArea, ")");

      console.log("📊 Key dynamic values extracted:");
      console.log("  - Customer ID:", getFieldValue(formValues.customerId, String(userId)));
      console.log("  - Category:", getFieldValue(formValues.category));
      console.log("  - Commodity:", commodityIds);
      console.log("  - Payment Mode:", getFieldValue(formValues.paymentMode));
      console.log("  - Service Type:", getFieldValue(formValues.serviceType));
      console.log("  - Insurance:", getBooleanValue(formValues.insurance));
      console.log("  - Sender Name:", getFieldValue(formValues.senderName));
      console.log("  - Sender State:", extractLocationId(formValues.senderState, "sender_state", "state", "21"));
      console.log("  - Sender City:", extractLocationId(formValues.senderCity, "sender_city", "city", "817"));
      console.log("  - Sender Area:", extractLocationId(formValues.senderArea, "sender_area", "area", "1"));
      console.log("  - Sender Customer ID:", getFieldValue(formValues.senderCustomerId, String(userId)));
      console.log("  - Receiver Name:", getFieldValue(formValues.receiverName));
      console.log("  - Receiver State:", extractLocationId(formValues.receiverState, "receiver_state", "state", "21"));
      console.log("  - Receiver City:", extractLocationId(formValues.receiverCity, "receiver_city", "city", "817"));
      console.log("  - Receiver Area:", extractLocationId(formValues.receiverArea, "receiver_area", "area", "1"));
      console.log("  - Receiver Customer ID:", getFieldValue(formValues.receiverCustomerId));
      console.log("  - Different Delivery:", getBooleanValue(formValues.isDifferentDeliveryAddress));
      console.log("  - Shipment ID:", dynamicShipmentId);
      console.log("  - Grand Total:", getFieldValue(formValues.grandTotal, "0"));
      console.log("  - Special Instructions:", getFieldValue(formValues.specialInstructions, ""));
      console.log("  - Priority:", getFieldValue(formValues.priority, "normal"));

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
