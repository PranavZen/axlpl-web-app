import React from 'react';
import SingleSelect from "../../ui/select/SingleSelect";
import StepFieldWrapper from "./StepFieldWrapper";

interface StepFourFormFieldsProps {
  values: any;
  setFieldValue: (field: string, value: any) => void;
  errors?: any;
  touched?: any;
}

const StepFourFormFields: React.FC<StepFourFormFieldsProps> = ({
  values,
  setFieldValue
}) => {
  const paymentModeOptions = [
    { value: "cod", label: "Cash on Delivery (COD)" },
    { value: "prepaid", label: "Prepaid" },
    { value: "credit", label: "Credit Account" },
  ];

  const calculateEstimatedCost = () => {
    const baseRate = 50;
    const weight = parseFloat(values.packageDetails?.weight) || 0;
    const serviceMultiplier = values.serviceType?.value === 'express' ? 2 : 1;
    const priorityMultiplier = values.priority === 'urgent' ? 1.5 : 1;
    const insuranceCost = values.packageDetails?.insurance ?
      Math.max(parseFloat(values.packageDetails?.insuranceValue) * 0.02, 50) : 0;

    return Math.round((baseRate + (weight * 10)) * serviceMultiplier * priorityMultiplier + insuranceCost);
  };

  return (
    <div className="step-four-fields">
      {/* Shipment Summary */}
      <div className="summary-section">
        <div className="section-header">
          <div className="section-icon">📋</div>
          <div className="section-info">
            <h3 className="section-title">Shipment Summary</h3>
            <p className="section-description">Review your shipment details before confirmation</p>
          </div>
        </div>

        <div className="summary-grid">
          {/* Basic Details */}
          <div className="summary-card">
            <h4 className="card-title">📦 Shipment Details</h4>
            <div className="summary-item">
              <span className="label">Customer:</span>
              <span className="value">{values.customerName || 'Not specified'}</span>
            </div>
            <div className="summary-item">
              <span className="label">Type:</span>
              <span className="value">{values.shipmentType?.label || 'Not specified'}</span>
            </div>
            <div className="summary-item">
              <span className="label">Service:</span>
              <span className="value">{values.serviceType?.label || 'Not specified'}</span>
            </div>
            <div className="summary-item">
              <span className="label">Priority:</span>
              <span className="value priority-badge priority-{values.priority}">
                {values.priority || 'Standard'}
              </span>
            </div>
          </div>

          {/* Package Details */}
          <div className="summary-card">
            <h4 className="card-title">📏 Package Information</h4>
            <div className="summary-item">
              <span className="label">Dimensions:</span>
              <span className="value">
                {values.packageDetails?.length}×{values.packageDetails?.width}×{values.packageDetails?.height} cm
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Weight:</span>
              <span className="value">{values.packageDetails?.weight} kg</span>
            </div>
            <div className="summary-item">
              <span className="label">Quantity:</span>
              <span className="value">{values.packageDetails?.quantity}</span>
            </div>
            <div className="summary-item">
              <span className="label">Value:</span>
              <span className="value">₹{values.packageDetails?.value}</span>
            </div>
            {values.packageDetails?.fragile && (
              <div className="summary-item">
                <span className="label">Special:</span>
                <span className="value fragile-badge">🔸 Fragile</span>
              </div>
            )}
            {values.packageDetails?.insurance && (
              <div className="summary-item">
                <span className="label">Insurance:</span>
                <span className="value insurance-badge">🛡️ ₹{values.packageDetails?.insuranceValue}</span>
              </div>
            )}
          </div>

          {/* Addresses */}
          <div className="summary-card">
            <h4 className="card-title">📍 Pickup Address</h4>
            <div className="address-summary">
              <div className="contact-info">
                <strong>{values.pickupAddress?.name}</strong>
                <span>{values.pickupAddress?.phone}</span>
              </div>
              <div className="address-info">
                {values.pickupAddress?.address}<br/>
                {values.pickupAddress?.city}, {values.pickupAddress?.state} - {values.pickupAddress?.pincode}
              </div>
            </div>
          </div>

          <div className="summary-card">
            <h4 className="card-title">🏠 Delivery Address</h4>
            <div className="address-summary">
              <div className="contact-info">
                <strong>{values.deliveryAddress?.name}</strong>
                <span>{values.deliveryAddress?.phone}</span>
              </div>
              <div className="address-info">
                {values.deliveryAddress?.address}<br/>
                {values.deliveryAddress?.city}, {values.deliveryAddress?.state} - {values.deliveryAddress?.pincode}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment and Schedule */}
      <div className="payment-section">
        <div className="section-header">
          <div className="section-icon">💳</div>
          <div className="section-info">
            <h3 className="section-title">Payment & Schedule</h3>
            <p className="section-description">Choose payment method and schedule your shipment</p>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <StepFieldWrapper name="paymentMode" label="Payment Mode">
              <SingleSelect
                options={paymentModeOptions}
                value={values.paymentMode}
                onChange={(option) => setFieldValue("paymentMode", option)}
                placeholder="Select payment mode"
              />
            </StepFieldWrapper>
          </div>

          <div className="form-group">
            <StepFieldWrapper
              name="pickupDate"
              label="Preferred Pickup Date"
              type="date"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <StepFieldWrapper
              name="specialInstructions"
              label="Special Instructions (Optional)"
              placeholder="Any special handling instructions or notes"
            />
          </div>
        </div>
      </div>

      {/* Cost Estimation */}
      <div className="cost-section">
        <div className="section-header">
          <div className="section-icon">💰</div>
          <div className="section-info">
            <h3 className="section-title">Cost Estimation</h3>
            <p className="section-description">Estimated shipping cost breakdown</p>
          </div>
        </div>

        <div className="cost-breakdown">
          <div className="cost-item">
            <span className="cost-label">Base Shipping:</span>
            <span className="cost-value">₹50</span>
          </div>
          <div className="cost-item">
            <span className="cost-label">Weight Charges:</span>
            <span className="cost-value">₹{(parseFloat(values.packageDetails?.weight) || 0) * 10}</span>
          </div>
          {values.serviceType?.value === 'express' && (
            <div className="cost-item">
              <span className="cost-label">Express Service:</span>
              <span className="cost-value">+100%</span>
            </div>
          )}
          {values.priority === 'urgent' && (
            <div className="cost-item">
              <span className="cost-label">Priority Handling:</span>
              <span className="cost-value">+50%</span>
            </div>
          )}
          {values.packageDetails?.insurance && (
            <div className="cost-item">
              <span className="cost-label">Insurance:</span>
              <span className="cost-value">₹{Math.max(parseFloat(values.packageDetails?.insuranceValue) * 0.02, 50)}</span>
            </div>
          )}
          <div className="cost-total">
            <span className="total-label">Estimated Total:</span>
            <span className="total-value">₹{calculateEstimatedCost()}</span>
          </div>
        </div>

        <div className="cost-note">
          <p>* Final charges may vary based on actual weight and dimensions measured at pickup</p>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="terms-section">
        <div className="terms-checkbox">
          <input
            type="checkbox"
            id="acceptTerms"
            required
            className="terms-checkbox-input"
          />
          <label htmlFor="acceptTerms" className="terms-label">
            I agree to the <a href="#" target="_blank">Terms and Conditions</a> and <a href="#" target="_blank">Privacy Policy</a>
          </label>
        </div>
      </div>
    </div>
  );
};

export default StepFourFormFields;
