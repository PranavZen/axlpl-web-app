import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "../../../redux/store";
import { trackShipment, clearTrackingError } from "../../../redux/slices/trackingSlice";
import Input from "../../ui/input/Input";
import Button from "../../ui/button/Button";

const TrackShipmentForm: React.FC = () => {
  const [shipmentId, setShipmentId] = useState("");
  const [touched, setTouched] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.tracking);

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

    try {
      const result = await dispatch(trackShipment(shipmentId.trim()));
      
      if (trackShipment.fulfilled.match(result)) {
        toast.success("Shipment tracking data retrieved successfully!");
      } else if (trackShipment.rejected.match(result)) {
        toast.error(result.payload as string);
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
                placeHolder="Enter your shipment ID (e.g., 1828030292462)"
                className="innerFormControll"
                error={getError()}
                touched={touched}
                disabled={loading}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="formLabel">&nbsp;</label>
              <Button
                type="submit"
                text={loading ? "Tracking..." : "Track Shipment"}
                disabled={loading || !shipmentId.trim()}
                className="btn btn-primary btn-block trackBtn"
              />
            </div>
          </div>
        </div>

        <div className="helpSection">
          <p className="helpText">
            <strong>Need help?</strong> Your shipment ID is usually 10-13 digits long.
            Check your booking confirmation email or SMS for the tracking number.
          </p>
        </div>
      </form>
    </div>
  );
};

export default TrackShipmentForm;
