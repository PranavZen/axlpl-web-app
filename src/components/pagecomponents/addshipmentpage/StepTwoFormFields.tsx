import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SingleSelect from "../../ui/select/SingleSelect";
import StepFieldWrapper from "./StepFieldWrapper";
import RadioGroup from "../../ui/radio/RadioGroup";
import Checkbox from "../../ui/checkbox/Checkbox";
import AddAreaButton from "../../ui/button/AddAreaButton";
import AddAreaModal from "../../ui/modal/AddAreaModal";
import { RootState, AppDispatch } from "../../../redux/store";
import {
  fetchCustomers,
  searchCustomers,
} from "../../../redux/slices/customerSlice";
import {
  fetchPincodeDetail,
  fetchAreasByPincode,
  addAreaToList,
} from "../../../redux/slices/pincodeSlice";
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
  const [isReceiverAutoPopulating, setIsReceiverAutoPopulating] =
    useState(false);
  
  // State to track when address type is being changed to suppress validation errors
  const [isSenderAddressTypeChanging, setIsSenderAddressTypeChanging] =
    useState(false);
  const [isReceiverAddressTypeChanging, setIsReceiverAddressTypeChanging] =
    useState(false);

  // Modal state for Add Area functionality
  const [isAddAreaModalOpen, setIsAddAreaModalOpen] = useState(false);
  const [modalContext, setModalContext] = useState<
    "sender" | "receiver" | null
  >(null);

  // Search state for customer search functionality
  const [receiverSearchQuery, setReceiverSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Refs for debouncing pincode API calls
  const senderPincodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const receiverPincodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Local state for sender and receiver areas
  const [senderAreas, setSenderAreas] = useState<any[]>([]);
  const [receiverAreas, setReceiverAreas] = useState<any[]>([]);

  // Helper functions to determine if errors should be suppressed (section-specific)
  const shouldSuppressSenderErrors =
    isSenderAutoPopulating ||
    isSenderAddressTypeChanging;
  const shouldSuppressReceiverErrors =
    isReceiverAutoPopulating ||
    isReceiverAddressTypeChanging;

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
  const fetchSenderPincodeData = useCallback(
    async (pincode: string) => {
      try {
        // Fetch pincode details first
        const pincodeResult = await dispatch(fetchPincodeDetail(pincode));

        if (fetchPincodeDetail.fulfilled.match(pincodeResult)) {
          const { state_name, city_name, state_id, city_id } =
            pincodeResult.payload;

          // Auto-populate state and city names
          setFieldValue("senderState", state_name);
          setFieldValue("senderCity", city_name);
          // Also set state and city IDs
          setFieldValue("senderStateId", state_id);
          setFieldValue("senderCityId", city_id);
        }

        // Fetch areas for the pincode (local only)
        const areasResult = await dispatch(fetchAreasByPincode(pincode));
        if (fetchAreasByPincode.fulfilled.match(areasResult)) {
          setSenderAreas(areasResult.payload || []);
          setFieldValue("senderArea", { value: '', label: '' });
        } else {
          setSenderAreas([]);
        }
      } catch (error) {
        setSenderAreas([]);
      }
    },
    [dispatch, setFieldValue]
  );

  // Debounced pincode handler for sender
  const handleSenderPincodeChange = useCallback(
    (pincode: string) => {
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
        setFieldValue("senderState", "");
        setFieldValue("senderCity", "");
        setFieldValue("senderArea", { value: '', label: '' });
      }
    },
    [fetchSenderPincodeData, setFieldValue]
  );

  // Core pincode fetch function for receiver
  const fetchReceiverPincodeData = useCallback(
    async (pincode: string) => {
      try {
        // Fetch pincode details first
        const pincodeResult = await dispatch(fetchPincodeDetail(pincode));

        if (fetchPincodeDetail.fulfilled.match(pincodeResult)) {
          const { state_name, city_name, state_id, city_id } = pincodeResult.payload;
          // Always set as { value, label } objects for display
          setFieldValue("receiverState", { value: state_id, label: state_name || String(state_id) });
          setFieldValue("receiverCity", { value: city_id, label: city_name || String(city_id) });
          setFieldValue("receiverStateId", state_id);
          setFieldValue("receiverCityId", city_id);
        }

        // Fetch areas for the pincode (local only)
        const areasResult = await dispatch(fetchAreasByPincode(pincode));
        if (fetchAreasByPincode.fulfilled.match(areasResult)) {
          const areaList = areasResult.payload || [];
          setReceiverAreas(areaList);
          // If area exists in values, try to map it to { value, label }
          let areaObj = { value: '', label: '' };
          // If areaList exists, try to match by ID or name, else fallback to first area or blank
          if (areaList.length > 0) {
            if (values.receiverArea && typeof values.receiverArea === 'object') {
              const foundArea = areaList.find((a: { id: any; name: any; }) =>
                a.id === values.receiverArea.value ||
                a.name === values.receiverArea.label
              );
              if (foundArea) {
                areaObj = { value: foundArea.id, label: foundArea.name };
              } else {
                // Fallback: use first area in list
                areaObj = { value: areaList[0].id, label: areaList[0].name };
              }
            } else {
              // Fallback: use first area in list
              areaObj = { value: areaList[0].id, label: areaList[0].name };
            }
          }
          setFieldValue("receiverArea", areaObj);
        } else {
          setReceiverAreas([]);
        }
      } catch (error) {
        setReceiverAreas([]);
      }
    },
    [dispatch, setFieldValue, values.receiverArea]
  );

  // Debounced pincode handler for receiver
  const handleReceiverPincodeChange = useCallback(
    (pincode: string) => {
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
        setFieldValue("receiverState", "");
        setFieldValue("receiverCity", "");
        setFieldValue("receiverArea", { value: '', label: '' });
      }
    },
    [fetchReceiverPincodeData, setFieldValue]
  );

  // Function to search customers
  const handleCustomerSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery || searchQuery.trim() === "") {
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
          search_query: searchQuery.trim(),
        };
        await dispatch(searchCustomers(searchParams));
      } catch (error) {
        // Error handling can be added here if needed
      } finally {
        setIsSearching(false);
      }
    },
    [dispatch]
  );

  // Ensure all customers are fetched when receiverAddressType is 'existing' and search box is empty
  useEffect(() => {
    if (values.receiverAddressType === 'existing' && receiverSearchQuery.trim() === '') {
      handleCustomerSearch('');
    }
  }, [values.receiverAddressType, receiverSearchQuery, handleCustomerSearch]);

  // Fetch customers on component mount with default search
  useEffect(() => {
    // Expose debug function to window for easy access in browser console
    (window as any).debugLoginUserData = debugLoginUserData;
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

  // Auto-populate receiver fields with proper {value, label} format when editing shipment
  useEffect(() => {
    // Only run when we have receiver data that looks like edit mode (has receiverZipCode and IDs)
    if (values.receiverZipCode && (values.receiverStateId || values.receiverCityId)) {
      // If receiver state is not already an object, convert it
      if (values.receiverState && typeof values.receiverState !== 'object') {
        // Fetch pincode details to get state/city names from IDs
        if (values.receiverZipCode.length === 6) {
          fetchReceiverPincodeData(values.receiverZipCode);
        }
      }
    }
  }, [values.receiverZipCode, values.receiverStateId, values.receiverCityId, values.receiverState, fetchReceiverPincodeData]);

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
      "receiverEmail",
    ];

    if (values.receiverAddressType === "existing") {
      // Clear all receiver field validation errors when switching to existing
      receiverFields.forEach((field) => {
        setFieldError(field, undefined);
      });

      // Additional clearing with multiple timeouts
      setTimeout(() => {
        receiverFields.forEach((field) => {
          setFieldError(field, undefined);
        });
      }, 25);

      setTimeout(() => {
        receiverFields.forEach((field) => {
          setFieldError(field, undefined);
        });
      }, 100);
    } else if (values.receiverAddressType === "new") {
      // When switching to "new", clear errors immediately and with delays
      receiverFields.forEach((field) => {
        setFieldError(field, undefined);
      });

      setTimeout(() => {
        receiverFields.forEach((field) => {
          setFieldError(field, undefined);
        });
      }, 25);

      setTimeout(() => {
        receiverFields.forEach((field) => {
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
      "senderEmail",
    ];

    if (values.senderAddressType === "existing") {
      // Clear all sender field validation errors when switching to existing
      senderFields.forEach((field) => {
        setFieldError(field, undefined);
      });

      // Additional clearing with multiple timeouts
      setTimeout(() => {
        senderFields.forEach((field) => {
          setFieldError(field, undefined);
        });
      }, 25);

      setTimeout(() => {
        senderFields.forEach((field) => {
          setFieldError(field, undefined);
        });
      }, 100);
    } else if (values.senderAddressType === "new") {
      // When switching to "new", clear errors immediately and with delays
      senderFields.forEach((field) => {
        setFieldError(field, undefined);
      });

      setTimeout(() => {
        senderFields.forEach((field) => {
          setFieldError(field, undefined);
        });
      }, 25);

      setTimeout(() => {
        senderFields.forEach((field) => {
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
      const userName =
        customerDetail?.name ||
        customerDetail?.full_name ||
        customerDetail?.customer_name ||
        "Your Account";
      const loginUserOption = {
        value: "login_user",
        label: `${userName} (Your Account)`,
      };
      setSelectedSenderCustomer(loginUserOption);

      // Populate with login user data including customer ID and state/city/area
      const loginUserFields = mapLoginUserToSenderFields();
      if (Object.keys(loginUserFields).length > 0) {
        const fieldsWithCustomerId = {
          ...loginUserFields,
          senderCustomerId: userId,
          // Don't override the properly formatted state/city/area from mapLoginUserToSenderFields
          // Only add the ID fields for backend compatibility
          senderStateId: customerDetail?.state_id || '',
          senderCityId: customerDetail?.city_id || '',
          senderAreaId: customerDetail?.area_id || '',
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
      if (selectedOption.value === "login_user") {
        // Use login user data
        const userData = getUserData();
        const userId = userData?.Customerdetail?.id;
        const loginUserFields = mapLoginUserToSenderFields();
        // Try to match area_name to area option
        let matchedArea = null;
        if (
          areas &&
          Array.isArray(areas) &&
          userData?.Customerdetail?.area_name
        ) {
          matchedArea = areas.find(
            (a: any) =>
              a.label === userData.Customerdetail.area_name ||
              a.value === userData.Customerdetail.area_name
          );
        }
        // Always set state/city IDs from userData
        const senderStateId = userData?.Customerdetail?.state_id || '';
        const senderCityId = userData?.Customerdetail?.city_id || '';
        const fieldsWithCustomerId = {
          ...loginUserFields,
          senderCustomerId: userId,
          senderArea: matchedArea || null,
          senderStateId,
          senderCityId,
        };
        populateSenderFieldsAndClearErrors(fieldsWithCustomerId);
      } else {
        // Use selected customer data
        const customer = findCustomerByName(customers, selectedOption.value);
        if (customer) {
          const mappedFields = mapCustomerToSenderFields(customer);
          // Try to match area_name to area option using proper area_id
          let matchedArea = null;
          if (areas && Array.isArray(areas) && customer.area_name) {
            matchedArea = areas.find(
              (a: any) =>
                a.label === customer.area_name ||
                a.value === customer.area_name ||
                a.value === customer.area_id
            );
          }
          // If no match found but area_name exists, create area option with proper ID
          if (!matchedArea && customer.area_name) {
            matchedArea = {
              value: customer.area_id || customer.id,
              label: customer.area_name
            };
          }
          // Always set state/city/area IDs from customer
          const senderStateId = customer.state_id || '';
          const senderCityId = customer.city_id || '';
          const senderAreaId = customer.area_id || '';
          const fieldsWithCustomerId = {
            ...mappedFields,
            senderCustomerId: customer.id,
            senderArea: matchedArea || null,
            senderStateId,
            senderCityId,
            senderAreaId,
          };
          populateSenderFieldsAndClearErrors(fieldsWithCustomerId);
        }
      }
    } else {
      // Clear sender fields if no customer selected
      const clearedFields = clearSenderFields();
      // Also clear the customer ID and IDs
      const fieldsWithClearedId = {
        ...clearedFields,
        senderCustomerId: "",
        senderStateId: '',
        senderCityId: '',
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
          // Get all mapped fields from the utility function (includes proper object format)
          const mappedFields = mapCustomerToReceiverFields(customer);
          
          // Debug: Log the mapped fields to verify they include all customer data
          // console.log('🔍 Receiver Customer Selected:', customer.full_name);
          // console.log('📋 Mapped Fields:', mappedFields);
          
          // Try to match area_name to area option from available areas
          let matchedArea = mappedFields.receiverArea; // Use the area from mapped fields as default
          if (areas && Array.isArray(areas) && customer.area_name) {
            const foundArea = areas.find(
              (a: any) =>
                (a.name && a.name.trim().toLowerCase() === customer.area_name.trim().toLowerCase()) ||
                (a.label && a.label.trim().toLowerCase() === customer.area_name.trim().toLowerCase()) ||
                a.id === customer.area_id
            );
            if (foundArea) {
              matchedArea = {
                value: foundArea.id,
                label: foundArea.name || (foundArea as any).label
              };
              // console.log('🎯 Found matching area in dropdown:', matchedArea);
            }
          }

          // Use all the properly mapped fields and add customer ID and IDs for backend compatibility
          const fieldsWithCustomerId = {
            ...mappedFields, // This already includes properly formatted state, city, area objects
            receiverCustomerId: customer.id,
            receiverArea: matchedArea, // Use the matched or default area object
            receiverStateId: customer.state_id || '',
            receiverCityId: customer.city_id || '',
            receiverAreaId: customer.area_id || '',
          };
          
          // console.log('✅ Final fields being populated:', fieldsWithCustomerId);
          
          // Populate all fields at once
          populateReceiverFieldsAndClearErrors(fieldsWithCustomerId);
          
        } catch (error) {
          console.error('❌ Error populating receiver fields:', error);
          // Show user-friendly error message
          // You could add a toast notification here if needed
        }
      }
    } else {
      // Clear receiver fields if no customer selected
      const clearedFields = clearReceiverFields();
      // Also clear the customer ID and IDs
      const fieldsWithClearedId = {
        ...clearedFields,
        receiverCustomerId: "",
        receiverStateId: '',
        receiverCityId: '',
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
      "senderEmail",
    ];

    // Immediately clear all sender validation errors regardless of address type
    senderFields.forEach((field) => {
      setFieldError(field, undefined);
    });

    if (value === "existing") {
      // Auto-select login user option
      const userData = getUserData();
      const customerDetail = userData?.Customerdetail;
      const userName =
        customerDetail?.name ||
        customerDetail?.full_name ||
        customerDetail?.customer_name ||
        "Your Account";
      const loginUserOption = {
        value: "login_user",
        label: `${userName} (Your Account)`,
      };
      setSelectedSenderCustomer(loginUserOption);

      // Populate with login user data when switching to existing address
      const loginUserFields = mapLoginUserToSenderFields();
      if (Object.keys(loginUserFields).length > 0) {
        // Ensure state/city/area IDs are set if available
        const userData = getUserData();
        const senderStateId = userData?.Customerdetail?.state_id || '';
        const senderCityId = userData?.Customerdetail?.city_id || '';
        const senderAreaId = userData?.Customerdetail?.area_id || '';
        populateSenderFieldsAndClearErrors({
          ...loginUserFields,
          senderStateId,
          senderCityId,
          senderAreaId,
        });
      }

      // Additional clearing for existing address mode
      setTimeout(() => {
        senderFields.forEach((field) => {
          setFieldError(field, undefined);
        });
      }, 10);
    }

    if (value === "new") {
      // Clear form fields when switching to new address
      const clearedFields = clearSenderFields();
      // Set senderCustomerId to userId when new address is selected
      const userData = getUserData();
      const userId = userData?.Customerdetail?.id || "";
      const senderStateId = userData?.Customerdetail?.state_id || '';
      const senderCityId = userData?.Customerdetail?.city_id || '';
      const senderAreaId = userData?.Customerdetail?.area_id || '';
      const clearedFieldsWithUserId = {
        ...clearedFields,
        senderCustomerId: userId,
        senderStateId,
        senderCityId,
        senderAreaId,
      };
      populateSenderFieldsAndClearErrors(clearedFieldsWithUserId);
      // Update Redux formData as well
      dispatch({ type: 'shipment/setFormData', payload: { senderCustomerId: userId } });
      // Additional error clearing for new address mode
      setTimeout(() => {
        senderFields.forEach((field) => {
          setFieldError(field, undefined);
        });
      }, 10);
    }

    // Multiple timeout layers to ensure errors stay cleared
    setTimeout(() => {
      senderFields.forEach((field) => {
        setFieldError(field, undefined);
      });
    }, 50);

    setTimeout(() => {
      senderFields.forEach((field) => {
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
      "receiverEmail",
    ];

    // Immediately clear all receiver validation errors regardless of address type
    receiverFields.forEach((field) => {
      setFieldError(field, undefined);
    });

    if (value === "existing") {
      // Additional clearing for existing address mode
      setTimeout(() => {
        receiverFields.forEach((field) => {
          setFieldError(field, undefined);
        });
      }, 10);
    }

    if (value === "new") {
      // Clear form fields when switching to new address
      const clearedFields = clearReceiverFields();
      // Set receiverCustomerId to userId when new address is selected
      const userData = getUserData();
      const userId = userData?.Customerdetail?.id || "";
      const receiverStateId = userData?.Customerdetail?.state_id || '';
      const receiverCityId = userData?.Customerdetail?.city_id || '';
      const clearedFieldsWithUserId = {
        ...clearedFields,
        receiverCustomerId: userId,
        receiverStateId,
        receiverCityId,
      };
      populateReceiverFieldsAndClearErrors(clearedFieldsWithUserId);
      // Update Redux formData as well
      dispatch({ type: 'shipment/setFormData', payload: { receiverCustomerId: userId } });
      // Additional error clearing for new address mode
      setTimeout(() => {
        receiverFields.forEach((field) => {
          setFieldError(field, undefined);
        });
      }, 10);
    }

    // Multiple timeout layers to ensure errors stay cleared
    setTimeout(() => {
      receiverFields.forEach((field) => {
        setFieldError(field, undefined);
      });
    }, 50);

    setTimeout(() => {
      receiverFields.forEach((field) => {
        setFieldError(field, undefined);
      });
    }, 150);

    // Reset changing state after a longer delay to ensure form stability
    setTimeout(() => {
      setIsReceiverAddressTypeChanging(false);
    }, 200);
  };

  // Auto-select sender area when areas are loaded and senderArea is not set
  useEffect(() => {
    if (
      values.senderAddressType === "existing" &&
      selectedSenderCustomer &&
      areas &&
      Array.isArray(areas) &&
      !values.senderArea
    ) {
      let customer: any = null;
      if (selectedSenderCustomer.value === "login_user") {
        const userData = getUserData();
        customer = userData?.Customerdetail;
      } else {
        customer = findCustomerByName(customers, selectedSenderCustomer.value);
      }
      if (customer && customer.area_name) {
        const areaName = customer.area_name.trim().toLowerCase();
        const matchedArea = areas.find(
          (a: any) =>
            (a.name && a.name.trim().toLowerCase() === areaName) ||
            (a.label && a.label.trim().toLowerCase() === areaName)
        );
        if (matchedArea) {
          setFieldValue("senderArea", {
            value: matchedArea.id,
            label: matchedArea.name,
          });
        }
      }
    }
  }, [
    areas,
    values.senderAddressType,
    selectedSenderCustomer,
    customers,
    values.senderArea,
    setFieldValue,
  ]);

  // Robustly auto-select sender area when areas or customer change
  useEffect(() => {
    if (
      values.senderAddressType === "existing" &&
      selectedSenderCustomer &&
      areas &&
      Array.isArray(areas) &&
      !values.senderArea
    ) {
      let customer: any = null;
      if (selectedSenderCustomer.value === "login_user") {
        const userData = getUserData();
        customer = userData?.Customerdetail;
      } else {
        customer = findCustomerByName(customers, selectedSenderCustomer.value);
      }
      if (customer && customer.area_name) {
        const areaName = customer.area_name.trim().toLowerCase();
        const matchedArea = areas.find(
          (a: any) =>
            (a.name && a.name.trim().toLowerCase() === areaName) ||
            (a.label && a.label.trim().toLowerCase() === areaName)
        );
        if (matchedArea) {
          setFieldValue("senderArea", {
            value: matchedArea.id,
            label: matchedArea.name,
          });
        }
      }
    }
  }, [
    areas,
    values.senderAddressType,
    selectedSenderCustomer,
    customers,
    values.senderArea,
    setFieldValue,
  ]);

  // Note: Receiver area auto-selection is now handled in handleReceiverCustomerChange

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
        receiverState: typeof values.senderState === 'object' && values.senderState !== null ? values.senderState.label || values.senderState.name || values.senderState : values.senderState || '',
        receiverCity: typeof values.senderCity === 'object' && values.senderCity !== null ? values.senderCity.label || values.senderCity.name || values.senderCity : values.senderCity || '',
        receiverArea: typeof values.senderArea === 'object' && values.senderArea !== null ? values.senderArea.label || values.senderArea.name || values.senderArea : values.senderArea || '',
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
  const handleOpenAddAreaModal = (context: "sender" | "receiver") => {
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
    dispatch(
      addAreaToList({
        id: newAreaId,
        name: newArea.value,
        city_id: "",
        pincode:
          modalContext === "sender"
            ? values.senderZipCode
            : values.receiverZipCode,
      })
    );

    // Create the option in the correct format for the dropdown (matching areasToOptions format)
    const areaOption = {
      value: newAreaId, // Use the ID as value (consistent with areasToOptions)
      label: newArea.value, // Use the area name as label
    };

    // Select the new area in the appropriate field and update local state
    if (modalContext === "sender") {
      setFieldValue("senderArea", areaOption);
      setSenderAreas((prev: any[]) => [...prev, { id: newAreaId, name: newArea.value }]);
      // console.log("✅ New area added and selected for sender:", areaOption);
    } else if (modalContext === "receiver") {
      setFieldValue("receiverArea", areaOption);
      setReceiverAreas((prev: any[]) => [...prev, { id: newAreaId, name: newArea.value }]);
      // console.log("✅ New area added and selected for receiver:", areaOption);
    }

    // Close the modal
    handleCloseAddAreaModal();
  };

  // Helper to get area option or fallback to string
  const getAreaSelectValue = (
    areaName: string,
    areas: any[]
  ) => {
    if (!areaName) return null;
    // Try to find matching option
    const areaNameNorm = areaName.trim().toLowerCase();
    const matched = areas.find(
      (a: any) =>
        (a.name && a.name.trim().toLowerCase() === areaNameNorm) ||
        (a.label && a.label.trim().toLowerCase() === areaNameNorm)
    );
    if (matched) return { value: matched.id, label: matched.name };
    // Fallback: show as string option
    return { value: areaName, label: areaName };
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
                { value: "existing", label: "Existing Address" },
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
            <StepFieldWrapper name="senderCustomer" label="Select Customer" errors={errors} touched={touched}>
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
            {/* {customersError && (
              <div className="errorText">
                Failed to load customers: {customersError}
              </div>
            )} */}
          </div>
        )}

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderName"
            label="Name"
            suppressErrors={shouldSuppressSenderErrors}
            errors={errors}
            touched={touched}
          >
            <input
              name="senderName"
              type="text"
              className="form-control innerFormControll"
              value={values.senderName || ""}
              onChange={(e) => setFieldValue("senderName", e.target.value)}
              placeholder="Enter name"
            />
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderCompanyName"
            label="Company Name"
            suppressErrors={shouldSuppressSenderErrors}
            errors={errors}
            touched={touched}
          >
            <input
              name="senderCompanyName"
              type="text"
              className="form-control innerFormControll"
              value={values.senderCompanyName || ""}
              onChange={(e) => setFieldValue("senderCompanyName", e.target.value)}
              placeholder="Enter company name"
            />
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderZipCode"
            label="Zip Code"
            suppressErrors={shouldSuppressSenderErrors}
            errors={errors}
            touched={touched}
          >
            <div className="position-relative">
              <input
                name="senderZipCode"
                type="text"
                className="form-control innerFormControll"
                value={values.senderZipCode || ""}
                onChange={(e) => {
                  const pincode = e.target.value.replace(/\D/g, ""); // Only allow digits
                  setFieldValue("senderZipCode", pincode);
                  handleSenderPincodeChange(pincode);
                }}
                placeholder="Enter 6-digit pincode"
                maxLength={6}
                disabled={pincodeLoading}
              />
              {pincodeLoading && values.senderZipCode?.length === 6 && (
                <div
                  className="position-absolute"
                  style={{
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <InlineLogisticsLoader size="sm" />
                </div>
              )}
            </div>
            {values.senderZipCode?.length === 6 && pincodeDetail && (
              <div className="text-success mt-1" style={{ fontSize: "1.4rem" }}>
                ✅ Found: {pincodeDetail.city_name}, {pincodeDetail.state_name}
              </div>
            )}
            {pincodeError && values.senderZipCode?.length === 6 && (
              <div className="text-danger mt-1" style={{ fontSize: "1.4rem" }}>
                ❌ {pincodeError}
              </div>
            )}
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3 d-none">
          <StepFieldWrapper
            name="senderCountry"
            label="Country"
            suppressErrors={shouldSuppressSenderErrors}
            errors={errors}
            touched={touched}
          >
            <input
              name="senderCountry"
              type="text"
              className="form-control innerFormControll"
              value={values.senderCountry || ""}
              onChange={(e) => setFieldValue("senderCountry", e.target.value)}
              placeholder="Enter country"
            />
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderState"
            label="State"
            suppressErrors={shouldSuppressSenderErrors}
            errors={errors}
            touched={touched}
          >
            <input
              name="senderState"
              type="text"
              className="form-control innerFormControll"
              value={typeof values.senderState === 'object' && values.senderState !== null ? values.senderState.label || '' : values.senderState || ''}
              onChange={(e) => setFieldValue("senderState", e.target.value)}
              placeholder="Enter state"
            />
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderCity"
            label="City"
            suppressErrors={shouldSuppressSenderErrors}
            errors={errors}
            touched={touched}
          >
            <input
              name="senderCity"
              type="text"
              className="form-control innerFormControll"
              value={typeof values.senderCity === 'object' && values.senderCity !== null ? values.senderCity.label || '' : values.senderCity || ''}
              onChange={(e) => setFieldValue("senderCity", e.target.value)}
              placeholder="Enter city"
            />
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderArea"
            label="Area"
            suppressErrors={shouldSuppressSenderErrors}
            errors={errors}
            touched={touched}
            labelButton={
              <AddAreaButton
                text="Add Area"
                onClick={() => handleOpenAddAreaModal("sender")}
                ariaLabel="Add new area for sender address"
              />
            }
          >
            <SingleSelect
              options={areasToOptions(values.senderZipCode?.length === 6 ? senderAreas : [])}
              value={
                values.senderAddressType === "existing" &&
                selectedSenderCustomer
                  ? getAreaSelectValue(
                      (selectedSenderCustomer.value === "login_user"
                        ? getUserData()?.Customerdetail?.area_name
                        : findCustomerByName(
                            customers,
                            selectedSenderCustomer.value
                          )?.area_name) || "",
                      values.senderZipCode?.length === 6 ? senderAreas : []
                    )
                  : values.senderArea
              }
              onChange={(option: any) => setFieldValue("senderArea", option)}
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
            suppressErrorMessage={true}
            errors={errors}
            touched={touched}
          >
            <input
              name="senderGstNo"
              type="text"
              className="form-control innerFormControll"
              value={values.senderGstNo || ""}
              onChange={(e) => {
                const gstValue = e.target.value
                  .replace(/[^a-zA-Z0-9]/g, "")
                  .toUpperCase(); // Only allow alphanumeric and convert to uppercase
                setFieldValue("senderGstNo", gstValue);
              }}
              placeholder="Enter 15-character GST number"
              maxLength={15}
            />
            {values.senderGstNo && values.senderGstNo.length > 0 && (
              <div
                className={`mt-1 ${
                  /^[0-3][0-9]{1}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(values.senderGstNo)
                    ? "text-success errorText"
                    : "errorText"
                }`}
              >
                {/^[0-3][0-9]{1}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(values.senderGstNo)
                  ? "✅ Valid GST Number"
                  : `GST Number format: 2 digits (state code), 5 letters, 4 digits, 1 letter, 1 entity (1-9/A-Z), 'Z', 1 alphanumeric`}
              </div>
            )}
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderAddressLine1"
            label="Address Line 1"
            suppressErrors={shouldSuppressSenderErrors}
            errors={errors}
            touched={touched}
          >
            <input
              name="senderAddressLine1"
              type="text"
              className="form-control innerFormControll"
              value={values.senderAddressLine1 || ""}
              onChange={(e) => setFieldValue("senderAddressLine1", e.target.value)}
              placeholder="Enter address line 1"
            />
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderAddressLine2"
            label="Address Line 2"
            suppressErrors={shouldSuppressSenderErrors}
            errors={errors}
            touched={touched}
          >
            <input
              name="senderAddressLine2"
              type="text"
              className="form-control innerFormControll"
              value={values.senderAddressLine2 || ""}
              onChange={(e) => setFieldValue("senderAddressLine2", e.target.value)}
              placeholder="Enter address line 2 (optional)"
            />
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderMobile"
            label="Mobile"
            suppressErrors={shouldSuppressSenderErrors}
            errors={errors}
            touched={touched}
          >
            <input
              name="senderMobile"
              type="tel"
              className="form-control innerFormControll"
              value={values.senderMobile || ""}
              onChange={(e) => {
                const mobileValue = e.target.value.replace(/\D/g, ""); // Only allow digits
                setFieldValue("senderMobile", mobileValue);
              }}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
            />
            {values.senderMobile && values.senderMobile.length > 0 && (
              <div
                className={`mt-1 ${
                  values.senderMobile.length === 10
                    ? "text-success errorText"
                    : "errorText"
                }`}
              >
                {values.senderMobile.length === 10 ? "✅" : "⚠️"}{" "}
                {values.senderMobile.length}/10 digits
              </div>
            )}
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="senderEmail"
            label="Email"
            suppressErrors={shouldSuppressSenderErrors}
            errors={errors}
            touched={touched}
          >
            <input
              name="senderEmail"
              type="email"
              className="form-control innerFormControll"
              value={values.senderEmail || ""}
              onChange={(e) => {
                setFieldValue("senderEmail", e.target.value);
              }}
              placeholder="Enter valid email address"
            />
            {values.senderEmail && values.senderEmail.length > 0 && (
              <div
                className={`mt-1 ${
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                    values.senderEmail
                  )
                    ? "text-success errorText"
                    : "errorText"
                }`}
              >
                {/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                  values.senderEmail
                )
                  ? "✅ Valid email format"
                  : "⚠️ Invalid email format"}
              </div>
            )}
          </StepFieldWrapper>
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
                { value: "existing", label: "Existing Address" },
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
          <StepFieldWrapper
            name="receiverCustomerSearch"
            label="Search Customers"
            errors={errors}
            touched={touched}
          >
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
                  if (query.trim().toLowerCase() === "version") {
                    // Only show /getCustomers options
                    handleCustomerSearch("version");
                  } else {
                    // Show all options
                    handleCustomerSearch("");
                  }
                }, 500); // 500ms delay
              }}
              disabled={isSearching}
            />
          </StepFieldWrapper>
            </div>

            {/* Customer Selection Dropdown */}
            <div className="col-md-12 mb-3">
              <StepFieldWrapper name="receiverCustomer" label="Select Customer" errors={errors} touched={touched}>
                <SingleSelect
                  options={
                    receiverSearchQuery.trim() === '' || receiverSearchQuery.trim().toLowerCase() === 'version'
                      ? customersToOptionsWithLoginUser(customers)
                      : customersToOptions(customers)
                  }
                  value={selectedReceiverCustomer}
                  onChange={handleReceiverCustomerChange}
                  placeholder={
                    customersLoading || isSearching
                      ? "Loading customers..."
                      : "Select customer"
                  }
                  isLoading={customersLoading || isSearching}
                />
                {receiverSearchQuery &&
                  customers.length === 0 &&
                  !customersLoading &&
                  !isSearching && (
                    <small className="text-muted">
                      No customers found for "{receiverSearchQuery}". Try a
                      different search term.
                    </small>
                  )}
              </StepFieldWrapper>
              {/* {customersError && (
                <div className="errorText">
                  Failed to load customers: {customersError}
                </div>
              )} */}
            </div>
          </>
        )}

        <div className="col-md-12 d-none">
          <Checkbox
            id="sameAsPickup"
            name="sameAsPickup"
            label="Same as Sender"
            checked={sameAsPickup}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSameAsPickup(e.target.checked)}
          />
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverName"
            label="Name"
            suppressErrors={shouldSuppressReceiverErrors}
            errors={errors}
            touched={touched}
          >
            <input
              name="receiverName"
              type="text"
              className="form-control innerFormControll"
              value={values.receiverName || ""}
              onChange={(e) => setFieldValue("receiverName", e.target.value)}
              placeholder="Enter name"
            />
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverCompanyName"
            label="Company Name"
            suppressErrors={shouldSuppressReceiverErrors}
            errors={errors}
            touched={touched}
          >
            <input
              name="receiverCompanyName"
              type="text"
              className="form-control innerFormControll"
              value={values.receiverCompanyName || ""}
              onChange={(e) => setFieldValue("receiverCompanyName", e.target.value)}
              placeholder="Enter company name"
            />
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverZipCode"
            label="Zip Code"
            suppressErrors={shouldSuppressReceiverErrors}
            errors={errors}
            touched={touched}
          >
            <div className="position-relative">
              <input
                name="receiverZipCode"
                type="text"
                className="form-control innerFormControll"
                value={values.receiverZipCode || ""}
                onChange={(e) => {
                  const pincode = e.target.value.replace(/\D/g, ""); // Only allow digits
                  setFieldValue("receiverZipCode", pincode);
                  handleReceiverPincodeChange(pincode);
                }}
                placeholder="Enter 6-digit pincode"
                maxLength={6}
                disabled={pincodeLoading}
              />
              {pincodeLoading && values.receiverZipCode?.length === 6 && (
                <div
                  className="position-absolute"
                  style={{
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <InlineLogisticsLoader size="sm" />
                </div>
              )}
            </div>
            {values.receiverZipCode?.length === 6 && pincodeDetail && (
              <div className="text-success mt-1" style={{ fontSize: "1.4rem" }}>
                ✅ Found: {pincodeDetail.city_name}, {pincodeDetail.state_name}
              </div>
            )}
            {pincodeError && values.receiverZipCode?.length === 6 && (
              <div className="text-danger mt-1" style={{ fontSize: "1.4rem" }}>
                ❌ {pincodeError}
              </div>
            )}
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3 d-none">
          <StepFieldWrapper
            name="receiverCountry"
            label="Country"
            suppressErrors={shouldSuppressReceiverErrors}
            errors={errors}
            touched={touched}
          >
            <input
              name="receiverCountry"
              type="text"
              className="form-control innerFormControll"
              value={values.receiverCountry || ""}
              onChange={(e) => setFieldValue("receiverCountry", e.target.value)}
              placeholder="Enter country"
            />
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverState"
            label="State"
            suppressErrors={shouldSuppressReceiverErrors}
            errors={errors}
            touched={touched}
          >
            <input
              name="receiverState"
              type="text"
              className="form-control innerFormControll"
              value={typeof values.receiverState === 'object' && values.receiverState !== null ? values.receiverState.label || '' : values.receiverState || ''}
              onChange={(e) => setFieldValue("receiverState", e.target.value)}
              placeholder="Enter state"
            />
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverCity"
            label="City"
            suppressErrors={shouldSuppressReceiverErrors}
            errors={errors}
            touched={touched}
          >
            <input
              name="receiverCity"
              type="text"
              className="form-control innerFormControll"
              value={typeof values.receiverCity === 'object' && values.receiverCity !== null ? values.receiverCity.label || '' : values.receiverCity || ''}
              onChange={(e) => setFieldValue("receiverCity", e.target.value)}
              placeholder="Enter city"
            />
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverArea"
            label="Area"
            suppressErrors={shouldSuppressReceiverErrors}
            errors={errors}
            touched={touched}
            labelButton={
              <AddAreaButton
                text="Add Area"
                onClick={() => handleOpenAddAreaModal("receiver")}
                ariaLabel="Add new area for receiver address"
              />
            }
          >
            <SingleSelect
              options={areasToOptions(values.receiverZipCode?.length === 6 ? receiverAreas : [])}
              value={values.receiverArea}
              onChange={(option: any) => setFieldValue("receiverArea", option)}
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
            suppressErrorMessage={true}
            errors={errors}
            touched={touched}
          >
            <input
              name="receiverGstNo"
              type="text"
              className="form-control innerFormControll"
              value={values.receiverGstNo || ""}
              onChange={(e) => {
                const gstValue = e.target.value
                  .replace(/[^a-zA-Z0-9]/g, "")
                  .toUpperCase(); // Only allow alphanumeric and convert to uppercase
                setFieldValue("receiverGstNo", gstValue);
              }}
              placeholder="Enter 15-character GST number"
              maxLength={15}
            />
            {values.receiverGstNo && values.receiverGstNo.length > 0 && (
              <div
                className={`mt-1 ${
                  /^[0-3][0-9]{1}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(values.receiverGstNo)
                    ? "text-success errorText"
                    : "errorText"
                }`}
              >
                {/^[0-3][0-9]{1}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(values.receiverGstNo)
                  ? "✅ Valid GST Number"
                  : `GST Number format: 2 digits (state code), 5 letters, 4 digits, 1 letter, 1 entity (1-9/A-Z), 'Z', 1 alphanumeric`}
              </div>
            )}
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverAddressLine1"
            label="Address Line 1"
            suppressErrors={shouldSuppressReceiverErrors}
            errors={errors}
            touched={touched}
          >
            <input
              name="receiverAddressLine1"
              type="text"
              className="form-control innerFormControll"
              value={values.receiverAddressLine1 || ""}
              onChange={(e) => setFieldValue("receiverAddressLine1", e.target.value)}
              placeholder="Enter address line 1"
            />
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverAddressLine2"
            label="Address Line 2"
            suppressErrors={shouldSuppressReceiverErrors}
            errors={errors}
            touched={touched}
          >
            <input
              name="receiverAddressLine2"
              type="text"
              className="form-control innerFormControll"
              value={values.receiverAddressLine2 || ""}
              onChange={(e) => setFieldValue("receiverAddressLine2", e.target.value)}
              placeholder="Enter address line 2 (optional)"
            />
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverMobile"
            label="Mobile"
            suppressErrors={shouldSuppressReceiverErrors}
            errors={errors}
            touched={touched}
          >
            <input
              name="receiverMobile"
              type="tel"
              className="form-control innerFormControll"
              value={values.receiverMobile || ""}
              onChange={(e) => {
                const mobileValue = e.target.value.replace(/\D/g, ""); // Only allow digits
                setFieldValue("receiverMobile", mobileValue);
              }}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
            />
            {values.receiverMobile && values.receiverMobile.length > 0 && (
              <div
                className={`mt-1 ${
                  values.receiverMobile.length === 10
                    ? "text-success errorText"
                    : "errorText"
                }`}
              >
                {values.receiverMobile.length === 10 ? "✅" : "⚠️"}{" "}
                {values.receiverMobile.length}/10 digits
              </div>
            )}
          </StepFieldWrapper>
        </div>

        <div className="col-md-12 mb-3">
          <StepFieldWrapper
            name="receiverEmail"
            label="Email"
            suppressErrors={shouldSuppressReceiverErrors}
            errors={errors}
            touched={touched}
          >
            <input
              name="receiverEmail"
              type="email"
              className="form-control innerFormControll"
              value={values.receiverEmail || ""}
              onChange={(e) => {
                setFieldValue("receiverEmail", e.target.value);
              }}
              placeholder="Enter valid email address"
            />
            {values.receiverEmail && values.receiverEmail.length > 0 && (
              <div
                className={`mt-1 ${
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                    values.receiverEmail
                  )
                    ? "text-success errorText"
                    : "errorText"
                }`}
              >
                {/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                  values.receiverEmail
                )
                  ? "✅ Valid email format"
                  : "⚠️ Invalid email format"}
              </div>
            )}
          </StepFieldWrapper>
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
              { value: "receiver", label: "Receiver" },
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
        title={`Add New Area ${
          modalContext === "sender"
            ? "for Sender"
            : modalContext === "receiver"
            ? "for Receiver"
            : ""
        }`}
      />
    </>
  );
};

export default StepTwoFormFields;
