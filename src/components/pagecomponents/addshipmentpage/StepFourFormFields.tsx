import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShipmentPaymentInformation } from '../../../redux/slices/shipmentPaymentSlice';
import { RootState, AppDispatch } from '../../../redux/store';
import StepFieldWrapper from "./StepFieldWrapper";

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
  touched
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { paymentInfo, loading, error } = useSelector((state: RootState) => state.shipmentPayment);

  // Build API payload from form values
  const buildApiPayload = () => {
    return {
      customer_id: values.senderCustomerId || values.customerId || '',
      commodity_id: Array.isArray(values.commodity) && values.commodity[0]?.value ? values.commodity[0].value : values.commodity[0] || '',
      category_id: values.category?.value || values.category || '',
      net_weight: values.netWeight || '',
      gross_weight: values.grossWeight || '',
      payment_mode: values.paymentMode?.value || values.paymentMode || '',
      invoice_value: values.invoiceValue || '',
      insurance_by_AXLPL: values.insurance ? '1' : '0',
      number_of_parcel: values.numberOfParcel || '1',
      sender_zipcode: values.senderZipCode || '',
      receiver_zipcode: values.receiverZipCode || '',
      policy_no: values.policyNumber || '',
      policy_expirydate: values.expiryDate || '',
      policy_value: values.insuranceValue || '',
    };
  };

  // Watch relevant fields and dispatch API call
  useEffect(() => {
    // Only call if all required fields are present
    const payload = buildApiPayload();
    if (
      payload.customer_id &&
      payload.commodity_id &&
      payload.category_id &&
      payload.net_weight &&
      payload.gross_weight &&
      payload.payment_mode &&
      payload.invoice_value &&
      payload.sender_zipcode &&
      payload.receiver_zipcode
    ) {
      dispatch(fetchShipmentPaymentInformation(payload));
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
    values.insuranceValue
  ]);

  // Update form fields with API response
  useEffect(() => {
    if (paymentInfo) {
      setFieldValue('shipmentCharges', paymentInfo.shipment_charges || '');
      setFieldValue('insuranceCharges', paymentInfo.insurance_charges || '');
      setFieldValue('handlingCharges', paymentInfo.handling_charges || '');
      setFieldValue('totalCharges', paymentInfo.total_charges || '');
      setFieldValue('gstAmount', paymentInfo.tax || '');
      setFieldValue('grandTotal', paymentInfo.grand_total || '');
    }
  }, [paymentInfo, setFieldValue]);

  return (
    <div className="step-four-fields">
      <div className="payment-section">
        {loading && (
          <div className="alert alert-info mb-3">Calculating payment information...</div>
        )}
        {error && (
          <div className="alert alert-danger mb-3">{error}</div>
        )}
        <div className="payment-details">
          <div className="row">
            {/* Left Column */}
            <div className="col-md-6">
              {/* Shipment Charges */}
              <div className="mb-3">
                <StepFieldWrapper
                  name="shipmentCharges"
                  label="Shipment Charges"
                >
                  <input
                    name="shipmentCharges"
                    type="text"
                    className="form-control innerFormControll"
                    value={values.shipmentCharges || ''}
                    disabled
                    readOnly
                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                  />
                </StepFieldWrapper>
              </div>

              {/* Handling Charges */}
              <div className="mb-3">
                <StepFieldWrapper
                  name="handlingCharges"
                  label="Handling Charges"
                >
                  <input
                    name="handlingCharges"
                    type="text"
                    className="form-control innerFormControll"
                    value={values.handlingCharges || ''}
                    disabled
                    readOnly
                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                  />
                </StepFieldWrapper>
              </div>

              {/* GST (18%) */}
              <div className="mb-3">
                <StepFieldWrapper
                  name="gstAmount"
                  label="GST (18%)"
                >
                  <input
                    name="gstAmount"
                    type="text"
                    className="form-control innerFormControll"
                    value={values.gstAmount || ''}
                    disabled
                    readOnly
                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
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
                >
                  <input
                    name="insuranceCharges"
                    type="text"
                    className="form-control innerFormControll"
                    value={values.insuranceCharges || ''}
                    disabled
                    readOnly
                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                  />
                </StepFieldWrapper>
              </div>

              {/* Total Charges */}
              <div className="mb-3">
                <StepFieldWrapper
                  name="totalCharges"
                  label="Total Charges"
                >
                  <input
                    name="totalCharges"
                    type="text"
                    className="form-control innerFormControll"
                    value={values.totalCharges || ''}
                    disabled
                    readOnly
                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                  />
                </StepFieldWrapper>
              </div>

              {/* Grand Total */}
              <div className="mb-3">
                <StepFieldWrapper
                  name="grandTotal"
                  label="Grand Total"
                >
                  <input
                    name="grandTotal"
                    type="text"
                    className="form-control innerFormControll"
                    value={values.grandTotal || ''}
                    disabled
                    readOnly
                    style={{
                      backgroundColor: '#e3f2fd',
                      cursor: 'not-allowed',
                      fontWeight: 'bold',
                      fontSize: '1.1em',
                      border: '2px solid #2196f3'
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
              <li>All charges are calculated automatically based on your shipment details</li>
              <li>GST is applied at 18% on the total charges</li>
              <li>Insurance charges apply only if insurance is selected</li>
              <li>Final payment will be processed after shipment confirmation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepFourFormFields;
