import React, { useState } from 'react';
import StepFieldWrapper from "./StepFieldWrapper";

interface StepTwoFormFieldsProps {
  values: any;
  setFieldValue: (field: string, value: any) => void;
  errors?: any;
  touched?: any;
}

const StepTwoFormFields: React.FC<StepTwoFormFieldsProps> = ({
  values,
  setFieldValue
}) => {
  const [sameAsPickup, setSameAsPickup] = useState(false);

  const handleSameAsPickup = (checked: boolean) => {
    setSameAsPickup(checked);
    if (checked) {
      setFieldValue('deliveryAddress', { ...values.pickupAddress });
    } else {
      setFieldValue('deliveryAddress', {
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        landmark: ""
      });
    }
  };

  return (
    <div className="step-two-fields">
      {/* Pickup Address Section */}
      <div className="address-section">
        <div className="section-header">
          <div className="section-icon">📍</div>
          <div className="section-info">
            <h3 className="section-title">Pickup Address</h3>
            <p className="section-description">Enter the address where the package will be collected from</p>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <StepFieldWrapper
              name="pickupAddress.name"
              label="Contact Person Name"
              placeholder="Enter contact person name"
            />
          </div>

          <div className="form-group">
            <StepFieldWrapper
              name="pickupAddress.phone"
              label="Phone Number"
              placeholder="Enter phone number"
              type="tel"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <StepFieldWrapper
              name="pickupAddress.email"
              label="Email Address"
              placeholder="Enter email address"
              type="email"
            />
          </div>

          <div className="form-group">
            <StepFieldWrapper
              name="pickupAddress.landmark"
              label="Landmark (Optional)"
              placeholder="Enter nearby landmark"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <StepFieldWrapper
              name="pickupAddress.address"
              label="Complete Address"
              placeholder="Enter complete address with building/house number"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <StepFieldWrapper
              name="pickupAddress.city"
              label="City"
              placeholder="Enter city"
            />
          </div>

          <div className="form-group">
            <StepFieldWrapper
              name="pickupAddress.state"
              label="State"
              placeholder="Enter state"
            />
          </div>

          <div className="form-group">
            <StepFieldWrapper
              name="pickupAddress.pincode"
              label="Pincode"
              placeholder="Enter pincode"
            />
          </div>
        </div>
      </div>

      {/* Same as Pickup Checkbox */}
      <div className="same-address-section">
        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            id="sameAsPickup"
            checked={sameAsPickup}
            onChange={(e) => handleSameAsPickup(e.target.checked)}
            className="same-address-checkbox"
          />
          <label htmlFor="sameAsPickup" className="same-address-label">
            <span className="checkbox-icon">
              {sameAsPickup ? '✓' : ''}
            </span>
            Delivery address is same as pickup address
          </label>
        </div>
      </div>

      {/* Delivery Address Section */}
      <div className="address-section">
        <div className="section-header">
          <div className="section-icon">🏠</div>
          <div className="section-info">
            <h3 className="section-title">Delivery Address</h3>
            <p className="section-description">Enter the address where the package will be delivered</p>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <StepFieldWrapper
              name="deliveryAddress.name"
              label="Contact Person Name"
              placeholder="Enter contact person name"
            />
          </div>

          <div className="form-group">
            <StepFieldWrapper
              name="deliveryAddress.phone"
              label="Phone Number"
              placeholder="Enter phone number"
              type="tel"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <StepFieldWrapper
              name="deliveryAddress.email"
              label="Email Address"
              placeholder="Enter email address"
              type="email"
            />
          </div>

          <div className="form-group">
            <StepFieldWrapper
              name="deliveryAddress.landmark"
              label="Landmark (Optional)"
              placeholder="Enter nearby landmark"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <StepFieldWrapper
              name="deliveryAddress.address"
              label="Complete Address"
              placeholder="Enter complete address with building/house number"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <StepFieldWrapper
              name="deliveryAddress.city"
              label="City"
              placeholder="Enter city"
            />
          </div>

          <div className="form-group">
            <StepFieldWrapper
              name="deliveryAddress.state"
              label="State"
              placeholder="Enter state"
            />
          </div>

          <div className="form-group">
            <StepFieldWrapper
              name="deliveryAddress.pincode"
              label="Pincode"
              placeholder="Enter pincode"
            />
          </div>
        </div>
      </div>

      {/* Address Tips */}
      <div className="address-tips">
        <h4 className="tips-title">📋 Address Guidelines</h4>
        <ul className="tips-list">
          <li>Ensure all contact details are accurate for smooth delivery</li>
          <li>Include building/house number and floor details</li>
          <li>Provide a landmark for easy location identification</li>
          <li>Double-check pincode for correct routing</li>
        </ul>
      </div>
    </div>
  );
};

export default StepTwoFormFields;
