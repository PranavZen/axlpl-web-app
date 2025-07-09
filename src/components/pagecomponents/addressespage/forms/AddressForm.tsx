import React, { useEffect, useRef, useState } from "react";
import Input from "../../../ui/input/Input";
import Label from "../../../ui/label/Label";
import SingleSelect from "../../../ui/select/SingleSelect";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import {
  fetchPincodeDetail,
  fetchAreasByPincode,
} from "../../../../redux/slices/pincodeSlice";
import { areasToOptions } from "../../../../utils/customerUtils";

export interface AddressFormData {
  name: string;
  company_name: string;
  country_id: string;
  state_id: { value: string; label: string };
  city_id: { value: string; label: string };
  area_id: { value: string; label: string };
  zip_code: string;
  address1: string;
  address2: string;
  mobile_no: string;
  email: string;
  sender_gst_no: string;
}

export const initialAddressFormData: AddressFormData = {
  name: "",
  company_name: "",
  country_id: "",
  state_id: { value: "", label: "" },
  city_id: { value: "", label: "" },
  area_id: { value: "", label: "" },
  zip_code: "",
  address1: "",
  address2: "",
  mobile_no: "",
  email: "",
  sender_gst_no: "",
};

interface AddressFormProps {
  formData: AddressFormData;
  isEditMode: boolean;
  formSubmitting: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSelectChange: (name: string) => (option: any) => void;
  onCancel: () => void;
  errors?: { [key: string]: string };
}

const AddressForm: React.FC<AddressFormProps> = ({
  formData,
  isEditMode,
  formSubmitting,
  onInputChange,
  onSelectChange,
  onCancel,
  errors = {},
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { pincodeDetail, areas, loading } = useSelector(
    (state: RootState) => state.pincode
  );
  // console.log("pincodeDetail", pincodeDetail);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [localZip, setLocalZip] = useState(formData.zip_code);
  const [stateLabel, setStateLabel] = useState("");
  const [cityLabel, setCityLabel] = useState("");

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zip = e.target.value.replace(/\D/g, ""); // Allow only digits
    // console.log(zip);
    if (zip.length <= 6) {
      setLocalZip(zip);
      onInputChange({ target: { name: "zip_code", value: zip } } as any);

      if (zip.length === 6) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
          dispatch(fetchPincodeDetail(zip));
          dispatch(fetchAreasByPincode(zip));
        }, 300);
      }
    }
  };

  useEffect(() => {
    if (pincodeDetail) {
      const stateId = pincodeDetail.state_id;
      const stateName = pincodeDetail.state_name;
      const cityId = pincodeDetail.city_id;
      const cityName = pincodeDetail.city_name;

      if (stateId && stateName) {
        onSelectChange("state_id")({ value: stateId, label: stateName });
        setStateLabel(stateName); // ✅ Set display label
      }

      if (cityId && cityName) {
        onSelectChange("city_id")({ value: cityId, label: cityName });
        setCityLabel(cityName); // ✅ Set display label
      }
    }
  }, [onSelectChange, pincodeDetail]);

  // Sync localZip, stateLabel, and cityLabel with formData when formData changes (for edit mode)
  useEffect(() => {
    setLocalZip(formData.zip_code || "");
    setStateLabel(formData.state_id?.label || "");
    setCityLabel(formData.city_id?.label || "");
  }, [formData]);

  const areaOptions = areasToOptions(areas);
  // const onCustomChange = (name: keyof AddressFormData, value: any) => {
  //   console.log("name", name);
  //   console.log("value", value);
  //   const event = {
  //     target: {
  //       name,
  //       value,
  //     },
  //   } as React.ChangeEvent<HTMLInputElement>;
  //   onInputChange(event);
  // };

  // Auto-select area in edit mode if area_id is present and area options are available, but only if not already set
  useEffect(() => {
    if (formData.area_id?.value && areaOptions.length > 0) {
      const found = areaOptions.find((a) => a.value === formData.area_id.value);
      // Only update if the current selected value is different
      if (
        found &&
        (!formData.area_id.label || formData.area_id.label !== found.label)
      ) {
        onSelectChange("area_id")(found);
      }
    }
  }, [formData.area_id?.value, formData.area_id?.label, areaOptions, onSelectChange]);

  return (
    <>
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
            error={errors.name || ""}
            touched={!!errors.name}
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
            error={errors.company_name || ""}
            touched={!!errors.company_name}
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
            value={localZip}
            onChange={handleZipChange}
            onBlur={() => {}}
            placeHolder="Enter zip code"
            error={errors.zip_code || ""}
            touched={!!errors.zip_code}
          />
        </div>

        <div className="col-md-6">
          <Label htmlFor="state_id" text="State" className="form-label" />
          <Input
            type="text"
            id="state_id"
            name="state_id"
            className="form-control innerFormControll"
            value={stateLabel}
            onChange={() => {}}
            onBlur={() => {}}
            placeHolder="State"
            error={errors.state_id || ""}
            touched={!!errors.state_id}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <Label htmlFor="city_id" text="City" className="form-label" />
          <Input
            type="text"
            id="city_id"
            name="city_id"
            className="form-control innerFormControll"
            value={cityLabel}
            onChange={() => {}}
            onBlur={() => {}}
            placeHolder="City"
            error={errors.city_id || ""}
            touched={!!errors.city_id}
          />
        </div>

        <div className="col-md-6">
          <Label htmlFor="area_id" text="Area" className="form-label" />
          <SingleSelect
            options={areaOptions}
            value={
              areaOptions.find((a) => a.value === formData.area_id?.value) ||
              (formData.area_id?.value && formData.area_id?.label
                ? { value: formData.area_id.value, label: formData.area_id.label }
                : null)
            }
            onChange={onSelectChange("area_id")}
            placeholder="Select area"
            isLoading={loading}
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
            error={errors.address1 || ""}
            touched={!!errors.address1}
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
            error={errors.address2 || ""}
            touched={!!errors.address2}
          />
        </div>
      </div>

      <div className="row mb-3">
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
            error={errors.mobile_no || ""}
            touched={!!errors.mobile_no}
          />
        </div>

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
            error={errors.email || ""}
            touched={!!errors.email}
          />
        </div>
      </div>
    </>
  );
};

export default AddressForm;
