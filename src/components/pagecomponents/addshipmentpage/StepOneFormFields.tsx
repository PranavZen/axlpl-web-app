import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SingleSelect from "../../ui/select/SingleSelect";
import MultiSelect from "../../ui/select/MultiSelect";
import SwitchButton from "../../ui/switch/SwitchButton";
import StepFieldWrapper from "./StepFieldWrapper";
import { MultiValue } from "react-select";
import { RootState, AppDispatch } from "../../../redux/store";
import { fetchCategories } from "../../../redux/slices/categorySlice";
import { fetchCommodities, clearCommodities } from "../../../redux/slices/commoditySlice";
import { fetchPaymentModes } from "../../../redux/slices/paymentModeSlice";
import { fetchServiceTypes } from "../../../redux/slices/serviceTypeSlice";
import { getUserData } from "../../../utils/authUtils";

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
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading: categoriesLoading } = useSelector((state: RootState) => state.category);
  const { commodities, loading: commoditiesLoading } = useSelector((state: RootState) => state.commodity);
  const { paymentModes, loading: paymentModesLoading } = useSelector((state: RootState) => state.paymentMode);
  const { serviceTypes, loading: serviceTypesLoading } = useSelector((state: RootState) => state.serviceType);

  // Get logged-in user data
  const userData = getUserData();
  const loggedInUserName = userData?.Customerdetail?.full_name || userData?.Customerdetail?.name || "User";

  // Track previous category to detect changes
  const prevCategoryRef = useRef<string | null>(null);

  // Fetch categories, payment modes, and service types on component mount
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPaymentModes());
    dispatch(fetchServiceTypes());
  }, [dispatch]);

  // Set the logged-in user's name when component mounts
  useEffect(() => {
    if (loggedInUserName && !values.name) {
      setFieldValue("name", loggedInUserName);
    }
  }, [loggedInUserName, values.name, setFieldValue]);

  // Fetch commodities when category changes and clear selected commodities
  useEffect(() => {
    const currentCategoryId = values.category?.value;
    const previousCategoryId = prevCategoryRef.current;

    if (currentCategoryId) {
      // Clear previously selected commodities only when category actually changes
      if (previousCategoryId && previousCategoryId !== currentCategoryId) {
        setFieldValue("commodity", []);
      }
      // Fetch new commodities for the selected category
      dispatch(fetchCommodities(currentCategoryId));
    } else {
      // Clear commodities and selected options when no category is selected
      dispatch(clearCommodities());
      setFieldValue("commodity", []);
    }

    // Update the ref with current category
    prevCategoryRef.current = currentCategoryId || null;
  }, [values.category, dispatch, setFieldValue]);

  // Transform categories for react-select format
  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name
  }));

  // Transform commodities for react-select format
  const commodityOptions = commodities.map(commodity => ({
    value: commodity.id,
    label: commodity.name
  }));

  // Transform payment modes for react-select format
  const paymentModeOptions = paymentModes.map(paymentMode => ({
    value: paymentMode.id,
    label: paymentMode.name
  }));

  // Transform service types for react-select format
  const serviceTypeOptions = serviceTypes.map(serviceType => ({
    value: serviceType.id,
    label: serviceType.name
  }));

  // Handle insurance switch change
  const handleInsuranceChange = (checked: boolean) => {
    setFieldValue("insurance", checked);

    // If insurance is disabled (not using AXLPL insurance), clear the manual insurance fields
    if (!checked) {
      setFieldValue("policyNumber", "");
      setFieldValue("expiryDate", "");
      setFieldValue("insuranceValue", "");
    }
  };

  return (
    <>
      <div className="col-md-4">
        <StepFieldWrapper name="name" label="Name" disabled={true} />
      </div>
      <div className="col-md-4">
        <StepFieldWrapper name="category" label="Category">
          <SingleSelect
            options={categoryOptions}
            value={values.category}
            onChange={(option) => setFieldValue("category", option)}
            placeholder={categoriesLoading ? "Loading categories..." : "Select category"}
            isLoading={categoriesLoading}
          />
        </StepFieldWrapper>
      </div>
      <div className="col-md-4">
        <StepFieldWrapper name="commodity" label="Commodity">
          <MultiSelect
            options={commodityOptions}
            value={values.commodity}
            onChange={(option: MultiValue<any>) => setFieldValue("commodity", option)}
            placeholder={
              !values.category
                ? "Select category first"
                : commoditiesLoading
                  ? "Loading commodities..."
                  : commodityOptions.length === 0
                    ? "No commodities found for this category"
                    : "Select commodities"
            }
            isLoading={commoditiesLoading}
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
          <SingleSelect
            options={paymentModeOptions}
            value={values.paymentMode}
            onChange={(option) => setFieldValue("paymentMode", option)}
            placeholder={paymentModesLoading ? "Loading payment modes..." : "Select payment mode"}
            isLoading={paymentModesLoading}
          />
        </StepFieldWrapper>
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="numberOfParcel" label="Number Of Parcel" />
      </div>
      <div className="col-md-4">
        <StepFieldWrapper name="serviceType" label="Service Type">
          <SingleSelect
            options={serviceTypeOptions}
            value={values.serviceType}
            onChange={(option) => setFieldValue("serviceType", option)}
            placeholder={serviceTypesLoading ? "Loading service types..." : "Select service type"}
            isLoading={serviceTypesLoading}
          />
          <p className="errorText">
            Note: Express Delivery will incur extra charges*
          </p>
        </StepFieldWrapper>
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="insurance" label="Insurance by AXLPL">
          <SwitchButton
            name="insurance"
            label=""
            checked={values.insurance}
            onChange={(e) => handleInsuranceChange(e.target.checked)}
          />
        </StepFieldWrapper>
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="expiryDate" label="Expiry Date" type="date" disabled={!values.insurance} />
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="policyNumber" label="Policy Number" disabled={!values.insurance} />
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="insuranceValue" label="Insurance Value (₹)" disabled={!values.insurance} />
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
