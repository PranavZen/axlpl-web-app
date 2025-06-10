import React, { useMemo, useEffect } from 'react';
import StepFieldWrapper from "./StepFieldWrapper";

// Interfaces for pricing data structures
interface PricingData {
  // Metro slabs
  metro_slab1_weight_from: string;
  metro_slab1_weight_to: string;
  metro_slab1_weight_comm: string;
  metro_slab2_weight_from: string;
  metro_slab2_weight_to: string;
  metro_slab2_weight_comm: string;
  metro_slab3_weight_from: string;
  metro_slab3_weight_to: string;
  metro_slab3_weight_comm: string;
  metro_slab4_weight_from: string;
  metro_slab4_weight_to: string;
  metro_slab4_weight_comm: string;
  metro_slab5_weight_from: string;
  metro_slab5_weight_to: string;
  metro_slab5_weight_comm: string;
  metro_slab6_weight_from: string;
  metro_slab6_weight_to: string;
  metro_slab6_weight_comm: string;

  // Non-metro slabs
  non_metro_slab1_weight_from: string;
  non_metro_slab1_weight_to: string;
  non_metro_slab1_weight_comm: string;
  non_metro_slab2_weight_from: string;
  non_metro_slab2_weight_to: string;
  non_metro_slab2_weight_comm: string;
  non_metro_slab3_weight_from: string;
  non_metro_slab3_weight_to: string;
  non_metro_slab3_weight_comm: string;
  non_metro_slab4_weight_from: string;
  non_metro_slab4_weight_to: string;
  non_metro_slab4_weight_comm: string;
  non_metro_slab5_weight_from: string;
  non_metro_slab5_weight_to: string;
  non_metro_slab5_weight_comm: string;
  non_metro_slab6_weight_from: string;
  non_metro_slab6_weight_to: string;
  non_metro_slab6_weight_comm: string;

  // Flat rates (fallback)
  flate_rate_1: string;
  flate_rate_2: string;
  flate_rate_3: string;
  flate_rate_4: string;
  flate_rate_5: string;
  flate_rate_6: string;

  // Insurance rates
  metro_insurance_charges: string;
  non_metro_insurance_charges: string;
}

interface ProductDetail {
  metro_handling_charges: string;
  non_metro_handling_charges: string;
  metro_insurance_charges: string;
  non_metro_insurance_charges: string;
}

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
  // Calculate charges based on form values using the provided logic
  const calculateCharges = useMemo(() => {
    // Mock pricing data - In real implementation, this would come from API/Redux store
    const mockPricingData: PricingData = {
      metro_slab1_weight_from: "0",
      metro_slab1_weight_to: "500",
      metro_slab1_weight_comm: "0.15",
      metro_slab2_weight_from: "501",
      metro_slab2_weight_to: "1000",
      metro_slab2_weight_comm: "0.12",
      metro_slab3_weight_from: "1001",
      metro_slab3_weight_to: "2000",
      metro_slab3_weight_comm: "0.10",
      metro_slab4_weight_from: "2001",
      metro_slab4_weight_to: "5000",
      metro_slab4_weight_comm: "0.08",
      metro_slab5_weight_from: "5001",
      metro_slab5_weight_to: "10000",
      metro_slab5_weight_comm: "0.06",
      metro_slab6_weight_from: "10001",
      metro_slab6_weight_to: "50000",
      metro_slab6_weight_comm: "0.05",

      non_metro_slab1_weight_from: "0",
      non_metro_slab1_weight_to: "500",
      non_metro_slab1_weight_comm: "0.18",
      non_metro_slab2_weight_from: "501",
      non_metro_slab2_weight_to: "1000",
      non_metro_slab2_weight_comm: "0.15",
      non_metro_slab3_weight_from: "1001",
      non_metro_slab3_weight_to: "2000",
      non_metro_slab3_weight_comm: "0.12",
      non_metro_slab4_weight_from: "2001",
      non_metro_slab4_weight_to: "5000",
      non_metro_slab4_weight_comm: "0.10",
      non_metro_slab5_weight_from: "5001",
      non_metro_slab5_weight_to: "10000",
      non_metro_slab5_weight_comm: "0.08",
      non_metro_slab6_weight_from: "10001",
      non_metro_slab6_weight_to: "50000",
      non_metro_slab6_weight_comm: "0.06",

      flate_rate_1: "0.20",
      flate_rate_2: "0.18",
      flate_rate_3: "0.15",
      flate_rate_4: "0.12",
      flate_rate_5: "0.10",
      flate_rate_6: "0.08",

      metro_insurance_charges: "0.02",
      non_metro_insurance_charges: "0.025"
    };

    // Mock product details - In real implementation, this would come from selected commodities
    const mockProductDetails: ProductDetail[] = [
      {
        metro_handling_charges: "25.00",
        non_metro_handling_charges: "30.00",
        metro_insurance_charges: "0.02",
        non_metro_insurance_charges: "0.025"
      }
    ];

    // Mock custom array for special rates
    const mockCustomArray: ProductDetail[] = [];
    const grossWeight = parseFloat(values.grossWeight || "0");
    const invoiceValue = parseFloat(values.invoiceValue || "0");
    const insuranceValue = parseFloat(values.insuranceValue || "0");
    const isMetro = 1; // Mock value - should be determined based on delivery location
    const isAxlplInsurance = values.insurance || false;

    let grossWeightRatePerKg = 0;
    let insuranceCharge = 0;
    let handlingCharge = 0;

    const data = mockPricingData;
    const productDetailObj = mockProductDetails;
    const customArray = mockCustomArray;

    // Metro city calculation
    if (isMetro === 1) {
      // Slab 1
      if (grossWeight >= parseFloat(data.metro_slab1_weight_from) &&
          parseFloat(data.metro_slab1_weight_to) >= grossWeight) {
        grossWeightRatePerKg = 0;
        if (data.metro_slab1_weight_comm !== "" && data.metro_slab1_weight_comm !== "") {
          grossWeightRatePerKg = grossWeight * parseFloat(data.metro_slab1_weight_comm);
        } else {
          grossWeightRatePerKg = grossWeight * parseFloat(data.flate_rate_1);
        }
      }

      // Slab 2
      if (data.metro_slab2_weight_from !== "" && data.metro_slab2_weight_to !== "") {
        if (grossWeight >= parseFloat(data.metro_slab2_weight_from) &&
            parseFloat(data.metro_slab2_weight_to) >= grossWeight) {
          grossWeightRatePerKg = 0;
          if (data.metro_slab2_weight_comm !== "" && data.metro_slab2_weight_comm !== "") {
            grossWeightRatePerKg = grossWeight * parseFloat(data.metro_slab2_weight_comm);
          } else {
            grossWeightRatePerKg = grossWeight * parseFloat(data.flate_rate_2);
          }
        }
      }

      // Slab 3
      if (data.metro_slab3_weight_from !== "" && data.metro_slab3_weight_to !== "") {
        if (grossWeight >= parseFloat(data.metro_slab3_weight_from) &&
            parseFloat(data.metro_slab3_weight_to) >= grossWeight) {
          grossWeightRatePerKg = 0;
          if (data.metro_slab3_weight_comm !== "" && data.metro_slab3_weight_comm !== "") {
            grossWeightRatePerKg = grossWeight * parseFloat(data.metro_slab3_weight_comm);
          } else {
            grossWeightRatePerKg = grossWeight * parseFloat(data.flate_rate_3);
          }
        }
      }

      // Slab 4
      if (data.metro_slab4_weight_from !== "" && data.metro_slab4_weight_to !== "") {
        if (grossWeight >= parseFloat(data.metro_slab4_weight_from) &&
            parseFloat(data.metro_slab4_weight_to) >= grossWeight) {
          grossWeightRatePerKg = 0;
          if (data.metro_slab4_weight_comm !== "" && data.metro_slab4_weight_comm !== "") {
            grossWeightRatePerKg = grossWeight * parseFloat(data.metro_slab4_weight_comm);
          } else {
            grossWeightRatePerKg = grossWeight * parseFloat(data.flate_rate_4);
          }
        }
      }

      // Slab 5
      if (data.metro_slab5_weight_from !== "" && data.metro_slab5_weight_to !== "") {
        if (grossWeight >= parseFloat(data.metro_slab5_weight_from) &&
            parseFloat(data.metro_slab5_weight_to) >= grossWeight) {
          grossWeightRatePerKg = 0;
          if (data.metro_slab5_weight_comm !== "" && data.metro_slab5_weight_comm !== "") {
            grossWeightRatePerKg = grossWeight * parseFloat(data.metro_slab5_weight_comm);
          } else {
            grossWeightRatePerKg = grossWeight * parseFloat(data.flate_rate_5);
          }
        }
      }

      // Slab 6
      if (data.metro_slab6_weight_from !== "" && data.metro_slab6_weight_to !== "") {
        if (grossWeight >= parseFloat(data.metro_slab6_weight_from) &&
            parseFloat(data.metro_slab6_weight_to) >= grossWeight) {
          grossWeightRatePerKg = 0;
          if (data.metro_slab6_weight_comm !== "" && data.metro_slab6_weight_comm !== "") {
            grossWeightRatePerKg = grossWeight * parseFloat(data.metro_slab6_weight_comm);
          } else {
            grossWeightRatePerKg = grossWeight * parseFloat(data.flate_rate_6);
          }
        }
      }

      // Calculate handling charges for metro
      handlingCharge = 0;
      for (let i = 0; i < productDetailObj.length; i++) {
        const handlingChargeVal = parseFloat(productDetailObj[i].metro_handling_charges);
        handlingCharge = handlingCharge + handlingChargeVal;
      }
    } else {
      // Non-metro city calculation
      // Slab 1
      if (grossWeight >= parseFloat(data.non_metro_slab1_weight_from) &&
          parseFloat(data.non_metro_slab1_weight_to) >= grossWeight) {
        grossWeightRatePerKg = 0;
        if (data.non_metro_slab1_weight_comm !== "" && data.non_metro_slab1_weight_comm !== "") {
          grossWeightRatePerKg = grossWeight * parseFloat(data.non_metro_slab1_weight_comm);
        } else {
          grossWeightRatePerKg = grossWeight * parseFloat(data.flate_rate_1);
        }
      }

      // Slab 2
      if (data.non_metro_slab2_weight_from !== "" && data.non_metro_slab2_weight_to !== "") {
        if (grossWeight >= parseFloat(data.non_metro_slab2_weight_from) &&
            parseFloat(data.non_metro_slab2_weight_to) >= grossWeight) {
          grossWeightRatePerKg = 0;
          if (data.non_metro_slab2_weight_comm !== "" && data.non_metro_slab2_weight_comm !== "") {
            grossWeightRatePerKg = grossWeight * parseFloat(data.non_metro_slab2_weight_comm);
          } else {
            grossWeightRatePerKg = grossWeight * parseFloat(data.flate_rate_2);
          }
        }
      }

      // Slab 3
      if (data.non_metro_slab3_weight_from !== "" && data.non_metro_slab3_weight_to !== "") {
        if (grossWeight >= parseFloat(data.non_metro_slab3_weight_from) &&
            parseFloat(data.non_metro_slab3_weight_to) >= grossWeight) {
          grossWeightRatePerKg = 0;
          if (data.non_metro_slab3_weight_comm !== "" && data.non_metro_slab3_weight_comm !== "") {
            grossWeightRatePerKg = grossWeight * parseFloat(data.non_metro_slab3_weight_comm);
          } else {
            grossWeightRatePerKg = grossWeight * parseFloat(data.flate_rate_3);
          }
        }
      }

      // Slab 4
      if (data.non_metro_slab4_weight_from !== "" && data.non_metro_slab4_weight_to !== "") {
        if (grossWeight >= parseFloat(data.non_metro_slab4_weight_from) &&
            parseFloat(data.non_metro_slab4_weight_to) >= grossWeight) {
          grossWeightRatePerKg = 0;
          if (data.non_metro_slab4_weight_comm !== "" && data.non_metro_slab4_weight_comm !== "") {
            grossWeightRatePerKg = grossWeight * parseFloat(data.non_metro_slab4_weight_comm);
          } else {
            grossWeightRatePerKg = grossWeight * parseFloat(data.flate_rate_4);
          }
        }
      }

      // Slab 5
      if (data.non_metro_slab5_weight_from !== "" && data.non_metro_slab5_weight_to !== "") {
        if (grossWeight >= parseFloat(data.non_metro_slab5_weight_from) &&
            parseFloat(data.non_metro_slab5_weight_to) >= grossWeight) {
          grossWeightRatePerKg = 0;
          if (data.non_metro_slab5_weight_comm !== "" && data.non_metro_slab5_weight_comm !== "") {
            grossWeightRatePerKg = grossWeight * parseFloat(data.non_metro_slab5_weight_comm);
          } else {
            grossWeightRatePerKg = grossWeight * parseFloat(data.flate_rate_5);
          }
        }
      }

      // Slab 6
      if (data.non_metro_slab6_weight_from !== "" && data.non_metro_slab6_weight_to !== "") {
        if (grossWeight >= parseFloat(data.non_metro_slab6_weight_from) &&
            parseFloat(data.non_metro_slab6_weight_to) >= grossWeight) {
          grossWeightRatePerKg = 0;
          if (data.non_metro_slab6_weight_comm !== "" && data.non_metro_slab6_weight_comm !== "") {
            grossWeightRatePerKg = grossWeight * parseFloat(data.non_metro_slab6_weight_comm);
          } else {
            grossWeightRatePerKg = grossWeight * parseFloat(data.flate_rate_6);
          }
        }
      }

      // Calculate handling charges for non-metro
      handlingCharge = 0;
      for (let i = 0; i < productDetailObj.length; i++) {
        const handlingChargeVal = parseFloat(productDetailObj[i].non_metro_handling_charges);
        handlingCharge = handlingCharge + handlingChargeVal;
      }
    }

    // Insurance calculation logic
    let additionalCharge = 0;

    if (!isAxlplInsurance) {
      // Not using AXLPL insurance
      if (insuranceValue >= invoiceValue) {
        additionalCharge = 0;
        insuranceCharge = additionalCharge;
      } else {
        additionalCharge = invoiceValue - insuranceValue;
        if (customArray.length > 0) {
          insuranceCharge = invoiceValue * parseFloat(customArray[0].non_metro_insurance_charges);
          insuranceCharge = insuranceCharge / 100;
        } else {
          const insuranceRate = isMetro === 1 ?
            parseFloat(data.metro_insurance_charges) :
            parseFloat(data.non_metro_insurance_charges);
          insuranceCharge = invoiceValue * insuranceRate;
          insuranceCharge = insuranceCharge / 100;
        }
      }
    } else {
      // Using AXLPL insurance
      additionalCharge = 0;
      if (insuranceValue < invoiceValue) {
        additionalCharge = invoiceValue - insuranceValue;
      }

      if (customArray.length > 0) {
        insuranceCharge = invoiceValue * parseFloat(customArray[0].non_metro_insurance_charges);
        insuranceCharge = insuranceCharge / 100;
      } else {
        const insuranceRate = isMetro === 1 ?
          parseFloat(data.metro_insurance_charges) :
          parseFloat(data.non_metro_insurance_charges);
        insuranceCharge = invoiceValue * insuranceRate;
        insuranceCharge = insuranceCharge / 100;
      }
    }

    // Calculate totals
    const totalCharges = grossWeightRatePerKg + insuranceCharge + handlingCharge;
    const gstPercentage = 18; // 18% GST
    const gstAmount = totalCharges * (gstPercentage / 100);
    const grandTotal = totalCharges + gstAmount;

    return {
      shipmentCharges: grossWeightRatePerKg.toFixed(2),
      insuranceCharges: insuranceCharge.toFixed(2),
      handlingCharges: handlingCharge.toFixed(2),
      totalCharges: totalCharges.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      grandTotal: grandTotal.toFixed(2)
    };
  }, [values.grossWeight, values.invoiceValue, values.insuranceValue, values.insurance]);

  const charges = calculateCharges;

  // Update form values with calculated charges
  useEffect(() => {
    setFieldValue("shipmentCharges", charges.shipmentCharges);
    setFieldValue("insuranceCharges", charges.insuranceCharges);
    setFieldValue("handlingCharges", charges.handlingCharges);
    setFieldValue("totalCharges", charges.totalCharges);
    setFieldValue("gstAmount", charges.gstAmount);
    setFieldValue("grandTotal", charges.grandTotal);
  }, [charges, setFieldValue]);

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
