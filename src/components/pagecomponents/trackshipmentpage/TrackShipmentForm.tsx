import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "../../../redux/store";
import { trackShipment, clearTrackingError } from "../../../redux/slices/trackingSlice";
import { getUserData } from "../../../utils/authUtils";
import { useShipmentSecurity, isSecurityError, getSecurityErrorMessage } from "../../../hooks/useShipmentSecurity";
import Input from "../../ui/input/Input";
import Button from "../../ui/button/Button";

const TrackShipmentForm: React.FC = () => {
  const [shipmentId, setShipmentId] = useState("");
  const [touched, setTouched] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.tracking);

  // Get current user information
  const userData = getUserData();
  const userName = userData?.Customerdetail?.name || userData?.Customerdetail?.company_name || "User";

  // Use security hook for validation
  const { validateShipmentAccess, isValidating } = useShipmentSecurity();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipmentId(e.target.value);
    if (error) {
      dispatch(clearTrackingError());
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!shipmentId.trim()) {
      toast.error("Please enter a shipment ID");
      return;
    }

    const shipmentIdTrimmed = shipmentId.trim();

    // Pre-validate shipment access using security hook
    const isAccessValid = await validateShipmentAccess(shipmentIdTrimmed);
    if (!isAccessValid) {
      // Error is already handled by the security hook
      return;
    }

    try {
      const result = await dispatch(trackShipment(shipmentIdTrimmed));

      if (trackShipment.fulfilled.match(result)) {
        toast.success(`🎉 Shipment tracking data retrieved successfully for ${userName}!`);
      } else if (trackShipment.rejected.match(result)) {
        const errorMessage = result.payload as string;

        // Use security error utilities for better error handling
        if (isSecurityError(errorMessage)) {
          const friendlyMessage = getSecurityErrorMessage(errorMessage);
          toast.error("🔒 " + friendlyMessage, { autoClose: 8000 });
        } else if (errorMessage.includes("Authentication required")) {
          toast.error("🔐 " + errorMessage, { autoClose: 6000 });
        } else if (errorMessage.includes("session has expired")) {
          toast.error("⏰ " + errorMessage, { autoClose: 6000 });
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      toast.error("Failed to track shipment. Please try again.");
    }
  };

  const getError = () => {
    if (!touched) return "";
    if (!shipmentId.trim()) return "Shipment ID is required";
    return "";
  };

  return (
    <div className="trackingForm">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-8">
            <div className="form-group">
              <label htmlFor="shipmentId" className="formLabel">
                Shipment ID
              </label>
              <Input
                type="text"
                id="shipmentId"
                name="shipmentId"
                value={shipmentId}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeHolder="Enter your shipment ID"
                className="innerFormControll"
                error={getError()}
                touched={touched}
                disabled={loading}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="formLabel extraLabel">&nbsp;</label>
              <Button
                type="submit"
                text={
                  loading ? "Tracking..." :
                  isValidating ? "Validating Access..." :
                  "Track Shipment"
                }
                disabled={loading || isValidating || !shipmentId.trim()}
                className="btn btn-primary btn-block trackBtn"
              />
            </div>
          </div>
        </div>

      </form>

      {/* Security Help Section */}
      <div className="helpSection d-none">
        <p className="helpText">
          <strong>Security Notice:</strong> You can only track shipments that belong to your account ({userName}).
          Enter your shipment ID to track your package in real-time with secure access control.
        </p>
      </div>
    </div>
  );
};

export default TrackShipmentForm;
