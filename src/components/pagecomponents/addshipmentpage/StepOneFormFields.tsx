import React from 'react';
import SingleSelect from "../../ui/select/SingleSelect";
import MultiSelect from "../../ui/select/MultiSelect";
import SwitchButton from "../../ui/switch/SwitchButton";
import StepFieldWrapper from "./StepFieldWrapper";
import { MultiValue } from "react-select";

interface StepOneFormFieldsProps {
  values: any;
  setFieldValue: (field: string, value: any) => void;
  errors?: any;
  touched?: any;
}

const StepOneFormFields: React.FC<StepOneFormFieldsProps> = ({
  values,
  setFieldValue
}) => {
  const categoryOptions = [
    { value: "document", label: "Document" },
    { value: "parcel", label: "Parcel" },
    { value: "cargo", label: "Cargo" },
    { value: "express", label: "Express" },
    { value: "fragile", label: "Fragile Items" },
  ];

  const commodityOptions = [
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "books", label: "Books" },
    { value: "food", label: "Food Items" },
    { value: "medicine", label: "Medicine" },
    { value: "documents", label: "Documents" },
    { value: "jewelry", label: "Jewelry" },
    { value: "other", label: "Other" },
  ];

  const paymentModeOptions = [
    { value: "card", label: "Card" },
    { value: "cash", label: "Cash" },
    { value: "upi", label: "UPI" },
    { value: "netbanking", label: "Net Banking" },
    { value: "cod", label: "Cash on Delivery" },
  ];

  const serviceTypeOptions = [
    { value: "standard", label: "Standard" },
    { value: "express", label: "Express" },
    { value: "overnight", label: "Overnight" },
    { value: "same-day", label: "Same Day" },
  ];

  return (
    <>
      <div className="col-md-4">
        <StepFieldWrapper name="name" label="Name" />
      </div>
      <div className="col-md-4">
        <StepFieldWrapper name="category" label="Category">
          <SingleSelect
            options={categoryOptions}
            value={values.category}
            onChange={(option) => setFieldValue("category", option)}
            placeholder="Select category"
          />
        </StepFieldWrapper>
      </div>
      <div className="col-md-4">
        <StepFieldWrapper name="commodity" label="Commodity">
          <MultiSelect
            options={commodityOptions}
            value={values.commodity}
            onChange={(option: MultiValue<any>) => setFieldValue("commodity", option)}
            placeholder="Select commodities"
          />
        </StepFieldWrapper>
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="netWeight" label="Net Weight (gm.)" />
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="grossWeight" label="Gross Weight (gm.)" />
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="paymentMode" label="Payment Mode">
          <MultiSelect
            options={paymentModeOptions}
            value={values.paymentMode}
            onChange={(option: MultiValue<any>) => setFieldValue("paymentMode", option)}
            placeholder="Select payment modes"
          />
        </StepFieldWrapper>
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="numberOfParcel" label="Number Of Parcel" />
      </div>
      <div className="col-md-4">
        <StepFieldWrapper name="serviceType" label="Service Type">
          <MultiSelect
            options={serviceTypeOptions}
            value={values.serviceType}
            onChange={(option: MultiValue<any>) => setFieldValue("serviceType", option)}
            placeholder="Select service types"
          />
          <p className="errorText">
            Note: Express Delivery will incur extra charges*
          </p>
        </StepFieldWrapper>
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="insurance" label="Insurance by AXLPL">
          <div className="radioBtnWrap">
            <SwitchButton
              id="insurance"
              name="insurance"
              label=""
              checked={values.insurance}
              onChange={(e) => setFieldValue("insurance", e.target.checked)}
            />
          </div>
        </StepFieldWrapper>
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="expiryDate" label="Expiry Date" type="date" />
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="policyNumber" label="Policy Number" />
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="insuranceValue" label="Insurance Value (₹)" />
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="invoiceValue" label="Invoice Value (₹)" />
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="remark" label="Remark" />
      </div>
    </>
  );
};

export default StepOneFormFields;
