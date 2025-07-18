import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShipmentPaymentInformation } from "../../../redux/slices/shipmentPaymentSlice";
import { RootState, AppDispatch } from "../../../redux/store";
import StepFieldWrapper from "./StepFieldWrapper";
import { getUserData } from "../../../utils/authUtils";

interface StepFourFormFieldsProps {
  values: any;
  setFieldValue: (field: string, value: any) => void;
  setFieldTouched: (field: string, touched: boolean) => void;
  setFieldError: (field: string, error: string | undefined) => void;
  errors?: any;
  touched?: any;
}

const StepFourFormFields: React.FC<StepFourFormFieldsProps> = ({
  values,
  setFieldValue,
  setFieldTouched,
  setFieldError,
  errors,
  touched,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { paymentInfo, loading, error } = useSelector(
    (state: RootState) => state.shipmentPayment
  );
  
  // Debug logging
  useEffect(() => {
    console.log("StepFourFormFields: State updated:", { paymentInfo, loading, error });
  }, [paymentInfo, loading, error]);
  //  const userId = getUserData()?.Customerdetail?.id || '';
  //       console.log("userIduserId", userId)
  // Build API payload from form values
  const buildApiPayload = () => {
    // Ensure commodity_id is always a string (comma separated if multiple)
    let commodity_id = "";
    if (Array.isArray(values.commodity)) {
      if (values.commodity.length > 0) {
        if (
          typeof values.commodity[0] === "object" &&
          values.commodity[0]?.value
        ) {
          commodity_id = values.commodity.map((c: any) => c.value).join(",");
        } else {
          commodity_id = values.commodity.join(",");
        }
      }
    } else if (values.commodity) {
      commodity_id = values.commodity.value || values.commodity;
    }

    // Always use senderName/receiverName for new address, fallback to customerId for existing
    let customer_id = "";
    if (values.senderAddressType === "existing") {
      customer_id = values.customerId || values.senderCustomerId || "";
    } else {
      // For new address, use logged-in userId as customer_id
      const userId = getUserData()?.Customerdetail?.id || "";
      // console.log("userIduserId 2", userId);
      customer_id = userId;
      // console.log("customer_id 2", customer_id);
    }

    return {
      customer_id,
      commodity_id,
      category_id: values.category?.value || values.category || "",
      net_weight: values.netWeight || "",
      gross_weight: values.grossWeight || "",
      tax: values.tax || values.gstAmount || "0",
      payment_mode: values.paymentMode?.value || values.paymentMode || "",
      invoice_value: values.invoiceValue || "",
      insurance_by_AXLPL: values.insurance ? "1" : "0",
      number_of_parcel: values.numberOfParcel || "1",
      sender_zipcode: values.senderZipCode || "",
      receiver_zipcode: values.receiverZipCode || "",
      policy_no: values.insurance ? values.policyNumber || "" : "0",
      policy_expirydate: values.insurance ? values.expiryDate || "" : "0",
      policy_value: values.insurance ? values.insuranceValue || "" : "0",
    };
  };

  // Watch relevant fields and dispatch API call
  useEffect(() => {
    // Only call if all required fields are present
    const payload = buildApiPayload();
    console.log("StepFourFormFields: Built payload:", payload);
    
    // Check each required field individually
    const requiredFields = [
      'customer_id',
      'commodity_id', 
      'category_id',
      'net_weight',
      'gross_weight',
      'tax',
      'payment_mode',
      'invoice_value',
      'sender_zipcode',
      'receiver_zipcode'
    ] as const;
    
    const missingFields = requiredFields.filter(field => !payload[field as keyof typeof payload]);
    
    if (missingFields.length === 0) {
      console.log("StepFourFormFields: All required fields present. Dispatching fetchShipmentPaymentInformation with payload:", payload);
      dispatch(fetchShipmentPaymentInformation(payload));
    } else {
      console.log("StepFourFormFields: Missing required fields:", missingFields);
      console.log("StepFourFormFields: Current payload:", payload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    values.senderCustomerId,
    values.customerId,
    values.commodity,
    values.category,
    values.netWeight,
    values.grossWeight,
    values.paymentMode,
    values.invoiceValue,
    values.insurance,
    values.numberOfParcel,
    values.senderZipCode,
    values.receiverZipCode,
    values.policyNumber,
    values.expiryDate,
    values.insuranceValue,
    values.tax,
    values.gstAmount,
  ]);

  // Update form fields with API response
  useEffect(() => {
    if (paymentInfo) {
      setFieldValue("shipmentCharges", paymentInfo.shipment_charges || "");
      setFieldValue("insuranceCharges", paymentInfo.insurance_charges || "");
      setFieldValue("handlingCharges", paymentInfo.handling_charges || "");
      setFieldValue("totalCharges", paymentInfo.total_charges || "");
      setFieldValue("gstAmount", paymentInfo.tax || "");
      setFieldValue("tax", paymentInfo.tax || "");
      setFieldValue("grandTotal", paymentInfo.grand_total || "");
    }
  }, [paymentInfo, setFieldValue]);

  return (
    <div className="step-four-fields">
      <div className="payment-section">
        {loading && (
          <div className="alert alert-info mb-3">
            Calculating payment information...
          </div>
        )}
        {error && <div className="alert alert-danger mb-3">{error}</div>}
        <div className="payment-details">
          <div className="row">
            {/* Left Column */}
            <div className="col-md-6">
              {/* Shipment Charges */}
              <div className="mb-3">
                <StepFieldWrapper
                  name="shipmentCharges"
                  label="Shipment Charges"
                  errors={errors}
                  touched={touched}
                >
                  <input
                    name="shipmentCharges"
                    type="text"
                    className="form-control innerFormControll"
                    value={values.shipmentCharges || ""}
                    disabled
                    readOnly
                    style={{
                      backgroundColor: "#f8f9fa",
                      cursor: "not-allowed",
                    }}
                  />
                </StepFieldWrapper>
              </div>

              {/* Handling Charges */}
              <div className="mb-3">
                <StepFieldWrapper
                  name="handlingCharges"
                  label="Handling Charges"
                  errors={errors}
                  touched={touched}
                >
                  <input
                    name="handlingCharges"
                    type="text"
                    className="form-control innerFormControll"
                    value={values.handlingCharges || ""}
                    disabled
                    readOnly
                    style={{
                      backgroundColor: "#f8f9fa",
                      cursor: "not-allowed",
                    }}
                  />
                </StepFieldWrapper>
              </div>

              {/* GST (18%) */}
              <div className="mb-3">
                <StepFieldWrapper name="gstAmount" label="GST (18%)" errors={errors} touched={touched}>
                  <input
                    name="gstAmount"
                    type="text"
                    className="form-control innerFormControll"
                    value={values.gstAmount || ""}
                    disabled
                    readOnly
                    style={{
                      backgroundColor: "#f8f9fa",
                      cursor: "not-allowed",
                    }}
                  />
                </StepFieldWrapper>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-md-6">
              {/* Insurance Charges */}
              <div className="mb-3">
                <StepFieldWrapper
                  name="insuranceCharges"
                  label="Insurance Charges"
                  errors={errors}
                  touched={touched}
                >
                  <input
                    name="insuranceCharges"
                    type="text"
                    className="form-control innerFormControll"
                    value={values.insuranceCharges || ""}
                    disabled
                    readOnly
                    style={{
                      backgroundColor: "#f8f9fa",
                      cursor: "not-allowed",
                    }}
                  />
                </StepFieldWrapper>
              </div>

              {/* Total Charges */}
              <div className="mb-3">
                <StepFieldWrapper name="totalCharges" label="Total Charges" errors={errors} touched={touched}>
                  <input
                    name="totalCharges"
                    type="text"
                    className="form-control innerFormControll"
                    value={values.totalCharges || ""}
                    disabled
                    readOnly
                    style={{
                      backgroundColor: "#f8f9fa",
                      cursor: "not-allowed",
                    }}
                  />
                </StepFieldWrapper>
              </div>

              {/* Grand Total */}
              <div className="mb-3">
                <StepFieldWrapper name="grandTotal" label="Grand Total" errors={errors} touched={touched}>
                  <input
                    name="grandTotal"
                    type="text"
                    className="form-control innerFormControll"
                    value={values.grandTotal || ""}
                    disabled
                    readOnly
                    style={{
                      backgroundColor: "#e3f2fd",
                      cursor: "not-allowed",
                      fontWeight: "bold",
                      fontSize: "1.1em",
                      border: "2px solid #2196f3",
                    }}
                  />
                </StepFieldWrapper>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Notes */}
        <div className="payment-notes mt-3 d-none">
          <div className="alert alert-info">
            <h6 className="alert-heading">
              <span className="me-2">ℹ️</span>
              Payment Information
            </h6>
            <ul className="mb-0">
              <li>
                All charges are calculated automatically based on your shipment
                details
              </li>
              <li>GST is applied at 18% on the total charges</li>
              <li>Insurance charges apply only if insurance is selected</li>
              <li>
                Final payment will be processed after shipment confirmation
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepFourFormFields;
