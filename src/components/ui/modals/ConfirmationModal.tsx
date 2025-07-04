import React from "react";
import Button from "../button/Button";
import Modal from "./Modal";
import { InlineLogisticsLoader } from "../spinner";

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
}) => {
  const footer = (
    <>
      <Button
        text={cancelText}
        type="button"
        className="btn btn-secondary"
        onClick={onCancel}
        disabled={isLoading}
      />
      <Button
        text={isLoading ? "Processing..." : confirmText}
        type="button"
        className={`btn btn-${confirmButtonVariant}`}
        onClick={onConfirm}
        disabled={isLoading}
      />
      {isLoading && (
        <span className="ms-2">
          <InlineLogisticsLoader size="sm" />
        </span>
      )}
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      size="sm"
      footer={footer}
    >
      <p>{message}</p>
    </Modal>
  );
};

export default ConfirmationModal;
