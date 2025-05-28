import React, { useState } from 'react';
import StepFieldWrapper from "./StepFieldWrapper";

interface StepThreeFormFieldsProps {
  values: any;
  setFieldValue: (field: string, value: any) => void;
  errors?: any;
  touched?: any;
}

const StepThreeFormFields: React.FC<StepThreeFormFieldsProps> = ({
  values,
  setFieldValue
}) => {
  const [calculatedVolume, setCalculatedVolume] = useState(0);

  // Calculate volume when dimensions change
  React.useEffect(() => {
    const { length, width, height } = values.packageDetails;
    if (length && width && height) {
      const volume = (parseFloat(length) * parseFloat(width) * parseFloat(height)) / 1000; // Convert to liters
      setCalculatedVolume(volume);
    }
  }, [values.packageDetails.length, values.packageDetails.width, values.packageDetails.height]);

  const handleInsuranceToggle = (checked: boolean) => {
    setFieldValue('packageDetails.insurance', checked);
    if (!checked) {
      setFieldValue('packageDetails.insuranceValue', '');
    }
  };

  return (
    <div className="step-three-fields">
      {/* Package Dimensions Section */}
      <div className="package-section">
        <div className="section-header">
          <div className="section-icon">📦</div>
          <div className="section-info">
            <h3 className="section-title">Package Dimensions</h3>
            <p className="section-description">Enter the physical dimensions and weight of your package</p>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <StepFieldWrapper
              name="packageDetails.length"
              label="Length (cm)"
              placeholder="Enter length"
              type="number"
            />
          </div>

          <div className="form-group">
            <StepFieldWrapper
              name="packageDetails.width"
              label="Width (cm)"
              placeholder="Enter width"
              type="number"
            />
          </div>

          <div className="form-group">
            <StepFieldWrapper
              name="packageDetails.height"
              label="Height (cm)"
              placeholder="Enter height"
              type="number"
            />
          </div>
        </div>

        {calculatedVolume > 0 && (
          <div className="volume-display">
            <span className="volume-label">Calculated Volume:</span>
            <span className="volume-value">{calculatedVolume.toFixed(2)} liters</span>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <StepFieldWrapper
              name="packageDetails.weight"
              label="Weight (kg)"
              placeholder="Enter weight"
              type="number"
            />
          </div>

          <div className="form-group">
            <StepFieldWrapper
              name="packageDetails.quantity"
              label="Quantity"
              placeholder="Enter quantity"
              type="number"
            />
          </div>
        </div>
      </div>

      {/* Package Details Section */}
      <div className="package-section">
        <div className="section-header">
          <div className="section-icon">📝</div>
          <div className="section-info">
            <h3 className="section-title">Package Information</h3>
            <p className="section-description">Provide details about the package contents and value</p>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <StepFieldWrapper
              name="packageDetails.value"
              label="Package Value (₹)"
              placeholder="Enter package value"
              type="number"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <StepFieldWrapper
              name="packageDetails.description"
              label="Package Description"
              placeholder="Describe the contents of the package"
            />
          </div>
        </div>

        {/* Fragile Toggle */}
        <div className="toggle-section">
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              id="fragile"
              checked={values.packageDetails.fragile}
              onChange={(e) => setFieldValue('packageDetails.fragile', e.target.checked)}
              className="toggle-checkbox"
            />
            <label htmlFor="fragile" className="toggle-label">
              <span className="toggle-switch"></span>
              <span className="toggle-text">
                <span className="toggle-icon">🔸</span>
                Mark as Fragile
              </span>
            </label>
          </div>
          <p className="toggle-description">
            Fragile items receive special handling and packaging
          </p>
        </div>
      </div>

      {/* Insurance Section */}
      <div className="package-section">
        <div className="section-header">
          <div className="section-icon">🛡️</div>
          <div className="section-info">
            <h3 className="section-title">Insurance Coverage</h3>
            <p className="section-description">Protect your shipment with insurance coverage</p>
          </div>
        </div>

        <div className="insurance-toggle">
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              id="insurance"
              checked={values.packageDetails.insurance}
              onChange={(e) => handleInsuranceToggle(e.target.checked)}
              className="toggle-checkbox"
            />
            <label htmlFor="insurance" className="toggle-label">
              <span className="toggle-switch"></span>
              <span className="toggle-text">
                <span className="toggle-icon">🛡️</span>
                Add Insurance Coverage
              </span>
            </label>
          </div>
          <p className="toggle-description">
            Insurance covers loss or damage during transit
          </p>
        </div>

        {values.packageDetails.insurance && (
          <div className="insurance-details">
            <div className="form-row">
              <div className="form-group">
                <StepFieldWrapper
                  name="packageDetails.insuranceValue"
                  label="Insurance Value (₹)"
                  placeholder="Enter insurance value"
                  type="number"
                />
              </div>
            </div>

            <div className="insurance-info">
              <h4>Insurance Benefits:</h4>
              <ul>
                <li>Full coverage for declared value</li>
                <li>Quick claim processing</li>
                <li>24/7 customer support</li>
                <li>Premium: 2% of declared value (minimum ₹50)</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Package Guidelines */}
      <div className="package-guidelines">
        <h4 className="guidelines-title">📋 Packaging Guidelines</h4>
        <div className="guidelines-grid">
          <div className="guideline-item">
            <div className="guideline-icon">📦</div>
            <h5>Proper Packaging</h5>
            <p>Use appropriate packaging materials and ensure items are secure</p>
          </div>

          <div className="guideline-item">
            <div className="guideline-icon">⚖️</div>
            <h5>Accurate Weight</h5>
            <p>Provide accurate weight to avoid additional charges</p>
          </div>

          <div className="guideline-item">
            <div className="guideline-icon">🔸</div>
            <h5>Fragile Items</h5>
            <p>Mark fragile items for special handling and protection</p>
          </div>

          <div className="guideline-item">
            <div className="guideline-icon">🛡️</div>
            <h5>Insurance</h5>
            <p>Consider insurance for valuable or important items</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepThreeFormFields;
