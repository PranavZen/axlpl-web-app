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
  categoryOptions?: any[];
  paymentModeOptions?: any[];
  serviceTypeOptions?: any[];
  commodityOptions?: any[];
}

const StepOneFormFields: React.FC<StepOneFormFieldsProps> = ({
  values,
  setFieldValue,
  errors,
  touched,
  categoryOptions,
  paymentModeOptions,
  serviceTypeOptions,
  commodityOptions,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading: categoriesLoading } = useSelector((state: RootState) => state.category);
  const { commodities, loading: commoditiesLoading } = useSelector((state: RootState) => state.commodity);
  const { paymentModes, loading: paymentModesLoading } = useSelector((state: RootState) => state.paymentMode);
  const { serviceTypes, loading: serviceTypesLoading } = useSelector((state: RootState) => state.serviceType);

  // Get logged-in user data
  const userData = getUserData();
  const loggedInUserCompanyName = userData?.Customerdetail?.company_name || userData?.Customerdetail?.full_name || userData?.Customerdetail?.name || "User";

  // Track previous category to detect changes
  const prevCategoryRef = useRef<string | null>(null);
  // Track if we've already set the default name to prevent overwriting during edits
  const hasSetDefaultNameRef = useRef<boolean>(false);

  // Fetch categories, payment modes, and service types on component mount
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPaymentModes());
    dispatch(fetchServiceTypes());
  }, [dispatch]);

  // Set the logged-in user's company name when component mounts (only for new shipments, not edit)
  useEffect(() => {
    // Only set default name if:
    // 1. We have the logged-in user's company name
    // 2. The name field is empty
    // 3. We're not in edit mode (no shipment_id)
    // 4. We haven't already set the default name
    if (loggedInUserCompanyName && !values.name && !values.shipment_id && !hasSetDefaultNameRef.current) {
      setFieldValue("name", loggedInUserCompanyName);
      hasSetDefaultNameRef.current = true;
    }
  }, [loggedInUserCompanyName, values.name, values.shipment_id, setFieldValue]);

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

  // Use passed-in options if available (Edit mode), else fallback to Redux
  const categoryOpts = categoryOptions || categories.map(category => ({ value: category.id, label: category.name }));
  const paymentModeOpts = paymentModeOptions || paymentModes.map(paymentMode => ({ value: paymentMode.id, label: paymentMode.name }));
  const serviceTypeOpts = serviceTypeOptions || serviceTypes.map(serviceType => ({ value: serviceType.id, label: serviceType.name }));
  const commodityOpts = commodityOptions || commodities.map(commodity => ({ value: commodity.id, label: commodity.name }));

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
        <StepFieldWrapper name="name" label="Name" disabled={true} errors={errors} touched={touched} />
      </div>
      <div className="col-md-4">
        <StepFieldWrapper name="category" label="Category" errors={errors} touched={touched}>
          <SingleSelect
            options={categoryOpts}
            value={values.category}
            onChange={(option) => setFieldValue("category", option)}
            placeholder={categoriesLoading ? "Loading categories..." : "Select category"}
            isLoading={categoriesLoading}
          />
        </StepFieldWrapper>
      </div>
      <div className="col-md-4">
        <StepFieldWrapper name="commodity" label="Commodity" errors={errors} touched={touched}>
          <MultiSelect
            options={commodityOpts}
            value={values.commodity}
            onChange={(option: MultiValue<any>) => setFieldValue("commodity", option)}
            placeholder={
              !values.category
                ? "Select category first"
                : commoditiesLoading
                  ? "Loading commodities..."
                  : commodityOpts.length === 0
                    ? "No commodities found for this category"
                    : "Select commodities"
            }
            isLoading={commoditiesLoading}
          />
        </StepFieldWrapper>
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="netWeight" label="Net Weight (gm.)" errors={errors} touched={touched} />
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="grossWeight" label="Gross Weight (gm.)" errors={errors} touched={touched} />
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="paymentMode" label="Payment Mode" errors={errors} touched={touched}>
          <SingleSelect
            options={paymentModeOpts}
            value={values.paymentMode}
            onChange={(option) => setFieldValue("paymentMode", option)}
            placeholder={paymentModesLoading ? "Loading payment modes..." : "Select payment mode"}
            isLoading={paymentModesLoading}
          />
        </StepFieldWrapper>
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="numberOfParcel" label="Number Of Parcel" errors={errors} touched={touched} />
      </div>
      <div className="col-md-4">
        <StepFieldWrapper name="serviceType" label="Service Type" errors={errors} touched={touched}>
          <SingleSelect
            options={serviceTypeOpts}
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
      <div className="col-md-2 radioBtnWrap">
        <StepFieldWrapper name="insurance" label="Insurance by AXLPL" errors={errors} touched={touched}>
          <SwitchButton
            name="insurance"
            label=""
            checked={values.insurance}
            onChange={(e) => handleInsuranceChange(e.target.checked)} 
          />
        </StepFieldWrapper>
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="expiryDate" label="Expiry Date" type="date" disabled={!values.insurance} errors={errors} touched={touched} />
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="policyNumber" label="Policy Number" disabled={!values.insurance} errors={errors} touched={touched} />
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="insuranceValue" label="Insurance Value (₹)" disabled={!values.insurance} errors={errors} touched={touched} />
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="invoiceValue" label="Invoice Value (₹)" errors={errors} touched={touched} />
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="invoiceNumber" label="Invoice Number" errors={errors} touched={touched} />
      </div>
      <div className="col-md-2">
        <StepFieldWrapper name="remark" label="Remark" errors={errors} touched={touched} />
      </div>
    </>
  );
};

export default StepOneFormFields;
