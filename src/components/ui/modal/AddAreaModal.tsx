import React, { useState } from "react";
import "./AddAreaModal.scss";

interface AddAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAreaAdded: (newArea: { value: string; label: string }) => void;
  title?: string;
}

const AddAreaModal: React.FC<AddAreaModalProps> = ({
  isOpen,
  onClose,
  onAreaAdded,
  title = "Add New Area"
}) => {
  const [areaName, setAreaName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!areaName.trim()) {
      setError("Area name is required");
      return false;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Simulate adding area (since we're not using API)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create new area option for the dropdown
      const newArea = {
        value: areaName.trim(),
        label: areaName.trim()
      };

      // Call the callback to update the parent component
      onAreaAdded(newArea);

      // Reset form and close modal
      setAreaName("");
      setError("");
      onClose();

    } catch (error) {
      setError("Failed to add area. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setAreaName("");
      setError("");
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-area-modal-backdrop" onClick={handleBackdropClick}>
      <div className="add-area-modal">
        <div className="add-area-modal-header">
          <h3 className="add-area-modal-title">{title}</h3>
          <button
            type="button"
            className="add-area-modal-close"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.89a.996.996 0 101.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
            </svg>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
          className="add-area-modal-form"
          noValidate
          autoComplete="off"
        >
          <div className="add-area-modal-body">
            <div className="form-group mb-0">
              <label htmlFor="areaName" className="form-label">
                Area Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="areaName"
                name="areaName"
                className={`form-control ${error ? 'is-invalid' : ''}`}
                value={areaName}
                onChange={(e) => {
                  setAreaName(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isSubmitting && areaName.trim()) {
                      await handleSubmit(e);
                    }
                  }
                }}
                placeholder="Enter area name"
                disabled={isSubmitting}
                autoFocus
                maxLength={100}
              />
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </div>
          </div>

          <div className="add-area-modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={isSubmitting || !areaName.trim()}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await handleSubmit(e);
              }}
            >
              {isSubmitting ? (
                <>
                  <svg className="spinner" width="16" height="16" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
                  </svg>
                  Adding...
                </>
              ) : (
                "Add Area"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAreaModal;
