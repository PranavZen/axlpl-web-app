import React, { useState } from "react";
import Button from "../button/Button";
import Modal from "./Modal";
import Label from "../label/Label";
import { InlineLogisticsLoader } from "../spinner";
import "./PrintLabelModal.scss";

interface PrintLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: (numberOfLabels: number) => void;
  shipmentId: string;
  isLoading?: boolean;
}

const PrintLabelModal: React.FC<PrintLabelModalProps> = ({
  isOpen,
  onClose,
  onPrint,
  shipmentId,
  isLoading = false,
}) => {
  const [numberOfLabels, setNumberOfLabels] = useState(1);

  const handlePrint = () => {
    if (numberOfLabels > 0 && numberOfLabels <= 100) {
      onPrint(numberOfLabels);
    }
  };

  const handleClose = () => {
    setNumberOfLabels(1); // Reset to default
    onClose();
  };

  const footer = (
    <div className="print-modal-footer">
      <Button
        text="Cancel"
        type="button"
        className="btn btn-cancel"
        onClick={handleClose}
        disabled={isLoading}
      />
      <Button
        text={isLoading ? "Printing..." : "Print Labels"}
        icon={
          isLoading ? (
            <InlineLogisticsLoader size="sm" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
            </svg>
          )
        }
        type="button"
        className="btn btn-print"
        onClick={handlePrint}
        disabled={isLoading || numberOfLabels < 1 || numberOfLabels > 100}
      />
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      title=""
      onClose={handleClose}
      size="md"
      footer={footer}
    >
      <div className="print-label-modal-content">
        {/* Header Section */}
        <div className="print-modal-header">
          <div className="print-icon-wrapper">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
            </svg>
          </div>
          <h3 className="print-modal-title">Print Shipment Labels</h3>
          <p className="print-modal-subtitle">
            Generate and print shipping labels for your shipment
          </p>
        </div>

        {/* Form Section */}
        <div className="print-form-section">
          <div className="form-group">
            <Label
              className="form-label innerLabel"
              htmlFor="numberOfLabels"
              text="Number of Labels"
            />
            <div className="input-wrapper">
              <input
                type="number"
                id="numberOfLabels"
                className="form-control innerFormControll"
                value={numberOfLabels}
                onChange={(e) =>
                  setNumberOfLabels(parseInt(e.target.value) || 1)
                }
                min="1"
                max="100"
                disabled={isLoading}
                placeholder="Enter quantity"
              />
              <div className="input-helper">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                <span>Enter a number between 1 and 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PrintLabelModal;
