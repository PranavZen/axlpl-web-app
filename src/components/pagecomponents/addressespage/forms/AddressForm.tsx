import React from "react";
import Input from "../../../ui/input/Input";
import Label from "../../../ui/label/Label";
import SingleSelect from "../../../ui/select/SingleSelect";

// Define the AddressFormData interface
export interface AddressFormData {
  name: string;
  company_name: string;
  country_id: string;
  state_id: string;
  city_id: string;
  area_id: string;
  zip_code: string;
  address1: string;
  address2: string;
  mobile_no: string;
  email: string;
  sender_gst_no: string;
}

// Define the initial form data
export const initialAddressFormData: AddressFormData = {
  name: "",
  company_name: "",
  country_id: "",
  state_id: "",
  city_id: "",
  area_id: "",
  zip_code: "",
  address1: "",
  address2: "",
  mobile_no: "",
  email: "",
  sender_gst_no: "",
};

// Define the props for the AddressForm component
interface AddressFormProps {
  formData: AddressFormData;
  isEditMode: boolean;
  formSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSelectChange: (name: string) => (option: any) => void;
  onCancel: () => void;
}

/**
 * A form component for adding or editing addresses
 */
const AddressForm: React.FC<AddressFormProps> = ({
  formData,
  isEditMode,
  formSubmitting,
  onSubmit,
  onInputChange,
  onSelectChange,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="row mb-3">
        <div className="col-md-6">
          <Label htmlFor="name" text="Name" className="form-label" />
          <Input
            type="text"
            id="name"
            name="name"
            className="form-control innerFormControll"
            value={formData.name}
            onChange={onInputChange}
            onBlur={() => {}}
            placeHolder="Enter name"
          />
        </div>
        <div className="col-md-6">
          <Label
            htmlFor="company_name"
            text="Company Name"
            className="form-label"
          />
          <Input
            type="text"
            id="company_name"
            name="company_name"
            className="form-control innerFormControll"
            value={formData.company_name}
            onChange={onInputChange}
            onBlur={() => {}}
            placeHolder="Enter company name"
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <Label htmlFor="country_id" text="Country" className="form-label" />
          <SingleSelect
            id="country_id"
            options={[
              { value: "", label: "Select Country" },
              { value: "1", label: "India" },
            ]}
            value={
              formData.country_id
                ? {
                    value: formData.country_id,
                    label: formData.country_id === "1" ? "India" : "",
                  }
                : null
            }
            onChange={onSelectChange("country_id")}
            placeholder="Select Country"
          />
        </div>
        <div className="col-md-6">
          <Label htmlFor="state_id" text="State" className="form-label" />
          <SingleSelect
            id="state_id"
            options={[
              { value: "", label: "Select State" },
              { value: "4", label: "Maharashtra" },
            ]}
            value={
              formData.state_id
                ? {
                    value: formData.state_id,
                    label: formData.state_id === "4" ? "Maharashtra" : "",
                  }
                : null
            }
            onChange={onSelectChange("state_id")}
            placeholder="Select State"
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <Label htmlFor="city_id" text="City" className="form-label" />
          <SingleSelect
            id="city_id"
            options={[
              { value: "", label: "Select City" },
              { value: "817", label: "Mumbai" },
            ]}
            value={
              formData.city_id
                ? {
                    value: formData.city_id,
                    label: formData.city_id === "817" ? "Mumbai" : "",
                  }
                : null
            }
            onChange={onSelectChange("city_id")}
            placeholder="Select City"
          />
        </div>
        <div className="col-md-6">
          <Label htmlFor="area_id" text="Area" className="form-label" />
          <SingleSelect
            id="area_id"
            options={[
              { value: "", label: "Select Area" },
              { value: "20745", label: "4 TH KUMBHARWADA" },
            ]}
            value={
              formData.area_id
                ? {
                    value: formData.area_id,
                    label:
                      formData.area_id === "20745" ? "4 TH KUMBHARWADA" : "",
                  }
                : null
            }
            onChange={onSelectChange("area_id")}
            placeholder="Select Area"
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <Label htmlFor="zip_code" text="Zip Code" className="form-label" />
          <Input
            type="text"
            id="zip_code"
            name="zip_code"
            className="form-control innerFormControll"
            value={formData.zip_code}
            onChange={onInputChange}
            onBlur={() => {}}
            placeHolder="Enter zip code"
          />
        </div>
        <div className="col-md-6">
          <Label
            htmlFor="mobile_no"
            text="Mobile Number"
            className="form-label"
          />
          <Input
            type="text"
            id="mobile_no"
            name="mobile_no"
            className="form-control innerFormControll"
            value={formData.mobile_no}
            onChange={onInputChange}
            onBlur={() => {}}
            placeHolder="Enter mobile number"
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <Label htmlFor="email" text="Email" className="form-label" />
          <Input
            type="email"
            id="email"
            name="email"
            className="form-control innerFormControll"
            value={formData.email}
            onChange={onInputChange}
            onBlur={() => {}}
            placeHolder="Enter email"
          />
        </div>
        <div className="col-md-6">
          <Label
            htmlFor="sender_gst_no"
            text="GST Number"
            className="form-label"
          />
          <Input
            type="text"
            id="sender_gst_no"
            name="sender_gst_no"
            className="form-control innerFormControll"
            value={formData.sender_gst_no}
            onChange={onInputChange}
            onBlur={() => {}}
            placeHolder="Enter GST number"
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-12">
          <Label
            htmlFor="address1"
            text="Address Line 1"
            className="form-label"
          />
          <Input
            type="text"
            id="address1"
            name="address1"
            className="form-control innerFormControll"
            value={formData.address1}
            onChange={onInputChange}
            onBlur={() => {}}
            placeHolder="Enter address line 1"
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-12">
          <Label
            htmlFor="address2"
            text="Address Line 2"
            className="form-label"
          />
          <Input
            type="text"
            id="address2"
            name="address2"
            className="form-control innerFormControll"
            value={formData.address2}
            onChange={onInputChange}
            onBlur={() => {}}
            placeHolder="Enter address line 2"
          />
        </div>
      </div>
    </form>
  );
};

export default AddressForm;
