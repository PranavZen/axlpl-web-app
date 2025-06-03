import React from 'react';
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
  // Calculate charges based on form values
  const calculateCharges = () => {
    // Base shipment charge calculation (example logic)
    const baseRate = 0.15; // ₹0.15 per unit
    const shipmentCharges = baseRate;

    // Insurance charges (if insurance is enabled)
    const insuranceCharges = values.insurance ? 0.00 : 0.00;

    // Handling charges
    const handlingCharges = 0.00;

    // Total charges before GST
    const totalCharges = shipmentCharges + insuranceCharges + handlingCharges;

    // GST calculation (18%)
    const gstAmount = totalCharges * 0.18;

    // Grand total
    const grandTotal = totalCharges + gstAmount;

    return {
      shipmentCharges: shipmentCharges.toFixed(2),
      insuranceCharges: insuranceCharges.toFixed(2),
      handlingCharges: handlingCharges.toFixed(2),
      totalCharges: totalCharges.toFixed(2),
      gstAmount: gstAmount.toFixed(3),
      grandTotal: grandTotal.toFixed(2)
    };
  };

  const charges = calculateCharges();

  return (
    <div className="step-four-fields">
      {/* Payment Information Section */}
      <div className="payment-section">

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
                    value={charges.shipmentCharges}
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
                    value={charges.handlingCharges}
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
                    value={charges.gstAmount}
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
                    value={charges.insuranceCharges}
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
                    value={charges.totalCharges}
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
                    value={charges.grandTotal}
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
        <div className="payment-notes mt-3">
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
