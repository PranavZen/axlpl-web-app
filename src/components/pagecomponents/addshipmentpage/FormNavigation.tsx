interface FormNavigationProps {
    step: number;
    stepsLength: number;
    onBack: () => void;
  }
  
  const FormNavigation = ({ step, stepsLength, onBack }: FormNavigationProps) => (
    <div className="col-12 d-flex justify-content-between mt-4">
      {step > 0 && (
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
      )}
      <button type="submit" className="btn btn-primary">
        {step === stepsLength - 1 ? "Submit" : "Next"}
      </button>
    </div>
  );
  
  export default FormNavigation;