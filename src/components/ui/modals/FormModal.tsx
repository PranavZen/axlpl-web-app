import React from "react";
import Button from "../button/Button";
import Modal from "./Modal";

interface FormModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  title,
  onClose,
  onSubmit,
  children,
  submitText = "Submit",
  cancelText = "Cancel",
  isSubmitting = false,
  size = "md",
}) => {
  return (
    <Modal isOpen={isOpen} title={title} onClose={onClose} size={size}>
      <form onSubmit={onSubmit}>
        {children}
        <div className="d-flex justify-content-end mt-4">
          <Button
            text={cancelText}
            type="button"
            className="btn btn-secondary me-2"
            onClick={onClose}
            disabled={isSubmitting}
          />
          <Button
            text={isSubmitting ? "Processing..." : submitText}
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          />
          {isSubmitting && (
            <span
              className="spinner-border spinner-border-sm ms-2"
              role="status"
              aria-hidden="true"
            ></span>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default FormModal;
