import React, { useState } from 'react';
import SingleSelect from "../../ui/select/SingleSelect";
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

  const stateOptions = [
    { value: "andhra-pradesh", label: "Andhra Pradesh" },
    { value: "arunachal-pradesh", label: "Arunachal Pradesh" },
    { value: "assam", label: "Assam" },
    { value: "bihar", label: "Bihar" },
    { value: "chhattisgarh", label: "Chhattisgarh" },
    { value: "goa", label: "Goa" },
    { value: "gujarat", label: "Gujarat" },
    { value: "haryana", label: "Haryana" },
    { value: "himachal-pradesh", label: "Himachal Pradesh" },
    { value: "jharkhand", label: "Jharkhand" },
    { value: "karnataka", label: "Karnataka" },
    { value: "kerala", label: "Kerala" },
    { value: "madhya-pradesh", label: "Madhya Pradesh" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "manipur", label: "Manipur" },
    { value: "meghalaya", label: "Meghalaya" },
    { value: "mizoram", label: "Mizoram" },
    { value: "nagaland", label: "Nagaland" },
    { value: "odisha", label: "Odisha" },
    { value: "punjab", label: "Punjab" },
    { value: "rajasthan", label: "Rajasthan" },
    { value: "sikkim", label: "Sikkim" },
    { value: "tamil-nadu", label: "Tamil Nadu" },
    { value: "telangana", label: "Telangana" },
    { value: "tripura", label: "Tripura" },
    { value: "uttar-pradesh", label: "Uttar Pradesh" },
    { value: "uttarakhand", label: "Uttarakhand" },
    { value: "west-bengal", label: "West Bengal" },
    { value: "delhi", label: "Delhi" },
  ];

  const handleSameAsPickup = (checked: boolean) => {
    setSameAsPickup(checked);
    if (checked) {
      setFieldValue('receiverName', values.senderName);
      setFieldValue('receiverCompanyName', values.senderCompanyName);
      setFieldValue('receiverZipCode', values.senderZipCode);
      setFieldValue('receiverState', values.senderState);
      setFieldValue('receiverCity', values.senderCity);
      setFieldValue('receiverArea', values.senderArea);
      setFieldValue('receiverGstNo', values.senderGstNo);
      setFieldValue('receiverAddressLine1', values.senderAddressLine1);
      setFieldValue('receiverAddressLine2', values.senderAddressLine2);
      setFieldValue('receiverMobile', values.senderMobile);
      setFieldValue('receiverEmail', values.senderEmail);
    } else {
      setFieldValue('receiverName', '');
      setFieldValue('receiverCompanyName', '');
      setFieldValue('receiverZipCode', '');
      setFieldValue('receiverState', null);
      setFieldValue('receiverCity', '');
      setFieldValue('receiverArea', null);
      setFieldValue('receiverGstNo', '');
      setFieldValue('receiverAddressLine1', '');
      setFieldValue('receiverAddressLine2', '');
      setFieldValue('receiverMobile', '');
      setFieldValue('receiverEmail', '');
    }
  };

  return (
    <>
      {/* Sender Info Section */}
      <div className="col-md-12">
        <h4 className="section-title">Sender Info</h4>
      </div>

      <div className="col-md-2">
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="senderAddressType"
            id="newSenderAddress"
            value="new"
            checked={values.senderAddressType === 'new'}
            onChange={(e) => setFieldValue('senderAddressType', e.target.value)}
          />
          <label className="form-check-label" htmlFor="newSenderAddress">
            New Address
          </label>
        </div>
      </div>

      <div className="col-md-2">
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="senderAddressType"
            id="existingSenderAddress"
            value="existing"
            checked={values.senderAddressType === 'existing'}
            onChange={(e) => setFieldValue('senderAddressType', e.target.value)}
          />
          <label className="form-check-label" htmlFor="existingSenderAddress">
            Existing Address
          </label>
        </div>
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="senderName" label="Name" />
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="senderCompanyName" label="Company Name" />
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="senderZipCode" label="Zip Code" />
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="senderState" label="State">
          <SingleSelect
            options={stateOptions}
            value={values.senderState}
            onChange={(option) => setFieldValue('senderState', option)}
            placeholder="Select State"
          />
        </StepFieldWrapper>
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="senderCity" label="City" />
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="senderArea" label="Area">
          <SingleSelect
            options={[]} // Will be populated based on city selection
            value={values.senderArea}
            onChange={(option) => setFieldValue('senderArea', option)}
            placeholder="Select Area"
          />
          <button type="button" className="btn btn-sm btn-outline-primary mt-1">
            Add Area
          </button>
        </StepFieldWrapper>
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="senderGstNo" label="GST No." />
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="senderAddressLine1" label="Address Line 1" />
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="senderAddressLine2" label="Address Line 2" />
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="senderMobile" label="Mobile" type="tel" />
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="senderEmail" label="Email" type="email" />
      </div>

      {/* Bill To Section */}
      <div className="col-md-12 mt-4">
        <h4 className="section-title">Bill To</h4>
      </div>

      <div className="col-md-2">
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="billTo"
            id="billToSender"
            value="sender"
            checked={values.billTo === 'sender'}
            onChange={(e) => setFieldValue('billTo', e.target.value)}
          />
          <label className="form-check-label" htmlFor="billToSender">
            Sender
          </label>
        </div>
      </div>

      <div className="col-md-2">
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="billTo"
            id="billToReceiver"
            value="receiver"
            checked={values.billTo === 'receiver'}
            onChange={(e) => setFieldValue('billTo', e.target.value)}
          />
          <label className="form-check-label" htmlFor="billToReceiver">
            Receiver
          </label>
        </div>
      </div>

      {/* Receiver Info Section */}
      <div className="col-md-12 mt-4">
        <h4 className="section-title">Receiver Info</h4>
      </div>

      <div className="col-md-2">
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="receiverAddressType"
            id="newReceiverAddress"
            value="new"
            checked={values.receiverAddressType === 'new'}
            onChange={(e) => setFieldValue('receiverAddressType', e.target.value)}
          />
          <label className="form-check-label" htmlFor="newReceiverAddress">
            New Address
          </label>
        </div>
      </div>

      <div className="col-md-2">
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="receiverAddressType"
            id="existingReceiverAddress"
            value="existing"
            checked={values.receiverAddressType === 'existing'}
            onChange={(e) => setFieldValue('receiverAddressType', e.target.value)}
          />
          <label className="form-check-label" htmlFor="existingReceiverAddress">
            Existing Address
          </label>
        </div>
      </div>

      <div className="col-md-2">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="sameAsPickup"
            checked={sameAsPickup}
            onChange={(e) => handleSameAsPickup(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="sameAsPickup">
            Same as Sender
          </label>
        </div>
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="receiverName" label="Name" />
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="receiverCompanyName" label="Company Name" />
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="receiverZipCode" label="Zip Code" />
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="receiverState" label="State">
          <SingleSelect
            options={stateOptions}
            value={values.receiverState}
            onChange={(option) => setFieldValue('receiverState', option)}
            placeholder="Select State"
          />
        </StepFieldWrapper>
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="receiverCity" label="City" />
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="receiverArea" label="Area">
          <SingleSelect
            options={[]} // Will be populated based on city selection
            value={values.receiverArea}
            onChange={(option) => setFieldValue('receiverArea', option)}
            placeholder="Select Area"
          />
          <button type="button" className="btn btn-sm btn-outline-primary mt-1">
            Add Area
          </button>
        </StepFieldWrapper>
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="receiverGstNo" label="GST No." />
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="receiverAddressLine1" label="Address Line 1" />
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="receiverAddressLine2" label="Address Line 2" />
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="receiverMobile" label="Mobile" type="tel" />
      </div>

      <div className="col-md-2">
        <StepFieldWrapper name="receiverEmail" label="Email" type="email" />
      </div>
    </>
  );
};

export default StepTwoFormFields;
