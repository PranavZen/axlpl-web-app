import React from 'react';

interface FormNavigationProps {
  step: number;
  stepsLength: number;
  onBack: () => void;
  isLastStep?: boolean;
  submitText?: string;
  isSubmitting?: boolean;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  step,
  stepsLength,
  onBack,
  isLastStep = false,
  submitText = "Submit Shipment",
  isSubmitting = false
}) => (
  <div className="form-navigation">
    <div className="navigation-buttons">
      {step > 0 && (
        <button
          type="button"
          className="btn btn-outline-secondary btn-back"
          onClick={onBack}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back
        </button>
      )}

      <button
        type="submit"
        className={`btn ${isLastStep ? 'btn-success btn-submit' : 'btn-primary btn-next'}`}
        disabled={isSubmitting}
      >
        {isLastStep ? (
          <>
            {isSubmitting ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Submitting...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {submitText}
              </>
            )}
          </>
        ) : (
          <>
            Next Step
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </>
        )}
      </button>
    </div>

    {/* <div className="step-info">
      <span className="step-counter">
        Step {step + 1} of {stepsLength}
      </span>
    </div> */}
  </div>
);

export default FormNavigation;