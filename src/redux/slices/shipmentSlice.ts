import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getUserData } from "../../utils/authUtils";
import { API_BASE_URL } from "../../config";

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
    console.log("🔄 submitShipment thunk called with:", formValues);
    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;
      const userId = userData?.Customerdetail?.id;

      console.log("🔐 Auth check - Token:", !!token, "UserId:", userId);

      if (!token || !userId) {
        console.log("❌ Authentication failed");
        return rejectWithValue("Authentication required");
      }

      // Transform form data to match API requirements exactly like Postman
      const formData = new FormData();

      // Use exact values from your working Postman example
      formData.append("customer_id", "63");
      formData.append("category_id", "1");
      formData.append("product_id", "2");
      formData.append("net_weight", "122");
      formData.append("gross_weight", "546");
      formData.append("payment_mode", "prepaid");
      formData.append("service_id", "1");
      formData.append("invoice_value", "10000");
      formData.append("axlpl_insurance", "1");
      formData.append("policy_no", "P-12345");
      formData.append("exp_date", "2025-12-31");
      formData.append("insurance_value", "1000");
      formData.append("remark", "Urgent shipment");
      formData.append("bill_to", "2");
      formData.append("number_of_parcel", "2");
      formData.append("additional_axlpl_insurance", "0.00");
      formData.append("shipment_status", "Pending");
      formData.append("calculation_status", "custom");
      formData.append("added_by", String(userId));
      formData.append("added_by_type", "1");
      formData.append("pre_alert_shipment", "0");
      formData.append("shipment_invoice_no", "1");
      formData.append("is_amt_edited_by_user", "0");
      formData.append("shipment_id", "");

      // Sender details - exact values from working Postman example
      formData.append("sender_name", "A.B. GOLD");
      formData.append("sender_company_name", "A.B. GOLD");
      formData.append("sender_country", "1");
      formData.append("sender_state", "4");
      formData.append("sender_city", "817");
      formData.append("sender_area", "63862");
      formData.append("sender_pincode", "400002");
      formData.append("sender_address1", "305, floor-3RD, D D IMAGE, SHAIKH MEMON STREET, , Maharashtra, 400002");
      formData.append("sender_address2", "Maharashtra, 400002");
      formData.append("sender_mobile", "9323688666");
      formData.append("sender_email", "abgoldmum@gmail.com");
      formData.append("sender_save_address", "1");
      formData.append("sender_is_new_sender_address", "0");
      formData.append("sender_gst_no", "27AACPJ9801C1Z1");
      formData.append("sender_customer_id", "233");

      // Receiver details - exact values from working Postman example
      formData.append("receiver_name", "DGLA QUALITY SERVICS PVT. LTD.");
      formData.append("receiver_company_name", "DGLA QUALITY SERVICS PVT. LTD.");
      formData.append("receiver_country", "1");
      formData.append("receiver_state", "4");
      formData.append("receiver_city", "817");
      formData.append("receiver_area", "24441");
      formData.append("receiver_pincode", "400093");
      formData.append("receiver_address1", "C 4 UDHYOG SADAN 3 MIDC ANDHERI EAST MUMBAI");
      formData.append("receiver_address2", "C 4 UDHYOG SADAN 3 MIDC ANDHERI EAST MUMBAI");
      formData.append("receiver_mobile", "9833722993");
      formData.append("receiver_email", "Sourabh@dpjewellers.com");
      formData.append("receiver_save_address", "1");
      formData.append("receiver_is_new_receiver_address", "0");
      formData.append("receiver_gst_no", "");
      formData.append("receiver_customer_id", "1950");

      // Different delivery address - exact values from working Postman example
      formData.append("is_diff_add", "0");
      formData.append("diff_receiver_country", "1");
      formData.append("diff_receiver_state", "4");
      formData.append("diff_receiver_city", "817");
      formData.append("diff_receiver_area", "MADURAI");
      formData.append("diff_receiver_pincode", "500072");
      formData.append("diff_receiver_address1", "asca");
      formData.append("diff_receiver_address2", "test");

      // Charges - exact values from working Postman example
      formData.append("shipment_charges", "0");
      formData.append("insurance_charges", "0.00");
      formData.append("invoice_charges", "0");
      formData.append("handling_charges", "0.00");
      formData.append("tax", "147.42");
      formData.append("total_charges", "819");
      formData.append("grand_total", "966.42");
      formData.append("docket_no", "");
      formData.append("shipment_date", "2025-05-14");

      console.log("📋 FormData prepared, making API call to:", `${API_BASE_URL}/insertShipment`);

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
