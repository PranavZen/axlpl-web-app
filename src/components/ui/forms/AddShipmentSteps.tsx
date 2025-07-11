import React, { useState, useEffect } from "react";
import StepOneFormFields from "../../pagecomponents/addshipmentpage/StepOneFormFields";
import StepTwoFormFields from "../../pagecomponents/addshipmentpage/StepTwoFormFields";
import StepThreeFormFields from "../../pagecomponents/addshipmentpage/StepThreeFormFields";
import StepFourFormFields from "../../pagecomponents/addshipmentpage/StepFourFormFields";
import FormNavigation from "../../pagecomponents/addshipmentpage/FormNavigation";

const steps = [
  {
    title: "Shipment Details",
    subtitle: "Basic shipment information",
    icon: "📦",
  },
  {
    title: "Address Information",
    subtitle: "Pickup and delivery addresses",
    icon: "📍",
  },
  {
    title: "Delivery Options",
    subtitle: "Different delivery address",
    icon: "🚚",
  },
  {
    title: "Review & Confirm",
    subtitle: "Review and submit your shipment",
    icon: "✅",
  },
];

const AddShipmentSteps = (props: any) => {
  const [step, setStep] = useState(0);
  const {
    values,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    errors,
    touched,
    isSubmitting,
    categoryOptions = [],
    paymentModeOptions = [],
    serviceTypeOptions = [],
    senderAreas = [],
    receiverAreas = [],
  } = props;

  // Auto-map IDs to option objects for select fields on mount (Edit mode)
  useEffect(() => {
    // Category
    if (values.category && typeof values.category === "string") {
      const found = categoryOptions.find(
        (opt: any) =>
          opt.value === values.category || opt.label === values.category
      );
      if (found) setFieldValue("category", found);
    }
    // Payment Mode
    if (values.paymentMode && typeof values.paymentMode === "string") {
      const found = paymentModeOptions.find(
        (opt: any) =>
          opt.value === values.paymentMode || opt.label === values.paymentMode
      );
      if (found) setFieldValue("paymentMode", found);
    }
    // Service Type
    if (values.serviceType && typeof values.serviceType === "string") {
      const found = serviceTypeOptions.find(
        (opt: any) =>
          opt.value === values.serviceType || opt.label === values.serviceType
      );
      if (found) setFieldValue("serviceType", found);
    }
    // Sender Area
    if (values.senderArea && typeof values.senderArea === "string") {
      const found = senderAreas.find(
        (opt: any) =>
          opt.value === values.senderArea || opt.label === values.senderArea
      );
      if (found) setFieldValue("senderArea", found);
    }
    // Receiver State
    if (
      values.receiverState &&
      typeof values.receiverState === "string" &&
      Array.isArray(props.receiverStateOptions)
    ) {
      const found = props.receiverStateOptions.find(
        (opt: any) =>
          opt.value === values.receiverState || opt.label === values.receiverState
      );
      if (found && values.receiverState !== found)
        setFieldValue("receiverState", found);
    }
    // Receiver City
    if (
      values.receiverCity &&
      typeof values.receiverCity === "string" &&
      Array.isArray(props.receiverCityOptions)
    ) {
      const found = props.receiverCityOptions.find(
        (opt: any) =>
          opt.value === values.receiverCity || opt.label === values.receiverCity
      );
      if (found && values.receiverCity !== found)
        setFieldValue("receiverCity", found);
    }
    // Receiver Area
    if (
      values.receiverArea &&
      typeof values.receiverArea === "string" &&
      Array.isArray(receiverAreas)
    ) {
      const found = receiverAreas.find(
        (opt: any) =>
          opt.value === values.receiverArea || opt.label === values.receiverArea
      );
      if (found && values.receiverArea !== found)
        setFieldValue("receiverArea", found);
    }
    // Commodity (multi-select)
    if (Array.isArray(values.commodity)) {
      // If any item is a string (ID), map to option object
      const mapped = values.commodity.map((item: any) => {
        if (typeof item === "string") {
          return (
            (props.commodityOptions || []).find(
              (opt: any) => opt.value === item || opt.label === item
            ) || item
          );
        }
        return item;
      });
      if (JSON.stringify(mapped) !== JSON.stringify(values.commodity)) {
        setFieldValue("commodity", mapped);
      }
    }
  }, [
    values,
    setFieldValue,
    categoryOptions,
    paymentModeOptions,
    serviceTypeOptions,
    senderAreas,
    receiverAreas,
    props.commodityOptions,
    props.receiverCityOptions,
    props.receiverStateOptions,
  ]);

  // Pass commodityOptions to StepOneFormFields for proper mapping
  return (
    <div className="multi-step-form-container">
      {/* Progress Indicator */}
      <div className="multi-step-progress">
        <div
          className="progress-container"
          style={
            {
              "--progress-width": `${(step / (steps.length - 1)) * 100}%`,
            } as React.CSSProperties
          }
        >
          {steps.map((stepItem, index) => {
            const isCompleted = index < step;
            const isActive = index === step;
            return (
              <div key={index} className="progress-step">
                <div
                  className={`step-circle ${isCompleted ? "completed" : ""} ${
                    isActive ? "active" : ""
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="step-label">
                  <div
                    className={`step-title ${isActive ? "active" : ""} ${
                      isCompleted ? "completed" : ""
                    }`}
                  >
                    {stepItem.title}
                  </div>
                  <div className="step-subtitle">{stepItem.subtitle}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Form Content */}
      <div className="form-content">
        <div className="step-content">
          <div className="step-header">
            <div className="step-icon">{steps[step].icon}</div>
            <div className="step-info">
              <h2 className="step-title">{steps[step].title}</h2>
              <p className="step-subtitle">{steps[step].subtitle}</p>
            </div>
          </div>
          <div className="step-fields row row-gap-4">
            {step === 0 && (
              <StepOneFormFields
                values={values}
                setFieldValue={setFieldValue}
                errors={errors}
                touched={touched}
                categoryOptions={categoryOptions}
                paymentModeOptions={paymentModeOptions}
                serviceTypeOptions={serviceTypeOptions}
                commodityOptions={props.commodityOptions || []}
              />
            )}
            {step === 1 && (
              <StepTwoFormFields
                values={values}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                setFieldError={setFieldError}
                errors={errors}
                touched={touched}
              />
            )}
            {step === 2 && (
              <StepThreeFormFields
                values={values}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                setFieldError={setFieldError}
                errors={errors}
                touched={touched}
              />
            )}
            {step === 3 && (
              <StepFourFormFields
                values={values}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                setFieldError={setFieldError}
                errors={errors}
                touched={touched}
              />
            )}
          </div>
        </div>
        <FormNavigation
          step={step}
          stepsLength={steps.length}
          onBack={() => setStep(step - 1)}
          isLastStep={step === steps.length - 1}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default AddShipmentSteps;
