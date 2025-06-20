import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import MainBody from "../components/ui/mainbody/MainBody";
import Sidebar from "../components/ui/sidebar/Sidebar";
import { RootState, AppDispatch } from "../redux/store";
import { resetFormData, setFormData, submitShipment, clearSubmitState } from "../redux/slices/shipmentSlice";
import * as Yup from "yup";
import StepOneFormFields from "../components/pagecomponents/addshipmentpage/StepOneFormFields";
import StepTwoFormFields from "../components/pagecomponents/addshipmentpage/StepTwoFormFields";
import StepThreeFormFields from "../components/pagecomponents/addshipmentpage/StepThreeFormFields";
import StepFourFormFields from "../components/pagecomponents/addshipmentpage/StepFourFormFields";
import FormNavigation from "../components/pagecomponents/addshipmentpage/FormNavigation";
import { SidebarContext } from "../contexts/SidebarContext";
import "../styles/global/AddShipment.scss";

const steps = [
  {
    title: "Shipment Details",
    subtitle: "Basic shipment information",
    icon: "📦"
  },
  {
    title: "Address Information",
    subtitle: "Pickup and delivery addresses",
    icon: "📍"
  },
  {
    title: "Delivery Options",
    subtitle: "Different delivery address",
    icon: "🚚"
  },
  {
    title: "Review & Confirm",
    subtitle: "Review and submit your shipment",
    icon: "✅"
  }
];

const AddShipment = () => {
  const [step, setStep] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const { submitting, submitError, submitSuccess, submittedShipmentId, formData } = useSelector((state: RootState) => state.shipment);
  const { isSidebarCollapsed } = useContext(SidebarContext);

  // Reset form data on component mount to ensure clean state
  useEffect(() => {
    dispatch(resetFormData());
  }, [dispatch]);

  const defaultInitialValues = {
    // Step 1: Shipment Details (Original Fields)
    name: "",
    category: null,
    commodity: [],
    netWeight: "",
    grossWeight: "",
    paymentMode: null,
    numberOfParcel: "",
    serviceType: null,
    insurance: false,
    expiryDate: "",
    policyNumber: "",
    insuranceValue: "",
    invoiceValue: "",
    invoiceNumber: "",
    remark: "",

    // Step 2: Address Information
    senderAddressType: "existing",
    senderName: "",
    senderCompanyName: "",
    senderZipCode: "",
    senderState: "",
    senderCity: "",
    senderArea: null,
    senderGstNo: "",
    senderAddressLine1: "",
    senderAddressLine2: "",
    senderMobile: "",
    senderEmail: "",
    senderCustomerId: "",

    billTo: "sender",

    receiverAddressType: "new",
    receiverName: "",
    receiverCompanyName: "",
    receiverZipCode: "",
    receiverState: "",
    receiverCity: "",
    receiverArea: null,
    receiverGstNo: "",
    receiverAddressLine1: "",
    receiverAddressLine2: "",
    receiverMobile: "",
    receiverEmail: "",
    receiverCustomerId: "",

    // Step 3: Delivery Address
    isDifferentDeliveryAddress: false,
    deliveryZipCode: "",
    deliveryState: "",
    deliveryCity: "",
    deliveryArea: null,
    deliveryAddressLine1: "",
    deliveryAddressLine2: "",

    // Step 4: Review & Confirmation
    deliveryDate: "",
  };

  // Merge default values with saved form data from Redux to preserve form state
  const initialValues = { ...defaultInitialValues, ...formData };

  const validationSchemas = [
    // Step 1: Shipment Details (Original Fields)
    Yup.object({
      name: Yup.string().required("Name is required"),
      category: Yup.object().nullable().required("Please select category"),
      commodity: Yup.array().min(1, "Please select at least one commodity"),
      netWeight: Yup.number().positive("Net weight must be positive").required("Net weight is required"),
      grossWeight: Yup.number().positive("Gross weight must be positive").required("Gross weight is required"),
      paymentMode: Yup.object().nullable().required("Please select payment mode"),
      numberOfParcel: Yup.number().positive("Number of parcels must be positive").required("Number of parcels is required"),
      serviceType: Yup.object().nullable().required("Please select service type"),
      invoiceValue: Yup.number().positive("Invoice value must be positive").required("Invoice value is required"),
      invoiceNumber: Yup.string().required("Invoice number is required"),
    }),

    // Step 2: Address Information (Strict validation with improved email regex)
    Yup.object({
      senderAddressType: Yup.string().oneOf(["new", "existing"], "Invalid sender address type").required("Please select sender address type"),
      receiverAddressType: Yup.string().oneOf(["new", "existing"], "Invalid receiver address type").required("Please select receiver address type"),
      billTo: Yup.string().oneOf(["sender", "receiver"], "Please select who to bill").required("Please select billing option"),

      senderName: Yup.string()
        .min(2, "Sender name must be at least 2 characters")
        .max(100, "Sender name cannot exceed 100 characters")
        .required("Sender name is required"),
      senderCompanyName: Yup.string()
        .min(2, "Sender company name must be at least 2 characters")
        .max(100, "Sender company name cannot exceed 100 characters")
        .required("Sender company name is required"),
      senderZipCode: Yup.string()
        .matches(/^\d{6}$/, "Sender zip code must be exactly 6 digits")
        .required("Sender zip code is required"),
      senderState: Yup.string()
        .min(2, "Sender state must be at least 2 characters")
        .max(50, "Sender state cannot exceed 50 characters")
        .matches(/^[a-zA-Z\s.-]+$/, "Sender state can only contain letters, spaces, dots, and hyphens")
        .required("Sender state is required"),
      senderCity: Yup.string()
        .min(2, "Sender city must be at least 2 characters")
        .max(50, "Sender city cannot exceed 50 characters")
        .matches(/^[a-zA-Z\s.-]+$/, "Sender city can only contain letters, spaces, dots, and hyphens")
        .required("Sender city is required"),
      senderArea: Yup.object().nullable(),
      senderGstNo: Yup.string()
        .matches(/^[a-zA-Z0-9]{15}$/, "Sender GST number must be exactly 15 alphanumeric characters")
        .required("Sender GST number is required"),
      senderAddressLine1: Yup.string()
        .min(5, "Sender address line 1 must be at least 5 characters")
        .max(200, "Sender address line 1 cannot exceed 200 characters")
        .required("Sender address line 1 is required"),
      senderAddressLine2: Yup.string()
        .min(5, "Sender address line 2 must be at least 5 characters")
        .max(200, "Sender address line 2 cannot exceed 200 characters")
        .required("Sender address line 2 is required"),
      senderMobile: Yup.string()
        .matches(/^\d{10}$/, "Sender mobile must be exactly 10 digits")
        .required("Sender mobile is required"),
      senderEmail: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
          "Invalid sender email format"
        )
        .required("Sender email is required"),

      receiverName: Yup.string()
        .min(2, "Receiver name must be at least 2 characters")
        .max(100, "Receiver name cannot exceed 100 characters")
        .required("Receiver name is required"),
      receiverCompanyName: Yup.string()
        .min(2, "Receiver company name must be at least 2 characters")
        .max(100, "Receiver company name cannot exceed 100 characters")
        .required("Receiver company name is required"),
      receiverZipCode: Yup.string()
        .matches(/^\d{6}$/, "Receiver zip code must be exactly 6 digits")
        .required("Receiver zip code is required"),
      receiverState: Yup.string()
        .min(2, "Receiver state must be at least 2 characters")
        .max(50, "Receiver state cannot exceed 50 characters")
        .matches(/^[a-zA-Z\s.-]+$/, "Receiver state can only contain letters, spaces, dots, and hyphens")
        .required("Receiver state is required"),
      receiverCity: Yup.string()
        .min(2, "Receiver city must be at least 2 characters")
        .max(50, "Receiver city cannot exceed 50 characters")
        .matches(/^[a-zA-Z\s.-]+$/, "Receiver city can only contain letters, spaces, dots, and hyphens")
        .required("Receiver city is required"),
      receiverArea: Yup.object().nullable(),
      receiverGstNo: Yup.string()
        .matches(/^[a-zA-Z0-9]{15}$/, "Receiver GST number must be exactly 15 alphanumeric characters")
        .required("Receiver GST number is required"),
      receiverAddressLine1: Yup.string()
        .min(5, "Receiver address line 1 must be at least 5 characters")
        .max(200, "Receiver address line 1 cannot exceed 200 characters")
        .required("Receiver address line 1 is required"),
      receiverAddressLine2: Yup.string()
        .min(5, "Receiver address line 2 must be at least 5 characters")
        .max(200, "Receiver address line 2 cannot exceed 200 characters")
        .required("Receiver address line 2 is required"),
      receiverMobile: Yup.string()
        .matches(/^\d{10}$/, "Receiver mobile must be exactly 10 digits")
        .required("Receiver mobile is required"),
      receiverEmail: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
          "Invalid receiver email format"
        )
        .required("Receiver email is required"),
      senderCustomerId: Yup.string().nullable(),
      receiverCustomerId: Yup.string().nullable(),
    }),

    // Step 3: Delivery Address
    Yup.object({
      // Include the checkbox field in validation
      isDifferentDeliveryAddress: Yup.boolean(),

      // Conditional validation for delivery address fields
      deliveryZipCode: Yup.string().when('isDifferentDeliveryAddress', {
        is: true,
        then: (schema) => schema
          .trim()
          .matches(/^\d{6}$/, "Delivery zip code must be exactly 6 digits")
          .required("Delivery zip code is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      deliveryState: Yup.string().when('isDifferentDeliveryAddress', {
        is: true,
        then: (schema) => schema
          .trim()
          .min(2, "Delivery state must be at least 2 characters")
          .max(50, "Delivery state cannot exceed 50 characters")
          .matches(/^[a-zA-Z\s.-]+$/, "Delivery state can only contain letters, spaces, dots, and hyphens")
          .required("Delivery state is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      deliveryCity: Yup.string().when('isDifferentDeliveryAddress', {
        is: true,
        then: (schema) => schema
          .trim()
          .min(2, "Delivery city must be at least 2 characters")
          .max(100, "Delivery city cannot exceed 100 characters")
          .matches(/^[a-zA-Z\s.-]+$/, "Delivery city can only contain letters, spaces, dots, and hyphens")
          .required("Delivery city is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      deliveryAddressLine1: Yup.string().when('isDifferentDeliveryAddress', {
        is: true,
        then: (schema) => schema
          .trim()
          .min(5, "Delivery address must be at least 5 characters")
          .max(200, "Delivery address cannot exceed 200 characters")
          .required("Delivery address line 1 is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      deliveryAddressLine2: Yup.string().when('isDifferentDeliveryAddress', {
        is: true,
        then: (schema) => schema
          .trim()
          .max(200, "Delivery address cannot exceed 200 characters")
          .nullable(),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),

    // Step 4: Review & Confirmation
    Yup.object({
      // No additional validation required for step 4
    }),
  ];

  // Custom validation function for Step 2 critical fields
  const validateStep2CriticalFields = (values: any) => {
    const errors: string[] = [];

    // Validate sender fields
    if (!values.senderGstNo || values.senderGstNo.length !== 15 || !/^[a-zA-Z0-9]{15}$/.test(values.senderGstNo)) {
      errors.push("Sender GST Number must be exactly 15 alphanumeric characters");
    }

    if (!values.senderMobile || values.senderMobile.length !== 10 || !/^\d{10}$/.test(values.senderMobile)) {
      errors.push("Sender Mobile Number must be exactly 10 digits");
    }

    if (!values.senderEmail || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.senderEmail)) {
      errors.push("Sender Email must be in valid format");
    }

    // Validate receiver fields
    if (!values.receiverGstNo || values.receiverGstNo.length !== 15 || !/^[a-zA-Z0-9]{15}$/.test(values.receiverGstNo)) {
      errors.push("Receiver GST Number must be exactly 15 alphanumeric characters");
    }

    if (!values.receiverMobile || values.receiverMobile.length !== 10 || !/^\d{10}$/.test(values.receiverMobile)) {
      errors.push("Receiver Mobile Number must be exactly 10 digits");
    }

    if (!values.receiverEmail || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.receiverEmail)) {
      errors.push("Receiver Email must be in valid format");
    }

    return errors;
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading("Submitting shipment...");

      // Submit the shipment
      const result = await dispatch(submitShipment(values));

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (submitShipment.fulfilled.match(result)) {
        // Success - Clear form and show success message
        const shipmentId = result.payload.shipmentId;
        toast.success(`Shipment submitted successfully! ${shipmentId ? `Shipment ID: ${shipmentId}` : ''}`);

        // 1. Reset Redux form data
        dispatch(resetFormData());

        // 2. Reset Formik form to initial values
        resetForm();

        // 3. Reset step to 0
        setStep(0);

      } else {
        // Error
        const errorMessage = result.payload as string || "Failed to submit shipment";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  // Handle submission state changes
  useEffect(() => {
    if (submitSuccess && submittedShipmentId) {
      // Clear submit state after showing success
      setTimeout(() => {
        dispatch(clearSubmitState());
      }, 3000);
    }

    if (submitError) {
      // Clear error state after some time
      setTimeout(() => {
        dispatch(clearSubmitState());
      }, 5000);
    }
  }, [submitSuccess, submitError, submittedShipmentId, dispatch]);

  return (
      <div className="container-fluid p-0">
        <section className={`bodyWrap ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Sidebar />
          <MainBody>
            <div className="multi-step-form-container">
              {/* Enhanced Header */}
              <div className="form-header">
                <div className="header-content">
                  <h1 className="form-title">Create New Shipment</h1>
                  <p className="form-subtitle">
                    Complete the following steps to create your shipment
                  </p>
                </div>
                {/* <div className="step-indicator">
                  <span className="current-step">Step {step + 1}</span>
                  <span className="total-steps">of {steps.length}</span>
                </div> */}
              </div>

              {/* Progress Indicator */}
              <div className="multi-step-progress">
                <div className="progress-container" style={{ '--progress-width': `${(step / (steps.length - 1)) * 100}%` } as React.CSSProperties}>
                  {steps.map((stepItem, index) => {
                    const isCompleted = index < step;
                    const isActive = index === step;

                    return (
                      <div key={index} className="progress-step">
                        <div className={`step-circle ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                          {isCompleted ? (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>
                        <div className="step-label">
                          <div className={`step-title ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
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
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchemas[step]}
                  onSubmit={async (values, formikHelpers) => {
                    // Check for validation errors
                    try {
                      await validationSchemas[step].validate(values, { abortEarly: false });
                    } catch (validationError: any) {
                      // Show validation errors to user
                      if (validationError.errors && validationError.errors.length > 0) {
                        const errorMessage = `Please fix the following errors:\n${validationError.errors.join('\n')}`;
                        // Show toast with validation errors
                        toast.error(errorMessage);
                      }
                      return; // Don't proceed if validation fails
                    }

                    // Additional validation for Step 2 critical fields before proceeding to Step 3
                    if (step === 1) { // Step 2 (0-indexed)
                      const criticalFieldErrors = validateStep2CriticalFields(values);
                      if (criticalFieldErrors.length > 0) {
                        const errorMessage = `Please fix the following critical validation errors before proceeding:\n${criticalFieldErrors.join('\n')}`;
                        toast.error(errorMessage);
                        return; // Don't proceed if critical validation fails
                      }
                    }

                    // Always save form data to Redux before proceeding
                    dispatch(setFormData(values));

                    if (step === steps.length - 1) {
                      await handleSubmit(values, formikHelpers);
                    } else {
                      setStep(step + 1);
                    }
                  }}
                  enableReinitialize
                >
                  {({ values, setFieldValue, setFieldTouched, setFieldError, errors, touched }) => {

                    return (
                    <Form className="multi-step-form" noValidate>
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
                        onBack={() => {
                          // Save current form data before going back
                          dispatch(setFormData(values));
                          setStep(step - 1);
                        }}
                        isLastStep={step === steps.length - 1}
                        isSubmitting={submitting}
                      />
                    </Form>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </MainBody>
        </section>
      </div>

  );
};

export default AddShipment;
