import React from "react";
import Button from "../button/Button";
import Modal from "./Modal";
import { InlineLogisticsLoader } from "../spinner";
import "./ConfirmationModal.scss";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  confirmButtonVariant?: string;
  icon?: React.ReactNode; // Optional custom icon
  subtitle?: string; // Optional subtitle
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  confirmButtonVariant = "danger",
  icon,
  subtitle,
}) => {
  const footer = (
    <div className="confirmation-modal-footer">
      <Button
        text={cancelText}
        type="button"
        className="btn btn-cancel"
        onClick={onCancel}
        disabled={isLoading}
      />
      <Button
        text={isLoading ? "Processing..." : confirmText}
        type="button"
        className={`btn btn-${confirmButtonVariant} btn-confirm`}
        onClick={onConfirm}
        disabled={isLoading}
        icon={isLoading ? <InlineLogisticsLoader size="sm" /> : undefined}
      />
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      title=""
      onClose={onCancel}
      size="sm"
      footer={footer}
    >
      <div className="confirmation-modal-content">
        {/* Header Section */}
        <div className="confirmation-modal-header">
          <div className="confirmation-icon-wrapper">
            {icon || (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            )}
          </div>
          <h3 className="confirmation-modal-title">{title}</h3>
          {subtitle && (
            <p className="confirmation-modal-subtitle">{subtitle}</p>
          )}
        </div>

        {/* Message Section */}
        <div className="confirmation-message-section">
          <p className="confirmation-message">{message}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
