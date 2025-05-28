import { MultiValue } from "react-select";
import MultiSelect from "../../ui/select/MultiSelect";
import SingleSelect from "../../ui/select/SingleSelect";
import SwitchButton from "../../ui/switch/SwitchButton";
import StepFieldWrapper from "./StepFieldWrapper";

const StepOneFormFields = ({ values, setFieldValue }: any) => (
  <>
    <div className="col-md-4">
      <StepFieldWrapper name="name" label="Customer Name" />
    </div>
    <div className="col-md-4">
      <StepFieldWrapper name="category" label="Category">
        <SingleSelect
          options={[
            { value: "fruits", label: "Fruits" },
            { value: "vegetables", label: "Vegetables" },
            { value: "dairy", label: "Dairy" },
          ]}
          value={values.category}
          onChange={(option) => setFieldValue("category", [option])}
        />
      </StepFieldWrapper>
    </div>
    <div className="col-md-4">
      <StepFieldWrapper name="commodity" label="Commodity">
        <MultiSelect
          options={[
            { value: "fruits", label: "Fruits" },
            { value: "vegetables", label: "Vegetables" },
            { value: "dairy", label: "Dairy" },
          ]}
          value={values.commodity}
          onChange={(option: MultiValue<any>) =>
            setFieldValue("commodity", option)
          }
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
          options={[
            { value: "card", label: "Card" },
            { value: "cash", label: "Cash" },
            { value: "upi", label: "UPI" },
          ]}
          value={values.paymentMode}
          onChange={(option: MultiValue<any>) =>
            setFieldValue("paymentMode", option)
          }
        />
      </StepFieldWrapper>
    </div>
    <div className="col-md-2">
      <StepFieldWrapper name="numberOfParcel" label="Number Of Parcel" />
    </div>
    <div className="col-md-4">
      <StepFieldWrapper name="serviceType" label="Service Type">
        <MultiSelect
          options={[
            { value: "standard", label: "Standard" },
            { value: "express", label: "Express" },
          ]}
          value={values.serviceType}
          onChange={(option: MultiValue<any>) =>
            setFieldValue("serviceType", option)
          }
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

export default StepOneFormFields;
