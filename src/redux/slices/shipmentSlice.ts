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
    try {
      const userData = getUserData();
      const token = userData?.Customerdetail?.token;
      const userId = userData?.Customerdetail?.id;

      if (!token || !userId) {
        return rejectWithValue("Authentication required");
      }



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
      formData.append("invoice_number", getFieldValue(formValues.invoiceNumber));

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
      formData.append("shipment_status", getFieldValue(formValues.shipmentStatus, "Approved"));
      formData.append("calculation_status", getFieldValue(formValues.calculationStatus, "custom"));
      formData.append("added_by", getFieldValue(formValues.addedBy, String(userId)));
      formData.append("added_by_type", getFieldValue(formValues.addedByType, "1"));
      formData.append("pre_alert_shipment", getBooleanValue(formValues.preAlertShipment || false));
      formData.append("shipment_invoice_no", getFieldValue(formValues.shipmentInvoiceNo, "1"));
      formData.append("is_amt_edited_by_user", getBooleanValue(formValues.isAmtEditedByUser || false));

      // // Generate dynamic shipment ID or use provided one
      // const dynamicShipmentId = getFieldValue(formValues.shipmentId) ||
      //                          String(Date.now() + Math.floor(Math.random() * 100000000000));
      formData.append("shipment_id", getFieldValue(formValues.shipmentId));

      // Sender details - always use IDs if present
      formData.append("sender_name", getFieldValue(formValues.senderName));
      formData.append("sender_company_name", getFieldValue(formValues.senderCompanyName));
      formData.append("sender_country", "1"); // Always set to 1
      // Sender details - use fallback only for existing address type
      let senderStateId = formValues.senderStateId;
      let senderCityId = formValues.senderCityId;
      // console.log("senderStateId", senderStateId);
      // console.log("senderCityId", senderCityId);
      // Fix: Use .id if senderStateId or senderCityId is an object
      const senderStateIdValue = (senderStateId && typeof senderStateId === 'object' && senderStateId.id !== undefined) ? senderStateId.id : senderStateId;
      const senderCityIdValue = (senderCityId && typeof senderCityId === 'object' && senderCityId.id !== undefined) ? senderCityId.id : senderCityId;
      formData.append("sender_state", getFieldValue(senderStateIdValue));
      formData.append("sender_city", getFieldValue(senderCityIdValue));
      // Use senderAreaId if available, otherwise extract from senderArea object
      const senderAreaId = formValues.senderAreaId || getFieldValue(formValues.senderArea, "1");
      formData.append("sender_area", senderAreaId);
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
      // Set sender_customer_id based on address type
      if (formValues.senderAddressType === "new") {
        formData.append("sender_customer_id", String(userId));
      } else {
        formData.append("sender_customer_id", getFieldValue(formValues.senderCustomerId, String(userId)));
      }

      // Receiver details - always use IDs if present
      formData.append("receiver_name", getFieldValue(formValues.receiverName));
      formData.append("receiver_company_name", getFieldValue(formValues.receiverCompanyName));
      formData.append("receiver_country", "1"); // Always set to 1
      // Receiver details - use fallback only for existing address type
      let receiverStateId = formValues.receiverStateId;
      let receiverCityId = formValues.receiverCityId;
      // console.log("receiverStateId", receiverStateId);
      // console.log("receiverCityId", receiverCityId);
      // if (formValues.receiverAddressType === "existing") {
      //   if (!receiverStateId && formValues.receiverState && formValues.receiverState.id) {
      //     receiverStateId = formValues.receiverState.id;
      //   }
      //   if (!receiverCityId && formValues.receiverCity && formValues.receiverCity.id) {
      //     receiverCityId = formValues.receiverCity.id;
      //   }
      // }
      formData.append("receiver_state", getFieldValue(receiverStateId));
      formData.append("receiver_city", getFieldValue(receiverCityId));
      formData.append("receiver_area", getFieldValue(formValues.receiverArea, "1")); // Pass as-is, default area ID
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
      // Set receiver_customer_id based on address type
      if (formValues.receiverAddressType === "new") {
        formData.append("receiver_customer_id", String(userId));
      } else {
        // Use form value, fallback to userId if not set
        formData.append("receiver_customer_id", getFieldValue(formValues.receiverCustomerId, String(userId)));
      }

      // Different delivery address - dynamic values from form
      const isDifferentDeliveryAddress = getBooleanValue(formValues.isDifferentDeliveryAddress) === "1";
      formData.append("is_diff_add", getBooleanValue(formValues.isDifferentDeliveryAddress));

      if (isDifferentDeliveryAddress) {
        formData.append("diff_receiver_country", getFieldValue(formValues.deliveryCountry, "1")); // Dynamic with India (1) as default
        // Use the actual state/city IDs if present, fallback to default if not
        formData.append("diff_receiver_state", getFieldValue(formValues.deliveryStateId, "21")); // Use ID
        formData.append("diff_receiver_city", getFieldValue(formValues.deliveryCityId, "817")); // Use ID
        formData.append("diff_receiver_area", getFieldValue(formValues.deliveryArea, "1")); // Pass as-is, default area ID
        formData.append("diff_receiver_pincode", getFieldValue(formValues.deliveryZipCode));
        formData.append("diff_receiver_address1", getFieldValue(formValues.deliveryAddressLine1));
        formData.append("diff_receiver_address2", getFieldValue(formValues.deliveryAddressLine2));
      } else {
        // Set dynamic default values for API compatibility when not using different delivery address
        formData.append("diff_receiver_country", getFieldValue(formValues.deliveryCountry, "1"));
        formData.append("diff_receiver_state", getFieldValue(formValues.deliveryStateId, "21")); // Use ID
        formData.append("diff_receiver_city", getFieldValue(formValues.deliveryCityId, "817")); // Use ID
        formData.append("diff_receiver_area", getFieldValue(formValues.deliveryArea, "1")); // Pass as-is, default area ID
        formData.append("diff_receiver_pincode", getFieldValue(formValues.deliveryZipCode, ""));
        formData.append("diff_receiver_address1", getFieldValue(formValues.deliveryAddressLine1, ""));
        formData.append("diff_receiver_address2", getFieldValue(formValues.deliveryAddressLine2, ""));
      }

      // Charges - dynamic values from form
      // If API did not provide a value, ensure we send '0' for these fields
      const safeShipmentCharges = formValues.shipmentCharges === undefined || formValues.shipmentCharges === null || formValues.shipmentCharges === '' ? '0' : formValues.shipmentCharges;
      const safeInsuranceCharges = formValues.insuranceCharges === undefined || formValues.insuranceCharges === null || formValues.insuranceCharges === '' ? '0' : formValues.insuranceCharges;
      const safeHandlingCharges = formValues.handlingCharges === undefined || formValues.handlingCharges === null || formValues.handlingCharges === '' ? '0' : formValues.handlingCharges;

      formData.append("shipment_charges", getFieldValue(safeShipmentCharges, "0"));
      formData.append("insurance_charges", getFieldValue(safeInsuranceCharges, "0"));
      formData.append("invoice_charges", getFieldValue(formValues.invoiceCharges, "0"));
      formData.append("handling_charges", getFieldValue(safeHandlingCharges, "0"));
      formData.append("tax", getFieldValue(formValues.tax, "0"));
      formData.append("gst_amount", getFieldValue(formValues.gstAmount, "0"));
      formData.append("total_charges", getFieldValue(formValues.totalCharges, "0"));
      formData.append("grand_total", getFieldValue(formValues.grandTotal, "0"));
      formData.append("docket_no", getFieldValue(formValues.docketNo));
      // // Date fields - dynamic with fallbacks
      const currentDate = new Date().toISOString().split('T')[0];
      formData.append("shipment_date", getFieldValue(formValues.shipmentDate, currentDate));
      // formData.append("expected_delivery_date", getFieldValue(formValues.expectedDeliveryDate, ""));
   
      // Try only FormData approach for shipment submission
      let response;
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

      if (response.data && response.data.status === "success") {
        return {
          success: true,
          message: response.data.message || "Shipment submitted successfully",
          shipmentId: response.data.shipment_id || response.data.data?.shipment_id,
          data: response.data
        };
      } else {
        return rejectWithValue(response.data?.message || "Failed to submit shipment");
      }
    } catch (error: any) {
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
