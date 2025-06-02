import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SingleSelect from "../../ui/select/SingleSelect";
import StepFieldWrapper from "./StepFieldWrapper";
import RadioButton from "../../ui/radio/RadioButton";
import FormikRadioButton from "../../ui/radio/FormikRadioButton";
import Checkbox from "../../ui/checkbox/Checkbox";
import { RootState, AppDispatch } from "../../../redux/store";
import { fetchCustomers } from "../../../redux/slices/customerSlice";
import { fetchPincodeDetail, fetchAreasByPincode } from "../../../redux/slices/pincodeSlice";
import {
  findCustomerByName,
  mapCustomerToSenderFields,
  mapCustomerToReceiverFields,
  customersToOptions,
  getCustomerApiParams,
  clearSenderFields,
  clearReceiverFields,
  areasToOptions,
} from "../../../utils/customerUtils";

interface StepTwoFormFieldsProps {
  values: any;
  setFieldValue: (field: string, value: any) => void;
  setFieldTouched: (field: string, touched: boolean) => void;
  setFieldError: (field: string, error: string | undefined) => void;
  errors?: any;
  touched?: any;
}

const StepTwoFormFields: React.FC<StepTwoFormFieldsProps> = ({
  values,
  setFieldValue,
  setFieldTouched,
  setFieldError,
  errors,
  touched,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    customers,
    loading: customersLoading,
    error: customersError,
  } = useSelector((state: RootState) => state.customer);

  const {
    pincodeDetail,
    areas,
    loading: pincodeLoading,
    error: pincodeError,
    areasLoading,
    areasError,
  } = useSelector((state: RootState) => state.pincode);

  const [sameAsPickup, setSameAsPickup] = useState(false);
  const [selectedSenderCustomer, setSelectedSenderCustomer] =
    useState<any>(null);
  const [selectedReceiverCustomer, setSelectedReceiverCustomer] =
    useState<any>(null);
  const [isAutoPopulating, setIsAutoPopulating] = useState(false);

  // Refs for debouncing pincode API calls
  const senderPincodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const receiverPincodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper functions to determine if errors should be suppressed
  const shouldSuppressSenderErrors = isAutoPopulating || values.senderAddressType === "existing";
  const shouldSuppressReceiverErrors = isAutoPopulating || values.receiverAddressType === "existing";

  // Enhanced helper function to populate fields and aggressively clear validation errors
  const populateFieldsAndClearErrors = useCallback(
    (fieldsObject: Record<string, any>) => {
      setIsAutoPopulating(true);

      // First pass: Set all values and mark as touched
      Object.keys(fieldsObject).forEach((key) => {
        setFieldValue(key, fieldsObject[key]);
        setFieldTouched(key, true);
      });

      // Second pass: Clear all validation errors immediately
      Object.keys(fieldsObject).forEach((key) => {
        setFieldError(key, undefined);
      });

      // Third pass: Use setTimeout to ensure errors are cleared after any validation runs
      setTimeout(() => {
        Object.keys(fieldsObject).forEach((key) => {
          setFieldError(key, undefined);
        });
        setIsAutoPopulating(false);
      }, 50);
    },
    [setFieldValue, setFieldTouched, setFieldError, setIsAutoPopulating]
  );

  // Core pincode fetch function for sender
  const fetchSenderPincodeData = useCallback(async (pincode: string) => {
    try {
      console.log('🔍 Fetching data for Sender Pincode:', pincode);

      // Fetch pincode details first
      const pincodeResult = await dispatch(fetchPincodeDetail(pincode));

      if (fetchPincodeDetail.fulfilled.match(pincodeResult)) {
        const { state_name, city_name, area_name } = pincodeResult.payload;

        // Auto-populate state and city
        setFieldValue('senderState', { value: state_name, label: state_name });
        setFieldValue('senderCity', city_name);

        console.log('✅ Sender Pincode details fetched:', {
          state: state_name,
          city: city_name,
          area: area_name
        });
      } else {
        console.warn('❌ Failed to fetch pincode details for sender');
      }

      // Fetch areas for the pincode
      const areasResult = await dispatch(fetchAreasByPincode(pincode));

      if (fetchAreasByPincode.fulfilled.match(areasResult)) {
        console.log('✅ Sender Areas fetched:', areasResult.payload.length, 'areas available');

        // Clear any previously selected area since we have new options
        setFieldValue('senderArea', null);
      } else {
        console.warn('❌ Failed to fetch areas for sender pincode');
      }
    } catch (error) {
      console.error('❌ Error fetching sender pincode data:', error);
    }
  }, [dispatch, setFieldValue]);

  // Debounced pincode handler for sender
  const handleSenderPincodeChange = useCallback((pincode: string) => {
    // Clear any existing timeout
    if (senderPincodeTimeoutRef.current) {
      clearTimeout(senderPincodeTimeoutRef.current);
    }

    // Only trigger when we have exactly 6 digits
    if (pincode && pincode.length === 6 && /^\d{6}$/.test(pincode)) {
      // Debounce the API call by 300ms
      senderPincodeTimeoutRef.current = setTimeout(() => {
        fetchSenderPincodeData(pincode);
      }, 300);
    } else if (pincode && pincode.length < 6) {
      // Clear state, city, and area when pincode is incomplete
      setFieldValue('senderState', null);
      setFieldValue('senderCity', '');
      setFieldValue('senderArea', null);
    }
  }, [fetchSenderPincodeData, setFieldValue]);

  // Core pincode fetch function for receiver
  const fetchReceiverPincodeData = useCallback(async (pincode: string) => {
    try {
      console.log('🔍 Fetching data for Receiver Pincode:', pincode);

      // Fetch pincode details first
      const pincodeResult = await dispatch(fetchPincodeDetail(pincode));

      if (fetchPincodeDetail.fulfilled.match(pincodeResult)) {
        const { state_name, city_name, area_name } = pincodeResult.payload;

        // Auto-populate state and city
        setFieldValue('receiverState', { value: state_name, label: state_name });
        setFieldValue('receiverCity', city_name);

        console.log('✅ Receiver Pincode details fetched:', {
          state: state_name,
          city: city_name,
          area: area_name
        });
      } else {
        console.warn('❌ Failed to fetch pincode details for receiver');
      }

      // Fetch areas for the pincode
      const areasResult = await dispatch(fetchAreasByPincode(pincode));

      if (fetchAreasByPincode.fulfilled.match(areasResult)) {
        console.log('✅ Receiver Areas fetched:', areasResult.payload.length, 'areas available');

        // Clear any previously selected area since we have new options
        setFieldValue('receiverArea', null);
      } else {
        console.warn('❌ Failed to fetch areas for receiver pincode');
      }
    } catch (error) {
      console.error('❌ Error fetching receiver pincode data:', error);
    }
  }, [dispatch, setFieldValue]);

  // Debounced pincode handler for receiver
  const handleReceiverPincodeChange = useCallback((pincode: string) => {
    // Clear any existing timeout
    if (receiverPincodeTimeoutRef.current) {
      clearTimeout(receiverPincodeTimeoutRef.current);
    }

    // Only trigger when we have exactly 6 digits
    if (pincode && pincode.length === 6 && /^\d{6}$/.test(pincode)) {
      // Debounce the API call by 300ms
      receiverPincodeTimeoutRef.current = setTimeout(() => {
        fetchReceiverPincodeData(pincode);
      }, 300);
    } else if (pincode && pincode.length < 6) {
      // Clear state, city, and area when pincode is incomplete
      setFieldValue('receiverState', null);
      setFieldValue('receiverCity', '');
      setFieldValue('receiverArea', null);
    }
  }, [fetchReceiverPincodeData, setFieldValue]);

  // Fetch customers on component mount
  useEffect(() => {
    const params = getCustomerApiParams();
    dispatch(fetchCustomers(params));
  }, [dispatch]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (senderPincodeTimeoutRef.current) {
        clearTimeout(senderPincodeTimeoutRef.current);
      }
      if (receiverPincodeTimeoutRef.current) {
        clearTimeout(receiverPincodeTimeoutRef.current);
      }
    };
  }, []);

  // Clear validation errors for address type fields on component mount
  useEffect(() => {
    setFieldError("senderAddressType", undefined);
    setFieldError("receiverAddressType", undefined);
  }, [setFieldError]);

  // Clear receiver validation errors when address type is "existing"
  useEffect(() => {
    if (values.receiverAddressType === "existing") {
      // Clear all receiver field validation errors
      const receiverFields = [
        "receiverName",
        "receiverCompanyName",
        "receiverZipCode",
        "receiverState",
        "receiverCity",
        "receiverArea",
        "receiverGstNo",
        "receiverAddressLine1",
        "receiverAddressLine2",
        "receiverMobile",
        "receiverEmail"
      ];

      receiverFields.forEach(field => {
        setFieldError(field, undefined);
      });
    }
  }, [values.receiverAddressType, setFieldError]);

  // Clear sender validation errors when address type is "existing"
  useEffect(() => {
    if (values.senderAddressType === "existing") {
      // Clear all sender field validation errors
      const senderFields = [
        "senderName",
        "senderCompanyName",
        "senderZipCode",
        "senderState",
        "senderCity",
        "senderArea",
        "senderGstNo",
        "senderAddressLine1",
        "senderAddressLine2",
        "senderMobile",
        "senderEmail"
      ];

      senderFields.forEach(field => {
        setFieldError(field, undefined);
      });
    }
  }, [values.senderAddressType, setFieldError]);

  // Auto-populate sender info with default customer when user logs in
  useEffect(() => {
    if (
      customers.length > 0 &&
      values.senderAddressType === "existing" &&
      !selectedSenderCustomer
    ) {
      // Auto-select first customer as default for sender info
      const defaultCustomer = customers[0];
      if (defaultCustomer) {
        const customerOption = {
          value: defaultCustomer.full_name,
          label: defaultCustomer.full_name,
        };
        setSelectedSenderCustomer(customerOption);

        // Auto-populate form fields and mark as touched to clear validation errors
        const mappedFields = mapCustomerToSenderFields(defaultCustomer);
        populateFieldsAndClearErrors(mappedFields);
      }
    }
  }, [
    customers,
    values.senderAddressType,
    selectedSenderCustomer,
    populateFieldsAndClearErrors,
  ]);

  // Handle conflicts between "Same as Sender" and receiver address type
  useEffect(() => {
    // If receiver address type is "existing" and "Same as Sender" is checked, uncheck it
    if (values.receiverAddressType === "existing" && sameAsPickup) {
      setSameAsPickup(false);
    }
  }, [values.receiverAddressType, sameAsPickup]);

  // Handle sender customer selection
  const handleSenderCustomerChange = (selectedOption: any) => {
    setSelectedSenderCustomer(selectedOption);

    if (selectedOption) {
      const customer = findCustomerByName(customers, selectedOption.value);
      if (customer) {
        const mappedFields = mapCustomerToSenderFields(customer);
        populateFieldsAndClearErrors(mappedFields);
      }
    } else {
      // Clear sender fields if no customer selected
      const clearedFields = clearSenderFields();
      populateFieldsAndClearErrors(clearedFields);
    }
  };

  // Handle receiver customer selection
  const handleReceiverCustomerChange = (selectedOption: any) => {
    setSelectedReceiverCustomer(selectedOption);

    // Clear "Same as Sender" when selecting a customer
    if (selectedOption && sameAsPickup) {
      setSameAsPickup(false);
    }

    if (selectedOption) {
      const customer = findCustomerByName(customers, selectedOption.value);
      if (customer) {
        try {
          const mappedFields = mapCustomerToReceiverFields(customer);
          populateFieldsAndClearErrors(mappedFields);
        } catch (error) {
          console.error("Error mapping customer fields:", error);
          // Show user-friendly error message
          // You could add a toast notification here if needed
        }
      } else {
        console.warn("Customer not found:", selectedOption.value);
      }
    } else {
      // Clear receiver fields if no customer selected
      const clearedFields = clearReceiverFields();
      populateFieldsAndClearErrors(clearedFields);
    }
  };

  // Handle address type change for sender
  const handleSenderAddressTypeChange = (value: string) => {
    // Note: FormikRadioButton already handles setFieldValue and setFieldError

    if (value === "existing") {
      // Immediately clear all sender validation errors when switching to existing
      const senderFields = [
        "senderName",
        "senderCompanyName",
        "senderZipCode",
        "senderState",
        "senderCity",
        "senderArea",
        "senderGstNo",
        "senderAddressLine1",
        "senderAddressLine2",
        "senderMobile",
        "senderEmail"
      ];

      senderFields.forEach(field => {
        setFieldError(field, undefined);
      });
    }

    if (value === "new") {
      // Clear customer selection and form fields when switching to new address
      setSelectedSenderCustomer(null);
      const clearedFields = clearSenderFields();
      populateFieldsAndClearErrors(clearedFields);
    }
  };

  // Handle address type change for receiver
  const handleReceiverAddressTypeChange = (value: string) => {
    // Note: FormikRadioButton already handles setFieldValue and setFieldError

    // Clear customer selection when switching address types
    setSelectedReceiverCustomer(null);

    // Also clear "Same as Sender" when switching to existing address
    if (value === "existing") {
      setSameAsPickup(false);

      // Immediately clear all receiver validation errors when switching to existing
      const receiverFields = [
        "receiverName",
        "receiverCompanyName",
        "receiverZipCode",
        "receiverState",
        "receiverCity",
        "receiverArea",
        "receiverGstNo",
        "receiverAddressLine1",
        "receiverAddressLine2",
        "receiverMobile",
        "receiverEmail"
      ];

      receiverFields.forEach(field => {
        setFieldError(field, undefined);
      });
    }

    if (value === "new") {
      // Clear form fields when switching to new address
      const clearedFields = clearReceiverFields();
      populateFieldsAndClearErrors(clearedFields);
    }
  };

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
      // Clear receiver customer selection when using "Same as Sender"
      setSelectedReceiverCustomer(null);

      // Set receiver address type to match sender behavior
      setFieldValue("receiverAddressType", "new");

      // Copy sender fields to receiver fields and mark as touched
      const senderToReceiverMapping = {
        receiverName: values.senderName,
        receiverCompanyName: values.senderCompanyName,
        receiverZipCode: values.senderZipCode,
        receiverState: values.senderState,
        receiverCity: values.senderCity,
        receiverArea: values.senderArea,
        receiverGstNo: values.senderGstNo,
        receiverAddressLine1: values.senderAddressLine1,
        receiverAddressLine2: values.senderAddressLine2,
        receiverMobile: values.senderMobile,
        receiverEmail: values.senderEmail,
      };
      populateFieldsAndClearErrors(senderToReceiverMapping);
    } else {
      // Clear receiver fields when unchecking "Same as Sender"
      const clearedFields = clearReceiverFields();
      populateFieldsAndClearErrors(clearedFields);

      // Reset receiver address type to default
      setFieldValue("receiverAddressType", "new");
    }
  };

  return (
    <>
      <div className="col-md-6">
        {/* Sender Info Section */}
        <div className="col-md-12">
          <h4 className="section-title">Sender Info</h4>
        </div>

        <div className="row">
          <div className="col-md-4">
            <FormikRadioButton
              id="newSenderAddress"
              name="senderAddressType"
              value="new"
              label="New Address"
              onCustomChange={handleSenderAddressTypeChange}
            />
          </div>

          <div className="col-md-4">
            <FormikRadioButton
              id="existingSenderAddress"
              name="senderAddressType"
              value="existing"
              label="Existing Address"
              onCustomChange={handleSenderAddressTypeChange}
            />
          </div>
        </div>

        {/* Customer Selection for Sender - Only show when existing address is selected */}
        {values.senderAddressType === "existing" && (
          <div className="col-md-12 mb-3">
            <StepFieldWrapper name="senderCustomer" id="senderCustomer" label="Select Customer">
              <SingleSelect
                id="senderCustomer"
                options={customersToOptions(customers)}
                value={selectedSenderCustomer}
                onChange={handleSenderCustomerChange}
                placeholder={
                  customersLoading ? "Loading customers..." : "Select customer"
                }
                isLoading={customersLoading}
              />
            </StepFieldWrapper>
            {customersError && (
              <div className="errorText">
                Failed to load customers: {customersError}
              </div>
            )}
          </div>
        )}

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderName"
            id="senderName"
            label="Name"
            suppressErrors={shouldSuppressSenderErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderCompanyName"
            id="senderCompanyName"
            label="Company Name"
            suppressErrors={shouldSuppressSenderErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderZipCode"
            id="senderZipCode"
            label="Zip Code"
            suppressErrors={shouldSuppressSenderErrors}
          >
            <div className="position-relative">
              <input
                id="senderZipCode"
                name="senderZipCode"
                type="text"
                className="form-control innerFormControll"
                value={values.senderZipCode || ''}
                onChange={(e) => {
                  const pincode = e.target.value.replace(/\D/g, ''); // Only allow digits
                  setFieldValue('senderZipCode', pincode);
                  handleSenderPincodeChange(pincode);
                }}
                placeholder="Enter 6-digit pincode"
                maxLength={6}
                disabled={pincodeLoading}
              />
              {pincodeLoading && values.senderZipCode?.length === 6 && (
                <div className="position-absolute" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
            {values.senderZipCode?.length === 6 && pincodeDetail && (
              <div className="text-success mt-1" style={{ fontSize: '1.4rem' }}>
                ✅ Found: {pincodeDetail.city_name}, {pincodeDetail.state_name}
              </div>
            )}
            {pincodeError && values.senderZipCode?.length === 6 && (
              <div className="text-danger mt-1" style={{ fontSize: '1.4rem' }}>
                ❌ {pincodeError}
              </div>
            )}
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper name="senderState" id="senderState" label="State">
            <SingleSelect
              id="senderState"
              options={stateOptions}
              value={values.senderState}
              onChange={(option) => setFieldValue("senderState", option)}
              placeholder="Select State"
            />
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderCity"
            id="senderCity"
            label="City"
            suppressErrors={shouldSuppressSenderErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderArea"
            id="senderArea"
            label="Area"
            suppressErrors={shouldSuppressSenderErrors}
          >
            <SingleSelect
              id="senderArea"
              options={areasToOptions(areas)}
              value={values.senderArea}
              onChange={(option) => setFieldValue("senderArea", option)}
              placeholder={areasLoading ? "Loading areas..." : "Select Area"}
              isLoading={areasLoading}
            />
            {areasError && (
              <div className="errorText mt-1">
                Failed to load areas: {areasError}
              </div>
            )}
            <button
              type="button"
              className="btn btn-sm btn-outline-primary mt-1"
            >
              Add Area
            </button>
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderGstNo"
            id="senderGstNo"
            label="GST No."
            suppressErrors={shouldSuppressSenderErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderAddressLine1"
            id="senderAddressLine1"
            label="Address Line 1"
            suppressErrors={shouldSuppressSenderErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderAddressLine2"
            id="senderAddressLine2"
            label="Address Line 2"
            suppressErrors={shouldSuppressSenderErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderMobile"
            id="senderMobile"
            label="Mobile"
            type="tel"
            suppressErrors={shouldSuppressSenderErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderEmail"
            id="senderEmail"
            label="Email"
            type="email"
            suppressErrors={shouldSuppressSenderErrors}
          />
        </div>
      </div>
      <div className="col-md-6">
        {/* Receiver Info Section */}
        <div className="col-md-12">
          <h4 className="section-title">Receiver Info</h4>
        </div>

        <div className="row">
          <div className="col-md-4">
            <FormikRadioButton
              id="newReceiverAddress"
              name="receiverAddressType"
              value="new"
              label="New Address"
              onCustomChange={handleReceiverAddressTypeChange}
            />
          </div>

          <div className="col-md-4">
            <FormikRadioButton
              id="existingReceiverAddress"
              name="receiverAddressType"
              value="existing"
              label="Existing Address"
              onCustomChange={handleReceiverAddressTypeChange}
            />
          </div>
        </div>

        {/* Customer Selection for Receiver - Only show when existing address is selected */}
        {values.receiverAddressType === "existing" && (
          <div className="col-md-12">
            <StepFieldWrapper name="receiverCustomer" id="receiverCustomer" label="Select Customer">
              <SingleSelect
                id="receiverCustomer"
                options={customersToOptions(customers)}
                value={selectedReceiverCustomer}
                onChange={handleReceiverCustomerChange}
                placeholder={
                  customersLoading ? "Loading customers..." : "Select customer"
                }
                isLoading={customersLoading}
              />
            </StepFieldWrapper>
            {customersError && (
              <div className="errorText">
                Failed to load customers: {customersError}
              </div>
            )}
          </div>
        )}

        <div className="col-md-12 d-none">
          <Checkbox
            id="sameAsPickup"
            name="sameAsPickup"
            label="Same as Sender"
            checked={sameAsPickup}
            onChange={(e) => handleSameAsPickup(e.target.checked)}
          />
        </div>

        <div className="col-md-12">
          <StepFieldWrapper
            name="receiverName"
            id="receiverName"
            label="Name"
            suppressErrors={shouldSuppressReceiverErrors}
          />
        </div>

        <div className="col-md-12">
          <StepFieldWrapper
            name="receiverCompanyName"
            id="receiverCompanyName"
            label="Company Name"
            suppressErrors={shouldSuppressReceiverErrors}
          />
        </div>

        <div className="col-md-12">
          <StepFieldWrapper
            name="receiverZipCode"
            id="receiverZipCode"
            label="Zip Code"
            suppressErrors={shouldSuppressReceiverErrors}
          >
            <div className="position-relative">
              <input
                id="receiverZipCode"
                name="receiverZipCode"
                type="text"
                className="form-control innerFormControll"
                value={values.receiverZipCode || ''}
                onChange={(e) => {
                  const pincode = e.target.value.replace(/\D/g, ''); // Only allow digits
                  setFieldValue('receiverZipCode', pincode);
                  handleReceiverPincodeChange(pincode);
                }}
                placeholder="Enter 6-digit pincode"
                maxLength={6}
                disabled={pincodeLoading}
              />
              {pincodeLoading && values.receiverZipCode?.length === 6 && (
                <div className="position-absolute" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
            {values.receiverZipCode?.length === 6 && pincodeDetail && (
              <div className="text-success mt-1" style={{ fontSize: '1.4rem' }}>
                ✅ Found: {pincodeDetail.city_name}, {pincodeDetail.state_name}
              </div>
            )}
            {pincodeError && values.receiverZipCode?.length === 6 && (
              <div className="text-danger mt-1" style={{ fontSize: '1.4rem' }}>
                ❌ {pincodeError}
              </div>
            )}
          </StepFieldWrapper>
        </div>

        <div className="col-md-12">
          <StepFieldWrapper
            name="receiverState"
            id="receiverState"
            label="State"
            suppressErrors={shouldSuppressReceiverErrors}
          >
            <SingleSelect
              id="receiverState"
              options={stateOptions}
              value={values.receiverState}
              onChange={(option) => setFieldValue("receiverState", option)}
              placeholder="Select State"
            />
          </StepFieldWrapper>
        </div>

        <div className="col-md-12">
          <StepFieldWrapper
            name="receiverCity"
            id="receiverCity"
            label="City"
            suppressErrors={shouldSuppressReceiverErrors}
          />
        </div>

        <div className="col-md-12">
          <StepFieldWrapper
            name="receiverArea"
            id="receiverArea"
            label="Area"
            suppressErrors={shouldSuppressReceiverErrors}
          >
            <SingleSelect
              id="receiverArea"
              options={areasToOptions(areas)}
              value={values.receiverArea}
              onChange={(option) => setFieldValue("receiverArea", option)}
              placeholder={areasLoading ? "Loading areas..." : "Select Area"}
              isLoading={areasLoading}
            />
            {areasError && (
              <div className="errorText mt-1">
                Failed to load areas: {areasError}
              </div>
            )}
            <button
              type="button"
              className="btn btn-sm btn-outline-primary mt-1"
            >
              Add Area
            </button>
          </StepFieldWrapper>
        </div>

        <div className="col-md-12">
          <StepFieldWrapper
            name="receiverGstNo"
            id="receiverGstNo"
            label="GST No."
            suppressErrors={shouldSuppressReceiverErrors}
          />
        </div>

        <div className="col-md-12">
          <StepFieldWrapper
            name="receiverAddressLine1"
            id="receiverAddressLine1"
            label="Address Line 1"
            suppressErrors={shouldSuppressReceiverErrors}
          />
        </div>

        <div className="col-md-12">
          <StepFieldWrapper
            name="receiverAddressLine2"
            id="receiverAddressLine2"
            label="Address Line 2"
            suppressErrors={shouldSuppressReceiverErrors}
          />
        </div>

        <div className="col-md-12">
          <StepFieldWrapper
            name="receiverMobile"
            id="receiverMobile"
            label="Mobile"
            type="tel"
            suppressErrors={shouldSuppressReceiverErrors}
          />
        </div>

        <div className="col-md-12">
          <StepFieldWrapper
            name="receiverEmail"
            id="receiverEmail"
            label="Email"
            type="email"
            suppressErrors={shouldSuppressReceiverErrors}
          />
        </div>
      </div>
      {/* Bill To Section */}
      <div className="col-md-12 mt-4">
        <h4 className="section-title">Bill To</h4>
      </div>

      <div className="row">
        <div className="col-md-2">
        <RadioButton
          id="billToSender"
          name="billTo"
          value="sender"
          label="Sender"
          checked={values.billTo === "sender"}
          onChange={(e) => setFieldValue("billTo", e.target.value)}
        />
      </div>

      <div className="col-md-2">
        <RadioButton
          id="billToReceiver"
          name="billTo"
          value="receiver"
          label="Receiver"
          checked={values.billTo === "receiver"}
          onChange={(e) => setFieldValue("billTo", e.target.value)}
        />
      </div>
      </div>
    </>
  );
};

export default StepTwoFormFields;
