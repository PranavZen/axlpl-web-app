import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SingleSelect from "../../ui/select/SingleSelect";
import StepFieldWrapper from "./StepFieldWrapper";
import RadioGroup from "../../ui/radio/RadioGroup";
import Checkbox from "../../ui/checkbox/Checkbox";
import AddAreaButton from "../../ui/button/AddAreaButton";
import AddAreaModal from "../../ui/modal/AddAreaModal";
import { RootState, AppDispatch } from "../../../redux/store";
import { fetchCustomers, searchCustomers } from "../../../redux/slices/customerSlice";
import { fetchPincodeDetail, fetchAreasByPincode, addAreaToList } from "../../../redux/slices/pincodeSlice";
import { getUserData } from "../../../utils/authUtils";
import { InlineLogisticsLoader } from "../../ui/spinner";
import {
  findCustomerByName,
  mapLoginUserToSenderFields,
  mapCustomerToSenderFields,
  mapCustomerToReceiverFields,
  customersToOptions,
  customersToOptionsWithLoginUser,
  getCustomerApiParams,
  clearSenderFields,
  clearReceiverFields,
  areasToOptions,
  debugLoginUserData,
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
  // Section-specific auto-populating states
  const [isSenderAutoPopulating, setIsSenderAutoPopulating] = useState(false);
  const [isReceiverAutoPopulating, setIsReceiverAutoPopulating] = useState(false);

  // State to track when address type is being changed to suppress validation errors
  const [isSenderAddressTypeChanging, setIsSenderAddressTypeChanging] = useState(false);
  const [isReceiverAddressTypeChanging, setIsReceiverAddressTypeChanging] = useState(false);

  // Modal state for Add Area functionality
  const [isAddAreaModalOpen, setIsAddAreaModalOpen] = useState(false);
  const [modalContext, setModalContext] = useState<'sender' | 'receiver' | null>(null);

  // Search state for customer search functionality
  const [receiverSearchQuery, setReceiverSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Refs for debouncing pincode API calls
  const senderPincodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const receiverPincodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper functions to determine if errors should be suppressed (section-specific)
  const shouldSuppressSenderErrors = isSenderAutoPopulating || values.senderAddressType === "existing" || isSenderAddressTypeChanging;
  const shouldSuppressReceiverErrors = isReceiverAutoPopulating || values.receiverAddressType === "existing" || isReceiverAddressTypeChanging;

  // Section-specific helper functions to populate fields and clear validation errors
  const populateSenderFieldsAndClearErrors = useCallback(
    (fieldsObject: Record<string, any>) => {
      setIsSenderAutoPopulating(true);

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
        setIsSenderAutoPopulating(false);
      }, 50);
    },
    [setFieldValue, setFieldTouched, setFieldError]
  );

  const populateReceiverFieldsAndClearErrors = useCallback(
    (fieldsObject: Record<string, any>) => {
      setIsReceiverAutoPopulating(true);

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
        setIsReceiverAutoPopulating(false);
      }, 50);
    },
    [setFieldValue, setFieldTouched, setFieldError]
  );

  // Core pincode fetch function for sender
  const fetchSenderPincodeData = useCallback(async (pincode: string) => {
    try {
      console.log('🔍 Fetching data for Sender Pincode:', pincode);

      // Fetch pincode details first
      const pincodeResult = await dispatch(fetchPincodeDetail(pincode));

      if (fetchPincodeDetail.fulfilled.match(pincodeResult)) {
        const { state_id, state_name, city_id, city_name, area_name } = pincodeResult.payload;

        // Auto-populate state and city with proper select objects containing IDs
        setFieldValue('senderState', { value: state_id, label: state_name });
        setFieldValue('senderCity', { value: city_id, label: city_name });

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
      setFieldValue('senderState', '');
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
        const { state_id, state_name, city_id, city_name, area_name } = pincodeResult.payload;

        // Auto-populate state and city with proper select objects containing IDs
        setFieldValue('receiverState', { value: state_id, label: state_name });
        setFieldValue('receiverCity', { value: city_id, label: city_name });

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
      setFieldValue('receiverState', '');
      setFieldValue('receiverCity', '');
      setFieldValue('receiverArea', null);
    }
  }, [fetchReceiverPincodeData, setFieldValue]);

  // Function to search customers
  const handleCustomerSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim() === '') {
      // If search query is empty, fetch all customers
      const params = getCustomerApiParams();
      dispatch(fetchCustomers(params));
      return;
    }

    setIsSearching(true);
    try {
      const baseParams = getCustomerApiParams();
      const searchParams = {
        ...baseParams,
        search_query: searchQuery.trim()
      };
      console.log('🔍 Searching customers with query:', searchQuery);
      await dispatch(searchCustomers(searchParams));
    } catch (error) {
      console.error('❌ Error searching customers:', error);
    } finally {
      setIsSearching(false);
    }
  }, [dispatch]);

  // Fetch customers on component mount with default search
  useEffect(() => {
    // Start with a search for "version" as requested
    const defaultSearchQuery = "version";
    setReceiverSearchQuery(defaultSearchQuery);
    handleCustomerSearch(defaultSearchQuery);

    // Expose debug function to window for easy access in browser console
    (window as any).debugLoginUserData = debugLoginUserData;
    console.log('Debug function available: window.debugLoginUserData()');
  }, [dispatch, handleCustomerSearch]);

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

  // Clear receiver validation errors when address type changes
  useEffect(() => {
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

    if (values.receiverAddressType === "existing") {
      // Clear all receiver field validation errors when switching to existing
      receiverFields.forEach(field => {
        setFieldError(field, undefined);
      });

      // Additional clearing with multiple timeouts
      setTimeout(() => {
        receiverFields.forEach(field => {
          setFieldError(field, undefined);
        });
      }, 25);

      setTimeout(() => {
        receiverFields.forEach(field => {
          setFieldError(field, undefined);
        });
      }, 100);
    } else if (values.receiverAddressType === "new") {
      // When switching to "new", clear errors immediately and with delays
      receiverFields.forEach(field => {
        setFieldError(field, undefined);
      });

      setTimeout(() => {
        receiverFields.forEach(field => {
          setFieldError(field, undefined);
        });
      }, 25);

      setTimeout(() => {
        receiverFields.forEach(field => {
          setFieldError(field, undefined);
        });
      }, 100);
    }
  }, [values.receiverAddressType, setFieldError]);

  // Clear sender validation errors when address type changes
  useEffect(() => {
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

    if (values.senderAddressType === "existing") {
      // Clear all sender field validation errors when switching to existing
      senderFields.forEach(field => {
        setFieldError(field, undefined);
      });

      // Additional clearing with multiple timeouts
      setTimeout(() => {
        senderFields.forEach(field => {
          setFieldError(field, undefined);
        });
      }, 25);

      setTimeout(() => {
        senderFields.forEach(field => {
          setFieldError(field, undefined);
        });
      }, 100);
    } else if (values.senderAddressType === "new") {
      // When switching to "new", clear errors immediately and with delays
      senderFields.forEach(field => {
        setFieldError(field, undefined);
      });

      setTimeout(() => {
        senderFields.forEach(field => {
          setFieldError(field, undefined);
        });
      }, 25);

      setTimeout(() => {
        senderFields.forEach(field => {
          setFieldError(field, undefined);
        });
      }, 100);
    }
  }, [values.senderAddressType, setFieldError]);

  // Auto-populate sender info with login user data when "Existing Address" is selected
  useEffect(() => {
    if (values.senderAddressType === "existing" && !selectedSenderCustomer) {
      // Auto-select login user option and populate fields
      const userData = getUserData();
      const customerDetail = userData?.Customerdetail;
      const userId = customerDetail?.id;
      const userName = customerDetail?.name || customerDetail?.full_name || customerDetail?.customer_name || 'Your Account';
      const loginUserOption = {
        value: 'login_user',
        label: `${userName} (Your Account)`,
      };
      setSelectedSenderCustomer(loginUserOption);

      // Populate with login user data including customer ID
      const loginUserFields = mapLoginUserToSenderFields();
      if (Object.keys(loginUserFields).length > 0) {
        const fieldsWithCustomerId = {
          ...loginUserFields,
          senderCustomerId: userId || ""
        };
        populateSenderFieldsAndClearErrors(fieldsWithCustomerId);
      }
    }
  }, [
    values.senderAddressType,
    selectedSenderCustomer,
    populateSenderFieldsAndClearErrors,
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
      if (selectedOption.value === 'login_user') {
        // Use login user data
        const userData = getUserData();
        const userId = userData?.Customerdetail?.id;
        const loginUserFields = mapLoginUserToSenderFields();
        // Add the login user ID as sender customer ID
        const fieldsWithCustomerId = {
          ...loginUserFields,
          senderCustomerId: userId || ""
        };
        populateSenderFieldsAndClearErrors(fieldsWithCustomerId);
        console.log("✅ Login user selected as sender, ID:", userId);
      } else {
        // Use selected customer data
        const customer = findCustomerByName(customers, selectedOption.value);
        if (customer) {
          const mappedFields = mapCustomerToSenderFields(customer);
          // Add the customer ID to the mapped fields
          const fieldsWithCustomerId = {
            ...mappedFields,
            senderCustomerId: customer.id
          };
          populateSenderFieldsAndClearErrors(fieldsWithCustomerId);
          console.log("✅ Sender customer selected:", customer.full_name, "ID:", customer.id);
        }
      }
    } else {
      // Clear sender fields if no customer selected
      const clearedFields = clearSenderFields();
      // Also clear the customer ID
      const fieldsWithClearedId = {
        ...clearedFields,
        senderCustomerId: ""
      };
      populateSenderFieldsAndClearErrors(fieldsWithClearedId);
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
          // Add the customer ID to the mapped fields
          const fieldsWithCustomerId = {
            ...mappedFields,
            receiverCustomerId: customer.id
          };
          populateReceiverFieldsAndClearErrors(fieldsWithCustomerId);
          console.log("✅ Receiver customer selected:", customer.full_name, "ID:", customer.id);
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
      // Also clear the customer ID
      const fieldsWithClearedId = {
        ...clearedFields,
        receiverCustomerId: ""
      };
      populateReceiverFieldsAndClearErrors(fieldsWithClearedId);
    }
  };

  // Handle address type change for sender
  const handleSenderAddressTypeChange = (value: string) => {
    // Set changing state to suppress validation errors during transition
    setIsSenderAddressTypeChanging(true);

    // Clear customer selection when switching address types
    setSelectedSenderCustomer(null);

    // Define sender fields for error clearing
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

    // Immediately clear all sender validation errors regardless of address type
    senderFields.forEach(field => {
      setFieldError(field, undefined);
    });

    if (value === "existing") {
      // Auto-select login user option
      const userData = getUserData();
      const customerDetail = userData?.Customerdetail;
      const userName = customerDetail?.name || customerDetail?.full_name || customerDetail?.customer_name || 'Your Account';
      const loginUserOption = {
        value: 'login_user',
        label: `${userName} (Your Account)`,
      };
      setSelectedSenderCustomer(loginUserOption);

      // Populate with login user data when switching to existing address
      const loginUserFields = mapLoginUserToSenderFields();
      if (Object.keys(loginUserFields).length > 0) {
        populateSenderFieldsAndClearErrors(loginUserFields);
      }

      // Additional clearing for existing address mode
      setTimeout(() => {
        senderFields.forEach(field => {
          setFieldError(field, undefined);
        });
      }, 10);
    }

    if (value === "new") {
      // Clear form fields when switching to new address
      const clearedFields = clearSenderFields();
      populateSenderFieldsAndClearErrors(clearedFields);

      // Additional error clearing for new address mode
      setTimeout(() => {
        senderFields.forEach(field => {
          setFieldError(field, undefined);
        });
      }, 10);
    }

    // Multiple timeout layers to ensure errors stay cleared
    setTimeout(() => {
      senderFields.forEach(field => {
        setFieldError(field, undefined);
      });
    }, 50);

    setTimeout(() => {
      senderFields.forEach(field => {
        setFieldError(field, undefined);
      });
    }, 150);

    // Reset changing state after a longer delay to ensure form stability
    setTimeout(() => {
      setIsSenderAddressTypeChanging(false);
    }, 200);
  };

  // Handle address type change for receiver
  const handleReceiverAddressTypeChange = (value: string) => {
    // Set changing state to suppress validation errors during transition
    setIsReceiverAddressTypeChanging(true);

    // Clear customer selection when switching address types
    setSelectedReceiverCustomer(null);

    // Also clear "Same as Sender" when switching to existing address
    if (value === "existing") {
      setSameAsPickup(false);
    }

    // Define receiver fields for error clearing
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

    // Immediately clear all receiver validation errors regardless of address type
    receiverFields.forEach(field => {
      setFieldError(field, undefined);
    });

    if (value === "existing") {
      // Additional clearing for existing address mode
      setTimeout(() => {
        receiverFields.forEach(field => {
          setFieldError(field, undefined);
        });
      }, 10);
    }

    if (value === "new") {
      // Clear form fields when switching to new address
      const clearedFields = clearReceiverFields();
      populateReceiverFieldsAndClearErrors(clearedFields);

      // Additional error clearing for new address mode
      setTimeout(() => {
        receiverFields.forEach(field => {
          setFieldError(field, undefined);
        });
      }, 10);
    }

    // Multiple timeout layers to ensure errors stay cleared
    setTimeout(() => {
      receiverFields.forEach(field => {
        setFieldError(field, undefined);
      });
    }, 50);

    setTimeout(() => {
      receiverFields.forEach(field => {
        setFieldError(field, undefined);
      });
    }, 150);

    // Reset changing state after a longer delay to ensure form stability
    setTimeout(() => {
      setIsReceiverAddressTypeChanging(false);
    }, 200);
  };



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
      populateReceiverFieldsAndClearErrors(senderToReceiverMapping);
    } else {
      // Clear receiver fields when unchecking "Same as Sender"
      const clearedFields = clearReceiverFields();
      populateReceiverFieldsAndClearErrors(clearedFields);

      // Reset receiver address type to default
      setFieldValue("receiverAddressType", "new");
    }
  };

  // Modal handler functions
  const handleOpenAddAreaModal = (context: 'sender' | 'receiver') => {
    setModalContext(context);
    setIsAddAreaModalOpen(true);
  };

  const handleCloseAddAreaModal = () => {
    setIsAddAreaModalOpen(false);
    setModalContext(null);
  };

  const handleAreaAdded = (newArea: { value: string; label: string }) => {
    // Create a unique ID for the new area
    const newAreaId = Date.now().toString();

    // Add the new area to the Redux store using the proper action
    dispatch(addAreaToList({
      id: newAreaId,
      name: newArea.value,
      city_id: '',
      pincode: modalContext === 'sender' ? values.senderZipCode : values.receiverZipCode
    }));

    // Create the option in the correct format for the dropdown (matching areasToOptions format)
    const areaOption = {
      value: newAreaId, // Use the ID as value (consistent with areasToOptions)
      label: newArea.value // Use the area name as label
    };

    // Select the new area in the appropriate field
    if (modalContext === 'sender') {
      setFieldValue('senderArea', areaOption);
      console.log('✅ New area added and selected for sender:', areaOption);
    } else if (modalContext === 'receiver') {
      setFieldValue('receiverArea', areaOption);
      console.log('✅ New area added and selected for receiver:', areaOption);
    }

    // Close the modal
    handleCloseAddAreaModal();
  };

  return (
    <>
      <div className="col-md-6">
        {/* Sender Info Section */}
        <div className="col-md-12">
          <h4 className="section-title">Sender Info</h4>
        </div>

        <div className="row">
          <div className="col-12">
            <RadioGroup
              name="senderAddressType"
              label="Address Type"
              options={[
                { value: "new", label: "New Address" },
                { value: "existing", label: "Existing Address" }
              ]}
              direction="horizontal"
              variant="card"
              required={true}
              onCustomChange={handleSenderAddressTypeChange}
            />
          </div>
        </div>

        {/* Customer Selection for Sender - Only show when existing address is selected */}
        {values.senderAddressType === "existing" && (
          <div className="col-md-12 mb-3">
            <StepFieldWrapper name="senderCustomer" label="Select Customer">
              <SingleSelect
                options={customersToOptionsWithLoginUser(customers)}
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
            label="Name"
            suppressErrors={shouldSuppressSenderErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderCompanyName"
            label="Company Name"
            suppressErrors={shouldSuppressSenderErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderZipCode"
            label="Zip Code"
            suppressErrors={shouldSuppressSenderErrors}
          >
            <div className="position-relative">
              <input
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
                  <InlineLogisticsLoader size="sm" />
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
          <StepFieldWrapper
            name="senderState"
            label="State"
            suppressErrors={shouldSuppressSenderErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderCity"
            label="City"
            suppressErrors={shouldSuppressSenderErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderArea"
            label="Area"
            suppressErrors={shouldSuppressSenderErrors}
            labelButton={
              <AddAreaButton
                text="Add Area"
                onClick={() => handleOpenAddAreaModal('sender')}
                ariaLabel="Add new area for sender address"
              />
            }
          >
            <SingleSelect
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
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderGstNo"
            label="GST No."
            suppressErrors={shouldSuppressSenderErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderAddressLine1"
            label="Address Line 1"
            suppressErrors={shouldSuppressSenderErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderAddressLine2"
            label="Address Line 2"
            suppressErrors={shouldSuppressSenderErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderMobile"
            label="Mobile"
            type="tel"
            suppressErrors={shouldSuppressSenderErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderEmail"
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
          <div className="col-12">
            <RadioGroup
              name="receiverAddressType"
              label="Address Type"
              options={[
                { value: "new", label: "New Address" },
                { value: "existing", label: "Existing Address" }
              ]}
              direction="horizontal"
              variant="card"
              required={true}
              onCustomChange={handleReceiverAddressTypeChange}
            />
          </div>
        </div>

        {/* Customer Selection for Receiver - Only show when existing address is selected */}
        {values.receiverAddressType === "existing" && (
          <>
            {/* Customer Search Input */}
            <div className="col-md-12 mb-3">
              <StepFieldWrapper name="receiverCustomerSearch" label="Search Customers">
                <input
                  type="text"
                  className="form-control innerFormControll"
                  placeholder="Search customers by name, company, or phone..."
                  value={receiverSearchQuery}
                  onChange={(e) => {
                    const query = e.target.value;
                    setReceiverSearchQuery(query);

                    // Debounce the search to avoid too many API calls
                    if (receiverPincodeTimeoutRef.current) {
                      clearTimeout(receiverPincodeTimeoutRef.current);
                    }

                    receiverPincodeTimeoutRef.current = setTimeout(() => {
                      handleCustomerSearch(query);
                    }, 500); // 500ms delay
                  }}
                  disabled={isSearching}
                />
                {isSearching && (
                  <small className="text-muted">
                    <i className="fas fa-spinner fa-spin"></i> Searching...
                  </small>
                )}
              </StepFieldWrapper>
            </div>

            {/* Customer Selection Dropdown */}
            <div className="col-md-12 mb-3">
              <StepFieldWrapper name="receiverCustomer" label="Select Customer">
                <SingleSelect
                  options={customersToOptions(customers)}
                  value={selectedReceiverCustomer}
                  onChange={handleReceiverCustomerChange}
                  placeholder={
                    customersLoading || isSearching ? "Loading customers..." : "Select customer"
                  }
                  isLoading={customersLoading || isSearching}
                />
                {receiverSearchQuery && customers.length === 0 && !customersLoading && !isSearching && (
                  <small className="text-muted">
                    No customers found for "{receiverSearchQuery}". Try a different search term.
                  </small>
                )}
              </StepFieldWrapper>
              {customersError && (
                <div className="errorText">
                  Failed to load customers: {customersError}
                </div>
              )}
            </div>
          </>
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

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverName"
            label="Name"
            suppressErrors={shouldSuppressReceiverErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverCompanyName"
            label="Company Name"
            suppressErrors={shouldSuppressReceiverErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverZipCode"
            label="Zip Code"
            suppressErrors={shouldSuppressReceiverErrors}
          >
            <div className="position-relative">
              <input
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
                  <InlineLogisticsLoader size="sm" />
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

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverState"
            label="State"
            suppressErrors={shouldSuppressReceiverErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverCity"
            label="City"
            suppressErrors={shouldSuppressReceiverErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverArea"
            label="Area"
            suppressErrors={shouldSuppressReceiverErrors}
            labelButton={
              <AddAreaButton
                text="Add Area"
                onClick={() => handleOpenAddAreaModal('receiver')}
                ariaLabel="Add new area for receiver address"
              />
            }
          >
            <SingleSelect
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
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverGstNo"
            label="GST No."
            suppressErrors={shouldSuppressReceiverErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverAddressLine1"
            label="Address Line 1"
            suppressErrors={shouldSuppressReceiverErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverAddressLine2"
            label="Address Line 2"
            suppressErrors={shouldSuppressReceiverErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverMobile"
            label="Mobile"
            type="tel"
            suppressErrors={shouldSuppressReceiverErrors}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverEmail"
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
        <div className="col-12">
          <RadioGroup
            name="billTo"
            options={[
              { value: "sender", label: "Sender" },
              { value: "receiver", label: "Receiver" }
            ]}
            direction="horizontal"
            variant="card"
          />
        </div>
      </div>

      {/* Add Area Modal */}
      <AddAreaModal
        isOpen={isAddAreaModalOpen}
        onClose={handleCloseAddAreaModal}
        onAreaAdded={handleAreaAdded}
        title={`Add New Area ${modalContext === 'sender' ? 'for Sender' : modalContext === 'receiver' ? 'for Receiver' : ''}`}
      />
    </>
  );
};

export default StepTwoFormFields;
