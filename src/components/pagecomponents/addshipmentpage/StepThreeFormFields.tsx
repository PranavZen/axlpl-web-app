import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import StepFieldWrapper from "./StepFieldWrapper";
import SingleSelect from "../../ui/select/SingleSelect";
import Checkbox from "../../ui/checkbox/Checkbox";
import { RootState, AppDispatch } from "../../../redux/store";
import {
  fetchPincodeDetail,
  fetchAreasByPincode,
  addAreaToList,
} from "../../../redux/slices/pincodeSlice";
import { areasToOptions } from "../../../utils/customerUtils";
import AddAreaButton from "../../ui/button/AddAreaButton";
import AddAreaModal from "../../ui/modal/AddAreaModal";
import { InlineLogisticsLoader } from "../../ui/spinner";

interface StepThreeFormFieldsProps {
  values: any;
  setFieldValue: (field: string, value: any) => void;
  setFieldTouched: (field: string, touched: boolean) => void;
  setFieldError: (field: string, error: string | undefined) => void;
  errors?: any;
  touched?: any;
}

const StepThreeFormFields: React.FC<StepThreeFormFieldsProps> = ({
  values,
  setFieldValue,
  setFieldTouched,
  setFieldError,
  errors,
  touched,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isDifferentDeliveryAddress, setIsDifferentDeliveryAddress] =
    useState(values.isDifferentDeliveryAddress || false);

  // Modal state for Add Area functionality
  const [isAddAreaModalOpen, setIsAddAreaModalOpen] = useState(false);

  // Redux state for pincode and areas
  const {
    pincodeDetail,
    loading: pincodeLoading,
    error: pincodeError,
    areas,
    areasLoading,
    areasError,
  } = useSelector((state: RootState) => state.pincode);

  // Refs for debouncing pincode API calls
  const deliveryPincodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Core pincode fetch function for delivery address
  const fetchDeliveryPincodeData = useCallback(
    async (pincode: string) => {
      try {
        // Fetch pincode details first
        const pincodeResult = await dispatch(fetchPincodeDetail(pincode));

        if (fetchPincodeDetail.fulfilled.match(pincodeResult)) {
          const { state_name, city_name, area_name, state_id, city_id, area_id } = pincodeResult.payload;

          // Auto-populate state and city with names
          setFieldValue("deliveryState", state_name);
          setFieldValue("deliveryCity", city_name);
          setFieldValue("deliveryArea", area_name);

          // Also set the corresponding IDs for form submission
          setFieldValue("deliveryStateId", state_id);
          setFieldValue("deliveryCityId", city_id);
          setFieldValue("deliveryAreaId", area_id);
        }

        // Fetch areas for the pincode
        const areasResult = await dispatch(fetchAreasByPincode(pincode));

        if (fetchAreasByPincode.fulfilled.match(areasResult)) {
          // Clear any previously selected area since we have new options
          setFieldValue("deliveryArea", null);
        }
      } catch (error) {
        // Error handling can be added here if needed
      }
    },
    [dispatch, setFieldValue]
  );

  // Debounced pincode handler for delivery address
  const handleDeliveryPincodeChange = useCallback(
    (pincode: string) => {
      // Clear any existing timeout
      if (deliveryPincodeTimeoutRef.current) {
        clearTimeout(deliveryPincodeTimeoutRef.current);
      }

      // Only trigger when we have exactly 6 digits
      if (pincode && pincode.length === 6 && /^\d{6}$/.test(pincode)) {
        // Debounce the API call by 300ms
        deliveryPincodeTimeoutRef.current = setTimeout(() => {
          fetchDeliveryPincodeData(pincode);
        }, 300);
      } else if (pincode && pincode.length < 6) {
        // Clear state, city, and area when pincode is incomplete
        setFieldValue("deliveryState", "");
        setFieldValue("deliveryCity", "");
        setFieldValue("deliveryArea", null);
      }
    },
    [fetchDeliveryPincodeData, setFieldValue]
  );

  // Handle different delivery address toggle
  const handleDifferentDeliveryAddressToggle = (checked: boolean) => {
    setIsDifferentDeliveryAddress(checked);
    setFieldValue("isDifferentDeliveryAddress", checked);

    if (!checked) {
      // Clear delivery address fields when unchecked
      setFieldValue("deliveryZipCode", "");
      setFieldValue("deliveryState", "");
      setFieldValue("deliveryCity", "");
      setFieldValue("deliveryArea", null);
      setFieldValue("deliveryAddressLine1", "");
      setFieldValue("deliveryAddressLine2", "");
    }
  };

  // Sync local state with Formik values
  useEffect(() => {
    setIsDifferentDeliveryAddress(values.isDifferentDeliveryAddress || false);
  }, [values.isDifferentDeliveryAddress]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (deliveryPincodeTimeoutRef.current) {
        clearTimeout(deliveryPincodeTimeoutRef.current);
      }
    };
  }, []);

  // Modal handler functions
  const handleOpenAddAreaModal = () => {
    setIsAddAreaModalOpen(true);
  };

  const handleCloseAddAreaModal = () => {
    setIsAddAreaModalOpen(false);
  };

  const handleAreaAdded = (newArea: { value: string; label: string }) => {
    // Create a unique ID for the new area
    const newAreaId = Date.now().toString();

    // Add the new area to the Redux store using the proper action
    dispatch(addAreaToList({
      id: newAreaId,
      name: newArea.value,
      city_id: '',
      pincode: values.deliveryZipCode
    }));

    // Create the option in the correct format for the dropdown (matching areasToOptions format)
    const areaOption = {
      value: newAreaId, // Use the ID as value (consistent with areasToOptions)
      label: newArea.value // Use the area name as label
    };

    // Select the new area in the delivery area field
    setFieldValue('deliveryArea', areaOption);

    // Close the modal
    handleCloseAddAreaModal();
  };



  return (
    <div className="step-three-fields">
      {/* Different Delivery Address Section */}
      <div className="package-section">
        <div className="col-md-12 mb-3">
          <Checkbox
            id="isDifferentDeliveryAddress"
            name="isDifferentDeliveryAddress"
            label="Different Delivery Address"
            checked={isDifferentDeliveryAddress}
            onChange={(e) =>
              handleDifferentDeliveryAddressToggle(e.target.checked)
            }
          />
        </div>

        {/* Delivery Address Fields - Only show when checkbox is checked */}
        {isDifferentDeliveryAddress && (
          <div className="delivery-address-fields">
            <div className="row">
              <div className="col-md-6 mb-3">
                <StepFieldWrapper name="deliveryZipCode" label="Zip Code">
                  <div className="position-relative">
                    <input
                      name="deliveryZipCode"
                      type="text"
                      className="form-control innerFormControll"
                      value={values.deliveryZipCode || ""}
                      onChange={(e) => {
                        const pincode = e.target.value.replace(/\D/g, ""); // Only allow digits
                        setFieldValue("deliveryZipCode", pincode);
                        handleDeliveryPincodeChange(pincode);
                      }}
                      placeholder="Enter 6-digit pincode"
                      maxLength={6}
                      disabled={pincodeLoading}
                    />
                    {pincodeLoading && values.deliveryZipCode?.length === 6 && (
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
                  {values.deliveryZipCode?.length === 6 && pincodeDetail && (
                    <div
                      className="text-success mt-1"
                      style={{ fontSize: "1.4rem" }}
                    >
                      ✅ Found: {pincodeDetail.city_name},{" "}
                      {pincodeDetail.state_name}
                    </div>
                  )}
                  {pincodeError && values.deliveryZipCode?.length === 6 && (
                    <div
                      className="text-danger mt-1"
                      style={{ fontSize: "1.4rem" }}
                    >
                      ❌ {pincodeError}
                    </div>
                  )}
                </StepFieldWrapper>
              </div>

              <div className="col-md-6 mb-3">
                <StepFieldWrapper name="deliveryState" label="State">
                  <input
                    name="deliveryState"
                    type="text"
                    className="form-control innerFormControll"
                    value={values.deliveryState || ""}
                    onChange={(e) =>
                      setFieldValue("deliveryState", e.target.value)
                    }
                    placeholder="Enter state name"
                  />
                </StepFieldWrapper>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <StepFieldWrapper name="deliveryCity" label="City">
                  <input
                    name="deliveryCity"
                    type="text"
                    className="form-control innerFormControll"
                    value={values.deliveryCity || ""}
                    onChange={(e) =>
                      setFieldValue("deliveryCity", e.target.value)
                    }
                    placeholder="Enter city name"
                    disabled={!values.deliveryState}
                  />
                </StepFieldWrapper>
              </div>

              <div className="col-md-6 mb-3">
                <StepFieldWrapper
                  name="deliveryArea"
                  label="Area"
                  labelButton={
                    <AddAreaButton
                      text="Add Area"
                      onClick={() => handleOpenAddAreaModal()}
                      ariaLabel="Add new area for delivery address"
                    />
                  }
                >
                  <SingleSelect
                    options={areasToOptions(areas)}
                    value={values.deliveryArea}
                    onChange={(option) => setFieldValue("deliveryArea", option)}
                    placeholder={
                      areasLoading ? "Loading areas..." : "Select Area"
                    }
                    isLoading={areasLoading}
                  />
                  {areasError && (
                    <div className="errorText mt-1">
                      Failed to load areas: {areasError}
                    </div>
                  )}
                </StepFieldWrapper>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <StepFieldWrapper
                  name="deliveryAddressLine1"
                  label="Address Line 1"
                >
                  <input
                    name="deliveryAddressLine1"
                    type="text"
                    className="form-control innerFormControll"
                    value={values.deliveryAddressLine1 || ""}
                    onChange={(e) =>
                      setFieldValue("deliveryAddressLine1", e.target.value)
                    }
                    placeholder="Enter address line 1"
                  />
                </StepFieldWrapper>
              </div>

              <div className="col-md-6 mb-3">
                <StepFieldWrapper
                  name="deliveryAddressLine2"
                  label="Address Line 2"
                >
                  <input
                    name="deliveryAddressLine2"
                    type="text"
                    className="form-control innerFormControll"
                    value={values.deliveryAddressLine2 || ""}
                    onChange={(e) =>
                      setFieldValue("deliveryAddressLine2", e.target.value)
                    }
                    placeholder="Enter address line 2 (optional)"
                  />
                </StepFieldWrapper>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Area Modal */}
      <AddAreaModal
        isOpen={isAddAreaModalOpen}
        onClose={handleCloseAddAreaModal}
        onAreaAdded={handleAreaAdded}
        title="Add New Area for Delivery"
      />
    </div>
  );
};

export default StepThreeFormFields;
